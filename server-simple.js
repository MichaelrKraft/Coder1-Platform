// Production server with WebSocket support
const app = require('./src/app-simple');
const http = require('http');
const { StreamingServer } = require('./src/websocket/streaming-server');

const PORT = process.env.PORT || 10000;

// Create HTTP server
const server = http.createServer(app);

// Initialize WebSocket streaming server (includes terminal support)
const streamingServer = new StreamingServer(server, {
  path: '/ws/streaming'
});

// Start the server
server.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 Coder1 Platform is running on port ${PORT}`);
  console.log(`📱 Frontend: http://localhost:${PORT}`);
  console.log(`🏥 Health check: http://localhost:${PORT}/health`);
  console.log(`🔌 WebSocket Terminal: ws://localhost:${PORT}/ws/terminal`);
  console.log(`🌍 Environment: ${process.env.NODE_ENV || 'production'}`);
});

// Graceful shutdown handling
process.on('SIGINT', () => {
  console.log('\n🛑 Received SIGINT. Graceful shutdown...');
  if (streamingServer.terminalHandler) {
    streamingServer.terminalHandler.cleanup();
  }
  process.exit(0);
});

process.on('SIGTERM', () => {
  console.log('\n🛑 Received SIGTERM. Graceful shutdown...');
  if (streamingServer.terminalHandler) {
    streamingServer.terminalHandler.cleanup();
  }
  process.exit(0);
});