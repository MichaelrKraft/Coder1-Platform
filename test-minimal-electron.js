const { app, BrowserWindow } = require('electron');

app.on('ready', () => {
  console.log('App ready!');
  const win = new BrowserWindow({
    width: 800,
    height: 600,
    show: true
  });
  
  win.loadURL('data:text/html,<h1>Hello Electron!</h1>');
  
  win.once('ready-to-show', () => {
    console.log('Window ready to show');
    win.show();
  });
  
  win.on('show', () => {
    console.log('Window shown');
  });
  
  win.on('hide', () => {
    console.log('Window hidden');
  });
  
  // Force focus
  setTimeout(() => {
    win.focus();
    win.moveTop();
    console.log('Forced focus');
  }, 1000);
});

app.on('window-all-closed', () => {
  console.log('All windows closed');
  app.quit();
});