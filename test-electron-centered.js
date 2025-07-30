const { app, BrowserWindow, screen } = require('electron');

app.on('ready', () => {
  // Get screen dimensions
  const primaryDisplay = screen.getPrimaryDisplay();
  const { width, height } = primaryDisplay.workAreaSize;
  
  console.log('Primary display:', width, 'x', height);
  console.log('All displays:', screen.getAllDisplays().map(d => ({
    id: d.id,
    bounds: d.bounds,
    workArea: d.workArea
  })));
  
  // Create window in center of primary display
  const win = new BrowserWindow({
    width: 800,
    height: 600,
    x: Math.floor((width - 800) / 2),
    y: Math.floor((height - 600) / 2),
    show: true,
    alwaysOnTop: true,
    backgroundColor: '#ffffff',
    webPreferences: {
      nodeIntegration: false
    }
  });
  
  win.loadURL('data:text/html,<body style="background:red;color:white;font-size:48px;text-align:center;padding-top:200px;">ELECTRON WINDOW TEST</body>');
  
  win.once('ready-to-show', () => {
    win.show();
    win.focus();
    win.setAlwaysOnTop(true);
    win.moveTop();
  });
  
  // Try multiple times to ensure window is visible
  let attempts = 0;
  const interval = setInterval(() => {
    attempts++;
    console.log(`Attempt ${attempts}: Visible=${win.isVisible()}, Minimized=${win.isMinimized()}, Position=${JSON.stringify(win.getPosition())}`);
    win.show();
    win.focus();
    win.moveTop();
    
    if (attempts >= 5) {
      clearInterval(interval);
    }
  }, 1000);
});

app.on('window-all-closed', () => {
  app.quit();
});