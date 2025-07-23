import React, { useState, useEffect } from 'react';
import './HivemindDashboard.css';
import io, { Socket } from 'socket.io-client';
import { authenticatedFetch, createAuthenticatedSocket } from '../utils/api';

interface Agent {
  id: number;
  name: string;
  role: string;
  status: 'idle' | 'working';
  currentTask: any;
  progress: number;
  specialization: string;
  tasksCompleted: number;
}

interface HivemindSession {
  id: string;
  status: string;
  agents: Agent[];
  queen: number;
  taskQueue: any[];
  completedTasks: any[];
  metrics: {
    tasksCompleted: number;
    discoveryCount: number;
    patternsIdentified: number;
    contextSize: number;
  };
}

interface HivemindDashboardProps {
  onClose: () => void;
  sessionId?: string;
}

const HivemindDashboard: React.FC<HivemindDashboardProps> = ({ onClose, sessionId }) => {
  const [session, setSession] = useState<HivemindSession | null>(null);
  const [socket, setSocket] = useState<Socket | null>(null);
  const [discoveries, setDiscoveries] = useState<any[]>([]);
  const [isStarting, setIsStarting] = useState(false);
  const [activeSessionId, setActiveSessionId] = useState<string | null>(sessionId || null);

  useEffect(() => {
    // Connect to WebSocket with authentication
    const newSocket = createAuthenticatedSocket();
    setSocket(newSocket);

    // If we have a session ID, join it
    if (activeSessionId) {
      newSocket.emit('hivemind:join_session', { sessionId: activeSessionId });
      fetchSessionStatus(activeSessionId);
    }

    // Set up event listeners
    newSocket.on('hivemind:session_joined', (data: any) => {
      if (data.status && data.status.session) {
        setSession(data.status.session);
      }
    });

    newSocket.on('hivemind:discovery', (data: any) => {
      setDiscoveries(prev => [...prev, data.discovery].slice(-10));
    });

    newSocket.on('hivemind:progress', (data: any) => {
      setSession(prev => {
        if (!prev) return null;
        const agents = [...prev.agents];
        agents[data.agentId].progress = data.progress;
        return { ...prev, agents };
      });
    });

    newSocket.on('hivemind:task_assigned', (data: any) => {
      setSession(prev => {
        if (!prev) return null;
        const agents = [...prev.agents];
        agents[data.agentId].status = 'working';
        agents[data.agentId].currentTask = data.task;
        return { ...prev, agents };
      });
    });

    newSocket.on('hivemind:task_completed', (data: any) => {
      setSession(prev => {
        if (!prev) return null;
        const agents = [...prev.agents];
        agents[data.agentId].status = 'idle';
        agents[data.agentId].currentTask = null;
        agents[data.agentId].tasksCompleted++;
        return { 
          ...prev, 
          agents,
          metrics: {
            ...prev.metrics,
            tasksCompleted: prev.metrics.tasksCompleted + 1
          }
        };
      });
    });

    return () => {
      if (activeSessionId) {
        newSocket.emit('hivemind:leave_session', { sessionId: activeSessionId });
      }
      newSocket.close();
    };
  }, [activeSessionId]);

  const fetchSessionStatus = async (sessionId: string) => {
    try {
      const response = await authenticatedFetch(`/api/hivemind/status/${sessionId}`);
      if (response.ok) {
        const data = await response.json();
        setSession(data.session);
      }
    } catch (error) {
      console.error('Failed to fetch session status:', error);
    }
  };

  const startHivemindSession = async () => {
    setIsStarting(true);
    try {
      const response = await authenticatedFetch('/api/hivemind/start', {
        method: 'POST',
        body: JSON.stringify({
          userId: 'user-1', // TODO: Get from auth context
          projectBrief: 'AI-powered component generation',
          taskDescription: 'Generate innovative UI components using coordinated agents'
        })
      });

      if (response.ok) {
        const data = await response.json();
        setActiveSessionId(data.sessionId);
        setSession(data.session);
        socket?.emit('hivemind:join_session', { sessionId: data.sessionId });
      }
    } catch (error) {
      console.error('Failed to start hivemind session:', error);
    } finally {
      setIsStarting(false);
    }
  };

  const stopSession = async () => {
    if (!activeSessionId) return;

    try {
      await authenticatedFetch(`/api/hivemind/stop/${activeSessionId}`, {
        method: 'POST'
      });
      setSession(null);
      setActiveSessionId(null);
      setDiscoveries([]);
    } catch (error) {
      console.error('Failed to stop session:', error);
    }
  };

  const getAgentStatusColor = (status: string) => {
    switch (status) {
      case 'working': return '#4CAF50';
      case 'idle': return '#9E9E9E';
      default: return '#FFC107';
    }
  };

  return (
    <div className="hivemind-dashboard">
      <div className="hivemind-header">
        <h2>🧠 Hivemind Control Center</h2>
        <button className="close-button" onClick={onClose}>×</button>
      </div>

      {!session ? (
        <div className="hivemind-start">
          <h3>Start a Hivemind Session</h3>
          <p>Coordinate 3 AI agents with shared context and memory</p>
          <button 
            className="start-button"
            onClick={startHivemindSession}
            disabled={isStarting}
          >
            {isStarting ? 'Starting...' : '🚀 Start Hivemind'}
          </button>
        </div>
      ) : (
        <>
          <div className="queen-status">
            <div className="queen-info">
              <span className="crown">👑</span>
              <span className="queen-name">
                {session.agents[session.queen].name} is Queen
              </span>
              <span className="coordination-mode">Auto Coordination</span>
            </div>
            <button className="stop-button" onClick={stopSession}>
              Stop Session
            </button>
          </div>

          <div className="agents-grid">
            {session.agents.map((agent, index) => (
              <div key={agent.id} className="agent-card">
                <div className="agent-header">
                  <h4>{agent.name}</h4>
                  <span 
                    className="status-indicator"
                    style={{ backgroundColor: getAgentStatusColor(agent.status) }}
                  />
                </div>
                <div className="agent-role">{agent.specialization}</div>
                <div className="progress-container">
                  <div 
                    className="progress-bar"
                    style={{ width: `${agent.progress}%` }}
                  />
                </div>
                <div className="agent-task">
                  {agent.currentTask ? (
                    <>
                      <span className="task-label">Task:</span>
                      <span className="task-description">
                        {agent.currentTask.description}
                      </span>
                    </>
                  ) : (
                    <span className="idle-text">Waiting for task...</span>
                  )}
                </div>
                <div className="agent-stats">
                  Tasks completed: {agent.tasksCompleted}
                </div>
              </div>
            ))}
          </div>

          <div className="hivemind-info">
            <div className="task-queue">
              <h4>Task Queue</h4>
              <div className="queue-items">
                {session.taskQueue.length > 0 ? (
                  session.taskQueue.map((task, index) => (
                    <div key={index} className="queue-item">
                      {index > 0 && <span className="arrow">→</span>}
                      <span className="task-item">{task.description}</span>
                    </div>
                  ))
                ) : (
                  <span className="empty-queue">No pending tasks</span>
                )}
              </div>
            </div>

            <div className="shared-context">
              <h4>Shared Context</h4>
              <div className="context-stats">
                <div className="stat-item">
                  <span className="stat-label">Items:</span>
                  <span className="stat-value">{session.metrics.discoveryCount}</span>
                </div>
                <div className="stat-item">
                  <span className="stat-label">Size:</span>
                  <span className="stat-value">
                    {(session.metrics.contextSize / 1024).toFixed(1)}KB
                  </span>
                </div>
                <div className="stat-item">
                  <span className="stat-label">Patterns:</span>
                  <span className="stat-value">{session.metrics.patternsIdentified}</span>
                </div>
              </div>
            </div>
          </div>

          {discoveries.length > 0 && (
            <div className="discoveries-feed">
              <h4>Recent Discoveries</h4>
              <div className="discoveries-list">
                {discoveries.map((discovery, index) => (
                  <div key={index} className="discovery-item">
                    <span className="discovery-agent">[{discovery.agentName}]</span>
                    <span className="discovery-content">{discovery.content}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default HivemindDashboard;