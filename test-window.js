const { app, BrowserWindow } = require('electron');

app.whenReady().then(() => {
  const win = new BrowserWindow({
    width: 800,
    height: 600,
    show: true,
    webPreferences: {
      nodeIntegration: false
    }
  });
  
  // Load a simple test page
  win.loadURL('data:text/html,<h1>Test Window Working!</h1><p>If you can see this, Electron windows work.</p>');
  
  // Force show the window
  win.show();
  win.focus();
  
  // Log window state
  setInterval(() => {
    console.log('Window visible:', win.isVisible());
    console.log('Window focused:', win.isFocused());
  }, 2000);
});

app.on('window-all-closed', () => {
  app.quit();
});