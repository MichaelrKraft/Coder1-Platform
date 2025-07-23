// Minimal Express test
const express = require('express');
const path = require('path');

const app = express();
const PORT = 8889;

// Basic middleware
app.use(express.json());

// Test route
app.get('/', (req, res) => {
    res.send('<h1>Express Test</h1><p>Express is working!</p>');
});

// Health check
app.get('/health', (req, res) => {
    res.json({ status: 'ok', port: PORT });
});

// Try to serve the voice integration files
app.get('/ide', (req, res) => {
    const filePath = path.join(__dirname, 'ide-build', 'index.html');
    console.log('Serving IDE from:', filePath);
    res.sendFile(filePath, (err) => {
        if (err) {
            console.error('IDE file error:', err);
            res.status(404).send('IDE not found: ' + err.message);
        }
    });
});

// Serve static files
app.use('/ide/static', express.static(path.join(__dirname, 'ide-build/static')));

app.listen(PORT, () => {
    console.log(`🚀 Minimal Express server running on http://localhost:${PORT}`);
    console.log(`📱 Try the IDE at: http://localhost:${PORT}/ide`);
}).on('error', (err) => {
    console.error('❌ Express server error:', err);
});