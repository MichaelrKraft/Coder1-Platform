import React from 'react';
import './CodeView.css';

const CodeView: React.FC = () => {
  return (
    <div className="code-view">
      <div className="code-tabs">
        <div className="code-tab active">
          <span className="tab-icon">📄</span>
          <span className="tab-name">App.js</span>
        </div>
      </div>
      <div className="code-editor">
        <div className="code-content">
          <pre className="code-lines">
{`const Home = () => {
  return (
    <motion.div
      <footer />
    </div>
  );
};

const App = () => {
  return (
    <motion.div`}
          </pre>
        </div>
      </div>
    </div>
  );
};

export default CodeView;