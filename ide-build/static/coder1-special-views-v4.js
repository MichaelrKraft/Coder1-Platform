// Coder1 Special Views V4 - Full Functionality with Glassmorphism
(function() {
    'use strict';
    
    console.log('🚀 Loading Coder1 Special Views V4 - Full Interactive Functionality');
    
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
    
    // Parallel Agent Templates
    const parallelAgentTemplates = [
        {
            id: 'fullstack-web',
            name: 'Full-Stack Web App',
            description: 'Coordinate frontend, backend, and database agents to build complete web applications',
            agents: ['Frontend Developer', 'Backend Engineer', 'Database Architect'],
            icon: 'fas fa-layer-group'
        },
        {
            id: 'ai-feature',
            name: 'AI-Powered Feature',
            description: 'Multiple agents work together to integrate AI capabilities into your application',
            agents: ['AI Integration Specialist', 'API Developer', 'UI/UX Designer'],
            icon: 'fas fa-brain'
        },
        {
            id: 'component-library',
            name: 'Component Library',
            description: 'Build a comprehensive component library with multiple specialized agents',
            agents: ['Component Architect', 'Style System Designer', 'Documentation Writer'],
            icon: 'fas fa-cube'
        },
        {
            id: 'api-integration',
            name: 'API Integration Suite',
            description: 'Connect multiple third-party services with specialized integration agents',
            agents: ['API Integration Expert', 'Data Transformer', 'Error Handler'],
            icon: 'fas fa-plug'
        },
        {
            id: 'testing-qa',
            name: 'Testing & QA',
            description: 'Comprehensive testing strategy with multiple QA agents',
            agents: ['Unit Test Developer', 'Integration Tester', 'E2E Automation Engineer'],
            icon: 'fas fa-vial'
        }
    ];
    
    // Infinite Loop Templates
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
    
    // Create overlay with animated background
    function createCoder1Overlay() {
        // Create a container that will hold both backdrop and content
        const container = document.createElement('div');
        container.className = 'coder1-special-view-container';
        container.style.cssText = `
            position: fixed !important;
            top: 0 !important;
            left: 0 !important;
            right: 0 !important;
            bottom: 0 !important;
            width: 100vw !important;
            height: 100vh !important;
            z-index: 2147483647 !important;
            isolation: isolate !important;
            pointer-events: auto !important;
        `;
        
        // Create backdrop to block all interaction with React app
        const backdrop = document.createElement('div');
        backdrop.className = 'coder1-backdrop';
        backdrop.style.cssText = `
            position: absolute !important;
            top: 0 !important;
            left: 0 !important;
            right: 0 !important;
            bottom: 0 !important;
            width: 100% !important;
            height: 100% !important;
            background: #1a1a1a !important;
            z-index: 1 !important;
        `;
        
        // Create the actual overlay for content
        const overlay = document.createElement('div');
        overlay.className = 'coder1-special-view-overlay';
        overlay.style.cssText = `
            position: absolute !important;
            top: 0 !important;
            left: 0 !important;
            right: 0 !important;
            bottom: 0 !important;
            width: 100% !important;
            height: 100% !important;
            z-index: 2 !important;
            overflow: auto !important;
        `;
        
        // Add animated background orbs to overlay
        const bgHTML = `
            <div class="animated-background">
                <div class="gradient-orb orb-1"></div>
                <div class="gradient-orb orb-2"></div>
                <div class="gradient-orb orb-3"></div>
            </div>
        `;
        overlay.innerHTML = bgHTML;
        
        // Assemble the structure
        container.appendChild(backdrop);
        container.appendChild(overlay);
        
        return { container, overlay };
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
            
            <div class="coder1-supervision-info">
                <h4>About Supervision Mode</h4>
                <p>Supervision Mode provides real-time monitoring of all AI agents and system processes. Use this dashboard to:</p>
                <div class="supervision-features">
                    <div class="feature-item">
                        <i class="fas fa-chart-line"></i>
                        <div>
                            <strong>Monitor Performance</strong>
                            <span>Track efficiency metrics and response times to identify bottlenecks</span>
                        </div>
                    </div>
                    <div class="feature-item">
                        <i class="fas fa-tasks"></i>
                        <div>
                            <strong>Track Agent Activity</strong>
                            <span>See what each AI agent is working on in real-time</span>
                        </div>
                    </div>
                    <div class="feature-item">
                        <i class="fas fa-server"></i>
                        <div>
                            <strong>System Health</strong>
                            <span>Monitor CPU and memory usage to ensure optimal performance</span>
                        </div>
                    </div>
                </div>
                <p class="supervision-note">💡 <strong>Pro Tip:</strong> Keep this open in a separate window while coding to monitor AI assistant performance</p>
            </div>
        `;
        
        return createGlassContainer('👁️ Supervision Mode', content);
    }
    
    // Sleep Mode View - With Working Timer
    function createSleepModeView() {
        const content = `
            <div class="coder1-sleep-info-banner">
                <i class="fas fa-info-circle"></i>
                <div>
                    <h4>What is Sleep Mode?</h4>
                    <p>Sleep Mode temporarily pauses all AI agents and background processes to free up system resources. Use this when you need maximum performance for other tasks or want to conserve battery power.</p>
                </div>
            </div>
            
            <div class="coder1-sleep-center">
                <div class="sleep-icon-container">
                    <div class="sleep-pulse"></div>
                    <i class="fas fa-moon sleep-icon"></i>
                </div>
                <h3>System in Sleep Mode</h3>
                <p>All AI agents and background processes are temporarily suspended</p>
                
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
            
            <div class="coder1-sleep-effects">
                <h4>What's Currently Happening:</h4>
                <div class="effect-list">
                    <div class="effect-item">
                        <i class="fas fa-pause-circle"></i>
                        <span>All AI code generation agents are paused</span>
                    </div>
                    <div class="effect-item">
                        <i class="fas fa-battery-full"></i>
                        <span>CPU and memory usage reduced by ~78%</span>
                    </div>
                    <div class="effect-item">
                        <i class="fas fa-snowflake"></i>
                        <span>Background tasks and file watchers suspended</span>
                    </div>
                    <div class="effect-item">
                        <i class="fas fa-shield-alt"></i>
                        <span>Your work is saved and will resume exactly where you left off</span>
                    </div>
                </div>
                <p class="sleep-note">💡 <strong>Tip:</strong> Perfect for meetings, breaks, or when running resource-intensive applications</p>
            </div>
        `;
        
        return createGlassContainer('🌙 Sleep Mode', content);
    }
    
    // Infinite Loop View - Configuration state with full interactivity
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
                        <div class="template-card compact" data-template-id="${template.id}">
                            <div class="template-header" onclick="toggleTemplateDetails('${template.id}')">
                                <h4>${template.name}</h4>
                                <i class="fas fa-chevron-down template-toggle"></i>
                            </div>
                            <div class="template-details" id="details-${template.id}" style="display: none;">
                                <p>${template.description}</p>
                                <div class="template-features">
                                    ${template.features.map(feature => `<span class="feature-tag">${feature}</span>`).join('')}
                                </div>
                                <div class="template-output">
                                    <i class="fas fa-file-code"></i>
                                    <span>${template.outputType}</span>
                                </div>
                            </div>
                            <div class="template-select-area" onclick="selectTemplate('${template.id}')"></div>
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
        `;
        
        return createGlassContainer('♾️ Infinite Loop Configuration', content);
    }
    
    // Running state view for infinite loop
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
    
    // Parallel Agents Configuration View
    function createParallelAgentsView() {
        const content = `
            <div class="agents-config-section">
                <div class="config-header">
                    <h3>Configure Parallel Agents</h3>
                    <p>Set up multiple AI agents to work on your project simultaneously</p>
                </div>
                
                <!-- Side-by-side configuration boxes -->
                <div style="display: flex; gap: 20px; margin-bottom: 25px;">
                    <!-- Feature Configuration Box -->
                    <div style="flex: 1; padding: 20px; background: rgba(139, 92, 246, 0.1); border: 1px solid rgba(139, 92, 246, 0.3); border-radius: 12px;">
                        <h4 style="margin-top: 0; margin-bottom: 15px; font-size: 16px;">Feature Configuration</h4>
                        <label style="font-size: 14px; display: block; margin-bottom: 5px;">Feature Name:</label>
                        <input type="text" id="parallel-feature-name" class="glassmorphism-input" 
                               placeholder="e.g., ui-revamp, new-dashboard" 
                               style="width: 100%; margin-bottom: 15px; padding: 10px; font-size: 14px;">
                        
                        <label style="font-size: 14px; display: block; margin-bottom: 5px;">Number of Agents:</label>
                        <div class="agent-count-selector" style="display: flex; gap: 10px;">
                            <label style="flex: 1; text-align: center;">
                                <input type="radio" name="agentCount" value="3" checked>
                                <span style="display: block; margin-top: 5px;">3</span>
                            </label>
                            <label style="flex: 1; text-align: center;">
                                <input type="radio" name="agentCount" value="4">
                                <span style="display: block; margin-top: 5px;">4</span>
                            </label>
                            <label style="flex: 1; text-align: center;">
                                <input type="radio" name="agentCount" value="5">
                                <span style="display: block; margin-top: 5px;">5</span>
                            </label>
                        </div>
                    </div>
                    
                    <!-- Plan Selection Box -->
                    <div style="flex: 1; padding: 20px; background: rgba(16, 185, 129, 0.1); border: 1px solid rgba(16, 185, 129, 0.3); border-radius: 12px;">
                        <h4 style="margin-top: 0; margin-bottom: 15px; font-size: 16px;">Plan Selection</h4>
                        <div class="radio-group" style="display: flex; flex-direction: column; gap: 10px;">
                            <label class="radio-option" style="font-size: 14px;">
                                <input type="radio" name="agentPlanType" value="template" checked onchange="handleAgentPlanTypeChange(this)">
                                <span>Use Template</span>
                            </label>
                            <label class="radio-option" style="font-size: 14px;">
                                <input type="radio" name="agentPlanType" value="custom" onchange="handleAgentPlanTypeChange(this)">
                                <span>Custom Plan</span>
                            </label>
                        </div>
                        <p class="agent-count-note" style="margin-top: 10px; font-size: 12px; opacity: 0.8;">
                            Templates provide pre-configured agent teams
                        </p>
                    </div>
                </div>
                
                <div id="agentTemplateSection" class="template-section">
                    <h4>Select Template</h4>
                    <div class="agent-template-grid">
                        ${parallelAgentTemplates.map(template => `
                            <div class="agent-template-card" data-template-id="${template.id}" onclick="selectAgentTemplate('${template.id}')">
                                <div class="template-icon">
                                    <i class="${template.icon}"></i>
                                </div>
                                <h5>${template.name}</h5>
                                <p>${template.description}</p>
                                <div class="template-agents">
                                    ${template.agents.map(agent => `<span class="agent-tag">${agent}</span>`).join('')}
                                </div>
                            </div>
                        `).join('')}
                    </div>
                </div>
                
                <div id="agentCustomSection" class="custom-section" style="display: none;">
                    <h4>Custom Plan</h4>
                    <textarea id="customAgentPlan" class="custom-plan-input" rows="6" 
                              placeholder="Describe what you want the parallel agents to build. Be specific about the features, technologies, and requirements..."></textarea>
                </div>
                
                <div class="parallel-info-box" style="margin-top: 20px;">
                    <h4>🚀 How It Works</h4>
                    <ul>
                        <li>Each agent works in an isolated environment</li>
                        <li>Agents develop unique solutions to the same problem</li>
                        <li>Compare and merge the best implementations</li>
                        <li>Leverage AI creativity through parallel exploration</li>
                    </ul>
                </div>
                
                <div class="config-actions">
                    <button class="coder1-start-btn" onclick="startParallelAgents()">
                        <i class="fas fa-rocket"></i>
                        Launch Parallel Agents
                    </button>
                </div>
            </div>
        `;
        
        return createGlassContainer('🤖 Parallel Agents', content);
    }
    
    // Parallel Agents Running View - Shows active agents
    function createRunningParallelAgentsView() {
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
    
    // Note: We no longer need hideMainAppUI and restoreMainAppUI functions
    // since our overlay is now completely outside the React DOM tree
    
    // Main function to show special views
    function showSpecialView(type) {
        // Remove any existing container
        const existing = document.querySelector('.coder1-special-view-container');
        if (existing) existing.remove();
        
        // Set a global flag to prevent settings recreation
        window.CODER1_SPECIAL_VIEW_ACTIVE = true;
        
        // Hide the settings section immediately
        const settingsSection = document.querySelector('.settings-section');
        if (settingsSection) {
            settingsSection.style.display = 'none';
        }
        
        // Create the new overlay structure
        const { container, overlay } = createCoder1Overlay();
        
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
        
        // Append container to documentElement (html) instead of body to escape React's DOM
        document.documentElement.appendChild(container);
        
        // Ensure no interference from React
        container.addEventListener('click', (e) => {
            e.stopPropagation();
        }, true);
        
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
                container.remove();
                window.CODER1_SPECIAL_VIEW_ACTIVE = false;
                const settingsSection = document.querySelector('.settings-section');
                if (settingsSection) {
                    settingsSection.style.display = '';
                }
            });
        }
        
        // Start sleep timer if sleep mode
        if (type === 'sleep-mode') {
            startSleepTimer();
        }
        
        // Add escape key handler
        const escapeHandler = (e) => {
            if (e.key === 'Escape') {
                if (sleepTimerInterval) {
                    clearInterval(sleepTimerInterval);
                    sleepTimerInterval = null;
                    sleepStartTime = null;
                }
                container.remove();
                window.CODER1_SPECIAL_VIEW_ACTIVE = false;
                const settingsSection = document.querySelector('.settings-section');
                if (settingsSection) {
                    settingsSection.style.display = '';
                }
                document.removeEventListener('keydown', escapeHandler);
            }
        };
        document.addEventListener('keydown', escapeHandler);
    }
    
    // Make showSpecialView globally available
    window.showSpecialView = showSpecialView;
    
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
    
    window.toggleTemplateDetails = function(templateId) {
        const details = document.getElementById(`details-${templateId}`);
        const card = document.querySelector(`[data-template-id="${templateId}"]`);
        const toggle = card.querySelector('.template-toggle');
        
        if (details.style.display === 'none') {
            details.style.display = 'block';
            toggle.classList.remove('fa-chevron-down');
            toggle.classList.add('fa-chevron-up');
            card.classList.add('expanded');
        } else {
            details.style.display = 'none';
            toggle.classList.remove('fa-chevron-up');
            toggle.classList.add('fa-chevron-down');
            card.classList.remove('expanded');
        }
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
        const container = document.querySelector('.coder1-special-view-container');
        const overlay = container ? container.querySelector('.coder1-special-view-overlay') : null;
        if (overlay) {
            // Keep the animated background
            const animatedBg = overlay.querySelector('.animated-background');
            overlay.innerHTML = '';
            if (animatedBg) {
                overlay.appendChild(animatedBg);
            }
            overlay.innerHTML += createRunningInfiniteLoopView();
            
            // Re-add exit functionality
            const exitBtn = overlay.querySelector('.coder1-exit-btn');
            if (exitBtn) {
                exitBtn.addEventListener('click', () => {
                    container.remove();
                window.CODER1_SPECIAL_VIEW_ACTIVE = false;
                const settingsSection = document.querySelector('.settings-section');
                if (settingsSection) {
                    settingsSection.style.display = '';
                }
                });
            }
        }
    };
    
    window.stopInfiniteLoop = function() {
        console.log('Stopping Infinite Loop...');
        // Close the container
        const container = document.querySelector('.coder1-special-view-container');
        if (container) {
            container.remove();
        }
    };
    
    // Parallel Agents functions
    window.handleAgentPlanTypeChange = function(radio) {
        const templateSection = document.getElementById('agentTemplateSection');
        const customSection = document.getElementById('agentCustomSection');
        
        if (radio.value === 'template') {
            templateSection.style.display = 'block';
            customSection.style.display = 'none';
        } else {
            templateSection.style.display = 'none';
            customSection.style.display = 'block';
        }
    };
    
    window.selectAgentTemplate = function(templateId) {
        // Remove previous selections
        document.querySelectorAll('.agent-template-card').forEach(card => {
            card.classList.remove('selected');
        });
        
        // Add selection to clicked template
        const selectedCard = document.querySelector(`[data-template-id="${templateId}"]`);
        if (selectedCard) {
            selectedCard.classList.add('selected');
        }
        
        // Store selection
        window.selectedAgentTemplate = templateId;
    };
    
    window.startParallelAgents = function() {
        const planType = document.querySelector('input[name="agentPlanType"]:checked').value;
        const agentCount = document.querySelector('input[name="agentCount"]:checked').value;
        
        let plan = '';
        if (planType === 'template') {
            const template = parallelAgentTemplates.find(t => t.id === window.selectedAgentTemplate);
            if (!template) {
                alert('Please select a template first');
                return;
            }
            plan = `Template: ${template.name} - ${template.description}`;
        } else {
            plan = document.getElementById('customAgentPlan').value;
            if (!plan.trim()) {
                alert('Please enter a custom plan');
                return;
            }
        }
        
        console.log('Starting Parallel Agents with:', {
            plan,
            agentCount,
            template: window.selectedAgentTemplate
        });
        
        // Show running view
        const container = document.querySelector('.coder1-special-view-container');
        const overlay = container ? container.querySelector('.coder1-special-view-overlay') : null;
        if (overlay) {
            // Keep the animated background
            const animatedBg = overlay.querySelector('.animated-background');
            overlay.innerHTML = '';
            if (animatedBg) {
                overlay.appendChild(animatedBg);
            }
            overlay.innerHTML += createRunningParallelAgentsView();
            
            // Re-add exit functionality
            const exitBtn = overlay.querySelector('.coder1-exit-btn');
            if (exitBtn) {
                exitBtn.addEventListener('click', () => {
                    container.remove();
                window.CODER1_SPECIAL_VIEW_ACTIVE = false;
                const settingsSection = document.querySelector('.settings-section');
                if (settingsSection) {
                    settingsSection.style.display = '';
                }
                });
            }
        }
    };
    
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
        
        // Close the container
        const container = document.querySelector('.coder1-special-view-container');
        if (container) {
            container.remove();
        }
        
        console.log('System awakened!');
    };
    
    // Override terminal buttons to use our special views
    function overrideTerminalButtons() {
        console.log('🎨 Coder1 Special Views V4 - Overriding terminal buttons...');
        
        try {
            // Look for buttons by their title attributes
            const buttonMappings = {
                'Supervision': 'supervision',
                'Sleep Mode': 'sleep-mode',
                'Infinite': 'infinite-loop',
                'Parallel Agents': 'parallel-agents'
            };
            
            Object.entries(buttonMappings).forEach(([title, viewType]) => {
                const buttons = document.querySelectorAll(`button[title*="${title}"]`);
                console.log(`Found ${buttons.length} buttons for ${title}`);
                
                buttons.forEach(button => {
                    // Skip if already overridden
                    if (button.getAttribute('data-coder1-v4-override') === 'true') {
                        return;
                    }
                    
                    // Remove ALL existing event listeners by cloning the button
                    const newButton = button.cloneNode(true);
                    
                    // Mark as overridden
                    newButton.setAttribute('data-coder1-v4-override', 'true');
                    
                    // Add our handler with capture phase to intercept before React
                    newButton.addEventListener('click', (e) => {
                        console.log(`Button clicked: ${title}`);
                        e.preventDefault();
                        e.stopPropagation();
                        e.stopImmediatePropagation();
                        
                        try {
                            showSpecialView(viewType);
                        } catch (error) {
                            console.error(`Error showing ${viewType}:`, error);
                        }
                        
                        return false;
                    }, true);
                    
                    // Also set onclick for extra safety
                    newButton.onclick = (e) => {
                        console.log(`Button onclick: ${title}`);
                        e.preventDefault();
                        e.stopPropagation();
                        e.stopImmediatePropagation();
                        
                        try {
                            showSpecialView(viewType);
                        } catch (error) {
                            console.error(`Error showing ${viewType}:`, error);
                        }
                        
                        return false;
                    };
                    
                    // Replace the button
                    if (button.parentNode) {
                        button.parentNode.replaceChild(newButton, button);
                        console.log(`✅ V4 Force overrode button: ${title}`);
                    }
                });
            });
        } catch (error) {
            console.error('Error in overrideTerminalButtons:', error);
        }
    }
    
    // Run override when DOM is ready and periodically
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', overrideTerminalButtons);
    } else {
        overrideTerminalButtons();
    }
    
    // Check periodically for new buttons
    setInterval(overrideTerminalButtons, 1000);
    
    // Keep settings hidden while special view is active
    setInterval(() => {
        if (window.CODER1_SPECIAL_VIEW_ACTIVE) {
            const settingsSection = document.querySelector('.settings-section');
            if (settingsSection && settingsSection.style.display !== 'none') {
                settingsSection.style.display = 'none';
            }
        }
    }, 100);
    
    console.log('✅ Coder1 Special Views V4 initialized - Full functionality restored!');
})();