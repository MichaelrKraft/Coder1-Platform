const { app, BrowserWindow, Menu } = require('electron');
const path = require('path');

let mainWindow;

function createWindow() {
  console.log('Creating main window...');
  
  // Create the browser window
  mainWindow = new BrowserWindow({
    width: 1600,
    height: 1000,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      webSecurity: false
    },
    icon: path.join(__dirname, 'static', 'favicon.ico')
  });

  // Try to load the main page
  const indexPath = path.join(__dirname, 'smart-prd-generator.html');
  console.log('Loading:', indexPath);
  
  mainWindow.loadFile(indexPath).then(() => {
    console.log('Page loaded successfully');
  }).catch(err => {
    console.error('Failed to load page:', err);
    mainWindow.loadURL(`data:text/html,<h1>Error loading page</h1><p>${err.message}</p><p>Path: ${indexPath}</p>`);
  });

  mainWindow.on('closed', () => {
    console.log('Window closed');
    mainWindow = null;
  });
}

app.whenReady().then(() => {
  console.log('App ready');
  createWindow();
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

// Log any errors
process.on('uncaughtException', (error) => {
  console.error('Uncaught Exception:', error);
});