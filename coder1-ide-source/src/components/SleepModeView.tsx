import React from 'react';
import './SpecialView.css';

interface SleepModeViewProps {
  onClose: () => void;
}

const SleepModeView: React.FC<SleepModeViewProps> = ({ onClose }) => {
  return (
    <div className="special-view-overlay">
      <div className="special-view-container">
        <button className="special-view-close" onClick={onClose}>
          ×
        </button>
        
        <div className="special-view-header">
          <h1 className="special-view-title">Sleep Mode</h1>
          <p className="special-view-subtitle">
            AI agents are in low-power standby mode
          </p>
        </div>
        
        <div className="special-view-status">
          <div className="status-indicator" style={{ background: '#3b82f6', boxShadow: '0 0 20px rgba(59, 130, 246, 0.8)' }}></div>
          <span className="status-text" style={{ color: '#3b82f6' }}>Sleeping</span>
        </div>
        
        <div className="special-view-content">
          <ul className="feature-list">
            <li className="feature-item">
              <div className="feature-icon">🌙</div>
              <div className="feature-text">
                <h3 className="feature-title">Resource Conservation</h3>
                <p className="feature-desc">Minimal CPU and memory usage while inactive</p>
              </div>
            </li>
            <li className="feature-item">
              <div className="feature-icon">⚡</div>
              <div className="feature-text">
                <h3 className="feature-title">Instant Wake</h3>
                <p className="feature-desc">Agents can be activated immediately when needed</p>
              </div>
            </li>
            <li className="feature-item">
              <div className="feature-icon">💾</div>
              <div className="feature-text">
                <h3 className="feature-title">State Preservation</h3>
                <p className="feature-desc">All context and progress is saved for later</p>
              </div>
            </li>
            <li className="feature-item">
              <div className="feature-icon">🔄</div>
              <div className="feature-text">
                <h3 className="feature-title">Background Updates</h3>
                <p className="feature-desc">Essential maintenance continues in sleep mode</p>
              </div>
            </li>
          </ul>
          
          <div style={{ textAlign: 'center', margin: '32px 0' }}>
            <div style={{ fontSize: '48px', marginBottom: '16px' }}>😴</div>
            <p style={{ fontSize: '16px', color: '#9ca3af' }}>
              Agents are resting. Click "Wake Agents" to resume operations.
            </p>
          </div>
        </div>
        
        <div className="special-view-actions">
          <button className="special-view-btn secondary" onClick={() => {
            // TODO: Implement schedule wake functionality
            console.log('Schedule wake clicked');
          }}>
            Schedule Wake
          </button>
          <button className="special-view-btn primary" onClick={onClose}>
            Wake Agents
          </button>
        </div>
      </div>
    </div>
  );
};

export default SleepModeView;