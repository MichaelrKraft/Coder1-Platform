const { app, BrowserWindow, screen } = require('electron');

app.whenReady().then(() => {
  // Get primary display dimensions
  const primaryDisplay = screen.getPrimaryDisplay();
  const { width, height } = primaryDisplay.workAreaSize;
  
  console.log('Screen dimensions:', width, 'x', height);
  
  // Create window centered on screen
  const win = new BrowserWindow({
    width: 800,
    height: 600,
    x: Math.floor((width - 800) / 2),
    y: Math.floor((height - 600) / 2),
    show: false, // Don't show until ready
    alwaysOnTop: true, // Force on top
    webPreferences: {
      nodeIntegration: false
    }
  });
  
  win.loadURL('data:text/html,<h1 style="text-align:center; margin-top:200px;">Electron Window Test</h1><p style="text-align:center;">This window should be centered and on top of all other windows.</p>');
  
  win.once('ready-to-show', () => {
    win.show();
    win.focus();
    win.moveTop();
    
    console.log('Window position:', win.getPosition());
    console.log('Window bounds:', win.getBounds());
  });
});

app.on('window-all-closed', () => {
  app.quit();
});