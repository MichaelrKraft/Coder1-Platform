import React from 'react';
import './Preview.css';

const Preview: React.FC = () => {
  return (
    <div className="preview">
      <div className="preview-header">
        <h3>Live Preview</h3>
      </div>
      <div className="preview-content">
        <div className="preview-frame">
          <p>Component preview will appear here</p>
          <p>Use /ui commands in the terminal to generate components</p>
        </div>
      </div>
    </div>
  );
};

export default Preview;