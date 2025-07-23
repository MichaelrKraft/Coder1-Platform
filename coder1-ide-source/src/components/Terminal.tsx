import React, { useState, useRef, useEffect } from 'react';
import './Terminal.css';
import { authenticatedFetch } from '../utils/api';

interface TerminalProps {
  isSleepMode: boolean;
  setIsSleepMode: (value: boolean) => void;
  isSupervisionOn: boolean;
  setIsSupervisionOn: (value: boolean) => void;
  isInfiniteLoop: boolean;
  setIsInfiniteLoop: (value: boolean) => void;
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
    'Welcome to Coder1 IDE Terminal',
    'Type "help" for available commands',
    ''
  ]);
  const [infiniteSessionId, setInfiniteSessionId] = useState<string | null>(null);
  const [isStoppingInfinite, setIsStoppingInfinite] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const terminalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (terminalRef.current) {
      terminalRef.current.scrollTop = terminalRef.current.scrollHeight;
    }
  }, [history]);

  const handleCommand = (cmd: string) => {
    const newHistory = [...history, `$ ${cmd}`];
    
    switch (cmd.toLowerCase()) {
      case 'help':
        newHistory.push(
          'Available commands:',
          '  help     - Show this help message',
          '  clear    - Clear terminal',
          '  claude   - Start Claude Code session',
          '  /ui      - Use 21st.dev Magic to create React components',
          ''
        );
        break;
      case 'clear':
        setHistory(['']);
        setInput('');
        return;
      case 'claude':
        newHistory.push('Starting Claude Code session...', '');
        break;
      default:
        if (cmd.startsWith('/ui ')) {
          newHistory.push(`Generating component: ${cmd.substring(4)}...`, '');
        } else {
          newHistory.push(`Command not found: ${cmd}`, '');
        }
    }
    
    setHistory(newHistory);
    setInput('');
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && input.trim()) {
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
          } else {
            // Handle non-JSON success response
            setHistory(prev => [...prev, '✅ Infinite Loop mode activated', '']);
          }
          setIsInfiniteLoop(true);
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
      setHistory(prev => [...prev, `❌ Error: ${error}`, '']);
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
      setHistory(prev => [...prev, `❌ Error: ${error}`, '']);
    }
  };

  return (
    <div className="terminal">
      <div className="terminal-header">
        <div className="terminal-header-left">
          {/* No SuperClaude Terminal text or icon */}
        </div>
        
        <div className="terminal-header-right">
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
            autoFocus
          />
        </div>
      </div>
    </div>
  );
};

export default Terminal;