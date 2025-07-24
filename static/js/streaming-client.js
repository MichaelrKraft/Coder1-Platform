/**
 * WebSocket Streaming Client
 * Handles real-time streaming connections for Claude API responses
 */

class StreamingClient {
    constructor(options = {}) {
        this.wsUrl = options.wsUrl || `${window.location.protocol === 'https:' ? 'wss:' : 'ws:'}//${window.location.host}/ws/streaming`;
        this.reconnectInterval = options.reconnectInterval || 5000;
        this.maxReconnectAttempts = options.maxReconnectAttempts || 5;
        
        this.ws = null;
        this.clientId = null;
        this.connected = false;
        this.reconnectAttempts = 0;
        this.activeStreams = new Map();
        this.eventHandlers = new Map();
        
        // Auto-connect on instantiation
        if (options.autoConnect !== false) {
            this.connect();
        }
    }
    
    connect() {
        if (this.ws && this.ws.readyState === WebSocket.OPEN) {
            console.log('WebSocket already connected');
            return;
        }
        
        console.log('Connecting to WebSocket:', this.wsUrl);
        
        try {
            this.ws = new WebSocket(this.wsUrl);
            
            this.ws.onopen = () => {
                console.log('WebSocket connected');
                this.connected = true;
                this.reconnectAttempts = 0;
                this.emit('connected');
            };
            
            this.ws.onmessage = (event) => {
                try {
                    const data = JSON.parse(event.data);
                    this.handleMessage(data);
                } catch (error) {
                    console.error('Error parsing WebSocket message:', error);
                }
            };
            
            this.ws.onclose = () => {
                console.log('WebSocket disconnected');
                this.connected = false;
                this.clientId = null;
                this.emit('disconnected');
                
                // Attempt to reconnect
                if (this.reconnectAttempts < this.maxReconnectAttempts) {
                    this.reconnectAttempts++;
                    console.log(`Attempting to reconnect (${this.reconnectAttempts}/${this.maxReconnectAttempts})...`);
                    setTimeout(() => this.connect(), this.reconnectInterval);
                }
            };
            
            this.ws.onerror = (error) => {
                console.error('WebSocket error:', error);
                this.emit('error', error);
            };
            
        } catch (error) {
            console.error('Failed to create WebSocket:', error);
            this.emit('error', error);
        }
    }
    
    disconnect() {
        if (this.ws) {
            this.reconnectAttempts = this.maxReconnectAttempts; // Prevent auto-reconnect
            this.ws.close();
            this.ws = null;
        }
    }
    
    handleMessage(data) {
        const { type, streamId } = data;
        
        switch (type) {
            case 'connected':
                this.clientId = data.clientId;
                console.log('Received client ID:', this.clientId);
                break;
                
            case 'stream-start':
                this.handleStreamStart(streamId, data);
                break;
                
            case 'stream-chunk':
                this.handleStreamChunk(streamId, data);
                break;
                
            case 'stream-complete':
                this.handleStreamComplete(streamId, data);
                break;
                
            case 'stream-error':
                this.handleStreamError(streamId, data);
                break;
                
            case 'stream-stopped':
                this.handleStreamStopped(streamId, data);
                break;
                
            case 'pong':
                // Heartbeat response
                break;
                
            default:
                console.warn('Unknown message type:', type);
        }
        
        // Emit raw message event
        this.emit('message', data);
    }
    
    // Start a new stream
    async startStream(content, options = {}) {
        if (!this.connected) {
            throw new Error('WebSocket not connected');
        }
        
        const streamId = this.generateStreamId();
        
        // Create stream object
        const stream = {
            id: streamId,
            content: '',
            chunks: [],
            startTime: Date.now(),
            status: 'pending',
            handlers: {
                onChunk: options.onChunk || null,
                onComplete: options.onComplete || null,
                onError: options.onError || null
            }
        };
        
        this.activeStreams.set(streamId, stream);
        
        // Send stream request
        this.send({
            type: 'stream-request',
            payload: {
                streamId,
                content,
                options: {
                    model: options.model || 'claude-3-sonnet-20240229',
                    maxTokens: options.maxTokens || 1000,
                    temperature: options.temperature || 0.3,
                    systemPrompt: options.systemPrompt || null
                }
            }
        });
        
        return streamId;
    }
    
    // Stop an active stream
    stopStream(streamId) {
        if (!this.activeStreams.has(streamId)) {
            console.warn('Stream not found:', streamId);
            return;
        }
        
        this.send({
            type: 'stop-stream',
            payload: { streamId }
        });
    }
    
    handleStreamStart(streamId, data) {
        const stream = this.activeStreams.get(streamId);
        if (stream) {
            stream.status = 'streaming';
            stream.startedAt = data.timestamp;
            console.log(`Stream ${streamId} started`);
        }
    }
    
    handleStreamChunk(streamId, data) {
        const stream = this.activeStreams.get(streamId);
        if (stream) {
            stream.chunks.push(data.content);
            stream.content = data.accumulated;
            
            // Call chunk handler if provided
            if (stream.handlers.onChunk) {
                stream.handlers.onChunk(data.content, data.accumulated);
            }
            
            // Emit chunk event
            this.emit('stream-chunk', {
                streamId,
                chunk: data.content,
                accumulated: data.accumulated
            });
        }
    }
    
    handleStreamComplete(streamId, data) {
        const stream = this.activeStreams.get(streamId);
        if (stream) {
            stream.status = 'complete';
            stream.content = data.content;
            stream.duration = data.duration;
            
            // Call complete handler if provided
            if (stream.handlers.onComplete) {
                stream.handlers.onComplete(data.content, stream);
            }
            
            // Emit complete event
            this.emit('stream-complete', {
                streamId,
                content: data.content,
                duration: data.duration
            });
            
            // Clean up after a delay
            setTimeout(() => {
                this.activeStreams.delete(streamId);
            }, 5000);
        }
    }
    
    handleStreamError(streamId, data) {
        const stream = this.activeStreams.get(streamId);
        if (stream) {
            stream.status = 'error';
            stream.error = data.error;
            
            // Call error handler if provided
            if (stream.handlers.onError) {
                stream.handlers.onError(data.error);
            }
            
            // Emit error event
            this.emit('stream-error', {
                streamId,
                error: data.error
            });
            
            // Remove stream
            this.activeStreams.delete(streamId);
        }
    }
    
    handleStreamStopped(streamId, data) {
        const stream = this.activeStreams.get(streamId);
        if (stream) {
            stream.status = 'stopped';
            console.log(`Stream ${streamId} stopped`);
            this.activeStreams.delete(streamId);
        }
    }
    
    // Send a message to the server
    send(data) {
        if (this.ws && this.ws.readyState === WebSocket.OPEN) {
            this.ws.send(JSON.stringify(data));
        } else {
            throw new Error('WebSocket not connected');
        }
    }
    
    // Send a ping to keep connection alive
    ping() {
        try {
            this.send({ type: 'ping' });
        } catch (error) {
            console.error('Ping failed:', error);
        }
    }
    
    // Event handling
    on(event, handler) {
        if (!this.eventHandlers.has(event)) {
            this.eventHandlers.set(event, []);
        }
        this.eventHandlers.get(event).push(handler);
    }
    
    off(event, handler) {
        if (this.eventHandlers.has(event)) {
            const handlers = this.eventHandlers.get(event);
            const index = handlers.indexOf(handler);
            if (index > -1) {
                handlers.splice(index, 1);
            }
        }
    }
    
    emit(event, data) {
        if (this.eventHandlers.has(event)) {
            this.eventHandlers.get(event).forEach(handler => {
                try {
                    handler(data);
                } catch (error) {
                    console.error(`Error in event handler for ${event}:`, error);
                }
            });
        }
    }
    
    // Utility methods
    generateStreamId() {
        return `stream-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    }
    
    isConnected() {
        return this.connected && this.ws && this.ws.readyState === WebSocket.OPEN;
    }
    
    getActiveStreams() {
        return Array.from(this.activeStreams.values());
    }
}

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = StreamingClient;
}