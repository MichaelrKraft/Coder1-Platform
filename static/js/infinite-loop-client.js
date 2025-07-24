/**
 * Infinite Loop WebSocket Client
 * Handles real-time updates for infinite loop sessions
 */

class InfiniteLoopClient {
    constructor(options = {}) {
        this.wsUrl = options.wsUrl || `${window.location.protocol === 'https:' ? 'wss:' : 'ws:'}//${window.location.host}/ws/infinite-loop`;
        this.reconnectInterval = options.reconnectInterval || 5000;
        this.maxReconnectAttempts = options.maxReconnectAttempts || 5;
        
        this.ws = null;
        this.connected = false;
        this.reconnectAttempts = 0;
        this.subscribedSessions = new Set();
        this.eventHandlers = new Map();
        
        // Auto-connect on instantiation
        if (options.autoConnect !== false) {
            this.connect();
        }
    }
    
    connect() {
        if (this.ws && this.ws.readyState === WebSocket.OPEN) {
            console.log('Infinite Loop WebSocket already connected');
            return;
        }
        
        console.log('Connecting to Infinite Loop WebSocket:', this.wsUrl);
        
        try {
            this.ws = new WebSocket(this.wsUrl);
            
            this.ws.onopen = () => {
                console.log('Infinite Loop WebSocket connected');
                this.connected = true;
                this.reconnectAttempts = 0;
                this.emit('connected');
                
                // Re-subscribe to all sessions
                this.subscribedSessions.forEach(sessionId => {
                    this.subscribe(sessionId);
                });
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
                console.log('Infinite Loop WebSocket disconnected');
                this.connected = false;
                this.emit('disconnected');
                
                // Attempt to reconnect
                if (this.reconnectAttempts < this.maxReconnectAttempts) {
                    this.reconnectAttempts++;
                    console.log(`Attempting to reconnect (${this.reconnectAttempts}/${this.maxReconnectAttempts})...`);
                    setTimeout(() => this.connect(), this.reconnectInterval);
                }
            };
            
            this.ws.onerror = (error) => {
                console.error('Infinite Loop WebSocket error:', error);
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
        const { type, sessionId } = data;
        
        switch (type) {
            case 'connected':
                console.log('Infinite Loop WebSocket ready');
                break;
                
            case 'status':
                this.emit('status', {
                    sessionId,
                    status: data.data
                });
                break;
                
            case 'output':
                this.emit('output', {
                    sessionId,
                    output: data.output
                });
                break;
                
            case 'error':
                this.emit('error', data.error);
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
    
    // Subscribe to a session's updates
    subscribe(sessionId) {
        if (!this.connected) {
            console.warn('Cannot subscribe: WebSocket not connected');
            return;
        }
        
        this.subscribedSessions.add(sessionId);
        
        this.send({
            type: 'subscribe',
            payload: { sessionId }
        });
        
        console.log('Subscribed to session:', sessionId);
    }
    
    // Unsubscribe from a session's updates
    unsubscribe(sessionId) {
        this.subscribedSessions.delete(sessionId);
        
        if (this.connected) {
            this.send({
                type: 'unsubscribe',
                payload: { sessionId }
            });
        }
        
        console.log('Unsubscribed from session:', sessionId);
    }
    
    // Send a message to the server
    send(data) {
        if (this.ws && this.ws.readyState === WebSocket.OPEN) {
            this.ws.send(JSON.stringify(data));
        } else {
            console.warn('Cannot send: WebSocket not connected');
        }
    }
    
    // Send a ping to keep connection alive
    ping() {
        this.send({ type: 'ping' });
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
    isConnected() {
        return this.connected && this.ws && this.ws.readyState === WebSocket.OPEN;
    }
    
    getSubscribedSessions() {
        return Array.from(this.subscribedSessions);
    }
}

// Usage example:
/*
const client = new InfiniteLoopClient();

// Listen for status updates
client.on('status', (data) => {
    console.log('Session status update:', data.sessionId, data.status);
    // Update UI with new status
});

// Listen for output
client.on('output', (data) => {
    console.log('Session output:', data.sessionId, data.output);
    // Append output to terminal
});

// Subscribe to a session
client.subscribe('infinite-123456789');
*/

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = InfiniteLoopClient;
}