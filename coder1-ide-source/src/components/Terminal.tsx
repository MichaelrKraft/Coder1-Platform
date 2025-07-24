import React, { useState, useRef, useEffect } from 'react';
import './Terminal.css';
import { authenticatedFetch } from '../utils/api';

interface TerminalProps {
  isSleepMode: boolean;
  setIsSleepMode: (value: boolean) => void;
  isSupervisionOn: boolean;
  setIsSupervisionOn: (value: boolean) => void;
  isInfiniteLoop: boolean;
  setIsInfiniteLoop: (value: boolean, sessionId?: string | null) => void;
  isParallelAgents: boolean;
  setIsParallelAgents: (value: boolean) => void;
  onHivemindClick?: () => void;
  hivemindActive?: boolean;
  agentCount?: number;
}

const Terminal: React.FC<TerminalProps> = ({
  isSleepMode,
  setIsSleepMode,
  isSupervisionOn,
  setIsSupervisionOn,
  isInfiniteLoop,
  setIsInfiniteLoop,
  isParallelAgents,
  setIsParallelAgents,
  onHivemindClick,
  hivemindActive = false,
  agentCount = 0
}) => {
  const [input, setInput] = useState('');
  const [history, setHistory] = useState<string[]>([
    'Welcome to Coder1 IDE Terminal - AI Chat Mode',
    'Just type naturally to chat with AI, or use $ prefix for bash commands',
    'NEW: Use /ui to generate React components (e.g., /ui create a glowing button)',
    'Examples: "create a landing page", "$ npm install", "/ui modern card"',
    ''
  ]);
  const [infiniteSessionId, setInfiniteSessionId] = useState<string | null>(null);
  const [isStoppingInfinite, setIsStoppingInfinite] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [sessionId] = useState(`terminal-${Date.now()}`);
  const inputRef = useRef<HTMLInputElement>(null);
  const terminalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (terminalRef.current) {
      terminalRef.current.scrollTop = terminalRef.current.scrollHeight;
    }
  }, [history]);

  const handleCommand = async (cmd: string) => {
    const newHistory = [...history, `$ ${cmd}`];
    
    // Check for /ui command
    if (cmd.startsWith('/ui ')) {
      const uiCommand = cmd.substring(4).trim();
      newHistory.push('🎨 Generating UI component...');
      setHistory(newHistory);
      setIsProcessing(true);
      
      try {
        // Call Magic API endpoint
        const response = await fetch('/api/magic/ui', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ message: uiCommand })
        });
        
        const data = await response.json();
        
        if (data.success && data.component) {
          // Replace "Generating..." with success message
          newHistory[newHistory.length - 1] = '✅ Component generated successfully!';
          
          // Add component preview
          newHistory.push(
            '📦 Component Type: ' + (data.customizations?.detected || 'Unknown'),
            '📝 Source: ' + (data.component.metadata?.source || 'local-fallback'),
            '',
            '--- Component Code ---',
            ...data.component.code.split('\n'),
            '--- End Component Code ---',
            '',
            '💡 ' + data.component.explanation,
            '',
            '📋 Component copied to clipboard (simulated)'
          );
          
          // TODO: Integrate with ReactBits component to show in UI
          // For now, we'll just show in terminal
        } else {
          newHistory[newHistory.length - 1] = `❌ Error: ${data.error || 'Failed to generate component'}`;
        }
      } catch (error) {
        newHistory[newHistory.length - 1] = `❌ Error: ${error instanceof Error ? error.message : 'Network error'}`;
      } finally {
        setIsProcessing(false);
      }
      
      setHistory(newHistory);
      setInput('');
      return;
    }
    
    // Check for bash command prefix
    if (cmd.startsWith('$')) {
      const bashCmd = cmd.substring(1).trim();
      
      // Special handling for known commands
      switch (bashCmd.toLowerCase()) {
        case 'clear':
          setHistory(['']);
          setInput('');
          return;
        case 'help':
          newHistory.push(
            'AI Chat Mode (default): Just type naturally',
            'Bash Mode: Prefix with $ (e.g., $ ls, $ npm install)',
            'UI Generation: /ui <description> (e.g., /ui create a glowing button)',
            'Commands:',
            '  $ clear   - Clear terminal',
            '  $ help    - Show this help',
            '  save      - Save conversation history',
            '  /ui       - Generate React components with AI',
            ''
          );
          break;
        default:
          // Execute as bash command
          newHistory.push(`Executing: ${bashCmd}`, '[Bash command execution not implemented in IDE]', '');
      }
    } else {
      // AI Chat mode
      setIsProcessing(true);
      newHistory.push('AI is processing...');
      setHistory(newHistory);
      
      try {
        // Call AI chat endpoint
        const response = await fetch('/api/terminal/chat', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            message: cmd,
            sessionId: sessionId,
            context: 'terminal'
          })
        });
        
        const data = await response.json();
        
        if (data.success) {
          // Replace "AI is processing..." with actual response
          newHistory[newHistory.length - 1] = data.response || 'Done.';
          
          // Handle tool calls if any
          if (data.toolCalls && data.toolCalls.length > 0) {
            for (const tool of data.toolCalls) {
              newHistory.push(`[Tool: ${tool.type}] ${JSON.stringify(tool.args)}`);
              // TODO: Implement confirmation dialogs
            }
          }
        } else {
          newHistory[newHistory.length - 1] = `Error: ${data.error || 'Failed to process request'}`;
        }
      } catch (error) {
        newHistory[newHistory.length - 1] = `Error: ${error instanceof Error ? error.message : 'Network error'}. Press Enter to retry.`;
      } finally {
        setIsProcessing(false);
      }
    }
    
    setHistory(newHistory);
    setInput('');
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && input.trim() && !isProcessing) {
      handleCommand(input.trim());
    }
  };

  // Handle Infinite Loop toggle
  const handleInfiniteLoopToggle = async () => {
    try {
      if (!isInfiniteLoop) {
        // Start infinite loop
        const response = await authenticatedFetch('/api/infinite/start', {
          method: 'POST',
          body: JSON.stringify({
            command: 'create innovative React components', // Required parameter
            userId: 'user-1',
            mode: 'collaborative',
            config: {
              maxIterations: 100,
              delayBetweenIterations: 1000
            }
          })
        });
        
        // Check content type before parsing
        const contentType = response.headers.get('content-type');
        
        if (response.ok) {
          if (contentType && contentType.includes('application/json')) {
            const data = await response.json();
            console.log('Infinite loop started:', data);
            setInfiniteSessionId(data.sessionId);
            setHistory(prev => [...prev, '✅ Infinite Loop mode activated', `Session ID: ${data.sessionId}`, '']);
            setIsInfiniteLoop(true, data.sessionId);
          } else {
            // Handle non-JSON success response
            setHistory(prev => [...prev, '✅ Infinite Loop mode activated', '']);
            setIsInfiniteLoop(true);
          }
        } else {
          // Error handling
          let errorMessage = 'Failed to start infinite loop';
          try {
            if (contentType && contentType.includes('application/json')) {
              const errorData = await response.json();
              errorMessage = errorData.message || errorMessage;
            } else {
              const errorText = await response.text();
              // Don't show HTML error pages
              if (!errorText.includes('<html')) {
                errorMessage = errorText;
              }
            }
          } catch (e) {
            console.error('Error parsing response:', e);
          }
          setHistory(prev => [...prev, `❌ ${errorMessage}`, '']);
        }
      } else {
        // Stop infinite loop
        if (infiniteSessionId) {
          setIsStoppingInfinite(true);
          setHistory(prev => [...prev, '⏳ Stopping infinite loop...', '']);
          
          try {
            const stopResponse = await authenticatedFetch(`/api/infinite/stop/${infiniteSessionId}`, {
              method: 'POST'
            });
            
            if (stopResponse.ok) {
              const stopData = await stopResponse.json();
              setHistory(prev => [...prev, '✅ Infinite Loop stopped successfully', 
                `Final stats: ${stopData.finalStats?.totalGenerated || 0} components generated in ${stopData.finalStats?.waves || 0} waves`, '']);
            } else {
              setHistory(prev => [...prev, '⚠️ Infinite Loop stop request sent (backend may still be stopping)', '']);
            }
          } catch (stopError) {
            console.error('Error stopping infinite loop:', stopError);
            setHistory(prev => [...prev, '⚠️ Could not confirm stop status, but loop may have stopped', '']);
          } finally {
            setIsStoppingInfinite(false);
            setInfiniteSessionId(null);
          }
        }
        
        setIsInfiniteLoop(false);
        setHistory(prev => [...prev, '⏹ Infinite Loop mode deactivated', '']);
      }
    } catch (error) {
      console.error('Infinite loop toggle error:', error);
      // Better error message
      const errorMessage = error instanceof Error ? error.message : String(error);
      setHistory(prev => [...prev, `❌ Error: ${errorMessage}`, '']);
    }
  };

  // Handle Parallel Agents toggle
  const handleParallelAgentsToggle = async () => {
    try {
      setIsParallelAgents(!isParallelAgents);
      if (!isParallelAgents) {
        setHistory(prev => [...prev, '🤖 Parallel Agents mode activated', 'Running tasks in parallel...', '']);
      } else {
        setHistory(prev => [...prev, '⏹ Parallel Agents mode deactivated', '']);
      }
    } catch (error) {
      console.error('Parallel agents toggle error:', error);
      const errorMessage = error instanceof Error ? error.message : String(error);
      setHistory(prev => [...prev, `❌ Error: ${errorMessage}`, '']);
    }
  };

  // Handle Supervision toggle
  const handleSupervisionToggle = async () => {
    try {
      setIsSupervisionOn(!isSupervisionOn);
      if (!isSupervisionOn) {
        setHistory(prev => [...prev, '👁 Supervision mode activated', 'All agent actions will be monitored', '']);
      } else {
        setHistory(prev => [...prev, '⏹ Supervision mode deactivated', '']);
      }
    } catch (error) {
      console.error('Supervision toggle error:', error);
      const errorMessage = error instanceof Error ? error.message : String(error);
      setHistory(prev => [...prev, `❌ Error: ${errorMessage}`, '']);
    }
  };

  // Handle save history
  const handleSaveHistory = async () => {
    try {
      const response = await fetch('/api/terminal/save-history', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          history: history,
          sessionId: sessionId
        })
      });
      
      const data = await response.json();
      
      if (data.success) {
        // Download the history file
        const blob = new Blob([JSON.stringify(data.data, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = data.filename;
        a.click();
        URL.revokeObjectURL(url);
        
        setHistory(prev => [...prev, '✅ History saved successfully', '']);
      } else {
        setHistory(prev => [...prev, `❌ Failed to save history: ${data.error}`, '']);
      }
    } catch (error) {
      console.error('Save history error:', error);
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      setHistory(prev => [...prev, `❌ Error saving history: ${errorMessage}`, '']);
    }
  };

  return (
    <div className="terminal">
      <div className="terminal-header">
        <div className="terminal-header-left">
          <span className="terminal-mode-indicator" style={{ color: '#8b5cf6', fontSize: '14px', fontWeight: 'bold' }}>
            AI Chat Mode
          </span>
        </div>
        
        <div className="terminal-header-right">
          <button 
            className="terminal-control-btn save-history"
            onClick={handleSaveHistory}
            title="Save conversation history"
            style={{ marginRight: '10px' }}
          >
            💾 Save
          </button>
          <button 
            className={`terminal-control-btn sleep-mode ${isSleepMode ? 'active' : ''}`}
            onClick={() => setIsSleepMode(!isSleepMode)}
          >
            Sleep Mode
          </button>
          <button 
            className={`terminal-control-btn supervision ${isSupervisionOn ? 'active' : ''}`}
            onClick={handleSupervisionToggle}
          >
            Supervision
          </button>
          <button 
            className={`terminal-control-btn parallel-agents ${isParallelAgents ? 'active' : ''}`}
            onClick={handleParallelAgentsToggle}
          >
            Parallel Agents
          </button>
          <button 
            className={`terminal-control-btn infinite-loop ${isInfiniteLoop ? 'active' : ''} ${isStoppingInfinite ? 'stopping' : ''}`}
            onClick={handleInfiniteLoopToggle}
            disabled={isStoppingInfinite}
          >
            {isStoppingInfinite ? 'Stopping...' : isInfiniteLoop ? 'Stop Loop' : 'Infinite Loop'}
          </button>
          <button 
            className={`terminal-control-btn hivemind ${hivemindActive ? 'active' : ''}`}
            onClick={onHivemindClick}
          >
            🧠 Hivemind {agentCount > 0 ? `(${agentCount}/3)` : ''}
          </button>
        </div>
      </div>
      
      <div className="terminal-content" ref={terminalRef}>
        {history.map((line, index) => (
          <div key={index} className="terminal-line">
            {line}
          </div>
        ))}
        <div className="terminal-input-line">
          <span className="terminal-prompt">$ </span>
          <input
            ref={inputRef}
            type="text"
            className="terminal-input"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={handleKeyPress}
            disabled={isProcessing}
            placeholder={isProcessing ? "AI is processing..." : "Type a message or $ for bash command"}
            autoFocus
          />
        </div>
      </div>
    </div>
  );
};

export default Terminal;