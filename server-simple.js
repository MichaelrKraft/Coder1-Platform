// Simplified production server for Render deployment
const app = require('./src/app-simple');
const PORT = process.env.PORT || 10000;

// Start the server with minimal dependencies
app.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 Coder1 Platform is running on port ${PORT}`);
  console.log(`📱 Frontend: http://localhost:${PORT}`);
  console.log(`🏥 Health check: http://localhost:${PORT}/health`);
  console.log(`🌍 Environment: ${process.env.NODE_ENV || 'production'}`);
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