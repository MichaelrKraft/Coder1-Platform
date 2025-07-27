const { app, BrowserWindow } = require('electron');
const path = require('path');

let testWindow;

function createTestWindow() {
  // Initialize the Express server
  const { initializeServer } = require('./electron-server');
  initializeServer();

  // Create a test window
  testWindow = new BrowserWindow({
    width: 1600,
    height: 1000,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      webSecurity: false
    }
  });

  // Load the main page
  const indexPath = path.join(__dirname, 'smart-prd-generator.html');
  testWindow.loadFile(indexPath).then(() => {
    console.log('✅ Page loaded successfully');
    
    // Check if CSS is loading properly
    testWindow.webContents.executeJavaScript(`
      const styles = window.getComputedStyle(document.body);
      const results = {
        bodyBackground: styles.backgroundColor,
        bodyColor: styles.color,
        glassmorphismElements: document.querySelectorAll('.glassmorphism').length,
        inputWrapper: !!document.querySelector('.input-wrapper'),
        messageInput: !!document.querySelector('#messageInput'),
        headerLogo: !!document.querySelector('.header-logo'),
        animatedBackground: !!document.querySelector('.animated-background')
      };
      console.log('CSS Test Results:', results);
      results;
    `).then(results => {
      console.log('\n🎨 CSS Formatting Test Results:');
      console.log(`  Body background: ${results.bodyBackground}`);
      console.log(`  Body text color: ${results.bodyColor}`);
      console.log(`  Glassmorphism elements: ${results.glassmorphismElements}`);
      console.log(`  Input wrapper present: ${results.inputWrapper}`);
      console.log(`  Message input present: ${results.messageInput}`);
      console.log(`  Header logo present: ${results.headerLogo}`);
      console.log(`  Animated background present: ${results.animatedBackground}`);
      
      // Take a screenshot for visual verification
      testWindow.webContents.capturePage().then(image => {
        require('fs').writeFileSync('test-screenshot.png', image.toPNG());
        console.log('\n📸 Screenshot saved as test-screenshot.png');
        console.log('\n✨ Test complete! Check the screenshot to verify formatting.');
        
        setTimeout(() => {
          app.quit();
        }, 2000);
      });
    });
  }).catch(err => {
    console.error('❌ Failed to load page:', err);
    app.quit();
  });
}

app.whenReady().then(createTestWindow);

app.on('window-all-closed', () => {
  app.quit();
});