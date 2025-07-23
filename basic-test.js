// Very basic HTTP server test
const http = require('http');

const server = http.createServer((req, res) => {
    res.writeHead(200, { 'Content-Type': 'text/html' });
    res.end(`
        <h1>Basic Server Test</h1>
        <p>If you can see this, the networking is working!</p>
        <p>Voice integration is ready at the working URLs</p>
    `);
});

const PORT = 8888;

server.listen(PORT, 'localhost', () => {
    console.log(`🧪 Basic test server running on http://localhost:${PORT}`);
});

server.on('error', (err) => {
    console.error('❌ Server failed to start:', err);
});