// Debug server with extensive logging
console.log('🔍 Starting debug server...');

try {
    const express = require('express');
    console.log('✅ Express loaded');
    
    const app = express();
    console.log('✅ Express app created');
    
    const PORT = 8890;
    
    app.get('/', (req, res) => {
        console.log('📥 Request received');
        res.send('Debug server working!');
    });
    
    console.log('✅ Routes defined');
    
    const server = app.listen(PORT, (err) => {
        if (err) {
            console.error('❌ Listen error:', err);
            return;
        }
        console.log(`🚀 Debug server listening on port ${PORT}`);
        console.log(`📍 Server address:`, server.address());
    });
    
    server.on('error', (err) => {
        console.error('❌ Server error event:', err);
    });
    
    server.on('listening', () => {
        console.log('🎧 Server listening event triggered');
        console.log('📍 Listening on:', server.address());
    });
    
    console.log('✅ Server setup complete, waiting for listen callback...');
    
} catch (error) {
    console.error('❌ Startup error:', error);
}