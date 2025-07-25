// Coder1 Special Views - Using External CSS (special-views-unified.css)
(function() {
    'use strict';
    
    // Create Coder1-style overlay
    function createCoder1Overlay() {
        const overlay = document.createElement('div');
        overlay.className = 'coder1-special-view-overlay';
        
        // Add animated background orbs
        overlay.innerHTML = `
            <div class="animated-background">
                <div class="gradient-orb orb-1"></div>
                <div class="gradient-orb orb-2"></div>
                <div class="gradient-orb orb-3"></div>
            </div>
        `;
        
        return overlay;
    }
    
    // Create glassmorphism container
    function createGlassContainer(title, content) {
        return `
            <div class="coder1-container">
                <div class="coder1-glass-panel">
                    <div class="coder1-panel-header">
                        <h2>${title}</h2>
                        <button class="coder1-exit-btn">
                            <i class="fas fa-times"></i>
                        </button>
                    </div>
                    <div class="coder1-panel-content">
                        ${content}
                    </div>
                </div>
            </div>
        `;
    }
    
    // Supervision View - Clean Coder1 Style
    function createSupervisionView() {
        const content = `
            <div class="coder1-metrics-grid">
                <div class="coder1-metric-card">
                    <div class="metric-icon">
                        <i class="fas fa-eye"></i>
                    </div>
                    <div class="metric-info">
                        <h3>Agent Status</h3>
                        <div class="status-indicator active">
                            <span class="status-dot"></span>
                            Active
                        </div>
                        <div class="metric-details">
                            <div>Tasks: 42</div>
                            <div>Uptime: 2h 34m</div>
                        </div>
                    </div>
                </div>
                
                <div class="coder1-metric-card">
                    <div class="metric-icon">
                        <i class="fas fa-chart-line"></i>
                    </div>
                    <div class="metric-info">
                        <h3>Performance</h3>
                        <div class="progress-bar">
                            <div class="progress-fill" style="width: 87%"></div>
                        </div>
                        <div class="metric-details">
                            <div>Efficiency: 87%</div>
                            <div>Response: 0.3s</div>
                        </div>
                    </div>
                </div>
                
                <div class="coder1-metric-card">
                    <div class="metric-icon">
                        <i class="fas fa-activity"></i>
                    </div>
                    <div class="metric-info">
                        <h3>System Health</h3>
                        <div class="health-grid">
                            <div class="health-item">
                                <span>CPU</span>
                                <span>34%</span>
                            </div>
                            <div class="health-item">
                                <span>Memory</span>
                                <span>2.1GB</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            
            <div class="coder1-activity-panel">
                <h3>Recent Activity</h3>
                <div class="activity-log">
                    <div class="activity-item">
                        <span class="activity-time">14:23:45</span>
                        <span class="activity-text">File analysis completed</span>
                    </div>
                    <div class="activity-item">
                        <span class="activity-time">14:23:12</span>
                        <span class="activity-text">Running code optimization</span>
                    </div>
                    <div class="activity-item">
                        <span class="activity-time">14:22:58</span>
                        <span class="activity-text">Pattern match detected</span>
                    </div>
                </div>
            </div>
        `;
        
        return createGlassContainer('👁️ Supervision Mode', content);
    }
    
    // Sleep Mode View - Clean Coder1 Style
    function createSleepModeView() {
        const content = `
            <div class="coder1-sleep-center">
                <div class="sleep-icon-container">
                    <div class="sleep-pulse"></div>
                    <i class="fas fa-moon sleep-icon"></i>
                </div>
                <h3>System in Sleep Mode</h3>
                <p>All non-essential processes have been suspended</p>
                
                <div class="coder1-metrics-grid sleep-metrics">
                    <div class="coder1-metric-card compact">
                        <div class="metric-icon">
                            <i class="fas fa-pause"></i>
                        </div>
                        <div class="metric-info">
                            <div class="metric-value">23</div>
                            <div class="metric-label">Processes Paused</div>
                        </div>
                    </div>
                    
                    <div class="coder1-metric-card compact">
                        <div class="metric-icon">
                            <i class="fas fa-battery-three-quarters"></i>
                        </div>
                        <div class="metric-info">
                            <div class="metric-value">78%</div>
                            <div class="metric-label">Power Saved</div>
                        </div>
                    </div>
                    
                    <div class="coder1-metric-card compact">
                        <div class="metric-icon">
                            <i class="fas fa-clock"></i>
                        </div>
                        <div class="metric-info">
                            <div class="metric-value">5:42</div>
                            <div class="metric-label">Sleep Time</div>
                        </div>
                    </div>
                </div>
                
                <div class="sleep-actions">
                    <button class="coder1-btn">
                        <i class="fas fa-play"></i>
                        Resume All Processes
                    </button>
                </div>
            </div>
        `;
        
        return createGlassContainer('🌙 Sleep Mode', content);
    }
    
    // Infinite Agent Loop View - Clean Coder1 Style  
    function createInfiniteLoopView() {
        const content = `
            <div class="loop-settings">
                <h3>Loop Configuration</h3>
                <div class="settings-grid">
                    <div class="setting-item">
                        <label>Mode</label>
                        <select>
                            <option>Autonomous</option>
                            <option>Supervised</option>
                            <option>Hybrid</option>
                        </select>
                    </div>
                    <div class="setting-item">
                        <label>Iterations</label>
                        <input type="number" value="∞" readonly>
                    </div>
                </div>
            </div>
            
            <div class="coder1-agents-grid">
                <div class="coder1-agent-card">
                    <div class="agent-header">
                        <div class="agent-status working"></div>
                        <h3>Code Agent</h3>
                    </div>
                    <div class="agent-info">
                        <div class="agent-task">Refactoring auth module</div>
                        <div class="agent-progress">
                            <div class="progress-bar">
                                <div class="progress-fill" style="width: 67%"></div>
                            </div>
                            <span>67%</span>
                        </div>
                        <div class="agent-meta">Iteration 142 • 3.2s/cycle</div>
                    </div>
                </div>
                
                <div class="coder1-agent-card">
                    <div class="agent-header">
                        <div class="agent-status active"></div>
                        <h3>Test Agent</h3>
                    </div>
                    <div class="agent-info">
                        <div class="agent-task">Running test suite</div>
                        <div class="agent-progress">
                            <div class="progress-bar">
                                <div class="progress-fill" style="width: 45%"></div>
                            </div>
                            <span>45%</span>
                        </div>
                        <div class="agent-meta">Iteration 89 • 1.8s/cycle</div>
                    </div>
                </div>
                
                <div class="coder1-agent-card">
                    <div class="agent-header">
                        <div class="agent-status"></div>
                        <h3>Review Agent</h3>
                    </div>
                    <div class="agent-info">
                        <div class="agent-task">Waiting for input</div>
                        <div class="agent-progress">
                            <div class="progress-bar">
                                <div class="progress-fill" style="width: 0%"></div>
                            </div>
                            <span>0%</span>
                        </div>
                        <div class="agent-meta">Iteration 88 • Idle</div>
                    </div>
                </div>
            </div>
            
            <div class="coder1-terminal-panel">
                <h3>Agent Communication</h3>
                <div class="terminal-output">
                    <div class="terminal-line success">[14:23:45] Code Agent: Auth module refactor complete</div>
                    <div class="terminal-line">[14:23:46] Test Agent: Initiating test suite for auth module</div>
                    <div class="terminal-line warning">[14:23:47] Test Agent: Warning - 2 deprecated methods found</div>
                    <div class="terminal-line">[14:23:48] Code Agent: Acknowledged, updating deprecated methods</div>
                </div>
            </div>
            
            <div class="info-card">
                <h4>About Infinite Loops</h4>
                <ul>
                    <li>Agents run continuously until manually stopped</li>
                    <li>Each agent maintains its own execution context</li>
                    <li>Communication occurs through message passing</li>
                    <li>System monitors for infinite recursion protection</li>
                </ul>
            </div>
        `;
        
        return createGlassContainer('♾️ Infinite Agent Loop', content);
    }
    
    // Parallel Agents View - Clean Coder1 Style
    function createParallelAgentsView() {
        const content = `
            <div class="coder1-metrics-grid">
                <div class="coder1-metric-card">
                    <div class="metric-icon">
                        <i class="fas fa-users"></i>
                    </div>
                    <div class="metric-info">
                        <h3>Active Agents</h3>
                        <div class="metric-value">12</div>
                        <div class="metric-details">
                            <div>Running: 8</div>
                            <div>Queued: 4</div>
                        </div>
                    </div>
                </div>
                
                <div class="coder1-metric-card">
                    <div class="metric-icon">
                        <i class="fas fa-tachometer-alt"></i>
                    </div>
                    <div class="metric-info">
                        <h3>Throughput</h3>
                        <div class="metric-value">324/min</div>
                        <div class="metric-details">
                            <div>Peak: 412/min</div>
                            <div>Avg: 287/min</div>
                        </div>
                    </div>
                </div>
                
                <div class="coder1-metric-card">
                    <div class="metric-icon">
                        <i class="fas fa-network-wired"></i>
                    </div>
                    <div class="metric-info">
                        <h3>Load Balance</h3>
                        <div class="progress-bar">
                            <div class="progress-fill" style="width: 72%"></div>
                        </div>
                        <div class="metric-details">
                            <div>CPU: 72%</div>
                            <div>Optimal</div>
                        </div>
                    </div>
                </div>
            </div>
            
            <div class="coder1-communication-panel">
                <h3>Inter-Agent Communication</h3>
                <div class="comm-log">
                    <div class="comm-item">
                        <span class="comm-from">Agent-1</span>
                        <span class="comm-to">Agent-4</span>
                        <span class="comm-message">Dependency resolved: auth.js</span>
                    </div>
                    <div class="comm-item">
                        <span class="comm-from">Agent-3</span>
                        <span class="comm-to">Broadcast</span>
                        <span class="comm-message">Database migration complete</span>
                    </div>
                    <div class="comm-item">
                        <span class="comm-from">Agent-7</span>
                        <span class="comm-to">Agent-2</span>
                        <span class="comm-message">Requesting code review for PR #142</span>
                    </div>
                </div>
            </div>
            
            <div class="info-card">
                <h4>Parallel Processing Benefits</h4>
                <ul>
                    <li>Simultaneous execution of independent tasks</li>
                    <li>Automatic workload distribution</li>
                    <li>Fault tolerance through agent redundancy</li>
                    <li>Real-time performance optimization</li>
                </ul>
            </div>
        `;
        
        return createGlassContainer('⚡ Parallel Agents', content);
    }
    
    // Show special view function
    window.showSpecialView = function(viewType) {
        console.log('🎨 Showing special view:', viewType);
        
        // Create overlay
        const overlay = createCoder1Overlay();
        
        // Normalize view type (handle both hyphenated and non-hyphenated)
        const normalizedViewType = viewType.replace(/-mode|-loop|-agents/g, '').toLowerCase();
        
        // Add content based on view type
        let content = '';
        switch(normalizedViewType) {
            case 'supervision':
                content = createSupervisionView();
                break;
            case 'sleep':
                content = createSleepModeView();
                break;
            case 'infinite':
                content = createInfiniteLoopView();
                break;
            case 'parallel':
                content = createParallelAgentsView();
                break;
            default:
                console.error('Unknown view type:', viewType, 'normalized to:', normalizedViewType);
                return;
        }
        
        // Add content to overlay
        const container = document.createElement('div');
        container.innerHTML = content;
        overlay.appendChild(container);
        
        // Add to body
        document.body.appendChild(overlay);
        
        // Add exit functionality
        setTimeout(() => {
            const exitBtn = overlay.querySelector('.coder1-exit-btn');
            if (exitBtn) {
                exitBtn.addEventListener('click', () => {
                    overlay.remove();
                });
            }
        }, 100);
    };
    
    console.log('✅ Coder1 Special Views v3 loaded (using external CSS)');
})();