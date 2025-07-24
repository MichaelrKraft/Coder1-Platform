import React, { useState } from 'react';
import './App.css';
import Sidebar from './components/Sidebar';
import Terminal from './components/Terminal';
import Explorer from './components/Explorer';
import Preview from './components/Preview';
import ReactBits from './components/ReactBits';
import HivemindDashboard from './components/HivemindDashboard';
import SupervisionView from './components/SupervisionView';
import SleepModeView from './components/SleepModeView';
import InfiniteLoopView from './components/InfiniteLoopView';
import ParallelAgentsView from './components/ParallelAgentsView';

function App() {
  const [activeView, setActiveView] = useState<'explorer' | 'terminal' | 'preview'>('terminal');
  const [isSleepMode, setIsSleepMode] = useState(false);
  const [isSupervisionOn, setIsSupervisionOn] = useState(false);
  const [isInfiniteLoop, setIsInfiniteLoop] = useState(false);
  const [isParallelAgents, setIsParallelAgents] = useState(false);
  const [showHivemind, setShowHivemind] = useState(false);
  const [hivemindSessionId, setHivemindSessionId] = useState<string | null>(null);
  const [activeAgentCount, setActiveAgentCount] = useState(0);
  const [infiniteSessionId, setInfiniteSessionId] = useState<string | null>(null);

  return (
    <div className="App">
      <div className="main-container">
        <Sidebar activeView={activeView} setActiveView={setActiveView} />
        
        <div className="content-area">
          <div className="main-content">
            {activeView === 'explorer' && <Explorer />}
            {activeView === 'terminal' && (
              <Terminal 
                isSleepMode={isSleepMode}
                setIsSleepMode={setIsSleepMode}
                isSupervisionOn={isSupervisionOn}
                setIsSupervisionOn={setIsSupervisionOn}
                isInfiniteLoop={isInfiniteLoop}
                setIsInfiniteLoop={(value, sessionId) => {
                  setIsInfiniteLoop(value);
                  if (value && sessionId) {
                    setInfiniteSessionId(sessionId);
                  } else if (!value) {
                    setInfiniteSessionId(null);
                  }
                }}
                isParallelAgents={isParallelAgents}
                setIsParallelAgents={setIsParallelAgents}
                onHivemindClick={() => setShowHivemind(true)}
                hivemindActive={hivemindSessionId !== null}
                agentCount={activeAgentCount}
              />
            )}
            {activeView === 'preview' && <Preview />}
          </div>
          <ReactBits />
        </div>
      </div>
      
      {/* Special views as overlays */}
      {isSupervisionOn && (
        <SupervisionView onClose={() => setIsSupervisionOn(false)} />
      )}
      {isSleepMode && (
        <SleepModeView onClose={() => setIsSleepMode(false)} />
      )}
      {isInfiniteLoop && (
        <InfiniteLoopView 
          onClose={() => {
            setIsInfiniteLoop(false);
            setInfiniteSessionId(null);
          }} 
          sessionId={infiniteSessionId}
        />
      )}
      {isParallelAgents && (
        <ParallelAgentsView onClose={() => setIsParallelAgents(false)} />
      )}
      
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
