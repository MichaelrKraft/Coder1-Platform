# Node.js Network Connectivity Troubleshooting Plan

## Issue Summary
Node.js servers start successfully but are not accessible via browser on macOS, while Python HTTP servers work perfectly on the same ports. This affects local development but not production deployments.

## 🔍 Diagnostic Steps

### Step 1: Confirm the Problem
```bash
# Start Node.js server
npm start

# In another terminal, test connectivity
curl -v http://127.0.0.1:8893/health
curl -v http://localhost:8893/health

# Compare with Python server
python3 -m http.server 8894 --bind 127.0.0.1
curl -v http://127.0.0.1:8894/
```

**Expected**: Node.js curl fails, Python succeeds

### Step 2: Check Process Status
```bash
# Verify Node.js process is running
ps aux | grep node

# Check what's listening on the port
lsof -i :8893
netstat -an | grep 8893

# Check if Node.js is binding correctly
sudo lsof -i -P | grep node
```

### Step 3: Network Interface Analysis
```bash
# Check network interfaces
ifconfig
netstat -rn

# Test different binding addresses
node -e "
const http = require('http');
const server = http.createServer((req, res) => res.end('OK'));

// Test different bindings
const bindings = ['127.0.0.1', 'localhost', '0.0.0.0', '::1'];
bindings.forEach(addr => {
  try {
    const s = http.createServer().listen(0, addr, () => {
      console.log(\`✅ Binding to \${addr} works on port \${s.address().port}\`);
      s.close();
    });
    s.on('error', e => console.log(\`❌ Binding to \${addr} failed: \${e.message}\`));
  } catch(e) {
    console.log(\`❌ Binding to \${addr} failed: \${e.message}\`);
  }
});
"
```

## 🛡️ Security & Firewall Checks

### Step 4: macOS Firewall
```bash
# Check firewall status
sudo /usr/libexec/ApplicationFirewall/socketfilterfw --getglobalstate

# List applications with firewall rules
sudo /usr/libexec/ApplicationFirewall/socketfilterfw --listapps

# Check if Node.js is blocked
sudo /usr/libexec/ApplicationFirewall/socketfilterfw --getappblocked /usr/local/bin/node

# Reset Node.js firewall permissions
sudo /usr/libexec/ApplicationFirewall/socketfilterfw --remove /usr/local/bin/node
sudo /usr/libexec/ApplicationFirewall/socketfilterfw --add /usr/local/bin/node
sudo /usr/libexec/ApplicationFirewall/socketfilterfw --unblock /usr/local/bin/node
```

### Step 5: System Integrity Protection (SIP)
```bash
# Check SIP status
csrutil status

# Check if network restrictions are in place
sudo dscl . -read /Groups/com.apple.access_disabled
```

### Step 6: Network Security Policies
```bash
# Check for VPN/proxy interference
scutil --proxy

# Check DNS resolution
nslookup 127.0.0.1
nslookup localhost

# Check hosts file
cat /etc/hosts | grep -E "(127.0.0.1|localhost)"
```

## 🔧 Node.js Specific Fixes

### Step 7: Node.js Permissions
```bash
# Reset Node.js network permissions
tccutil reset All node 2>/dev/null || echo "TCC reset not available"

# Check Node.js installation
which node
node --version
npm --version

# Test with different Node.js versions
nvm list 2>/dev/null || echo "NVM not installed"
```

### Step 8: Server Configuration Fixes

#### Fix 1: Explicit IPv4 Binding
```javascript
// In server.js, change from:
server.listen(PORT, '0.0.0.0', callback);
// To:
server.listen(PORT, '127.0.0.1', callback);
```

#### Fix 2: Dual Stack Binding
```javascript
// Try IPv6 first, fallback to IPv4
const server = http.createServer(app);
server.listen(PORT, '::', (err) => {
  if (err) {
    console.log('IPv6 failed, trying IPv4...');
    server.listen(PORT, '127.0.0.1', callback);
  } else {
    console.log(`Server running on IPv6 port ${PORT}`);
  }
});
```

#### Fix 3: Express Trust Proxy
```javascript
// Add to app configuration
app.set('trust proxy', 'loopback');
app.set('trust proxy', 1);
```

## 🧪 Advanced Diagnostics

### Step 9: Packet Tracing
```bash
# Monitor network traffic (requires admin)
sudo tcpdump -i lo0 port 8893

# Monitor in another terminal while testing
curl http://127.0.0.1:8893/health
```

### Step 10: System Call Tracing
```bash
# Install dtrace tools if needed
# Monitor Node.js system calls
sudo dtruss -p $(pgrep -f "node.*server.js") 2>&1 | grep -E "(socket|bind|listen|accept)"
```

### Step 11: Alternative Testing Methods
```bash
# Test with different tools
telnet 127.0.0.1 8893
nc -zv 127.0.0.1 8893

# Test HTTP specifically
echo -e "GET /health HTTP/1.1\r\nHost: 127.0.0.1:8893\r\n\r\n" | nc 127.0.0.1 8893
```

## 🔄 Quick Fixes to Try

### Fix A: Server Restart with Clean Environment
```bash
# Kill all Node processes
pkill -f node

# Clear DNS cache
sudo dscacheutil -flushcache

# Restart with clean environment
env -i PATH=/usr/local/bin:/usr/bin:/bin npm start
```

### Fix B: Different Port Binding Strategy
```javascript
// Try port binding with error handling
const tryPorts = [8893, 8894, 8895, 3000, 3001];
let server = null;

for (const port of tryPorts) {
  try {
    server = app.listen(port, '127.0.0.1', () => {
      console.log(`✅ Server running on 127.0.0.1:${port}`);
    });
    break;
  } catch (error) {
    console.log(`❌ Port ${port} failed: ${error.message}`);
  }
}
```

### Fix C: Browser-Specific Testing
```bash
# Test with different browsers
open -a "Google Chrome" http://127.0.0.1:8893/health
open -a "Safari" http://127.0.0.1:8893/health
open -a "Firefox" http://127.0.0.1:8893/health

# Test in private/incognito mode
# Test with browser dev tools network tab
```

## 🚀 Workarounds

### Workaround 1: Tunneling Solutions
```bash
# Install ngrok
brew install ngrok

# Tunnel local Node.js server
ngrok http 8893

# Use the ngrok URL for testing
```

### Workaround 2: Docker Container
```dockerfile
# Dockerfile
FROM node:18
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
EXPOSE 8893
CMD ["npm", "start"]
```

```bash
# Build and run
docker build -t coder1-test .
docker run -p 8893:8893 coder1-test
```

### Workaround 3: Cloud Development
```bash
# Deploy to cloud for testing
# Heroku
heroku create coder1-test
git push heroku main

# Vercel
vercel --prod
```

## 📊 Diagnostic Script

Create and run this comprehensive diagnostic:

```bash
#!/bin/bash
# save as: diagnose-nodejs.sh

echo "🔍 Node.js Network Diagnostic Script"
echo "====================================="

echo -e "\n1. System Information:"
sw_vers
echo "Node.js: $(node --version)"
echo "npm: $(npm --version)"

echo -e "\n2. Network Interfaces:"
ifconfig | grep -E "(inet|lo0|en0)"

echo -e "\n3. Firewall Status:"
sudo /usr/libexec/ApplicationFirewall/socketfilterfw --getglobalstate

echo -e "\n4. Node.js Processes:"
ps aux | grep node | grep -v grep

echo -e "\n5. Port Usage:"
lsof -i :8893 | head -10

echo -e "\n6. DNS Resolution:"
nslookup 127.0.0.1
nslookup localhost

echo -e "\n7. Hosts File:"
grep -E "(127.0.0.1|localhost)" /etc/hosts

echo -e "\n8. Proxy Settings:"
scutil --proxy | grep -E "(HTTP|HTTPS|SOCKS)"

echo -e "\n9. Test Connections:"
nc -zv 127.0.0.1 8893 2>&1 || echo "Port 8893 not accessible"
nc -zv localhost 8893 2>&1 || echo "localhost:8893 not accessible"

echo -e "\n✅ Diagnostic complete!"
```

## 📋 Systematic Resolution Plan

### Phase 1: Security & Permissions (Most Likely)
1. Reset firewall rules for Node.js
2. Check and fix system permissions
3. Verify no VPN/proxy interference

### Phase 2: Configuration Changes
1. Modify server binding address
2. Try different port binding strategies
3. Update Express configuration

### Phase 3: Environment Issues
1. Test with different Node.js versions
2. Clear system caches
3. Test in clean environment

### Phase 4: Alternative Solutions
1. Use tunneling (ngrok)
2. Docker containerization
3. Cloud deployment for testing

## ✅ Success Criteria

**Problem is solved when:**
- `curl http://127.0.0.1:8893/health` returns 200 OK
- Browser can access Node.js server URLs
- Terminal AI integration works without mock mode
- All development features accessible locally

## 📞 Next Steps

1. **Run the diagnostic script** to identify the specific issue
2. **Try quick fixes** in order of likelihood
3. **Implement workarounds** if fixes don't work immediately
4. **Document the solution** for future reference

This plan should resolve the Node.js networking issue and restore full local development capabilities.