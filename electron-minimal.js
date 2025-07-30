const { app, BrowserWindow } = require('electron');

let mainWindow;

function createWindow() {
  console.log('Creating window...');
  
  mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    show: true,
    center: true
  });

  console.log('Loading content...');
  mainWindow.loadURL('data:text/html,<h1>Electron Test</h1><p>Window is working!</p>');
  
  mainWindow.on('closed', () => {
    console.log('Window closed');
    mainWindow = null;
  });
  
  console.log('Window created');
}

app.on('ready', () => {
  console.log('App ready');
  createWindow();
});

app.on('window-all-closed', () => {
  console.log('All windows closed');
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

console.log('Electron minimal app starting...');