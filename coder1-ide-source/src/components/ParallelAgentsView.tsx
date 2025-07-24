import React, { useState, useEffect } from 'react';
import './SpecialView.css';

interface ParallelAgentsViewProps {
  onClose: () => void;
}

interface Agent {
  id: number;
  name: string;
  status: 'idle' | 'working' | 'completed';
  task: string;
  progress: number;
}

const ParallelAgentsView: React.FC<ParallelAgentsViewProps> = ({ onClose }) => {
  const [agents, setAgents] = useState<Agent[]>([
    { id: 1, name: 'Agent Alpha', status: 'working', task: 'Analyzing codebase structure', progress: 65 },
    { id: 2, name: 'Agent Beta', status: 'working', task: 'Generating test cases', progress: 40 },
    { id: 3, name: 'Agent Gamma', status: 'idle', task: 'Waiting for assignment', progress: 0 },
    { id: 4, name: 'Agent Delta', status: 'completed', task: 'Documentation update', progress: 100 },
  ]);
  
  useEffect(() => {
    // Simulate agent progress
    const interval = setInterval(() => {
      setAgents(prevAgents => 
        prevAgents.map(agent => {
          if (agent.status === 'working' && agent.progress < 100) {
            return { ...agent, progress: Math.min(agent.progress + Math.random() * 10, 100) };
          }
          if (agent.progress >= 100 && agent.status === 'working') {
            return { ...agent, status: 'completed' };
          }
          return agent;
        })
      );
    }, 1500);
    
    return () => clearInterval(interval);
  }, []);
  
  const getStatusColor = (status: Agent['status']) => {
    switch (status) {
      case 'working': return '#ff9e00';
      case 'completed': return '#10b981';
      case 'idle': return '#6b7280';
    }
  };
  
  return (
    <div className="special-view-overlay">
      <div className="special-view-container" style={{ maxWidth: '1000px' }}>
        <button className="special-view-close" onClick={onClose}>
          ×
        </button>
        
        <div className="special-view-header">
          <h1 className="special-view-title">Parallel Agents</h1>
          <p className="special-view-subtitle">
            Multiple AI agents working simultaneously
          </p>
        </div>
        
        <div className="special-view-status">
          <div className="status-indicator"></div>
          <span className="status-text">{agents.filter(a => a.status === 'working').length} Agents Active</span>
        </div>
        
        <div className="special-view-content">
          <div style={{ marginBottom: '32px' }}>
            {agents.map(agent => (
              <div key={agent.id} style={{
                marginBottom: '24px',
                padding: '20px',
                background: 'rgba(26, 27, 38, 0.5)',
                borderRadius: '12px',
                border: '1px solid rgba(255, 255, 255, 0.05)'
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <div style={{
                      width: '10px',
                      height: '10px',
                      borderRadius: '50%',
                      background: getStatusColor(agent.status),
                      boxShadow: `0 0 10px ${getStatusColor(agent.status)}`
                    }}></div>
                    <h3 style={{ margin: 0, fontSize: '18px', fontWeight: '600' }}>{agent.name}</h3>
                    <span style={{
                      fontSize: '12px',
                      color: getStatusColor(agent.status),
                      textTransform: 'uppercase',
                      letterSpacing: '1px',
                      fontWeight: '500'
                    }}>{agent.status}</span>
                  </div>
                  <span style={{ fontSize: '14px', color: '#9ca3af' }}>{agent.progress.toFixed(0)}%</span>
                </div>
                <p style={{ margin: '0 0 12px 0', fontSize: '14px', color: '#9ca3af' }}>{agent.task}</p>
                <div className="progress-container" style={{ height: '6px' }}>
                  <div 
                    className="progress-bar" 
                    style={{ 
                      width: `${agent.progress}%`,
                      background: `linear-gradient(90deg, ${getStatusColor(agent.status)} 0%, ${getStatusColor(agent.status)} 100%)`
                    }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
          
          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(3, 1fr)', 
            gap: '16px',
            padding: '24px',
            background: 'rgba(255, 158, 0, 0.05)',
            borderRadius: '12px',
            border: '1px solid rgba(255, 158, 0, 0.2)'
          }}>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#ff9e00' }}>
                {agents.filter(a => a.status === 'working').length}
              </div>
              <div style={{ fontSize: '12px', color: '#9ca3af', marginTop: '4px' }}>Working</div>
            </div>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#10b981' }}>
                {agents.filter(a => a.status === 'completed').length}
              </div>
              <div style={{ fontSize: '12px', color: '#9ca3af', marginTop: '4px' }}>Completed</div>
            </div>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#6b7280' }}>
                {agents.filter(a => a.status === 'idle').length}
              </div>
              <div style={{ fontSize: '12px', color: '#9ca3af', marginTop: '4px' }}>Idle</div>
            </div>
          </div>
        </div>
        
        <div className="special-view-actions">
          <button className="special-view-btn secondary" onClick={() => {
            // TODO: Implement add agent functionality
            console.log('Add agent clicked');
          }}>
            Add Agent
          </button>
          <button className="special-view-btn secondary" onClick={() => {
            // TODO: Implement view results functionality
            console.log('View results clicked');
          }}>
            View Results
          </button>
          <button className="special-view-btn primary" onClick={onClose}>
            Stop All Agents
          </button>
        </div>
      </div>
    </div>
  );
};

export default ParallelAgentsView;