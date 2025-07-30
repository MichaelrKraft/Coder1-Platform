import React, { useEffect, useRef, useState } from 'react';
import { Terminal } from '@xterm/xterm';
import { FitAddon } from '@xterm/addon-fit';
import { WebLinksAddon } from '@xterm/addon-web-links';
import '@xterm/xterm/css/xterm.css';

interface XTerminalProps {
  onMicrophoneClick?: () => void;
  onDataReceived?: (data: string) => void;
}

const XTerminal = React.forwardRef<any, XTerminalProps>(({ onMicrophoneClick, onDataReceived }, ref) => {
  const terminalRef = useRef<HTMLDivElement>(null);
  const terminalInstance = useRef<Terminal | null>(null);
  const fitAddon = useRef<FitAddon | null>(null);
  const ws = useRef<WebSocket | null>(null);
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    if (!terminalRef.current || terminalInstance.current) return;

    // Create terminal instance
    const term = new Terminal({
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
      cursorBlink: true,
      cursorStyle: 'block',
      scrollback: 10000,
      convertEol: true
    });

    terminalInstance.current = term;

    // Add addons
    fitAddon.current = new FitAddon();
    term.loadAddon(fitAddon.current);
    
    const webLinksAddon = new WebLinksAddon();
    term.loadAddon(webLinksAddon);

    // Open terminal in DOM
    term.open(terminalRef.current);
    fitAddon.current.fit();

    // Connect to WebSocket
    connectWebSocket(term);

    // Handle terminal input
    term.onData((data) => {
      if (ws.current && ws.current.readyState === WebSocket.OPEN) {
        ws.current.send(JSON.stringify({ type: 'input', data }));
      }
    });

    // Handle resize
    const handleResize = () => {
      if (fitAddon.current) {
        fitAddon.current.fit();
        if (ws.current && ws.current.readyState === WebSocket.OPEN) {
          ws.current.send(JSON.stringify({
            type: 'resize',
            cols: term.cols,
            rows: term.rows
          }));
        }
      }
    };

    window.addEventListener('resize', handleResize);

    // Cleanup
    return () => {
      window.removeEventListener('resize', handleResize);
      if (ws.current) {
        ws.current.close();
      }
      if (terminalInstance.current) {
        terminalInstance.current.dispose();
      }
    };
  }, []);

  const connectWebSocket = (term: Terminal) => {
    // Determine WebSocket URL based on current location
    let wsUrl: string;
    
    if (window.location.protocol === 'file:') {
      // Electron environment - connect to local server
      wsUrl = 'ws://localhost:3000/ws/terminal';
    } else {
      const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
      const host = window.location.hostname;
      const port = window.location.port || (window.location.protocol === 'https:' ? '443' : '80');
      wsUrl = `${protocol}//${host}:${port}/ws/terminal`;
    }

    console.log('Connecting to terminal WebSocket:', wsUrl);
    ws.current = new WebSocket(wsUrl);

    ws.current.onopen = () => {
      console.log('Terminal WebSocket connected');
      setIsConnected(true);
      term.write('\r\n\x1b[32mTerminal connected!\x1b[0m\r\n');
    };

    ws.current.onmessage = (event) => {
      const message = JSON.parse(event.data);
      
      switch (message.type) {
        case 'output':
          term.write(message.data);
          if (onDataReceived) {
            onDataReceived(message.data);
          }
          break;
        case 'error':
          term.write(`\r\n\x1b[31mError: ${message.message}\x1b[0m\r\n`);
          break;
        case 'connected':
          console.log('Terminal session established');
          break;
      }
    };

    ws.current.onerror = (error) => {
      console.error('Terminal WebSocket error:', error);
      term.write('\r\n\x1b[31mConnection error. Please refresh the page.\x1b[0m\r\n');
    };

    ws.current.onclose = () => {
      console.log('Terminal WebSocket disconnected');
      setIsConnected(false);
      term.write('\r\n\x1b[33mConnection closed. Attempting to reconnect...\x1b[0m\r\n');
      
      // Attempt to reconnect after 3 seconds
      setTimeout(() => {
        if (!ws.current || ws.current.readyState === WebSocket.CLOSED) {
          connectWebSocket(term);
        }
      }, 3000);
    };
  };

  // Public method to write to terminal (for microphone input)
  const writeToTerminal = (text: string) => {
    if (terminalInstance.current && ws.current && ws.current.readyState === WebSocket.OPEN) {
      // Send the text to the shell
      ws.current.send(JSON.stringify({ type: 'input', data: text }));
    }
  };

  // Expose writeToTerminal method via ref
  React.useImperativeHandle(
    ref,
    () => ({ writeToTerminal }),
    []
  );

  return (
    <div 
      ref={terminalRef} 
      style={{ 
        width: '100%', 
        height: '100%',
        backgroundColor: '#1a1b26'
      }}
    />
  );
});

XTerminal.displayName = 'XTerminal';

export default XTerminal;