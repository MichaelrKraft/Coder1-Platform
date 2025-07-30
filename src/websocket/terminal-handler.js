/**
 * Terminal WebSocket Handler
 * Manages real terminal sessions using node-pty
 */

const pty = require('node-pty');
const os = require('os');
const path = require('path');

// Simple logger fallback
const logger = {
    info: (...args) => console.log('ℹ️', ...args),
    error: (...args) => console.error('❌', ...args),
    warn: (...args) => console.warn('⚠️', ...args)
};

class TerminalHandler {
    constructor() {
        this.terminals = new Map();
        this.shell = os.platform() === 'win32' ? 'powershell.exe' : 'bash';
    }

    handleConnection(ws) {
        const terminalId = this.generateId();
        logger.info(`Terminal WebSocket connected: ${terminalId}`);

        // Create PTY instance
        const ptyProcess = pty.spawn(this.shell, [], {
            name: 'xterm-color',
            cols: 80,
            rows: 30,
            cwd: process.cwd(),
            env: process.env
        });

        // Store terminal session
        this.terminals.set(terminalId, {
            ws,
            pty: ptyProcess,
            connected: true
        });

        // Send welcome message
        ws.send(JSON.stringify({
            type: 'connected',
            terminalId,
            message: 'Terminal session established'
        }));

        // Handle PTY output
        ptyProcess.onData((data) => {
            if (ws.readyState === ws.OPEN) {
                ws.send(JSON.stringify({
                    type: 'output',
                    data
                }));
            }
        });

        // Handle PTY exit
        ptyProcess.onExit(({ exitCode, signal }) => {
            logger.info(`Terminal ${terminalId} exited with code ${exitCode} and signal ${signal}`);
            this.cleanupTerminal(terminalId);
        });

        // Handle WebSocket messages
        ws.on('message', (message) => {
            try {
                const msg = JSON.parse(message);
                this.handleMessage(terminalId, msg);
            } catch (error) {
                logger.error('Terminal message parse error:', error);
            }
        });

        // Handle WebSocket close
        ws.on('close', () => {
            logger.info(`Terminal WebSocket disconnected: ${terminalId}`);
            this.cleanupTerminal(terminalId);
        });

        // Handle WebSocket error
        ws.on('error', (error) => {
            logger.error(`Terminal WebSocket error ${terminalId}:`, error);
            this.cleanupTerminal(terminalId);
        });
    }

    handleMessage(terminalId, message) {
        const terminal = this.terminals.get(terminalId);
        if (!terminal) {
            logger.error(`Terminal not found: ${terminalId}`);
            return;
        }

        switch (message.type) {
            case 'input':
                // Write input to PTY
                terminal.pty.write(message.data);
                break;

            case 'resize':
                // Resize PTY
                if (message.cols && message.rows) {
                    terminal.pty.resize(message.cols, message.rows);
                    logger.info(`Terminal ${terminalId} resized to ${message.cols}x${message.rows}`);
                }
                break;

            case 'ping':
                // Respond to ping
                if (terminal.ws.readyState === terminal.ws.OPEN) {
                    terminal.ws.send(JSON.stringify({ type: 'pong' }));
                }
                break;

            default:
                logger.warn(`Unknown terminal message type: ${message.type}`);
        }
    }

    cleanupTerminal(terminalId) {
        const terminal = this.terminals.get(terminalId);
        if (!terminal) return;

        // Kill PTY process
        try {
            terminal.pty.kill();
        } catch (error) {
            logger.error(`Error killing terminal ${terminalId}:`, error);
        }

        // Close WebSocket
        if (terminal.ws.readyState === terminal.ws.OPEN) {
            terminal.ws.close();
        }

        // Remove from map
        this.terminals.delete(terminalId);
    }

    generateId() {
        return `term-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    }

    // Get terminal statistics
    getStats() {
        return {
            activeTerminals: this.terminals.size,
            terminals: Array.from(this.terminals.entries()).map(([id, term]) => ({
                id,
                connected: term.connected,
                cols: term.pty.cols,
                rows: term.pty.rows
            }))
        };
    }

    // Cleanup all terminals
    cleanup() {
        logger.info('Cleaning up all terminals');
        for (const [terminalId] of this.terminals) {
            this.cleanupTerminal(terminalId);
        }
    }
}

module.exports = { TerminalHandler };