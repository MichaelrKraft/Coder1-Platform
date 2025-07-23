// Simple test server to debug the issue
const express = require('express');
const app = express();
const PORT = process.env.PORT || 8765;

app.get('/', (req, res) => {
    res.send('Hello! Server is working on port ' + PORT);
});

app.get('/health', (req, res) => {
    res.json({ status: 'ok', port: PORT });
});

app.listen(PORT, () => {
    console.log(`🚀 Test server running on port ${PORT}`);
    console.log(`📱 Try: http://localhost:${PORT}`);
}).on('error', (err) => {
    console.error('❌ Server error:', err);
});