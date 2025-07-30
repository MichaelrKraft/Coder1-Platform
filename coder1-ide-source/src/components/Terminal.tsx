import React, { useState, useRef, useEffect } from 'react';
import './Terminal.css';
import { authenticatedFetch } from '../utils/api';
import XTerminal from './XTerminal';

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
  const [infiniteSessionId, setInfiniteSessionId] = useState<string | null>(null);
  const [isStoppingInfinite, setIsStoppingInfinite] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const terminalRef = useRef<any>(null);
  const recognitionRef = useRef<any>(null);

  // Initialize speech recognition
  useEffect(() => {
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      const SpeechRecognition = (window as any).webkitSpeechRecognition || (window as any).SpeechRecognition;
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.continuous = false;
      recognitionRef.current.interimResults = false;
      recognitionRef.current.lang = 'en-US';

      recognitionRef.current.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        console.log('Speech recognized:', transcript);
        
        // Write to terminal
        if (terminalRef.current && terminalRef.current.writeToTerminal) {
          terminalRef.current.writeToTerminal(transcript);
        }
      };

      recognitionRef.current.onerror = (event: any) => {
        console.error('Speech recognition error:', event.error);
        setIsRecording(false);
      };

      recognitionRef.current.onend = () => {
        setIsRecording(false);
      };
    }
  }, []);

  const handleMicrophoneClick = () => {
    if (isRecording) {
      // Stop recording
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
      setIsRecording(false);
    } else {
      // Start recording
      if (recognitionRef.current) {
        try {
          recognitionRef.current.start();
          setIsRecording(true);
        } catch (error) {
          console.error('Failed to start speech recognition:', error);
        }
      } else {
        console.warn('Speech recognition not supported in this browser');
      }
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
        
        const contentType = response.headers.get('content-type');
        
        if (response.ok) {
          if (contentType && contentType.includes('application/json')) {
            const data = await response.json();
            console.log('Infinite loop started:', data);
            setInfiniteSessionId(data.sessionId);
            // Write to terminal instead of history
            if (terminalRef.current && terminalRef.current.writeToTerminal) {
              terminalRef.current.writeToTerminal('\r\n✅ Infinite Loop mode activated\r\n');
              terminalRef.current.writeToTerminal(`Session ID: ${data.sessionId}\r\n`);
            }
            setIsInfiniteLoop(true, data.sessionId);
          } else {
            if (terminalRef.current && terminalRef.current.writeToTerminal) {
              terminalRef.current.writeToTerminal('\r\n✅ Infinite Loop mode activated\r\n');
            }
            setIsInfiniteLoop(true);
          }
        } else {
          let errorMessage = 'Failed to start infinite loop';
          try {
            if (contentType && contentType.includes('application/json')) {
              const errorData = await response.json();
              errorMessage = errorData.message || errorMessage;
            } else {
              const errorText = await response.text();
              if (!errorText.includes('<html')) {
                errorMessage = errorText;
              }
            }
          } catch (e) {
            console.error('Error parsing response:', e);
          }
          if (terminalRef.current && terminalRef.current.writeToTerminal) {
            terminalRef.current.writeToTerminal(`\r\n❌ ${errorMessage}\r\n`);
          }
        }
      } else {
        // Stop infinite loop
        if (infiniteSessionId) {
          setIsStoppingInfinite(true);
          if (terminalRef.current && terminalRef.current.writeToTerminal) {
            terminalRef.current.writeToTerminal('\r\n⏳ Stopping infinite loop...\r\n');
          }
          
          try {
            const stopResponse = await authenticatedFetch(`/api/infinite/stop/${infiniteSessionId}`, {
              method: 'POST'
            });
            
            if (stopResponse.ok) {
              const stopData = await stopResponse.json();
              if (terminalRef.current && terminalRef.current.writeToTerminal) {
                terminalRef.current.writeToTerminal('\r\n✅ Infinite Loop stopped successfully\r\n');
                terminalRef.current.writeToTerminal(`Final stats: ${stopData.finalStats?.totalGenerated || 0} components generated in ${stopData.finalStats?.waves || 0} waves\r\n`);
              }
            } else {
              if (terminalRef.current && terminalRef.current.writeToTerminal) {
                terminalRef.current.writeToTerminal('\r\n⚠️ Infinite Loop stop request sent (backend may still be stopping)\r\n');
              }
            }
          } catch (stopError) {
            console.error('Error stopping infinite loop:', stopError);
            if (terminalRef.current && terminalRef.current.writeToTerminal) {
              terminalRef.current.writeToTerminal('\r\n⚠️ Could not confirm stop status, but loop may have stopped\r\n');
            }
          } finally {
            setIsStoppingInfinite(false);
            setInfiniteSessionId(null);
          }
        }
        
        setIsInfiniteLoop(false);
        if (terminalRef.current && terminalRef.current.writeToTerminal) {
          terminalRef.current.writeToTerminal('\r\n⏹ Infinite Loop mode deactivated\r\n');
        }
      }
    } catch (error) {
      console.error('Infinite loop toggle error:', error);
      const errorMessage = error instanceof Error ? error.message : String(error);
      if (terminalRef.current && terminalRef.current.writeToTerminal) {
        terminalRef.current.writeToTerminal(`\r\n❌ Error: ${errorMessage}\r\n`);
      }
    }
  };

  // Handle Parallel Agents toggle
  const handleParallelAgentsToggle = async () => {
    try {
      setIsParallelAgents(!isParallelAgents);
      if (!isParallelAgents) {
        if (terminalRef.current && terminalRef.current.writeToTerminal) {
          terminalRef.current.writeToTerminal('\r\n🤖 Parallel Agents mode activated\r\nRunning tasks in parallel...\r\n');
        }
      } else {
        if (terminalRef.current && terminalRef.current.writeToTerminal) {
          terminalRef.current.writeToTerminal('\r\n⏹ Parallel Agents mode deactivated\r\n');
        }
      }
    } catch (error) {
      console.error('Parallel agents toggle error:', error);
      const errorMessage = error instanceof Error ? error.message : String(error);
      if (terminalRef.current && terminalRef.current.writeToTerminal) {
        terminalRef.current.writeToTerminal(`\r\n❌ Error: ${errorMessage}\r\n`);
      }
    }
  };

  // Handle Supervision toggle
  const handleSupervisionToggle = async () => {
    try {
      setIsSupervisionOn(!isSupervisionOn);
      if (!isSupervisionOn) {
        if (terminalRef.current && terminalRef.current.writeToTerminal) {
          terminalRef.current.writeToTerminal('\r\n👁 Supervision mode activated\r\nAll agent actions will be monitored\r\n');
        }
      } else {
        if (terminalRef.current && terminalRef.current.writeToTerminal) {
          terminalRef.current.writeToTerminal('\r\n⏹ Supervision mode deactivated\r\n');
        }
      }
    } catch (error) {
      console.error('Supervision toggle error:', error);
      const errorMessage = error instanceof Error ? error.message : String(error);
      if (terminalRef.current && terminalRef.current.writeToTerminal) {
        terminalRef.current.writeToTerminal(`\r\n❌ Error: ${errorMessage}\r\n`);
      }
    }
  };

  return (
    <div className="terminal">
      <div className="terminal-header">
        <div className="terminal-header-left">
          <span className="terminal-mode-indicator" style={{ color: '#8b5cf6', fontSize: '14px', fontWeight: 'bold' }}>
            Terminal
          </span>
        </div>
        
        <div className="terminal-header-right">
          <button 
            className={`terminal-control-btn microphone ${isRecording ? 'active' : ''}`}
            onClick={handleMicrophoneClick}
            title="Speech to text"
            style={{ marginRight: '10px' }}
          >
            🎤 {isRecording ? 'Recording...' : 'Voice'}
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
      
      <div className="terminal-content">
        <XTerminal ref={terminalRef} />
      </div>
    </div>
  );
};

export default Terminal;