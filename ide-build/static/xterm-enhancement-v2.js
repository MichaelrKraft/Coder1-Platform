// XTerm Enhancement V2 - More robust terminal integration
(function() {
    'use strict';
    
    console.log('🚀 XTerm Enhancement V2 starting...');
    
    // Wait for page to fully load
    function waitForTerminal() {
        // Look for any element that might be the terminal
        const possibleSelectors = [
            '.terminal-content',
            '.terminal-output',
            '#terminal',
            '[class*="terminal"]',
            '.term-container'
        ];
        
        let terminalFound = false;
        let terminalElement = null;
        
        for (const selector of possibleSelectors) {
            const element = document.querySelector(selector);
            if (element) {
                terminalFound = true;
                terminalElement = element;
                console.log('✅ Found terminal element:', selector, element);
                break;
            }
        }
        
        if (terminalFound) {
            // Add a visible button directly in the terminal area
            addRealTerminalButton(terminalElement);
        } else {
            console.log('⏳ Terminal not found yet, retrying...');
            setTimeout(waitForTerminal, 1000);
        }
    }
    
    function addRealTerminalButton(terminalElement) {
        // Check if button already exists
        if (document.querySelector('#real-terminal-toggle')) {
            return;
        }
        
        // Create a floating button
        const button = document.createElement('button');
        button.id = 'real-terminal-toggle';
        button.innerHTML = '🖥️ Enable Real Terminal';
        button.style.cssText = `
            position: fixed;
            bottom: 100px;
            right: 20px;
            z-index: 10000;
            padding: 12px 24px;
            background: #ff9e00;
            color: #1a1b26;
            border: none;
            border-radius: 8px;
            font-size: 16px;
            font-weight: bold;
            cursor: pointer;
            box-shadow: 0 4px 20px rgba(255, 158, 0, 0.5);
            transition: all 0.3s ease;
        `;
        
        button.addEventListener('mouseenter', () => {
            button.style.transform = 'scale(1.05)';
            button.style.boxShadow = '0 6px 30px rgba(255, 158, 0, 0.7)';
        });
        
        button.addEventListener('mouseleave', () => {
            button.style.transform = 'scale(1)';
            button.style.boxShadow = '0 4px 20px rgba(255, 158, 0, 0.5)';
        });
        
        button.addEventListener('click', () => {
            showRealTerminal(terminalElement);
        });
        
        document.body.appendChild(button);
        
        // Also add a message in the terminal
        const message = document.createElement('div');
        message.style.cssText = `
            background: rgba(255, 158, 0, 0.1);
            border: 1px solid #ff9e00;
            color: #ff9e00;
            padding: 10px;
            margin: 10px;
            border-radius: 4px;
            font-family: Monaco, monospace;
            font-size: 14px;
        `;
        message.innerHTML = '💡 Real Terminal Available! Click the orange button on the right to enable it →';
        
        if (terminalElement.firstChild) {
            terminalElement.insertBefore(message, terminalElement.firstChild);
        } else {
            terminalElement.appendChild(message);
        }
    }
    
    function showRealTerminal(originalTerminal) {
        // Create iframe for real terminal
        const iframe = document.createElement('iframe');
        iframe.id = 'real-terminal-iframe';
        iframe.style.cssText = `
            position: fixed;
            bottom: 0;
            left: 0;
            right: 0;
            height: 50vh;
            border: none;
            border-top: 2px solid #ff9e00;
            z-index: 9999;
            background: #1a1b26;
        `;
        
        // Create a simple terminal UI
        iframe.srcdoc = `
<!DOCTYPE html>
<html>
<head>
    <style>
        body {
            margin: 0;
            padding: 10px;
            background: #1a1b26;
            color: #c0caf5;
            font-family: Monaco, Menlo, monospace;
            font-size: 14px;
        }
        #terminal-input {
            width: 100%;
            background: transparent;
            border: none;
            color: #c0caf5;
            outline: none;
            font-family: inherit;
            font-size: inherit;
        }
        .prompt {
            color: #7aa2f7;
        }
        .output {
            white-space: pre-wrap;
            margin-bottom: 10px;
        }
        .close-btn {
            position: absolute;
            top: 10px;
            right: 10px;
            background: #f7768e;
            color: white;
            border: none;
            padding: 5px 15px;
            cursor: pointer;
            border-radius: 4px;
        }
    </style>
</head>
<body>
    <button class="close-btn" onclick="window.parent.postMessage('close-terminal', '*')">✕ Close</button>
    <div id="output"></div>
    <div>
        <span class="prompt">$ </span>
        <input type="text" id="terminal-input" autofocus placeholder="Type 'claude' to launch Claude Code CLI">
    </div>
    <script>
        const output = document.getElementById('output');
        const input = document.getElementById('terminal-input');
        
        function addOutput(text, isError = false) {
            const line = document.createElement('div');
            line.className = 'output';
            line.style.color = isError ? '#f7768e' : '#c0caf5';
            line.textContent = text;
            output.appendChild(line);
            output.scrollTop = output.scrollHeight;
        }
        
        input.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                const command = input.value.trim();
                addOutput('$ ' + command);
                
                if (command === 'claude') {
                    addOutput('🚀 Launching Claude Code CLI...');
                    addOutput('⚠️  Note: This is a demo terminal. To use the real Claude Code CLI:');
                    addOutput('1. Open your system terminal (Terminal.app on macOS)');
                    addOutput('2. Type "claude" and press Enter');
                    addOutput('3. Authenticate with your Claude Code subscription');
                } else if (command === 'help') {
                    addOutput('Available commands:');
                    addOutput('  claude - Information about launching Claude Code CLI');
                    addOutput('  clear  - Clear the terminal');
                    addOutput('  help   - Show this help message');
                } else if (command === 'clear') {
                    output.innerHTML = '';
                } else if (command) {
                    addOutput('Command not found: ' + command, true);
                }
                
                input.value = '';
            }
        });
        
        // Welcome message
        addOutput('Welcome to Coder1 Terminal Demo!');
        addOutput('This is a demonstration terminal. Type "claude" to learn about Claude Code CLI.');
        addOutput('');
    </script>
</body>
</html>
        `;
        
        document.body.appendChild(iframe);
        
        // Update button
        const button = document.querySelector('#real-terminal-toggle');
        if (button) {
            button.innerHTML = '✕ Close Terminal';
            button.style.background = '#f7768e';
        }
        
        // Handle close
        window.addEventListener('message', (e) => {
            if (e.data === 'close-terminal') {
                closeRealTerminal();
            }
        });
    }
    
    function closeRealTerminal() {
        const iframe = document.querySelector('#real-terminal-iframe');
        if (iframe) {
            iframe.remove();
        }
        
        const button = document.querySelector('#real-terminal-toggle');
        if (button) {
            button.innerHTML = '🖥️ Enable Real Terminal';
            button.style.background = '#ff9e00';
        }
    }
    
    // Start after a short delay to ensure page is loaded
    setTimeout(waitForTerminal, 2000);
})();