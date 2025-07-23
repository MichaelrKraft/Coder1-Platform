import React, { useState } from 'react';
import './App.css';
import Sidebar from './components/Sidebar';
import Terminal from './components/Terminal';
import Explorer from './components/Explorer';
import Preview from './components/Preview';
import ReactBits from './components/ReactBits';
import HivemindDashboard from './components/HivemindDashboard';

function App() {
  const [activeView, setActiveView] = useState<'explorer' | 'terminal' | 'preview'>('terminal');
  const [isSleepMode, setIsSleepMode] = useState(false);
  const [isSupervisionOn, setIsSupervisionOn] = useState(false);
  const [isInfiniteLoop, setIsInfiniteLoop] = useState(false);
  const [isParallelAgents, setIsParallelAgents] = useState(false);
  const [showHivemind, setShowHivemind] = useState(false);
  const [hivemindSessionId, setHivemindSessionId] = useState<string | null>(null);
  const [activeAgentCount, setActiveAgentCount] = useState(0);

  return (
    <div className="App">
      <div className="main-container">
        <Sidebar activeView={activeView} setActiveView={setActiveView} />
        
        <div className="content-area">
          <div className="left-panel">
            <ReactBits />
            <div className="content-view">
              {activeView === 'explorer' && <Explorer />}
              {activeView === 'terminal' && (
                <Terminal 
                  isSleepMode={isSleepMode}
                  setIsSleepMode={setIsSleepMode}
                  isSupervisionOn={isSupervisionOn}
                  setIsSupervisionOn={setIsSupervisionOn}
                  isInfiniteLoop={isInfiniteLoop}
                  setIsInfiniteLoop={setIsInfiniteLoop}
                  isParallelAgents={isParallelAgents}
                  setIsParallelAgents={setIsParallelAgents}
                  onHivemindClick={() => setShowHivemind(true)}
                  hivemindActive={hivemindSessionId !== null}
                  agentCount={activeAgentCount}
                />
              )}
              {activeView === 'preview' && <Preview />}
            </div>
          </div>
        </div>
      </div>
      
      {showHivemind && (
        <HivemindDashboard 
          onClose={() => setShowHivemind(false)}
          sessionId={hivemindSessionId || undefined}
        />
      )}
    </div>
  );
}

export default App;
