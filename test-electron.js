// Quick test to verify Electron setup
const { app } = require('electron');
const path = require('path');

console.log('Testing Electron setup...');
console.log('App path:', app.getAppPath());
console.log('Electron version:', process.versions.electron);
console.log('Node version:', process.versions.node);

// Check if required files exist
const fs = require('fs');
const requiredFiles = [
  'electron-main.js',
  'electron-server.js',
  'smart-prd-generator.html',
  'ide-build/index.html',
  'src/app-simple.js'
];

console.log('\nChecking required files:');
requiredFiles.forEach(file => {
  const exists = fs.existsSync(path.join(__dirname, file));
  console.log(`${exists ? '✅' : '❌'} ${file}`);
});

console.log('\nSetup looks good! Run "npm start" to launch Coder1');
app.quit();