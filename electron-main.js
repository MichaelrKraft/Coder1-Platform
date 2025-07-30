const { app, BrowserWindow, Menu, shell, protocol, ipcMain } = require('electron');
const path = require('path');
const fs = require('fs');
const { initializeServer, handleRequest } = require('./electron-server');

let mainWindow;

// Ensure Coder1Projects directory exists
const projectsPath = path.join(require('os').homedir(), 'Documents', 'Coder1Projects');
if (!fs.existsSync(projectsPath)) {
  fs.mkdirSync(projectsPath, { recursive: true });
}

// Set projects path in environment
process.env.PROJECTS_PATH = projectsPath;

function createWindow() {
  console.log('createWindow called');
  
  // Initialize the Express server within Electron with error handling
  console.log('Initializing Express server within Electron...');
  try {
    initializeServer();
  } catch (error) {
    console.error('Failed to initialize server:', error);
    // Continue anyway - the app can work without the server for now
  }

  console.log('Creating BrowserWindow...');
  // Create the browser window
  mainWindow = new BrowserWindow({
    width: 1600,
    height: 1000,
    center: true, // Center the window
    show: true, // Show immediately
    alwaysOnTop: false, // Don't keep on top
    focusable: true,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: false, // Disable context isolation
      sandbox: false, // Disable sandbox
      webSecurity: false, // Allow loading local files
      webviewTag: true
    },
    icon: path.join(__dirname, 'static', 'favicon.ico'),
    titleBarStyle: 'default' // Use default title bar for better visibility
  });

  // Create application menu
  const template = [
    {
      label: 'Coder1',
      submenu: [
        { label: 'About Coder1', role: 'about' },
        { type: 'separator' },
        { label: 'Preferences', accelerator: 'Cmd+,', click: () => openPreferences() },
        { type: 'separator' },
        { label: 'Quit', accelerator: 'Cmd+Q', role: 'quit' }
      ]
    },
    {
      label: 'File',
      submenu: [
        { label: 'New Project', accelerator: 'Cmd+N', click: () => newProject() },
        { label: 'Open Projects Folder', click: () => shell.openPath(projectsPath) },
        { type: 'separator' },
        { label: 'Export PRD', accelerator: 'Cmd+E', click: () => exportPRD() }
      ]
    },
    {
      label: 'Edit',
      submenu: [
        { role: 'undo' },
        { role: 'redo' },
        { type: 'separator' },
        { role: 'cut' },
        { role: 'copy' },
        { role: 'paste' }
      ]
    },
    {
      label: 'View',
      submenu: [
        { label: 'PRD Generator', click: () => navigateTo('/') },
        { type: 'separator' },
        { label: 'IDE (Classic Web)', click: () => navigateTo('/ide') },
        { label: 'IDE (Desktop Native)', click: () => navigateTo('/ide-desktop') },
        { type: 'separator' },
        { role: 'reload' },
        { role: 'forceReload' },
        { role: 'toggleDevTools' },
        { type: 'separator' },
        { role: 'togglefullscreen' }
      ]
    },
    {
      label: 'AI',
      submenu: [
        { label: 'Start Infinite Loop', accelerator: 'Cmd+I', click: () => startInfiniteLoop() },
        { label: 'Launch Parallel Agents', accelerator: 'Cmd+P', click: () => launchParallelAgents() },
        { label: 'Open Hivemind', accelerator: 'Cmd+H', click: () => openHivemind() }
      ]
    }
  ];

  const menu = Menu.buildFromTemplate(template);
  Menu.setApplicationMenu(menu);

  // Show window when ready
  mainWindow.once('ready-to-show', () => {
    console.log('Window ready to show');
    mainWindow.show();
    mainWindow.focus();
    mainWindow.center();
    mainWindow.moveTop();
    console.log('Window should now be visible and focused');
  });

  // Add error handling for the window
  mainWindow.webContents.on('did-fail-load', (event, errorCode, errorDescription) => {
    console.error('Page failed to load:', errorCode, errorDescription);
  });

  mainWindow.webContents.on('did-finish-load', () => {
    console.log('Page finished loading successfully');
    
    // Inject error handler to prevent window from closing
    mainWindow.webContents.executeJavaScript(`
      window.addEventListener('error', (event) => {
        console.error('Window error:', event.message, event.filename, event.lineno);
        event.preventDefault();
        return true;
      });
      
      window.addEventListener('unhandledrejection', (event) => {
        console.error('Unhandled promise rejection:', event.reason);
        event.preventDefault();
        return true;
      });
      
      // Prevent navigation that could close the window
      window.addEventListener('beforeunload', (event) => {
        console.log('Preventing window unload');
        event.preventDefault();
        event.returnValue = '';
        return '';
      });
    `);
  });

  mainWindow.webContents.on('crashed', (event, killed) => {
    console.error('Window crashed:', killed);
  });

  mainWindow.webContents.on('render-process-gone', (event, details) => {
    console.error('Render process gone:', details);
  });

  // Prevent window from closing on errors
  mainWindow.webContents.on('will-prevent-unload', (event) => {
    console.log('Preventing unload');
    event.preventDefault();
  });

  mainWindow.on('closed', () => {
    console.log('Window closed');
    mainWindow = null;
  });

  // Load the main page directly from file
  const indexPath = path.join(__dirname, 'smart-prd-generator.html');
  console.log('Loading main page from:', indexPath);
  
  mainWindow.loadFile(indexPath).then(() => {
    console.log('Main page loaded successfully');
  }).catch(err => {
    console.error('Failed to load main page:', err);
    console.error('Error details:', err.stack);
    // Fallback to a simple error page
    mainWindow.loadURL(`data:text/html,<h1>Error loading Coder1</h1><p>${err.message}</p><p>Path: ${indexPath}</p>`);
  });

  // Open DevTools only in development
  if (process.env.NODE_ENV === 'development') {
    mainWindow.webContents.openDevTools();
  }
}

// Handle navigation from renderer process
ipcMain.on('navigate', (event, path) => {
  navigateTo(path);
});

// Navigation helpers
function navigateTo(routePath) {
  if (mainWindow) {
    // Map routes to actual files
    const routeMap = {
      '/': 'smart-prd-generator.html',
      '/ide': 'ide-build/index.html',
      '/ide-desktop': 'ide-build/index-desktop.html',
      '/platform': 'static/homepage.html',
      '/context-priming': 'context-priming.html'
    };
    
    const fileName = routeMap[routePath] || 'smart-prd-generator.html';
    const filePath = path.join(__dirname, fileName);
    
    console.log(`Navigating to: ${filePath}`);
    mainWindow.loadFile(filePath).catch(err => {
      console.error(`Failed to load ${fileName}:`, err);
    });
  }
}

function newProject() {
  if (mainWindow) {
    const indexPath = path.join(__dirname, 'smart-prd-generator.html');
    mainWindow.loadFile(indexPath);
    // Clear any existing session
    mainWindow.webContents.executeJavaScript('localStorage.clear()');
  }
}

function exportPRD() {
  if (mainWindow) {
    mainWindow.webContents.executeJavaScript(`
      if (window.exportCurrentPRD) {
        window.exportCurrentPRD();
      } else {
        alert('Please generate a PRD first');
      }
    `);
  }
}

function startInfiniteLoop() {
  if (mainWindow) {
    navigateTo('/ide');
    setTimeout(() => {
      mainWindow.webContents.executeJavaScript(`
        const btn = document.querySelector('[data-action="infinite-loop"]');
        if (btn) btn.click();
      `);
    }, 1000);
  }
}

function launchParallelAgents() {
  if (mainWindow) {
    navigateTo('/ide');
    setTimeout(() => {
      mainWindow.webContents.executeJavaScript(`
        const btn = document.querySelector('[data-action="parallel-agents"]');
        if (btn) btn.click();
      `);
    }, 1000);
  }
}

function openHivemind() {
  if (mainWindow) {
    navigateTo('/ide');
    setTimeout(() => {
      mainWindow.webContents.executeJavaScript(`
        const btn = document.querySelector('[data-action="hivemind"]');
        if (btn) btn.click();
      `);
    }, 1000);
  }
}

function openPreferences() {
  // TODO: Create preferences window
  if (mainWindow) {
    mainWindow.webContents.executeJavaScript(`
      alert('Preferences coming soon!\\n\\nCurrent Settings:\\n- Projects Path: ${projectsPath}\\n- API: Claude Code Max');
    `);
  }
}

// Set up custom protocol to handle API requests
app.on('ready', () => {
  console.log('Electron app is ready!');
  // Register a custom protocol for API requests
  protocol.registerStringProtocol('coder1-api', (request, callback) => {
    // This will be used for API calls
    handleRequest(request, (response) => {
      callback({
        statusCode: response.statusCode,
        headers: response.headers,
        data: response.data.toString()
      });
    });
  });
  
  
  console.log('Creating window now...');
  createWindow();
});

app.on('window-all-closed', () => {
  console.log('All windows closed - NOT quitting app');
  // Don't quit the app even on non-macOS platforms for now
  // We want to debug why the window is closing
});

app.on('activate', () => {
  if (mainWindow === null) {
    createWindow();
  }
});

// Handle uncaught exceptions
process.on('uncaughtException', (error) => {
  console.error('Uncaught Exception:', error);
});

// Keep the process alive
setInterval(() => {
  // Keep-alive heartbeat
}, 1000);

// Prevent the app from exiting
process.on('exit', (code) => {
  console.log('Process attempting to exit with code:', code);
});

process.on('beforeExit', (code) => {
  console.log('Process about to exit with code:', code);
  // Prevent exit by scheduling more work
  setTimeout(() => {
    console.log('Keeping process alive...');
  }, 0);
});

console.log('Electron main process started');