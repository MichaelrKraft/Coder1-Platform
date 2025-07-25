// Coder1 Special Views - Match PRD Generator Design Language
(function() {
    'use strict';
    
    // Coder1 Design System Colors (from PRD generator)
    const DESIGN_SYSTEM = {
        colors: {
            primaryBg: '#1a1a1a',
            secondaryBg: '#2a2a2a', 
            accentPrimary: '#8b5cf6',
            accentSecondary: '#10b981',
            accentDanger: '#ef4444',
            textPrimary: '#ffffff',
            textSecondary: '#a1a1aa',
            glassBg: 'rgba(42, 42, 42, 0.6)',
            glassBorder: 'rgba(255, 255, 255, 0.1)'
        },
        fonts: {
            primary: "'Inter', -apple-system, BlinkMacSystemFont, sans-serif"
        }
    };
    
    // Create Coder1-style overlay
    function createCoder1Overlay() {
        const overlay = document.createElement('div');
        overlay.className = 'coder1-special-view-overlay';
        
        // Apply inline styles for immediate effect
        overlay.style.cssText = `
            position: fixed !important;
            top: 0 !important;
            left: 0 !important;
            width: 100vw !important;
            height: 100vh !important;
            background: #1a1a1a !important;
            z-index: 9999 !important;
            font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif !important;
            color: #ffffff !important;
            overflow-y: auto !important;
        `;
        
        // Add animated background orbs like PRD generator
        overlay.innerHTML = `
            <style>
                @keyframes float {
                    0%, 100% { transform: translateY(0) translateX(0) scale(1); }
                    25% { transform: translateY(-50px) translateX(50px) scale(1.1); }
                    50% { transform: translateY(50px) translateX(-50px) scale(0.9); }
                    75% { transform: translateY(-30px) translateX(-30px) scale(1.05); }
                }
                .animated-background {
                    position: fixed !important;
                    top: 0 !important;
                    left: 0 !important;
                    width: 100% !important;
                    height: 100% !important;
                    z-index: 0 !important;
                    overflow: hidden !important;
                }
                .gradient-orb {
                    position: absolute !important;
                    border-radius: 50% !important;
                    filter: blur(100px) !important;
                    opacity: 0.6 !important;
                    animation: float 20s infinite ease-in-out !important;
                }
                .orb-1 {
                    width: 600px !important;
                    height: 600px !important;
                    background: linear-gradient(135deg, #8b5cf6, #6366f1) !important;
                    top: -200px !important;
                    left: -200px !important;
                }
                .orb-2 {
                    width: 500px !important;
                    height: 500px !important;
                    background: linear-gradient(135deg, #10b981, #06b6d4) !important;
                    bottom: -200px !important;
                    right: -200px !important;
                    animation-delay: 7s !important;
                }
                .orb-3 {
                    width: 400px !important;
                    height: 400px !important;
                    background: linear-gradient(135deg, #f59e0b, #ef4444) !important;
                    top: 50% !important;
                    left: 50% !important;
                    transform: translate(-50%, -50%) !important;
                    animation-delay: 14s !important;
                }
            </style>
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
            <style>
                .coder1-container {
                    position: relative !important;
                    padding: 24px !important;
                    max-width: 1000px !important;
                    margin: 0 auto !important;
                    min-height: 100vh !important;
                    display: flex !important;
                    align-items: center !important;
                    justify-content: center !important;
                    z-index: 1 !important;
                }
                .coder1-glass-panel {
                    background: rgba(42, 42, 42, 0.6) !important;
                    backdrop-filter: blur(20px) !important;
                    -webkit-backdrop-filter: blur(20px) !important;
                    border: 1px solid rgba(255, 255, 255, 0.1) !important;
                    box-shadow: 0 8px 32px 0 rgba(0, 0, 0, 0.37) !important;
                    border-radius: 12px !important;
                    width: 100% !important;
                    max-width: 800px !important;
                    overflow: hidden !important;
                }
                .coder1-panel-header {
                    padding: 16px 24px !important;
                    border-bottom: 1px solid rgba(255, 255, 255, 0.1) !important;
                    display: flex !important;
                    justify-content: space-between !important;
                    align-items: center !important;
                }
                .coder1-panel-header h2 {
                    font-size: 1.25rem !important;
                    font-weight: 600 !important;
                    margin: 0 !important;
                    color: #ffffff !important;
                }
                .coder1-exit-btn {
                    background: transparent !important;
                    border: 1px solid rgba(255, 255, 255, 0.1) !important;
                    color: #a1a1aa !important;
                    padding: 6px 10px !important;
                    border-radius: 6px !important;
                    cursor: pointer !important;
                    font-size: 13px !important;
                    transition: all 0.2s !important;
                }
                .coder1-exit-btn:hover {
                    background: #ef4444 !important;
                    border-color: #ef4444 !important;
                    color: white !important;
                }
                .coder1-panel-content {
                    padding: 20px 24px !important;
                }
            </style>
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
                        <div class="status-indicator active">Active</div>
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
            <style>
                @keyframes sleep-pulse {
                    0% { transform: scale(0.9); opacity: 0.7; }
                    50% { transform: scale(1.2); opacity: 0.3; }
                    100% { transform: scale(0.9); opacity: 0.7; }
                }
                .coder1-sleep-center {
                    text-align: center;
                    padding: 40px 0;
                }
                .sleep-icon-container {
                    position: relative;
                    width: 120px;
                    height: 120px;
                    margin: 0 auto 30px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                }
                .sleep-pulse {
                    position: absolute;
                    width: 100%;
                    height: 100%;
                    border-radius: 50%;
                    background: rgba(139, 92, 246, 0.3);
                    animation: sleep-pulse 3s infinite ease-out;
                }
                .sleep-icon {
                    font-size: 60px;
                    color: #8b5cf6;
                    z-index: 1;
                    position: relative;
                }
                .coder1-sleep-center h3 {
                    font-size: 1.5rem;
                    font-weight: 300;
                    margin-bottom: 10px;
                    color: #ffffff;
                }
                .coder1-sleep-center p {
                    font-size: 0.9rem;
                    color: #a1a1aa;
                    margin-bottom: 40px;
                }
                .sleep-metrics {
                    grid-template-columns: repeat(3, 1fr) !important;
                    max-width: 600px !important;
                    margin: 40px auto 0 !important;
                }
                .coder1-metrics-grid {
                    display: grid !important;
                    gap: 16px !important;
                }
                .coder1-metric-card {
                    background: rgba(255, 255, 255, 0.05) !important;
                    border: 1px solid rgba(255, 255, 255, 0.1) !important;
                    border-radius: 8px !important;
                    padding: 16px !important;
                    display: flex !important;
                    gap: 12px !important;
                    align-items: flex-start !important;
                }
                .coder1-metric-card.compact {
                    flex-direction: column !important;
                    align-items: center !important;
                    text-align: center !important;
                }
                .metric-icon {
                    width: 32px !important;
                    height: 32px !important;
                    background: #8b5cf6 !important;
                    border-radius: 8px !important;
                    display: flex !important;
                    align-items: center !important;
                    justify-content: center !important;
                    color: white !important;
                    font-size: 14px !important;
                }
                .metric-value {
                    font-size: 1.1rem !important;
                    font-weight: 600 !important;
                    color: #8b5cf6 !important;
                    margin-bottom: 2px !important;
                }
                .metric-label {
                    font-size: 0.8rem !important;
                    color: #a1a1aa !important;
                }
                .sleep-actions {
                    margin-top: 40px;
                    text-align: center;
                }
                .coder1-btn {
                    background: linear-gradient(135deg, #8b5cf6, #6366f1) !important;
                    border: none !important;
                    color: white !important;
                    padding: 8px 16px !important;
                    border-radius: 6px !important;
                    font-size: 0.875rem !important;
                    font-weight: 500 !important;
                    cursor: pointer !important;
                    display: inline-flex !important;
                    align-items: center !important;
                    gap: 6px !important;
                    transition: all 0.2s !important;
                }
                .coder1-btn:hover {
                    transform: translateY(-1px);
                    box-shadow: 0 4px 12px rgba(139, 92, 246, 0.4);
                }
            </style>
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
                            <div class="metric-value" id="sleepTimer">00:00</div>
                            <div class="metric-label">Sleep Duration</div>
                        </div>
                    </div>
                </div>
                
                <div class="sleep-actions">
                    <button class="coder1-btn" onclick="wakeUpSystem()">
                        <i class="fas fa-sun"></i>
                        Wake Up System
                    </button>
                </div>
            </div>
        `;
        
        return createGlassContainer('🌙 Sleep Mode', content);
    }
    
    // Infinite Loop Templates (restored functionality)
    const infiniteLoopTemplates = [
        {
            id: 'dashboard-widget',
            name: 'Dashboard Widget',
            description: 'Generate interactive dashboard components with charts, metrics, and real-time data',
            features: ['Chart components', 'Data visualization', 'Real-time updates', 'Responsive design'],
            outputType: 'React components'
        },
        {
            id: 'ui-components',
            name: 'UI Components',
            description: 'Create reusable UI components with consistent styling and behavior',
            features: ['Component library', 'Design system', 'Accessibility', 'Documentation'],
            outputType: 'Component files'
        },
        {
            id: 'api-endpoints',
            name: 'API Endpoints',
            description: 'Generate RESTful API endpoints with validation and error handling',
            features: ['CRUD operations', 'Input validation', 'Error handling', 'OpenAPI spec'],
            outputType: 'API routes'
        },
        {
            id: 'test-suite',
            name: 'Test Suite',
            description: 'Create comprehensive test suites with unit and integration tests',
            features: ['Unit tests', 'Integration tests', 'Test coverage', 'Mock data'],
            outputType: 'Test files'
        },
        {
            id: 'data-models',
            name: 'Data Models',
            description: 'Generate database schemas and data models with relationships',
            features: ['Schema design', 'Migrations', 'Validations', 'Relationships'],
            outputType: 'Model files'
        },
        {
            id: 'documentation',
            name: 'Documentation',
            description: 'Create technical documentation with examples and guides',
            features: ['API docs', 'Code examples', 'User guides', 'Markdown format'],
            outputType: 'Documentation files'
        }
    ];
    
    // Infinite Loop View - Configuration state
    function createInfiniteLoopView() {
        const content = `
            <div class="loop-spec-type">
                <h3>Select Generation Type</h3>
                <div class="spec-type-selector">
                    <label class="spec-type-option">
                        <input type="radio" name="specType" value="template" checked onchange="handleSpecTypeChange(this)">
                        <span>Use Template</span>
                    </label>
                    <label class="spec-type-option">
                        <input type="radio" name="specType" value="custom" onchange="handleSpecTypeChange(this)">
                        <span>Custom Specification</span>
                    </label>
                </div>
            </div>
            
            <div id="templateSpecSection" class="spec-section">
                <h3>Choose a Template</h3>
                <div class="template-grid">
                    ${infiniteLoopTemplates.map(template => `
                        <div class="template-card" data-template-id="${template.id}" onclick="selectTemplate('${template.id}')">
                            <h4>${template.name}</h4>
                            <p>${template.description}</p>
                            <div class="template-features">
                                ${template.features.map(feature => `<span class="feature-tag">${feature}</span>`).join('')}
                            </div>
                            <div class="template-output">
                                <i class="fas fa-file-code"></i>
                                <span>${template.outputType}</span>
                            </div>
                        </div>
                    `).join('')}
                </div>
            </div>
            
            <div id="customSpecSection" class="spec-section" style="display: none;">
                <div class="custom-spec-section">
                    <label for="customSpec">
                        <h3>Custom Specification</h3>
                        <p>Describe what you want the infinite loop to generate:</p>
                    </label>
                    <textarea id="customSpec" class="custom-spec-input" placeholder="Example: Generate a series of React components for a social media dashboard, including user profiles, activity feeds, and analytics widgets. Each iteration should create a unique variation with different layouts and color schemes."></textarea>
                </div>
            </div>
            
            <div class="loop-settings">
                <h3>Loop Configuration</h3>
                <div class="settings-grid">
                    <div class="setting-item">
                        <label for="iterationCount">Maximum Iterations:</label>
                        <select id="iterationCount">
                            <option value="infinite">Infinite</option>
                            <option value="10">10</option>
                            <option value="25">25</option>
                            <option value="50">50</option>
                            <option value="100">100</option>
                        </select>
                    </div>
                    
                    <div class="setting-item">
                        <label for="outputDirectory">Output Directory:</label>
                        <input type="text" id="outputDirectory" value="ai-generated" placeholder="Directory name">
                    </div>
                    
                    <div class="setting-item">
                        <label for="iterationDelay">Delay Between Iterations:</label>
                        <select id="iterationDelay">
                            <option value="0">No delay</option>
                            <option value="1000">1 second</option>
                            <option value="5000">5 seconds</option>
                            <option value="10000">10 seconds</option>
                        </select>
                    </div>
                </div>
            </div>
            
            <div class="loop-info">
                <div class="info-card">
                    <h4>♾️ How Infinite Loop Works</h4>
                    <ul>
                        <li>Generates content continuously based on your specification</li>
                        <li>Each iteration builds upon previous results</li>
                        <li>Automatically creates variations and improvements</li>
                        <li>Stops when maximum iterations reached or manually stopped</li>
                        <li>All generated content is saved to your specified directory</li>
                    </ul>
                </div>
            </div>
            
            <div class="loop-actions">
                <button class="coder1-start-btn" onclick="startInfiniteLoop()">
                    <i class="fas fa-play"></i>
                    Start Infinite Loop
                </button>
            </div>
        </div>
        `;
        
        return createGlassContainer('♾️ Infinite Loop Configuration', content);
    }
    
    // Running state view
    function createRunningInfiniteLoopView() {
        const content = `
            <div class="coder1-loop-header">
                <div class="loop-status-card">
                    <div class="status-indicator running">
                        <div class="status-dot"></div>
                        <span>Running</span>
                    </div>
                    <div class="loop-stats">
                        <div class="stat-item">
                            <span class="stat-value">127</span>
                            <span class="stat-label">Iterations</span>
                        </div>
                        <div class="stat-item">
                            <span class="stat-value">45m</span>
                            <span class="stat-label">Duration</span>
                        </div>
                    </div>
                    <button class="coder1-stop-btn" onclick="stopInfiniteLoop()">
                        <i class="fas fa-stop"></i>
                        Stop Loop
                    </button>
                </div>
            </div>
            
            <div class="coder1-metrics-grid">
                <div class="coder1-metric-card">
                    <div class="metric-icon">
                        <i class="fas fa-check-circle"></i>
                    </div>
                    <div class="metric-info">
                        <h3>Success Rate</h3>
                        <div class="progress-bar">
                            <div class="progress-fill" style="width: 94.5%"></div>
                        </div>
                        <div class="metric-value">94.5%</div>
                    </div>
                </div>
                
                <div class="coder1-metric-card">
                    <div class="metric-icon">
                        <i class="fas fa-code"></i>
                    </div>
                    <div class="metric-info">
                        <h3>Generated</h3>
                        <div class="metric-details">
                            <div>Lines: 3.2k</div>
                            <div>Files: 12</div>
                            <div>Components: 8</div>
                        </div>
                    </div>
                </div>
            </div>
            
            <div class="coder1-terminal-panel">
                <h3>Recent Output</h3>
                <div class="terminal-output">
                    <div class="terminal-line">[Iteration 127] Processing request...</div>
                    <div class="terminal-line success">✓ Generated component structure</div>
                    <div class="terminal-line success">✓ Applied styling patterns</div>
                    <div class="terminal-line warning">⚠ Minor adjustment needed</div>
                    <div class="terminal-line">[Iteration 128] Starting...</div>
                </div>
            </div>
        `;
        
        return createGlassContainer('♾️ Infinite Loop Mode - Running', content);
    }
    
    // Parallel Agents View - Clean Coder1 Style  
    function createParallelAgentsView() {
        const content = `
            <div class="coder1-agents-grid">
                <div class="coder1-agent-card">
                    <div class="agent-header">
                        <div class="agent-status active"></div>
                        <h3>Agent Alpha</h3>
                    </div>
                    <div class="agent-info">
                        <div class="agent-task">Frontend Development</div>
                        <div class="agent-progress">
                            <div class="progress-bar">
                                <div class="progress-fill" style="width: 78%"></div>
                            </div>
                            <span>78%</span>
                        </div>
                        <div class="agent-meta">Uptime: 23m 45s</div>
                    </div>
                </div>
                
                <div class="coder1-agent-card">
                    <div class="agent-header">
                        <div class="agent-status working"></div>
                        <h3>Agent Beta</h3>
                    </div>
                    <div class="agent-info">
                        <div class="agent-task">Backend API</div>
                        <div class="agent-progress">
                            <div class="progress-bar">
                                <div class="progress-fill" style="width: 45%"></div>
                            </div>
                            <span>45%</span>
                        </div>
                        <div class="agent-meta">Uptime: 31m 12s</div>
                    </div>
                </div>
                
                <div class="coder1-agent-card">
                    <div class="agent-header">
                        <div class="agent-status active"></div>
                        <h3>Agent Gamma</h3>
                    </div>
                    <div class="agent-info">
                        <div class="agent-task">Testing & QA</div>
                        <div class="agent-progress">
                            <div class="progress-bar">
                                <div class="progress-fill" style="width: 92%"></div>
                            </div>
                            <span>92%</span>
                        </div>
                        <div class="agent-meta">Uptime: 18m 33s</div>
                    </div>
                </div>
            </div>
            
            <div class="coder1-communication-panel">
                <h3>Agent Communication</h3>
                <div class="comm-log">
                    <div class="comm-item">
                        <span class="comm-from">Alpha</span>
                        <span class="comm-to">Beta</span>
                        <span class="comm-message">Component API ready for integration</span>
                    </div>
                    <div class="comm-item">
                        <span class="comm-from">Beta</span>
                        <span class="comm-to">Gamma</span>
                        <span class="comm-message">Database schema updated, please test</span>
                    </div>
                    <div class="comm-item">
                        <span class="comm-from">Gamma</span>
                        <span class="comm-to">All</span>
                        <span class="comm-message">Test suite passing, 97% coverage</span>
                    </div>
                </div>
            </div>
        `;
        
        return createGlassContainer('🤖 Parallel Agents', content);
    }
    
    // Main function to show special views
    function showSpecialView(type) {
        // Remove any existing overlay
        const existing = document.querySelector('.coder1-special-view-overlay');
        if (existing) existing.remove();
        
        const overlay = createCoder1Overlay();
        
        let content = '';
        switch(type) {
            case 'supervision':
                content = createSupervisionView();
                break;
            case 'sleep-mode':
                content = createSleepModeView();
                break;
            case 'infinite-loop':
                content = createInfiniteLoopView();
                break;
            case 'parallel-agents':
                content = createParallelAgentsView();
                break;
        }
        
        overlay.innerHTML += content;
        document.body.appendChild(overlay);
        
        // Add exit functionality
        const exitBtn = overlay.querySelector('.coder1-exit-btn');
        if (exitBtn) {
            exitBtn.addEventListener('click', () => {
                // Stop sleep timer if active
                if (sleepTimerInterval) {
                    clearInterval(sleepTimerInterval);
                    sleepTimerInterval = null;
                    sleepStartTime = null;
                }
                overlay.remove();
            });
        }
        
        // Start sleep timer if sleep mode
        if (type === 'sleep-mode') {
            startSleepTimer();
        }
        
        // Add escape key handler
        const escapeHandler = (e) => {
            if (e.key === 'Escape') {
                overlay.remove();
                document.removeEventListener('keydown', escapeHandler);
            }
        };
        document.addEventListener('keydown', escapeHandler);
    }
    
    // Make showSpecialView globally available
    window.showSpecialView = showSpecialView;
    
    // Add Coder1 styles
    function addCoder1Styles() {
        // Check if unified CSS is already loaded
        if (document.getElementById('coder1-special-views-unified-css')) return;
        
        // Create link to external CSS
        const link = document.createElement('link');
        link.id = 'coder1-special-views-unified-css';
        link.rel = 'stylesheet';
        link.href = './static/special-views-unified.css?v=4';
        document.head.appendChild(link);
        
        // Keep Font Awesome if not already loaded
        if (!document.querySelector('link[href*="font-awesome"]')) {
            const faLink = document.createElement('link');
            faLink.rel = 'stylesheet';
            faLink.href = 'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css';
            document.head.appendChild(faLink);
        }
    }
    
    // JavaScript functions for infinite loop interface
    window.handleSpecTypeChange = function(radio) {
        const templateSection = document.getElementById('templateSpecSection');
        const customSection = document.getElementById('customSpecSection');
        
        if (radio.value === 'template') {
            templateSection.style.display = 'block';
            customSection.style.display = 'none';
        } else {
            templateSection.style.display = 'none';
            customSection.style.display = 'block';
        }
    };
    
    window.selectTemplate = function(templateId) {
        // Remove previous selections
        document.querySelectorAll('.template-card').forEach(card => {
            card.classList.remove('selected');
        });
        
        // Add selection to clicked template
        const selectedCard = document.querySelector(`[data-template-id="${templateId}"]`);
        if (selectedCard) {
            selectedCard.classList.add('selected');
        }
        
        // Store selection
        window.selectedTemplate = templateId;
    };
    
    window.startInfiniteLoop = function() {
        const specType = document.querySelector('input[name="specType"]:checked').value;
        const iterationCount = document.getElementById('iterationCount').value;
        const outputDirectory = document.getElementById('outputDirectory').value;
        const iterationDelay = document.getElementById('iterationDelay').value;
        
        let specification = '';
        if (specType === 'template') {
            const template = infiniteLoopTemplates.find(t => t.id === window.selectedTemplate);
            if (!template) {
                alert('Please select a template first');
                return;
            }
            specification = `Template: ${template.name} - ${template.description}`;
        } else {
            specification = document.getElementById('customSpec').value;
            if (!specification.trim()) {
                alert('Please enter a custom specification');
                return;
            }
        }
        
        console.log('Starting Infinite Loop with:', {
            specification,
            iterationCount,
            outputDirectory,
            iterationDelay
        });
        
        // Show running view
        const overlay = document.querySelector('.coder1-special-view-overlay');
        if (overlay) {
            overlay.innerHTML = createRunningInfiniteLoopView();
            
            // Re-add exit functionality
            const exitBtn = overlay.querySelector('.coder1-exit-btn');
            if (exitBtn) {
                exitBtn.addEventListener('click', () => {
                    overlay.remove();
                });
            }
        }
    };
    
    window.stopInfiniteLoop = function() {
        console.log('Stopping Infinite Loop...');
        // Close the overlay
        const overlay = document.querySelector('.coder1-special-view-overlay');
        if (overlay) {
            overlay.remove();
        }
    };
    
    // Initialize styles when script loads
    addCoder1Styles();
    
    // Sleep mode timer functionality
    let sleepStartTime = null;
    let sleepTimerInterval = null;
    
    function startSleepTimer() {
        sleepStartTime = Date.now();
        sleepTimerInterval = setInterval(updateSleepTimer, 1000);
    }
    
    function updateSleepTimer() {
        if (!sleepStartTime) return;
        
        const elapsed = Math.floor((Date.now() - sleepStartTime) / 1000);
        const minutes = Math.floor(elapsed / 60);
        const seconds = elapsed % 60;
        
        const timerElement = document.getElementById('sleepTimer');
        if (timerElement) {
            timerElement.textContent = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
        }
    }
    
    window.wakeUpSystem = function() {
        if (sleepTimerInterval) {
            clearInterval(sleepTimerInterval);
            sleepTimerInterval = null;
        }
        sleepStartTime = null;
        
        // Close the overlay
        const overlay = document.querySelector('.coder1-special-view-overlay');
        if (overlay) {
            overlay.remove();
        }
    };
    
    // Override terminal buttons to use our special views
    function overrideTerminalButtons() {
        console.log('🎨 Coder1 Special Views - Overriding terminal buttons...');
        
        // Look for buttons by their title attributes
        const buttonMappings = {
            'Supervision': 'supervision',
            'Sleep Mode': 'sleep-mode',
            'Infinite': 'infinite-loop',
            'Parallel Agents': 'parallel-agents'
        };
        
        Object.entries(buttonMappings).forEach(([title, viewType]) => {
            const buttons = document.querySelectorAll(`button[title*="${title}"]`);
            buttons.forEach(button => {
                // Skip if already overridden
                if (button.hasAttribute('data-coder1-override')) return;
                
                // Mark as overridden
                button.setAttribute('data-coder1-override', 'true');
                
                // Replace click handler
                button.onclick = (e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    showSpecialView(viewType);
                    return false;
                };
                
                console.log(`✅ Overrode button: ${title}`);
            });
        });
    }
    
    // Run override when DOM is ready and periodically
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', overrideTerminalButtons);
    } else {
        overrideTerminalButtons();
    }
    
    // Check periodically for new buttons
    setInterval(overrideTerminalButtons, 1000);
    
    console.log('✅ Coder1 Special Views V2 initialized - WITH INLINE STYLES');
    
    // Test immediately
    setTimeout(() => {
        console.log('🔍 Testing special views - buttons found:', document.querySelectorAll('button[title*="Sleep"]').length);
    }, 2000);
})();