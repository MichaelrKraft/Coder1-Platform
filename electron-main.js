const { app, BrowserWindow, Menu, shell, protocol } = require('electron');
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
  // Initialize the Express server within Electron
  console.log('Initializing Express server within Electron...');
  initializeServer();

  // Create the browser window
  mainWindow = new BrowserWindow({
    width: 1600,
    height: 1000,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      webSecurity: false, // Allow loading local files
      webviewTag: true
    },
    icon: path.join(__dirname, 'static', 'favicon.ico'),
    titleBarStyle: 'hiddenInset'
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
        { label: 'IDE', click: () => navigateTo('/ide') },
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

  // Load the main page directly from file
  const indexPath = path.join(__dirname, 'smart-prd-generator.html');
  console.log('Loading main page from:', indexPath);
  
  mainWindow.loadFile(indexPath).catch(err => {
    console.error('Failed to load main page:', err);
    // Fallback to a simple error page
    mainWindow.loadURL(`data:text/html,<h1>Error loading Coder1</h1><p>${err.message}</p>`);
  });

  // Open DevTools only in development mode when explicitly set
  if (process.env.NODE_ENV === 'development' && process.env.OPEN_DEVTOOLS === 'true') {
    mainWindow.webContents.openDevTools();
  }

  mainWindow.on('closed', () => {
    mainWindow = null;
  });
}

// Navigation helpers
function navigateTo(routePath) {
  if (mainWindow) {
    // Map routes to actual files
    const routeMap = {
      '/': 'smart-prd-generator.html',
      '/ide': 'ide-build/index.html',
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
app.whenReady().then(() => {
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
  
  // Intercept HTTP requests to localhost and redirect to file protocol
  protocol.interceptFileProtocol('http', (request, callback) => {
    const url = new URL(request.url);
    
    // Handle API requests
    if (url.pathname.startsWith('/api/')) {
      handleRequest(request, (response) => {
        const dataUrl = `data:${response.headers['Content-Type'] || 'text/plain'};base64,${response.data.toString('base64')}`;
        callback({ url: dataUrl });
      });
    } else {
      // Handle static file requests
      const filePath = path.join(__dirname, url.pathname.substring(1));
      callback({ path: filePath });
    }
  });
  
  createWindow();
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
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