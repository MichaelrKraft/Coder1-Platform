/**
 * WebSocket Streaming Server
 * Handles real-time streaming of Claude API responses
 */

const WebSocket = require('ws');
const { ClaudeCodeAPI } = require('../integrations/claude-code-api');
const { logger } = require('../monitoring/comprehensive-logger');
const { TerminalHandler } = require('./terminal-handler');

class StreamingServer {
    constructor(server, options = {}) {
        this.wss = new WebSocket.Server({ 
            server,
            path: options.path || '/ws/streaming'
        });
        
        // Create separate WebSocket server for infinite loop
        this.infiniteWss = new WebSocket.Server({
            server,
            path: '/ws/infinite-loop'
        });
        
        // Create WebSocket server for terminal
        this.terminalWss = new WebSocket.Server({
            server,
            path: '/ws/terminal'
        });
        
        this.claudeAPI = new ClaudeCodeAPI(
            process.env.ANTHROPIC_API_KEY || process.env.CLAUDE_CODE_API_KEY
        );
        
        this.clients = new Map();
        this.activeStreams = new Map();
        this.terminalHandler = new TerminalHandler();
        
        this.setupWebSocketServer();
        this.setupInfiniteLoopWebSocket();
        this.setupTerminalWebSocket();
    }
    
    setupWebSocketServer() {
        this.wss.on('connection', (ws, req) => {
            const clientId = this.generateClientId();
            logger.info(`WebSocket client connected: ${clientId}`);
            
            // Store client connection
            this.clients.set(clientId, {
                ws,
                connected: true,
                streams: new Set()
            });
            
            // Send welcome message
            ws.send(JSON.stringify({
                type: 'connected',
                clientId,
                message: 'WebSocket streaming connection established'
            }));
            
            // Handle incoming messages
            ws.on('message', async (message) => {
                try {
                    const data = JSON.parse(message);
                    await this.handleMessage(clientId, data);
                } catch (error) {
                    logger.error('WebSocket message error:', error);
                    ws.send(JSON.stringify({
                        type: 'error',
                        error: error.message
                    }));
                }
            });
            
            // Handle disconnection
            ws.on('close', () => {
                logger.info(`WebSocket client disconnected: ${clientId}`);
                this.cleanupClient(clientId);
            });
            
            // Handle errors
            ws.on('error', (error) => {
                logger.error(`WebSocket error for client ${clientId}:`, error);
                this.cleanupClient(clientId);
            });
        });
    }
    
    async handleMessage(clientId, data) {
        const { type, payload } = data;
        
        switch (type) {
            case 'stream-request':
                await this.handleStreamRequest(clientId, payload);
                break;
                
            case 'stop-stream':
                this.stopStream(clientId, payload.streamId);
                break;
                
            case 'ping':
                this.sendToClient(clientId, { type: 'pong' });
                break;
                
            default:
                logger.warn(`Unknown message type: ${type}`);
        }
    }
    
    async handleStreamRequest(clientId, payload) {
        const { streamId, content, options = {} } = payload;
        const client = this.clients.get(clientId);
        
        if (!client) {
            logger.error(`Client not found: ${clientId}`);
            return;
        }
        
        try {
            // Start streaming from Claude API
            logger.info(`Starting stream ${streamId} for client ${clientId}`);
            
            const stream = await this.claudeAPI.streamMessage(content, {
                ...options,
                stream: true
            });
            
            // Store active stream
            this.activeStreams.set(streamId, {
                clientId,
                stream,
                startTime: Date.now()
            });
            
            client.streams.add(streamId);
            
            // Send stream start notification
            this.sendToClient(clientId, {
                type: 'stream-start',
                streamId,
                timestamp: new Date().toISOString()
            });
            
            // Handle stream data
            let fullContent = '';
            for await (const chunk of stream) {
                if (chunk.type === 'content_block_delta') {
                    const text = chunk.delta?.text || '';
                    fullContent += text;
                    
                    // Send chunk to client
                    this.sendToClient(clientId, {
                        type: 'stream-chunk',
                        streamId,
                        content: text,
                        accumulated: fullContent
                    });
                }
                
                // Check if stream was stopped
                if (!this.activeStreams.has(streamId)) {
                    logger.info(`Stream ${streamId} was stopped`);
                    break;
                }
            }
            
            // Stream completed
            this.sendToClient(clientId, {
                type: 'stream-complete',
                streamId,
                content: fullContent,
                duration: Date.now() - this.activeStreams.get(streamId).startTime
            });
            
            // Cleanup
            this.activeStreams.delete(streamId);
            client.streams.delete(streamId);
            
        } catch (error) {
            logger.error(`Stream error for ${streamId}:`, error);
            
            this.sendToClient(clientId, {
                type: 'stream-error',
                streamId,
                error: error.message
            });
            
            // Cleanup on error
            this.activeStreams.delete(streamId);
            client.streams.delete(streamId);
        }
    }
    
    stopStream(clientId, streamId) {
        const streamInfo = this.activeStreams.get(streamId);
        
        if (streamInfo && streamInfo.clientId === clientId) {
            logger.info(`Stopping stream ${streamId}`);
            
            // Remove from active streams
            this.activeStreams.delete(streamId);
            
            // Remove from client's streams
            const client = this.clients.get(clientId);
            if (client) {
                client.streams.delete(streamId);
            }
            
            // Send stop confirmation
            this.sendToClient(clientId, {
                type: 'stream-stopped',
                streamId
            });
        }
    }
    
    sendToClient(clientId, data) {
        const client = this.clients.get(clientId);
        
        if (client && client.connected && client.ws.readyState === WebSocket.OPEN) {
            client.ws.send(JSON.stringify(data));
        }
    }
    
    cleanupClient(clientId) {
        const client = this.clients.get(clientId);
        
        if (client) {
            // Stop all active streams for this client
            client.streams.forEach(streamId => {
                this.activeStreams.delete(streamId);
            });
            
            // Remove client
            this.clients.delete(clientId);
        }
    }
    
    generateClientId() {
        return `client-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    }
    
    // Broadcast to all connected clients
    broadcast(data) {
        const message = JSON.stringify(data);
        
        this.clients.forEach((client) => {
            if (client.connected && client.ws.readyState === WebSocket.OPEN) {
                client.ws.send(message);
            }
        });
    }
    
    // Get server statistics
    getStats() {
        return {
            connectedClients: this.clients.size,
            activeStreams: this.activeStreams.size,
            uptime: process.uptime()
        };
    }
    
    // Setup infinite loop WebSocket
    setupInfiniteLoopWebSocket() {
        const { handleInfiniteLoopWebSocket } = require('../routes/infinite-loop-stream');
        
        this.infiniteWss.on('connection', (ws, req) => {
            handleInfiniteLoopWebSocket(ws, req);
        });
        
        logger.info('Infinite Loop WebSocket server initialized on /ws/infinite-loop');
    }
    
    // Setup terminal WebSocket
    setupTerminalWebSocket() {
        this.terminalWss.on('connection', (ws, req) => {
            this.terminalHandler.handleConnection(ws);
        });
        
        logger.info('Terminal WebSocket server initialized on /ws/terminal');
    }
}

module.exports = { StreamingServer };