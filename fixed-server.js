// Fixed server with IPv4 binding
const express = require('express');
const path = require('path');

const app = express();
const PORT = 8891;

// Basic middleware
app.use(express.json());
app.use(express.static(path.join(__dirname, 'static')));

// Main page
app.get('/', (req, res) => {
    const filePath = path.join(__dirname, 'smart-prd-generator.html');
    res.sendFile(filePath, (err) => {
        if (err) {
            res.status(404).send('SmartPRD page not found');
        }
    });
});

// IDE page
app.get('/ide', (req, res) => {
    const filePath = path.join(__dirname, 'ide-build', 'index.html');
    res.sendFile(filePath, (err) => {
        if (err) {
            res.status(404).send('IDE not found');
        }
    });
});

// Serve IDE static files
app.use('/ide/static', express.static(path.join(__dirname, 'ide-build/static')));

// Health check
app.get('/health', (req, res) => {
    res.json({ status: 'ok', port: PORT, message: 'Voice integration ready!' });
});

// Explicitly bind to IPv4 localhost
app.listen(PORT, '127.0.0.1', () => {
    console.log(`🚀 Fixed server running on http://127.0.0.1:${PORT}`);
    console.log(`🎤 SmartPRD Voice: http://127.0.0.1:${PORT}/`);
    console.log(`🎤 Terminal Voice: http://127.0.0.1:${PORT}/ide`);
    console.log(`🏥 Health check: http://127.0.0.1:${PORT}/health`);
}).on('error', (err) => {
    console.error('❌ Server error:', err);
});