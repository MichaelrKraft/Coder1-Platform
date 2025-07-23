import React from 'react';
import './ReactBits.css';

const ReactBits: React.FC = () => {
  return (
    <div className="react-bits">
      <div className="react-bits-header">
        <h3>React Bits</h3>
      </div>
      <div className="react-bits-content">
        <div className="react-bit-item">
          <span className="bit-icon">⚛️</span>
          <span className="bit-name">Button</span>
        </div>
        <div className="react-bit-item">
          <span className="bit-icon">📝</span>
          <span className="bit-name">Form</span>
        </div>
        <div className="react-bit-item">
          <span className="bit-icon">🎨</span>
          <span className="bit-name">Card</span>
        </div>
        <div className="react-bit-item">
          <span className="bit-icon">📊</span>
          <span className="bit-name">Chart</span>
        </div>
      </div>
    </div>
  );
};

export default ReactBits;