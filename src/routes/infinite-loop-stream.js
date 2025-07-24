/**
 * WebSocket handler for Infinite Loop real-time updates
 */

const InfiniteLoopManager = require('../services/InfiniteLoopManager');

// Global manager instance
let manager = null;

const getManager = () => {
    if (!manager) {
        manager = new InfiniteLoopManager();
    }
    return manager;
};

/**
 * Handle WebSocket connections for infinite loop streaming
 */
function handleInfiniteLoopWebSocket(ws, req) {
    console.log('New WebSocket connection for infinite loop');
    
    const sessionSubscriptions = new Set();
    
    // Handle incoming messages
    ws.on('message', async (message) => {
        try {
            const data = JSON.parse(message);
            const { type, payload } = data;
            
            switch (type) {
                case 'subscribe':
                    // Subscribe to session updates
                    const { sessionId } = payload;
                    sessionSubscriptions.add(sessionId);
                    
                    // Send current status immediately
                    const manager = getManager();
                    const status = manager.getSessionStatus(sessionId);
                    
                    ws.send(JSON.stringify({
                        type: 'status',
                        sessionId,
                        data: status
                    }));
                    break;
                    
                case 'unsubscribe':
                    sessionSubscriptions.delete(payload.sessionId);
                    break;
                    
                case 'ping':
                    ws.send(JSON.stringify({ type: 'pong' }));
                    break;
            }
        } catch (error) {
            console.error('WebSocket message error:', error);
            ws.send(JSON.stringify({
                type: 'error',
                error: error.message
            }));
        }
    });
    
    // Listen for infinite loop output events
    const outputHandler = (data) => {
        // Only send updates for subscribed sessions
        if (sessionSubscriptions.has(data.sessionId)) {
            ws.send(JSON.stringify({
                type: 'output',
                sessionId: data.sessionId,
                output: data.output
            }));
            
            // Also send updated status
            const manager = getManager();
            const status = manager.getSessionStatus(data.sessionId);
            
            ws.send(JSON.stringify({
                type: 'status',
                sessionId: data.sessionId,
                data: status
            }));
        }
    };
    
    // Subscribe to global terminal emitter
    if (global.terminalEmitter) {
        global.terminalEmitter.on('infinite-output', outputHandler);
    }
    
    // Handle disconnection
    ws.on('close', () => {
        console.log('WebSocket connection closed for infinite loop');
        
        // Unsubscribe from events
        if (global.terminalEmitter) {
            global.terminalEmitter.removeListener('infinite-output', outputHandler);
        }
        
        sessionSubscriptions.clear();
    });
    
    // Send initial connection success
    ws.send(JSON.stringify({
        type: 'connected',
        message: 'WebSocket connection established for infinite loop'
    }));
}

module.exports = { handleInfiniteLoopWebSocket };