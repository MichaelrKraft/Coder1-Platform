const { app, BrowserWindow } = require('electron');

let mainWindow;

function createWindow() {
  console.log('Creating test window...');
  
  mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true
    }
  });

  // Load a simple HTML string to test
  mainWindow.loadURL('data:text/html,<h1>Electron Test Window</h1><p>If you can see this, Electron is working!</p>');
  
  mainWindow.on('closed', () => {
    console.log('Window closed');
    mainWindow = null;
  });
  
  console.log('Window created successfully');
}

app.whenReady().then(() => {
  console.log('App is ready');
  createWindow();
});

app.on('window-all-closed', () => {
  console.log('All windows closed');
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  if (mainWindow === null) {
    createWindow();
  }
});