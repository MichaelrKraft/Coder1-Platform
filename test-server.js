const http = require('http');

const server = http.createServer((req, res) => {
  res.writeHead(200, { 'Content-Type': 'text/plain' });
  res.end('Node.js is working!\n');
});

server.listen(9876, '127.0.0.1', () => {
  console.log('Server running on http://127.0.0.1:9876');
  console.log('Press Ctrl+C to stop');
});