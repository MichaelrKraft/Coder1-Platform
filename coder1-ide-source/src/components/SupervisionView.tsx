import React from 'react';
import './SpecialView.css';

interface SupervisionViewProps {
  onClose: () => void;
}

const SupervisionView: React.FC<SupervisionViewProps> = ({ onClose }) => {
  return (
    <div className="special-view-overlay">
      <div className="special-view-container">
        <button className="special-view-close" onClick={onClose}>
          ×
        </button>
        
        <div className="special-view-header">
          <h1 className="special-view-title">Supervision Mode</h1>
          <p className="special-view-subtitle">
            AI Agent monitoring and control system active
          </p>
        </div>
        
        <div className="special-view-status">
          <div className="status-indicator"></div>
          <span className="status-text">Active Monitoring</span>
        </div>
        
        <div className="special-view-content">
          <ul className="feature-list">
            <li className="feature-item">
              <div className="feature-icon">👁</div>
              <div className="feature-text">
                <h3 className="feature-title">Real-time Monitoring</h3>
                <p className="feature-desc">All agent actions are being tracked and logged</p>
              </div>
            </li>
            <li className="feature-item">
              <div className="feature-icon">🛡️</div>
              <div className="feature-text">
                <h3 className="feature-title">Safety Controls</h3>
                <p className="feature-desc">Automatic intervention for risky operations</p>
              </div>
            </li>
            <li className="feature-item">
              <div className="feature-icon">📊</div>
              <div className="feature-text">
                <h3 className="feature-title">Performance Analytics</h3>
                <p className="feature-desc">Detailed metrics on agent efficiency and accuracy</p>
              </div>
            </li>
            <li className="feature-item">
              <div className="feature-icon">🔔</div>
              <div className="feature-text">
                <h3 className="feature-title">Alert System</h3>
                <p className="feature-desc">Instant notifications for critical events</p>
              </div>
            </li>
          </ul>
          
          <div className="progress-container">
            <div className="progress-bar" style={{ width: '75%' }}></div>
          </div>
          <p style={{ textAlign: 'center', marginTop: '8px', fontSize: '14px', color: '#9ca3af' }}>
            Supervision Coverage: 75%
          </p>
        </div>
        
        <div className="special-view-actions">
          <button className="special-view-btn secondary" onClick={() => {
            // TODO: Implement view logs functionality
            console.log('View logs clicked');
          }}>
            View Logs
          </button>
          <button className="special-view-btn secondary" onClick={() => {
            // TODO: Implement settings functionality
            console.log('Settings clicked');
          }}>
            Settings
          </button>
          <button className="special-view-btn primary" onClick={onClose}>
            Exit Supervision
          </button>
        </div>
      </div>
    </div>
  );
};

export default SupervisionView;