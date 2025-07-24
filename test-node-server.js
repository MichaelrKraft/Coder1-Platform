// Minimal Node.js server test
const http = require('http');
const PORT = 3002;

console.log('Starting minimal Node.js server test...');

// Try different binding configurations
const configs = [
  { host: undefined, name: 'default (no host)' },
  { host: '127.0.0.1', name: '127.0.0.1' },
  { host: 'localhost', name: 'localhost' },
  { host: '0.0.0.0', name: '0.0.0.0' },
  { host: '::', name: ':: (IPv6)' }
];

async function testBinding(config) {
  return new Promise((resolve) => {
    const server = http.createServer((req, res) => {
      res.writeHead(200, { 'Content-Type': 'text/plain' });
      res.end('OK');
    });

    server.on('error', (err) => {
      console.log(`❌ ${config.name}: Failed - ${err.message}`);
      resolve(false);
    });

    try {
      if (config.host) {
        server.listen(PORT, config.host, () => {
          console.log(`✅ ${config.name}: Listening on ${config.host}:${PORT}`);
          server.close();
          resolve(true);
        });
      } else {
        server.listen(PORT, () => {
          console.log(`✅ ${config.name}: Listening on port ${PORT}`);
          server.close();
          resolve(true);
        });
      }
    } catch (err) {
      console.log(`❌ ${config.name}: Exception - ${err.message}`);
      resolve(false);
    }
  });
}

async function runTests() {
  for (const config of configs) {
    await testBinding(config);
    await new Promise(resolve => setTimeout(resolve, 100));
  }
  
  console.log('\nTesting actual connectivity...');
  
  // Start a server on default binding
  const testServer = http.createServer((req, res) => {
    res.writeHead(200, { 'Content-Type': 'text/plain' });
    res.end('Test server running');
  });
  
  testServer.listen(3002, () => {
    console.log('Test server started on port 3002');
    console.log('Run this in another terminal: curl http://127.0.0.1:3002/');
    console.log('Press Ctrl+C to stop');
  });
}

runTests();