#!/bin/bash
# Node.js Network Diagnostic Script

echo "🔍 Node.js Network Diagnostic Script"
echo "====================================="

echo -e "\n1. System Information:"
sw_vers
echo "Node.js: $(node --version)"
echo "npm: $(npm --version)"

echo -e "\n2. Network Interfaces:"
ifconfig | grep -E "(inet|lo0|en0)"

echo -e "\n3. Node.js Processes:"
ps aux | grep node | grep -v grep

echo -e "\n4. Port Usage:"
lsof -i :3000 | head -10

echo -e "\n5. DNS Resolution:"
nslookup 127.0.0.1
nslookup localhost

echo -e "\n6. Hosts File:"
grep -E "(127.0.0.1|localhost)" /etc/hosts

echo -e "\n7. Test Connections:"
nc -zv 127.0.0.1 3000 2>&1 || echo "Port 3000 not accessible"
nc -zv localhost 3000 2>&1 || echo "localhost:3000 not accessible"

echo -e "\n8. Python Server Test (for comparison):"
echo "Starting Python server on port 3001..."
python3 -m http.server 3001 --bind 127.0.0.1 &
PYTHON_PID=$!
sleep 2
nc -zv 127.0.0.1 3001 2>&1 || echo "Python server not accessible"
kill $PYTHON_PID 2>/dev/null

echo -e "\n✅ Diagnostic complete!"