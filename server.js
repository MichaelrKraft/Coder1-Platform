// Production server entry point
const app = require('./src/app-simple');
const http = require('http');
const { StreamingServer } = require('./src/websocket/streaming-server');

const PORT = process.env.PORT || 8080;

// Create HTTP server
const server = http.createServer(app);

// Initialize WebSocket streaming server
const streamingServer = new StreamingServer(server, {
  path: '/ws/streaming'
});

// Start the server - try without specific binding
server.listen(PORT, () => {
  console.log(`🚀 Coder1 Platform is running on port ${PORT}`);
  console.log(`📱 Frontend: http://127.0.0.1:${PORT}`);
  console.log(`📱 Also try: http://localhost:${PORT}`);
  console.log(`🏥 Health check: http://127.0.0.1:${PORT}/health`);
  console.log(`🔌 WebSocket Streaming: ws://127.0.0.1:${PORT}/ws/streaming`);
  console.log(`🔄 WebSocket Infinite Loop: ws://127.0.0.1:${PORT}/ws/infinite-loop`);
  console.log(`🌍 Environment: ${process.env.NODE_ENV || 'development'}`);
});

// Graceful shutdown handling
process.on('SIGINT', () => {
  console.log('\n🛑 Received SIGINT. Graceful shutdown...');
  process.exit(0);
});

process.on('SIGTERM', () => {
  console.log('\n🛑 Received SIGTERM. Graceful shutdown...');
  process.exit(0);
});