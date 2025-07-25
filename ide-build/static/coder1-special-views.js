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
        
        // Add animated background orbs like PRD generator
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
                            <div class="metric-value">12:34</div>
                            <div class="metric-label">Sleep Duration</div>
                        </div>
                    </div>
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
            description: 'Create reusable UI component library with consistent styling and behavior',
            features: ['Form elements', 'Navigation components', 'Modal dialogs', 'Button variants'],
            outputType: 'Component library'
        },
        {
            id: 'api-integration',
            name: 'API Integration',
            description: 'Build API client code, data fetching hooks, and service layer implementations',
            features: ['HTTP clients', 'Data fetching', 'Error handling', 'Type definitions'],
            outputType: 'Service modules'
        },
        {
            id: 'landing-page',
            name: 'Landing Page',
            description: 'Generate modern landing page sections with hero, features, testimonials, and CTA',
            features: ['Hero sections', 'Feature grids', 'Testimonials', 'Call-to-action'],
            outputType: 'Page components'
        },
        {
            id: 'utility-functions',
            name: 'Utility Functions',
            description: 'Create helper functions, formatters, validators, and common utility code',
            features: ['Data formatting', 'Validation logic', 'Helper functions', 'Type utilities'],
            outputType: 'Utility modules'
        }
    ];

    // Infinite Loop View - Interactive with Templates (restored original functionality)
    function createInfiniteLoopView() {
        // Check if there's an active session
        const hasActiveSession = false; // This would be determined by checking session state
        
        if (hasActiveSession) {
            // Show running state
            return createRunningInfiniteLoopView();
        } else {
            // Show setup interface
            return createInfiniteLoopSetupView();
        }
    }
    
    // Setup interface for infinite loop (restored original)
    function createInfiniteLoopSetupView() {
        const content = `
            <div class="coder1-loop-setup">
                <div class="loop-intro">
                    <p>Configure your infinite generation loop. Choose a template or create a custom specification.</p>
                </div>
                
                <div class="specification-section">
                    <h3>Specification Type</h3>
                    <div class="spec-type-selector">
                        <label class="spec-option">
                            <input type="radio" name="specType" value="template" checked onchange="handleSpecTypeChange(this)">
                            <span class="radio-custom"></span>
                            Use Template
                        </label>
                        <label class="spec-option">
                            <input type="radio" name="specType" value="custom" onchange="handleSpecTypeChange(this)">
                            <span class="radio-custom"></span>
                            Custom Spec
                        </label>
                    </div>
                    
                    <div id="templateSpecSection" class="template-spec-section">
                        <label for="infiniteTemplateSelect">Select Template:</label>
                        <div class="template-grid">
                            ${infiniteLoopTemplates.map(template => `
                                <div class="template-card" onclick="selectInfiniteTemplate('${template.id}')">
                                    <h4>${template.name}</h4>
                                    <p>${template.description}</p>
                                    <div class="template-features">
                                        ${template.features.map(feature => 
                                            `<span class="feature-tag">${feature}</span>`
                                        ).join('')}
                                    </div>
                                    <div class="template-output">
                                        <i class="fas fa-arrow-right"></i>
                                        <span>${template.outputType}</span>
                                    </div>
                                </div>
                            `).join('')}
                        </div>
                    </div>
                    
                    <div id="customSpecSection" class="custom-spec-section" style="display: none;">
                        <label for="customInfiniteSpec">Enter Your Custom Specification:</label>
                        <textarea id="customInfiniteSpec" class="custom-spec-input" rows="6" 
                                  placeholder="Describe what you want the infinite loop to generate...&#10;&#10;Example:&#10;- Generate React hooks for data fetching&#10;- Create utility functions for date formatting&#10;- Build responsive card components"></textarea>
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
        
        return createGlassContainer('⚡ Parallel Agents', content);
    }
    
    // Show special view
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
        
        // Add styles
        addCoder1Styles();
        
        // Add exit functionality
        const exitBtn = overlay.querySelector('.coder1-exit-btn');
        if (exitBtn) {
            exitBtn.onclick = () => overlay.remove();
        }
        
        // Close on overlay click
        overlay.onclick = (e) => {
            if (e.target === overlay) overlay.remove();
        };
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
        link.href = './static/special-views-unified.css?v=1';
        document.head.appendChild(link);
        
        // Keep Font Awesome if not already loaded
        if (!document.querySelector('link[href*="font-awesome"]')) {
            const faLink = document.createElement('link');
            faLink.rel = 'stylesheet';
            faLink.href = 'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css';
            document.head.appendChild(faLink);
        }
    }
            /* Coder1 Special Views Styles */
            
            /* Animated Background (from PRD generator) */
            .animated-background {
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                z-index: -1;
                overflow: hidden;
            }
            
            .gradient-orb {
                position: absolute;
                border-radius: 50%;
                filter: blur(100px);
                opacity: 0.6;
                animation: float 20s infinite ease-in-out;
            }
            
            .orb-1 {
                width: 600px;
                height: 600px;
                background: linear-gradient(135deg, ${DESIGN_SYSTEM.colors.accentPrimary}, #6366f1);
                top: -200px;
                left: -200px;
                animation-delay: 0s;
            }
            
            .orb-2 {
                width: 500px;
                height: 500px;
                background: linear-gradient(135deg, ${DESIGN_SYSTEM.colors.accentSecondary}, #06b6d4);
                bottom: -200px;
                right: -200px;
                animation-delay: 7s;
            }
            
            .orb-3 {
                width: 400px;
                height: 400px;
                background: linear-gradient(135deg, #f59e0b, ${DESIGN_SYSTEM.colors.accentDanger});
                top: 50%;
                left: 50%;
                transform: translate(-50%, -50%);
                animation-delay: 14s;
            }
            
            @keyframes float {
                0%, 100% { transform: translateY(0) translateX(0) scale(1); }
                25% { transform: translateY(-50px) translateX(50px) scale(1.1); }
                50% { transform: translateY(50px) translateX(-50px) scale(0.9); }
                75% { transform: translateY(-30px) translateX(-30px) scale(1.05); }
            }
            
            /* Container */
            .coder1-container {
                padding: 40px;
                max-width: 1200px;
                margin: 0 auto;
                min-height: 100vh;
                display: flex;
                align-items: center;
                justify-content: center;
            }
            
            /* Glass Panel */
            .coder1-glass-panel {
                background: ${DESIGN_SYSTEM.colors.glassBg};
                backdrop-filter: blur(20px);
                -webkit-backdrop-filter: blur(20px);
                border: 1px solid ${DESIGN_SYSTEM.colors.glassBorder};
                box-shadow: 0 8px 32px 0 rgba(0, 0, 0, 0.37);
                border-radius: 16px;
                width: 100%;
                max-width: 900px;
                overflow: hidden;
            }
            
            /* Panel Header */
            .coder1-panel-header {
                padding: 24px 32px;
                border-bottom: 1px solid ${DESIGN_SYSTEM.colors.glassBorder};
                display: flex;
                justify-content: space-between;
                align-items: center;
            }
            
            .coder1-panel-header h2 {
                font-size: 1.5rem;
                font-weight: 600;
                margin: 0;
                color: ${DESIGN_SYSTEM.colors.textPrimary};
            }
            
            .coder1-exit-btn {
                background: transparent;
                border: 1px solid ${DESIGN_SYSTEM.colors.glassBorder};
                color: ${DESIGN_SYSTEM.colors.textSecondary};
                padding: 8px 12px;
                border-radius: 8px;
                cursor: pointer;
                transition: all 0.2s;
                font-size: 14px;
            }
            
            .coder1-exit-btn:hover {
                background: ${DESIGN_SYSTEM.colors.accentDanger};
                border-color: ${DESIGN_SYSTEM.colors.accentDanger};
                color: white;
            }
            
            /* Panel Content */
            .coder1-panel-content {
                padding: 32px;
            }
            
            /* Metrics Grid */
            .coder1-metrics-grid {
                display: grid;
                grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
                gap: 20px;
                margin-bottom: 32px;
            }
            
            .coder1-metric-card {
                background: rgba(255, 255, 255, 0.05);
                border: 1px solid ${DESIGN_SYSTEM.colors.glassBorder};
                border-radius: 12px;
                padding: 20px;
                display: flex;
                gap: 16px;
                align-items: flex-start;
            }
            
            .coder1-metric-card.compact {
                flex-direction: column;
                align-items: center;
                text-align: center;
                padding: 24px 16px;
            }
            
            .metric-icon {
                width: 40px;
                height: 40px;
                background: ${DESIGN_SYSTEM.colors.accentPrimary};
                border-radius: 10px;
                display: flex;
                align-items: center;
                justify-content: center;
                color: white;
                font-size: 18px;
                flex-shrink: 0;
            }
            
            .metric-info {
                flex: 1;
            }
            
            .metric-info h3 {
                font-size: 1rem;
                font-weight: 500;
                margin: 0 0 8px 0;
                color: ${DESIGN_SYSTEM.colors.textPrimary};
            }
            
            .metric-value {
                font-size: 1.25rem;
                font-weight: 600;
                color: ${DESIGN_SYSTEM.colors.accentPrimary};
                margin-bottom: 4px;
            }
            
            .metric-label {
                font-size: 0.875rem;
                color: ${DESIGN_SYSTEM.colors.textSecondary};
            }
            
            .metric-details {
                font-size: 0.875rem;
                color: ${DESIGN_SYSTEM.colors.textSecondary};
                line-height: 1.4;
            }
            
            /* Progress Bars */
            .progress-bar {
                width: 100%;
                height: 6px;
                background: rgba(255, 255, 255, 0.1);
                border-radius: 3px;
                overflow: hidden;
                margin: 8px 0;
            }
            
            .progress-fill {
                height: 100%;
                background: ${DESIGN_SYSTEM.colors.accentPrimary};
                border-radius: 3px;
                transition: width 0.3s ease;
            }
            
            /* Status Indicators */
            .status-indicator {
                display: flex;
                align-items: center;
                gap: 8px;
                font-size: 0.875rem;
                font-weight: 500;
            }
            
            .status-indicator.active {
                color: ${DESIGN_SYSTEM.colors.accentSecondary};
            }
            
            .status-indicator.running {
                color: ${DESIGN_SYSTEM.colors.accentPrimary};
            }
            
            .status-dot {
                width: 8px;
                height: 8px;
                border-radius: 50%;
                background: currentColor;
                animation: pulse 2s infinite;
            }
            
            @keyframes pulse {
                0%, 100% { opacity: 1; }
                50% { opacity: 0.5; }
            }
            
            /* Activity/Terminal Panels */
            .coder1-activity-panel,
            .coder1-terminal-panel,
            .coder1-communication-panel {
                background: rgba(0, 0, 0, 0.2);
                border: 1px solid ${DESIGN_SYSTEM.colors.glassBorder};
                border-radius: 12px;
                padding: 20px;
                margin-top: 24px;
            }
            
            .coder1-activity-panel h3,
            .coder1-terminal-panel h3,
            .coder1-communication-panel h3 {
                font-size: 1rem;
                font-weight: 500;
                margin-bottom: 16px;
                color: ${DESIGN_SYSTEM.colors.textPrimary};
            }
            
            .activity-log,
            .terminal-output {
                font-family: 'Monaco', monospace;
                font-size: 0.875rem;
                line-height: 1.6;
            }
            
            .activity-item,
            .terminal-line {
                display: flex;
                gap: 12px;
                margin-bottom: 8px;
                color: ${DESIGN_SYSTEM.colors.textSecondary};
            }
            
            .activity-time {
                color: ${DESIGN_SYSTEM.colors.accentPrimary};
                font-weight: 500;
                min-width: 60px;
            }
            
            .terminal-line.success {
                color: ${DESIGN_SYSTEM.colors.accentSecondary};
            }
            
            .terminal-line.warning {
                color: #f59e0b;
            }
            
            /* Sleep Mode Specific */
            .coder1-sleep-center {
                text-align: center;
                padding: 40px 0;
            }
            
            .sleep-icon-container {
                position: relative;
                display: inline-block;
                margin-bottom: 24px;
            }
            
            .sleep-icon {
                font-size: 4rem;
                color: ${DESIGN_SYSTEM.colors.accentPrimary};
            }
            
            .sleep-pulse {
                position: absolute;
                top: 50%;
                left: 50%;
                transform: translate(-50%, -50%);
                width: 100px;
                height: 100px;
                border-radius: 50%;
                background: ${DESIGN_SYSTEM.colors.accentPrimary};
                opacity: 0.2;
                animation: sleep-pulse 3s infinite;
            }
            
            @keyframes sleep-pulse {
                0% { transform: translate(-50%, -50%) scale(1); opacity: 0.2; }
                50% { transform: translate(-50%, -50%) scale(1.2); opacity: 0.1; }
                100% { transform: translate(-50%, -50%) scale(1); opacity: 0.2; }
            }
            
            .sleep-metrics {
                margin-top: 32px;
            }
            
            /* Infinite Loop Specific */
            .coder1-loop-header {
                margin-bottom: 32px;
            }
            
            .loop-status-card {
                background: rgba(255, 255, 255, 0.05);
                border: 1px solid ${DESIGN_SYSTEM.colors.glassBorder};
                border-radius: 12px;
                padding: 24px;
                display: flex;
                justify-content: space-between;
                align-items: center;
            }
            
            .loop-stats {
                display: flex;
                gap: 32px;
            }
            
            .stat-item {
                text-align: center;
            }
            
            .stat-value {
                display: block;
                font-size: 1.5rem;
                font-weight: 600;
                color: ${DESIGN_SYSTEM.colors.accentPrimary};
            }
            
            .stat-label {
                font-size: 0.875rem;
                color: ${DESIGN_SYSTEM.colors.textSecondary};
            }
            
            /* Parallel Agents Specific */
            .coder1-agents-grid {
                grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
            }
            
            .coder1-agent-card {
                background: rgba(255, 255, 255, 0.05);
                border: 1px solid ${DESIGN_SYSTEM.colors.glassBorder};
                border-radius: 12px;
                padding: 20px;
            }
            
            .agent-header {
                display: flex;
                align-items: center;
                gap: 12px;
                margin-bottom: 16px;
            }
            
            .agent-status {
                width: 10px;
                height: 10px;
                border-radius: 50%;
                animation: pulse 2s infinite;
            }
            
            .agent-status.active {
                background: ${DESIGN_SYSTEM.colors.accentSecondary};
            }
            
            .agent-status.working {
                background: #f59e0b;
            }
            
            .agent-header h3 {
                font-size: 1rem;
                font-weight: 500;
                margin: 0;
                color: ${DESIGN_SYSTEM.colors.textPrimary};
            }
            
            .agent-task {
                font-size: 0.875rem;
                color: ${DESIGN_SYSTEM.colors.textSecondary};
                margin-bottom: 12px;
            }
            
            .agent-progress {
                display: flex;
                align-items: center;
                gap: 12px;
                margin-bottom: 8px;
            }
            
            .agent-progress .progress-bar {
                flex: 1;
                margin: 0;
            }
            
            .agent-progress span {
                font-size: 0.875rem;
                font-weight: 500;
                color: ${DESIGN_SYSTEM.colors.accentPrimary};
                min-width: 35px;
            }
            
            .agent-meta {
                font-size: 0.75rem;
                color: ${DESIGN_SYSTEM.colors.textSecondary};
            }
            
            /* Communication Log */
            .comm-log {
                font-size: 0.875rem;
            }
            
            .comm-item {
                display: flex;
                gap: 12px;
                margin-bottom: 12px;
                padding: 12px;
                background: rgba(255, 255, 255, 0.05);
                border-radius: 8px;
            }
            
            .comm-from, .comm-to {
                font-weight: 500;
                color: ${DESIGN_SYSTEM.colors.accentPrimary};
                min-width: 50px;
            }
            
            .comm-message {
                color: ${DESIGN_SYSTEM.colors.textSecondary};
                flex: 1;
            }
            
            /* Infinite Loop Setup Styles */
            .coder1-loop-setup {
                max-width: 800px;
                margin: 0 auto;
            }
            
            .loop-intro {
                text-align: center;
                margin-bottom: 32px;
                padding: 24px;
                background: rgba(255, 255, 255, 0.05);
                border-radius: 12px;
                border: 1px solid ${DESIGN_SYSTEM.colors.glassBorder};
            }
            
            .loop-intro p {
                color: ${DESIGN_SYSTEM.colors.textSecondary};
                margin: 0;
                font-size: 1rem;
                line-height: 1.6;
            }
            
            .specification-section {
                margin-bottom: 32px;
            }
            
            .specification-section h3 {
                font-size: 1.25rem;
                font-weight: 600;
                margin-bottom: 16px;
                color: ${DESIGN_SYSTEM.colors.textPrimary};
            }
            
            .spec-type-selector {
                display: flex;
                gap: 24px;
                margin-bottom: 24px;
            }
            
            .spec-option {
                display: flex;
                align-items: center;
                gap: 8px;
                cursor: pointer;
                font-size: 0.9rem;
                color: ${DESIGN_SYSTEM.colors.textSecondary};
            }
            
            .spec-option input[type="radio"] {
                display: none;
            }
            
            .radio-custom {
                width: 16px;
                height: 16px;
                border: 2px solid ${DESIGN_SYSTEM.colors.glassBorder};
                border-radius: 50%;
                position: relative;
                transition: all 0.2s;
            }
            
            .spec-option input[type="radio"]:checked + .radio-custom {
                border-color: ${DESIGN_SYSTEM.colors.accentPrimary};
            }
            
            .spec-option input[type="radio"]:checked + .radio-custom::after {
                content: '';
                position: absolute;
                top: 50%;
                left: 50%;
                transform: translate(-50%, -50%);
                width: 8px;
                height: 8px;
                background: ${DESIGN_SYSTEM.colors.accentPrimary};
                border-radius: 50%;
            }
            
            .template-spec-section label {
                display: block;
                margin-bottom: 16px;
                font-weight: 500;
                color: ${DESIGN_SYSTEM.colors.textPrimary};
            }
            
            .template-grid {
                display: grid;
                grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
                gap: 16px;
                margin-top: 16px;
            }
            
            .template-card {
                background: rgba(255, 255, 255, 0.05);
                border: 1px solid ${DESIGN_SYSTEM.colors.glassBorder};
                border-radius: 12px;
                padding: 20px;
                cursor: pointer;
                transition: all 0.2s;
                position: relative;
            }
            
            .template-card:hover {
                border-color: ${DESIGN_SYSTEM.colors.accentPrimary};
                background: rgba(139, 92, 246, 0.1);
            }
            
            .template-card.selected {
                border-color: ${DESIGN_SYSTEM.colors.accentPrimary};
                background: rgba(139, 92, 246, 0.15);
                box-shadow: 0 0 0 2px rgba(139, 92, 246, 0.3);
            }
            
            .template-card h4 {
                font-size: 1.1rem;
                font-weight: 600;
                margin: 0 0 8px 0;
                color: ${DESIGN_SYSTEM.colors.textPrimary};
            }
            
            .template-card p {
                font-size: 0.875rem;
                color: ${DESIGN_SYSTEM.colors.textSecondary};
                margin: 0 0 16px 0;
                line-height: 1.5;
            }
            
            .template-features {
                display: flex;
                flex-wrap: wrap;
                gap: 6px;
                margin-bottom: 16px;
            }
            
            .feature-tag {
                background: rgba(139, 92, 246, 0.2);
                color: ${DESIGN_SYSTEM.colors.accentPrimary};
                padding: 4px 8px;
                border-radius: 6px;
                font-size: 0.75rem;
                font-weight: 500;
            }
            
            .template-output {
                display: flex;
                align-items: center;
                gap: 8px;
                font-size: 0.875rem;
                color: ${DESIGN_SYSTEM.colors.textSecondary};
                margin-top: 12px;
                padding-top: 12px;
                border-top: 1px solid ${DESIGN_SYSTEM.colors.glassBorder};
            }
            
            .template-output i {
                color: ${DESIGN_SYSTEM.colors.accentPrimary};
            }
            
            .custom-spec-section {
                margin-top: 24px;
            }
            
            .custom-spec-section label {
                display: block;
                margin-bottom: 12px;
                font-weight: 500;
                color: ${DESIGN_SYSTEM.colors.textPrimary};
            }
            
            .custom-spec-input {
                width: 100%;
                background: rgba(0, 0, 0, 0.3);
                border: 1px solid ${DESIGN_SYSTEM.colors.glassBorder};
                border-radius: 8px;
                padding: 12px;
                color: ${DESIGN_SYSTEM.colors.textPrimary};
                font-family: ${DESIGN_SYSTEM.fonts.primary};
                font-size: 0.9rem;
                line-height: 1.5;
                resize: vertical;
                min-height: 120px;
            }
            
            .custom-spec-input:focus {
                outline: none;
                border-color: ${DESIGN_SYSTEM.colors.accentPrimary};
                box-shadow: 0 0 0 2px rgba(139, 92, 246, 0.2);
            }
            
            .loop-settings {
                margin-bottom: 32px;
            }
            
            .loop-settings h3 {
                font-size: 1.25rem;
                font-weight: 600;
                margin-bottom: 16px;
                color: ${DESIGN_SYSTEM.colors.textPrimary};
            }
            
            .settings-grid {
                display: grid;
                grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
                gap: 20px;
            }
            
            .setting-item {
                display: flex;
                flex-direction: column;
                gap: 8px;
            }
            
            .setting-item label {
                font-weight: 500;
                color: ${DESIGN_SYSTEM.colors.textPrimary};
                font-size: 0.9rem;
            }
            
            .setting-item select,
            .setting-item input {
                background: rgba(0, 0, 0, 0.3);
                border: 1px solid ${DESIGN_SYSTEM.colors.glassBorder};
                border-radius: 8px;
                padding: 10px 12px;
                color: ${DESIGN_SYSTEM.colors.textPrimary};
                font-family: ${DESIGN_SYSTEM.fonts.primary};
                font-size: 0.9rem;
            }
            
            .setting-item select:focus,
            .setting-item input:focus {
                outline: none;
                border-color: ${DESIGN_SYSTEM.colors.accentPrimary};
                box-shadow: 0 0 0 2px rgba(139, 92, 246, 0.2);
            }
            
            .loop-info {
                margin-bottom: 32px;
            }
            
            .info-card {
                background: rgba(255, 255, 255, 0.05);
                border: 1px solid ${DESIGN_SYSTEM.colors.glassBorder};
                border-radius: 12px;
                padding: 20px;
            }
            
            .info-card h4 {
                font-size: 1rem;
                font-weight: 600;
                margin: 0 0 12px 0;
                color: ${DESIGN_SYSTEM.colors.textPrimary};
            }
            
            .info-card ul {
                margin: 0;
                padding-left: 20px;
                color: ${DESIGN_SYSTEM.colors.textSecondary};
                font-size: 0.875rem;
                line-height: 1.6;
            }
            
            .info-card li {
                margin-bottom: 4px;
            }
            
            .loop-actions {
                text-align: center;
                padding-top: 24px;
                border-top: 1px solid ${DESIGN_SYSTEM.colors.glassBorder};
            }
            
            .coder1-start-btn {
                background: ${DESIGN_SYSTEM.colors.accentPrimary};
                border: none;
                color: white;
                padding: 12px 32px;
                border-radius: 8px;
                font-size: 1rem;
                font-weight: 600;
                cursor: pointer;
                transition: all 0.2s;
                display: inline-flex;
                align-items: center;
                gap: 8px;
            }
            
            .coder1-start-btn:hover {
                background: #7c3aed;
                transform: translateY(-2px);
                box-shadow: 0 4px 12px rgba(139, 92, 246, 0.4);
            }
            
            .coder1-stop-btn {
                background: ${DESIGN_SYSTEM.colors.accentDanger};
                border: none;
                color: white;
                padding: 8px 16px;
                border-radius: 8px;
                font-size: 0.875rem;
                font-weight: 500;
                cursor: pointer;
                transition: all 0.2s;
                display: inline-flex;
                align-items: center;
                gap: 6px;
            }
            
            .coder1-stop-btn:hover {
                background: #dc2626;
                transform: translateY(-1px);
                box-shadow: 0 2px 8px rgba(239, 68, 68, 0.4);
            }

            /* Responsive */
            @media (max-width: 768px) {
                .coder1-container {
                    padding: 20px;
                }
                
                .coder1-panel-content {
                    padding: 20px;
                }
                
                .coder1-metrics-grid {
                    grid-template-columns: 1fr;
                }
                
                .template-grid {
                    grid-template-columns: 1fr;
                }
                
                .settings-grid {
                    grid-template-columns: 1fr;
                }
                
                .spec-type-selector {
                    flex-direction: column;
                    gap: 12px;
                }
            }
    
    // Override ONLY Infinite Loop button to use custom interface
    function overrideOriginalButtons() {
        console.log('🔄 Starting Infinite Loop button override...');
        
        // Function to override a button
        function overrideButton(button) {
            // Skip if already overridden
            if (button.hasAttribute('data-coder1-override')) return;
            
            const title = button.getAttribute('title') || button.textContent || '';
            
            // ONLY override Infinite Loop button
            if (title.includes('Infinite')) {
                console.log('Found Infinite Loop button:', title);
                
                // Mark as overridden
                button.setAttribute('data-coder1-override', 'true');
                
                // Remove all existing event listeners by cloning
                const newButton = button.cloneNode(true);
                button.parentNode.replaceChild(newButton, button);
                
                // Add our handler for Infinite Loop only
                newButton.onclick = (e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    e.stopImmediatePropagation();
                    console.log('Infinite Loop clicked - showing custom view');
                    showSpecialView('infinite-loop');
                    return false;
                };
                
                // Also override addEventListener to prevent React from re-adding handlers
                newButton.addEventListener = function(type, handler, options) {
                    if (type === 'click') {
                        console.log('Blocked React click handler on:', title);
                        return;
                    }
                    // Allow other event types
                    Element.prototype.addEventListener.call(this, type, handler, options);
                };
            }
        }
        
        // Check for buttons periodically
        setInterval(() => {
            const buttons = document.querySelectorAll('button[title*="Infinite"]');
            buttons.forEach(overrideButton);
        }, 500);
        
        // Also use MutationObserver for immediate detection
        const observer = new MutationObserver(() => {
            const buttons = document.querySelectorAll('button[title*="Infinite"]');
            buttons.forEach(overrideButton);
        });
        
        observer.observe(document.body, { childList: true, subtree: true });
    }
    
    // Apply Coder1 styling to original special view interfaces
    function applyOriginalInterfaceStyling() {
        // Add styles for original React interfaces
        if (document.getElementById('coder1-original-interface-styles')) return;
        
        const styles = document.createElement('style');
        styles.id = 'coder1-original-interface-styles';
        styles.textContent = `
            /* Style original special view modals/overlays */
            
            /* Animated background for enhanced modals */
            .coder1-animated-background {
                position: absolute;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                z-index: -1;
                overflow: hidden;
                pointer-events: none;
            }
            
            .coder1-animated-background .gradient-orb {
                position: absolute;
                border-radius: 50%;
                filter: blur(100px);
                opacity: 0.6;
                animation: float 20s infinite ease-in-out;
            }
            
            .coder1-animated-background .orb-1 {
                width: 600px;
                height: 600px;
                background: linear-gradient(135deg, ${DESIGN_SYSTEM.colors.accentPrimary}, #6366f1);
                top: -200px;
                left: -200px;
                animation-delay: 0s;
            }
            
            .coder1-animated-background .orb-2 {
                width: 500px;
                height: 500px;
                background: linear-gradient(135deg, ${DESIGN_SYSTEM.colors.accentSecondary}, #06b6d4);
                bottom: -200px;
                right: -200px;
                animation-delay: 7s;
            }
            
            .coder1-animated-background .orb-3 {
                width: 400px;
                height: 400px;
                background: linear-gradient(135deg, #f59e0b, ${DESIGN_SYSTEM.colors.accentDanger});
                top: 50%;
                left: 50%;
                transform: translate(-50%, -50%);
                animation-delay: 14s;
            }
            
            /* Enhanced modal styling */
            .coder1-enhanced-modal {
                /* Remove positioning changes that break layout */
            }
            
            /* Glassmorphism for content */
            .coder1-glassmorphism {
                background: ${DESIGN_SYSTEM.colors.glassBg} !important;
                backdrop-filter: blur(20px) !important;
                -webkit-backdrop-filter: blur(20px) !important;
                border: 1px solid ${DESIGN_SYSTEM.colors.glassBorder} !important;
                box-shadow: 0 8px 32px 0 rgba(0, 0, 0, 0.37) !important;
            }
            
            /* Target supervision, sleep mode, and parallel agents overlays */
            .supervision-overlay,
            .sleep-mode-overlay,
            .parallel-agents-overlay,
            [class*="supervision"][class*="modal"],
            [class*="sleep"][class*="modal"],
            [class*="parallel"][class*="modal"],
            [data-view-type="supervision"],
            [data-view-type="sleep-mode"],
            [data-view-type="parallel-agents"],
            .coder1-enhanced-modal {
                /* Use Inter font */
                font-family: ${DESIGN_SYSTEM.fonts.primary} !important;
                color: ${DESIGN_SYSTEM.colors.textPrimary} !important;
            }
            
            /* Style modal content containers */
            .supervision-content,
            .sleep-mode-content,
            .parallel-agents-content,
            [class*="supervision"] .modal-content,
            [class*="sleep"] .modal-content,
            [class*="parallel"] .modal-content {
                background: ${DESIGN_SYSTEM.colors.glassBg} !important;
                border: 1px solid ${DESIGN_SYSTEM.colors.glassBorder} !important;
                border-radius: 16px !important;
                box-shadow: 0 8px 32px 0 rgba(0, 0, 0, 0.37) !important;
                padding: 32px !important;
            }
            
            /* Style headers in original interfaces */
            .supervision-header,
            .sleep-mode-header,
            .parallel-agents-header,
            [class*="supervision"] h1,
            [class*="supervision"] h2,
            [class*="sleep"] h1,
            [class*="sleep"] h2,
            [class*="parallel"] h1,
            [class*="parallel"] h2 {
                font-family: ${DESIGN_SYSTEM.fonts.primary} !important;
                color: ${DESIGN_SYSTEM.colors.textPrimary} !important;
                font-weight: 600 !important;
                margin-bottom: 24px !important;
            }
            
            /* Style buttons in original interfaces */
            .supervision-btn,
            .sleep-mode-btn,
            .parallel-agents-btn,
            [class*="supervision"] button,
            [class*="sleep"] button,
            [class*="parallel"] button {
                background: ${DESIGN_SYSTEM.colors.accentPrimary} !important;
                border: none !important;
                color: white !important;
                padding: 12px 24px !important;
                border-radius: 8px !important;
                font-family: ${DESIGN_SYSTEM.fonts.primary} !important;
                font-weight: 500 !important;
                cursor: pointer !important;
                transition: all 0.2s !important;
            }
            
            /* Button hover states */
            [class*="supervision"] button:hover,
            [class*="sleep"] button:hover,
            [class*="parallel"] button:hover {
                background: #7c3aed !important;
                transform: translateY(-2px) !important;
                box-shadow: 0 4px 12px rgba(139, 92, 246, 0.4) !important;
            }
            
            /* Style cards/panels in original interfaces */
            .supervision-card,
            .sleep-mode-card,
            .parallel-agents-card,
            [class*="supervision"] .card,
            [class*="sleep"] .card,
            [class*="parallel"] .card,
            [class*="supervision"] .panel,
            [class*="sleep"] .panel,
            [class*="parallel"] .panel {
                background: rgba(255, 255, 255, 0.05) !important;
                border: 1px solid ${DESIGN_SYSTEM.colors.glassBorder} !important;
                border-radius: 12px !important;
                padding: 20px !important;
                margin-bottom: 16px !important;
            }
            
            /* Style input fields */
            [class*="supervision"] input,
            [class*="supervision"] textarea,
            [class*="supervision"] select,
            [class*="sleep"] input,
            [class*="sleep"] textarea,
            [class*="sleep"] select,
            [class*="parallel"] input,
            [class*="parallel"] textarea,
            [class*="parallel"] select {
                background: rgba(0, 0, 0, 0.3) !important;
                border: 1px solid ${DESIGN_SYSTEM.colors.glassBorder} !important;
                border-radius: 8px !important;
                padding: 10px 12px !important;
                color: ${DESIGN_SYSTEM.colors.textPrimary} !important;
                font-family: ${DESIGN_SYSTEM.fonts.primary} !important;
            }
            
            /* Focus states */
            [class*="supervision"] input:focus,
            [class*="supervision"] textarea:focus,
            [class*="supervision"] select:focus,
            [class*="sleep"] input:focus,
            [class*="sleep"] textarea:focus,
            [class*="sleep"] select:focus,
            [class*="parallel"] input:focus,
            [class*="parallel"] textarea:focus,
            [class*="parallel"] select:focus {
                outline: none !important;
                border-color: ${DESIGN_SYSTEM.colors.accentPrimary} !important;
                box-shadow: 0 0 0 2px rgba(139, 92, 246, 0.2) !important;
            }
            
            /* Text styling */
            [class*="supervision"] p,
            [class*="sleep"] p,
            [class*="parallel"] p {
                color: ${DESIGN_SYSTEM.colors.textSecondary} !important;
                line-height: 1.6 !important;
            }
            
            /* List styling */
            [class*="supervision"] ul,
            [class*="sleep"] ul,
            [class*="parallel"] ul {
                color: ${DESIGN_SYSTEM.colors.textSecondary} !important;
            }
            
            /* Progress bars */
            [class*="supervision"] .progress,
            [class*="sleep"] .progress,
            [class*="parallel"] .progress {
                background: rgba(255, 255, 255, 0.1) !important;
                border-radius: 4px !important;
                overflow: hidden !important;
            }
            
            [class*="supervision"] .progress-bar,
            [class*="sleep"] .progress-bar,
            [class*="parallel"] .progress-bar {
                background: ${DESIGN_SYSTEM.colors.accentPrimary} !important;
            }
            
            /* Close/exit buttons */
            .close-btn,
            .exit-btn,
            [class*="close"],
            [class*="exit"] {
                background: transparent !important;
                border: 1px solid ${DESIGN_SYSTEM.colors.glassBorder} !important;
                color: ${DESIGN_SYSTEM.colors.textSecondary} !important;
                padding: 8px 12px !important;
                border-radius: 8px !important;
            }
            
            .close-btn:hover,
            .exit-btn:hover,
            [class*="close"]:hover,
            [class*="exit"]:hover {
                background: ${DESIGN_SYSTEM.colors.accentDanger} !important;
                border-color: ${DESIGN_SYSTEM.colors.accentDanger} !important;
                color: white !important;
            }
            
            /* Specific styling for Parallel Agents Modal */
            #parallel-agents-modal,
            .parallel-modal-overlay {
                background: rgba(26, 26, 26, 0.95) !important;
                backdrop-filter: blur(20px) !important;
                -webkit-backdrop-filter: blur(20px) !important;
            }
            
            .parallel-modal-content {
                background: ${DESIGN_SYSTEM.colors.glassBg} !important;
                border: 1px solid ${DESIGN_SYSTEM.colors.glassBorder} !important;
                border-radius: 16px !important;
                box-shadow: 0 8px 32px 0 rgba(0, 0, 0, 0.37) !important;
                font-family: ${DESIGN_SYSTEM.fonts.primary} !important;
            }
            
            .parallel-modal-header {
                padding: 24px 32px !important;
                border-bottom: 1px solid ${DESIGN_SYSTEM.colors.glassBorder} !important;
            }
            
            .parallel-modal-header h2 {
                font-family: ${DESIGN_SYSTEM.fonts.primary} !important;
                color: ${DESIGN_SYSTEM.colors.textPrimary} !important;
                font-size: 1.5rem !important;
                font-weight: 600 !important;
            }
            
            .parallel-modal-body {
                padding: 32px !important;
                color: ${DESIGN_SYSTEM.colors.textPrimary} !important;
            }
            
            .parallel-modal-close {
                background: transparent !important;
                border: 1px solid ${DESIGN_SYSTEM.colors.glassBorder} !important;
                color: ${DESIGN_SYSTEM.colors.textSecondary} !important;
                width: 32px !important;
                height: 32px !important;
                border-radius: 8px !important;
                font-size: 20px !important;
                display: flex !important;
                align-items: center !important;
                justify-content: center !important;
            }
            
            .parallel-modal-close:hover {
                background: ${DESIGN_SYSTEM.colors.accentDanger} !important;
                border-color: ${DESIGN_SYSTEM.colors.accentDanger} !important;
                color: white !important;
            }
            
            /* Style template cards in parallel agents */
            .template-details,
            .template-info {
                background: rgba(255, 255, 255, 0.05) !important;
                border: 1px solid ${DESIGN_SYSTEM.colors.glassBorder} !important;
                border-radius: 12px !important;
                padding: 20px !important;
            }
            
            .agent-badge {
                background: rgba(139, 92, 246, 0.2) !important;
                color: ${DESIGN_SYSTEM.colors.accentPrimary} !important;
                padding: 6px 12px !important;
                border-radius: 6px !important;
                font-size: 0.875rem !important;
                font-weight: 500 !important;
            }
            
            .info-card {
                background: rgba(255, 255, 255, 0.05) !important;
                border: 1px solid ${DESIGN_SYSTEM.colors.glassBorder} !important;
                border-radius: 12px !important;
                padding: 20px !important;
            }
            
            .parallel-start-btn,
            .parallel-cancel-btn {
                font-family: ${DESIGN_SYSTEM.fonts.primary} !important;
                border-radius: 8px !important;
                padding: 12px 24px !important;
                font-weight: 500 !important;
                transition: all 0.2s !important;
            }
            
            .parallel-start-btn {
                background: ${DESIGN_SYSTEM.colors.accentPrimary} !important;
                border: none !important;
                color: white !important;
            }
            
            .parallel-start-btn:hover {
                background: #7c3aed !important;
                transform: translateY(-2px) !important;
                box-shadow: 0 4px 12px rgba(139, 92, 246, 0.4) !important;
            }
            
            .parallel-cancel-btn {
                background: transparent !important;
                border: 1px solid ${DESIGN_SYSTEM.colors.glassBorder} !important;
                color: ${DESIGN_SYSTEM.colors.textSecondary} !important;
            }
            
            .parallel-cancel-btn:hover {
                background: rgba(255, 255, 255, 0.1) !important;
                border-color: ${DESIGN_SYSTEM.colors.textSecondary} !important;
            }
            
            /* Radio buttons and dropdowns */
            .radio-option {
                font-family: ${DESIGN_SYSTEM.fonts.primary} !important;
                color: ${DESIGN_SYSTEM.colors.textSecondary} !important;
            }
            
            .template-dropdown {
                background: rgba(0, 0, 0, 0.3) !important;
                border: 1px solid ${DESIGN_SYSTEM.colors.glassBorder} !important;
                border-radius: 8px !important;
                padding: 10px 12px !important;
                color: ${DESIGN_SYSTEM.colors.textPrimary} !important;
                font-family: ${DESIGN_SYSTEM.fonts.primary} !important;
            }
            
            .custom-plan-input {
                background: rgba(0, 0, 0, 0.3) !important;
                border: 1px solid ${DESIGN_SYSTEM.colors.glassBorder} !important;
                border-radius: 8px !important;
                padding: 12px !important;
                color: ${DESIGN_SYSTEM.colors.textPrimary} !important;
                font-family: ${DESIGN_SYSTEM.fonts.primary} !important;
            }
        `;
        
        document.head.appendChild(styles);
        
        // Also run periodically to catch dynamically added elements
        setInterval(applyOriginalInterfaceStyling, 2000);
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
    
    window.selectInfiniteTemplate = function(templateId) {
        // Remove selection from other cards
        document.querySelectorAll('.template-card').forEach(card => {
            card.classList.remove('selected');
        });
        
        // Add selection to clicked card
        const selectedCard = document.querySelector(`[onclick="selectInfiniteTemplate('${templateId}')"]`);
        if (selectedCard) {
            selectedCard.classList.add('selected');
        }
        
        // Store selected template
        window.selectedInfiniteTemplate = templateId;
    };
    
    window.startInfiniteLoop = function() {
        const specType = document.querySelector('input[name="specType"]:checked')?.value;
        let specification = '';
        
        if (specType === 'template') {
            if (!window.selectedInfiniteTemplate) {
                alert('Please select a template first');
                return;
            }
            const template = infiniteLoopTemplates.find(t => t.id === window.selectedInfiniteTemplate);
            specification = template ? template.name : '';
        } else {
            specification = document.getElementById('customInfiniteSpec')?.value;
            if (!specification.trim()) {
                alert('Please enter a custom specification');
                return;
            }
        }
        
        const settings = {
            specification: specification,
            maxIterations: document.getElementById('iterationCount')?.value || 'infinite',
            outputDirectory: document.getElementById('outputDirectory')?.value || 'ai-generated',
            delay: document.getElementById('iterationDelay')?.value || '0'
        };
        
        console.log('Starting infinite loop with settings:', settings);
        
        // Here you would call the actual API to start the infinite loop
        // For now, just show a success message
        alert(`Starting infinite loop: ${specification}\nSettings: ${JSON.stringify(settings, null, 2)}`);
        
        // Close the modal
        const overlay = document.querySelector('.coder1-special-view-overlay');
        if (overlay) overlay.remove();
    };
    
    window.stopInfiniteLoop = function() {
        console.log('Stopping infinite loop...');
        alert('Infinite loop stopped');
        
        // Close the modal
        const overlay = document.querySelector('.coder1-special-view-overlay');
        if (overlay) overlay.remove();
    };
    
    // Inject Coder1 visual enhancements into original interfaces
    function injectCoder1Enhancements() {
        console.log('💉 Starting Coder1 enhancement injection...');
        
        // Watch for original interfaces to appear
        const observer = new MutationObserver((mutations) => {
            mutations.forEach(mutation => {
                mutation.addedNodes.forEach(node => {
                    if (node.nodeType === 1) { // Element node
                        // Check if this is a special view modal/overlay
                        const isSpecialView = 
                            node.classList?.contains('supervision-modal') ||
                            node.classList?.contains('sleep-mode-modal') ||
                            node.classList?.contains('parallel-agents-modal') ||
                            node.querySelector?.('[class*="supervision"]') ||
                            node.querySelector?.('[class*="sleep"]') ||
                            node.querySelector?.('[class*="parallel"]') ||
                            (node.textContent?.includes('Supervision Mode') && node.querySelector?.('button')) ||
                            (node.textContent?.includes('Sleep Mode') && node.querySelector?.('button')) ||
                            (node.textContent?.includes('Parallel Agents') && node.querySelector?.('button'));
                        
                        if (isSpecialView && !node.hasAttribute('data-coder1-enhanced')) {
                            console.log('Found special view interface, enhancing...');
                            node.setAttribute('data-coder1-enhanced', 'true');
                            
                            // Add animated background
                            const animatedBg = document.createElement('div');
                            animatedBg.className = 'coder1-animated-background';
                            animatedBg.innerHTML = `
                                <div class="gradient-orb orb-1"></div>
                                <div class="gradient-orb orb-2"></div>
                                <div class="gradient-orb orb-3"></div>
                            `;
                            
                            // Insert at the beginning of the modal
                            node.insertBefore(animatedBg, node.firstChild);
                            
                            // Add glassmorphism class to the modal content
                            const modalContent = node.querySelector('.modal-content, [class*="content"], [class*="panel"]');
                            if (modalContent) {
                                modalContent.classList.add('coder1-glassmorphism');
                            }
                            
                            // Add Coder1 styling class to the whole modal
                            node.classList.add('coder1-enhanced-modal');
                        }
                    }
                });
            });
        });
        
        observer.observe(document.body, {
            childList: true,
            subtree: true
        });
        
        // Also check periodically for interfaces that might have been missed
        setInterval(() => {
            const modals = document.querySelectorAll('[class*="modal"]:not([data-coder1-enhanced]), [class*="overlay"]:not([data-coder1-enhanced])');
            modals.forEach(modal => {
                if ((modal.textContent?.includes('Supervision') || 
                     modal.textContent?.includes('Sleep Mode') || 
                     modal.textContent?.includes('Parallel Agents')) &&
                    !modal.textContent?.includes('Infinite Loop')) {
                    
                    modal.setAttribute('data-coder1-enhanced', 'true');
                    
                    // Add animated background if not already present
                    if (!modal.querySelector('.coder1-animated-background')) {
                        const animatedBg = document.createElement('div');
                        animatedBg.className = 'coder1-animated-background';
                        animatedBg.innerHTML = `
                            <div class="gradient-orb orb-1"></div>
                            <div class="gradient-orb orb-2"></div>
                            <div class="gradient-orb orb-3"></div>
                        `;
                        modal.insertBefore(animatedBg, modal.firstChild);
                    }
                    
                    modal.classList.add('coder1-enhanced-modal');
                }
            });
        }, 1000);
    }

    // Initialize
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => {
            overrideOriginalButtons();
            applyOriginalInterfaceStyling();
            injectCoder1Enhancements();
        });
    } else {
        overrideOriginalButtons();
        applyOriginalInterfaceStyling();
        injectCoder1Enhancements();
    }
    
})();