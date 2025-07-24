import React, { useState, useEffect } from 'react';
import './SpecialView.css';

interface InfiniteLoopViewProps {
  onClose: () => void;
  sessionId?: string | null;
}

const InfiniteLoopView: React.FC<InfiniteLoopViewProps> = ({ onClose, sessionId }) => {
  const [iterations, setIterations] = useState(0);
  const [componentsGenerated, setComponentsGenerated] = useState(0);
  
  useEffect(() => {
    // Simulate iteration counter
    const interval = setInterval(() => {
      setIterations(prev => prev + 1);
      setComponentsGenerated(prev => prev + Math.floor(Math.random() * 3) + 1);
    }, 2000);
    
    return () => clearInterval(interval);
  }, []);
  
  return (
    <div className="special-view-overlay">
      <div className="special-view-container">
        <button className="special-view-close" onClick={onClose}>
          ×
        </button>
        
        <div className="special-view-header">
          <h1 className="special-view-title">Infinite Loop Mode</h1>
          <p className="special-view-subtitle">
            Continuous AI generation engine running
          </p>
        </div>
        
        <div className="special-view-status">
          <div className="status-indicator" style={{ background: '#8b5cf6', boxShadow: '0 0 20px rgba(139, 92, 246, 0.8)' }}></div>
          <span className="status-text" style={{ color: '#8b5cf6' }}>Generating</span>
        </div>
        
        <div className="special-view-content">
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px', marginBottom: '32px' }}>
            <div style={{ textAlign: 'center', padding: '24px', background: 'rgba(139, 92, 246, 0.1)', borderRadius: '12px' }}>
              <div style={{ fontSize: '36px', fontWeight: 'bold', color: '#8b5cf6' }}>{iterations}</div>
              <div style={{ fontSize: '14px', color: '#9ca3af', marginTop: '8px' }}>Iterations</div>
            </div>
            <div style={{ textAlign: 'center', padding: '24px', background: 'rgba(16, 185, 129, 0.1)', borderRadius: '12px' }}>
              <div style={{ fontSize: '36px', fontWeight: 'bold', color: '#10b981' }}>{componentsGenerated}</div>
              <div style={{ fontSize: '14px', color: '#9ca3af', marginTop: '8px' }}>Components Generated</div>
            </div>
          </div>
          
          <ul className="feature-list">
            <li className="feature-item">
              <div className="feature-icon">♾️</div>
              <div className="feature-text">
                <h3 className="feature-title">Continuous Generation</h3>
                <p className="feature-desc">Non-stop creation of innovative React components</p>
              </div>
            </li>
            <li className="feature-item">
              <div className="feature-icon">🧠</div>
              <div className="feature-text">
                <h3 className="feature-title">Adaptive Learning</h3>
                <p className="feature-desc">Each iteration improves based on previous results</p>
              </div>
            </li>
            <li className="feature-item">
              <div className="feature-icon">⚙️</div>
              <div className="feature-text">
                <h3 className="feature-title">Auto-optimization</h3>
                <p className="feature-desc">Components are refined and optimized automatically</p>
              </div>
            </li>
          </ul>
          
          {sessionId && (
            <div style={{ marginTop: '24px', padding: '16px', background: 'rgba(26, 27, 38, 0.5)', borderRadius: '8px' }}>
              <p style={{ fontSize: '14px', color: '#9ca3af', margin: 0 }}>
                Session ID: <span style={{ color: '#8b5cf6', fontFamily: 'monospace' }}>{sessionId}</span>
              </p>
            </div>
          )}
          
          <div className="loading-spinner" style={{ marginTop: '32px' }}></div>
        </div>
        
        <div className="special-view-actions">
          <button className="special-view-btn secondary" onClick={() => {
            // TODO: Implement view output functionality
            console.log('View output clicked');
          }}>
            View Output
          </button>
          <button className="special-view-btn primary" onClick={onClose} style={{ background: 'linear-gradient(135deg, #f7768e 0%, #ff5370 100%)' }}>
            Stop Loop
          </button>
        </div>
      </div>
    </div>
  );
};

export default InfiniteLoopView;