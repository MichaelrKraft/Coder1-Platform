// Production server entry point
const app = require('./src/app-simple');
const PORT = process.env.PORT || 8080;

// Start the server - bind to all interfaces
app.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 Coder1 Platform is running on port ${PORT}`);
  console.log(`📱 Frontend: http://127.0.0.1:${PORT}`);
  console.log(`📱 Also try: http://localhost:${PORT}`);
  console.log(`🏥 Health check: http://127.0.0.1:${PORT}/health`);
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