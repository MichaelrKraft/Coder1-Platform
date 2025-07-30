import React from 'react';
import Terminal from './Terminal';
import CodeView from './CodeView';
import './IDELayout.css';

interface IDELayoutProps {
  isSleepMode: boolean;
  setIsSleepMode: (value: boolean) => void;
  isSupervisionOn: boolean;
  setIsSupervisionOn: (value: boolean) => void;
  isInfiniteLoop: boolean;
  setIsInfiniteLoop: (value: boolean, sessionId?: string | null) => void;
  isParallelAgents: boolean;
  setIsParallelAgents: (value: boolean) => void;
  onHivemindClick?: () => void;
  hivemindActive?: boolean;
  agentCount?: number;
}

const IDELayout: React.FC<IDELayoutProps> = (props) => {
  return (
    <div className="ide-layout">
      <div className="ide-top-section">
        <CodeView />
      </div>
      <div className="ide-bottom-section">
        <Terminal {...props} />
      </div>
    </div>
  );
};

export default IDELayout;