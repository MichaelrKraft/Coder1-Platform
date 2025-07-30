// XTerm Enhancement for Coder1 IDE - Adds real terminal capability without breaking existing functionality
(function() {
    'use strict';
    
    console.log('🚀 Loading XTerm Enhancement for real terminal capability');
    
    let xtermLoaded = false;
    let xtermInstance = null;
    let fitAddon = null;
    let ws = null;
    let isRealTerminalMode = false;
    
    // Load xterm.js and addons dynamically
    function loadXTermResources() {
        if (xtermLoaded) return Promise.resolve();
        
        return new Promise((resolve, reject) => {
            // Load xterm CSS
            const cssLink = document.createElement('link');
            cssLink.rel = 'stylesheet';
            cssLink.href = 'https://cdn.jsdelivr.net/npm/xterm@5.3.0/css/xterm.css';
            document.head.appendChild(cssLink);
            
            // Load xterm JS
            const script = document.createElement('script');
            script.src = 'https://cdn.jsdelivr.net/npm/xterm@5.3.0/lib/xterm.js';
            script.onload = () => {
                // Load fit addon
                const fitScript = document.createElement('script');
                fitScript.src = 'https://cdn.jsdelivr.net/npm/xterm-addon-fit@0.8.0/lib/xterm-addon-fit.js';
                fitScript.onload = () => {
                    xtermLoaded = true;
                    console.log('✅ XTerm.js loaded successfully');
                    resolve();
                };
                fitScript.onerror = reject;
                document.head.appendChild(fitScript);
            };
            script.onerror = reject;
            document.head.appendChild(script);
        });
    }
    
    // Add toggle button to terminal header
    function addTerminalToggle() {
        const checkInterval = setInterval(() => {
            const terminalHeader = document.querySelector('.terminal-header-right');
            if (terminalHeader && !document.querySelector('.terminal-mode-toggle')) {
                clearInterval(checkInterval);
                
                // Create toggle button
                const toggleBtn = document.createElement('button');
                toggleBtn.className = 'terminal-control-btn terminal-mode-toggle';
                toggleBtn.innerHTML = '🖥️ Real Terminal';
                toggleBtn.title = 'Toggle between AI Chat and Real Terminal';
                toggleBtn.style.marginRight = '10px';
                toggleBtn.style.backgroundColor = '#2a2e42';
                toggleBtn.style.border = '2px solid #ff9e00';
                
                // Insert before the first button
                const firstBtn = terminalHeader.querySelector('button');
                if (firstBtn) {
                    terminalHeader.insertBefore(toggleBtn, firstBtn);
                } else {
                    terminalHeader.appendChild(toggleBtn);
                }
                
                // Add click handler
                toggleBtn.addEventListener('click', toggleTerminalMode);
            }
        }, 1000);
    }
    
    // Toggle between chat and real terminal
    async function toggleTerminalMode() {
        const terminalContent = document.querySelector('.terminal-content');
        const toggleBtn = document.querySelector('.terminal-mode-toggle');
        
        if (!terminalContent) return;
        
        isRealTerminalMode = !isRealTerminalMode;
        
        if (isRealTerminalMode) {
            // Load xterm if not already loaded
            await loadXTermResources();
            
            // Save current chat content
            const chatContent = terminalContent.innerHTML;
            terminalContent.setAttribute('data-chat-content', chatContent);
            
            // Clear and create xterm container
            terminalContent.innerHTML = '<div id="xterm-container" style="width: 100%; height: 100%;"></div>';
            
            // Initialize xterm
            initializeXTerm();
            
            // Update button
            toggleBtn.innerHTML = '💬 AI Chat';
            toggleBtn.style.backgroundColor = '#ff9e00';
            toggleBtn.style.color = '#1a1b26';
        } else {
            // Restore chat content
            const chatContent = terminalContent.getAttribute('data-chat-content');
            if (chatContent) {
                terminalContent.innerHTML = chatContent;
            }
            
            // Cleanup xterm
            if (xtermInstance) {
                xtermInstance.dispose();
                xtermInstance = null;
            }
            if (ws) {
                ws.close();
                ws = null;
            }
            
            // Update button
            toggleBtn.innerHTML = '🖥️ Real Terminal';
            toggleBtn.style.backgroundColor = '#2a2e42';
            toggleBtn.style.color = '#c0caf5';
        }
    }
    
    // Initialize xterm
    function initializeXTerm() {
        const container = document.getElementById('xterm-container');
        if (!container || !window.Terminal) return;
        
        // Create terminal instance
        xtermInstance = new window.Terminal({
            theme: {
                background: '#1a1b26',
                foreground: '#c0caf5',
                cursor: '#c0caf5',
                black: '#15161e',
                red: '#f7768e',
                green: '#9ece6a',
                yellow: '#e0af68',
                blue: '#7aa2f7',
                magenta: '#bb9af7',
                cyan: '#7dcfff',
                white: '#c0caf5',
                brightBlack: '#414868',
                brightRed: '#f7768e',
                brightGreen: '#9ece6a',
                brightYellow: '#e0af68',
                brightBlue: '#7aa2f7',
                brightMagenta: '#bb9af7',
                brightCyan: '#7dcfff',
                brightWhite: '#c0caf5'
            },
            fontFamily: 'Monaco, Menlo, "Ubuntu Mono", monospace',
            fontSize: 14,
            lineHeight: 1.5,
            cursorBlink: true
        });
        
        // Open terminal
        xtermInstance.open(container);
        
        // Fit addon
        if (window.FitAddon) {
            fitAddon = new window.FitAddon.FitAddon();
            xtermInstance.loadAddon(fitAddon);
            fitAddon.fit();
            
            // Refit on window resize
            window.addEventListener('resize', () => {
                if (fitAddon && isRealTerminalMode) {
                    fitAddon.fit();
                }
            });
        }
        
        // Connect to WebSocket
        connectWebSocket();
    }
    
    // Connect to terminal WebSocket
    function connectWebSocket() {
        const wsUrl = 'ws://localhost:3000/ws/terminal';
        
        try {
            ws = new WebSocket(wsUrl);
            
            ws.onopen = () => {
                console.log('✅ Terminal WebSocket connected');
                if (xtermInstance) {
                    xtermInstance.write('\r\n\x1b[32mTerminal connected! You can now type commands.\x1b[0m\r\n');
                    xtermInstance.write('\x1b[33mType "claude" to launch Claude Code CLI\x1b[0m\r\n\r\n');
                }
            };
            
            ws.onmessage = (event) => {
                try {
                    const message = JSON.parse(event.data);
                    if (message.type === 'output' && xtermInstance) {
                        xtermInstance.write(message.data);
                    }
                } catch (e) {
                    // Handle non-JSON messages
                    if (xtermInstance) {
                        xtermInstance.write(event.data);
                    }
                }
            };
            
            ws.onerror = (error) => {
                console.error('Terminal WebSocket error:', error);
                if (xtermInstance) {
                    xtermInstance.write('\r\n\x1b[31mConnection error. Make sure the server is running.\x1b[0m\r\n');
                }
            };
            
            ws.onclose = () => {
                console.log('Terminal WebSocket disconnected');
                if (xtermInstance && isRealTerminalMode) {
                    xtermInstance.write('\r\n\x1b[33mConnection closed.\x1b[0m\r\n');
                }
            };
            
            // Handle terminal input
            if (xtermInstance) {
                xtermInstance.onData((data) => {
                    if (ws && ws.readyState === WebSocket.OPEN) {
                        ws.send(JSON.stringify({ type: 'input', data }));
                    }
                });
            }
        } catch (error) {
            console.error('Failed to connect WebSocket:', error);
        }
    }
    
    // Initialize when DOM is ready
    function initialize() {
        console.log('Initializing XTerm Enhancement...');
        addTerminalToggle();
    }
    
    // Start initialization
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initialize);
    } else {
        initialize();
    }
})();