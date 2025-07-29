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
                        <button class="coder1-exit-btn" onclick="console.log('X button clicked!'); try { const container = document.querySelector('.coder1-special-view-container'); if(container) { container.remove(); window.CODER1_SPECIAL_VIEW_ACTIVE = false; const settings = document.querySelector('.settings-section'); if(settings) settings.style.display = ''; } } catch(e) { console.error('Exit error:', e); } return false;" style="cursor: pointer; pointer-events: auto; z-index: 99999; position: relative;">
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
    
    // IDE Settings View - API Configuration and Features
    function createIDESettingsView() {
        const content = `
            <div class="coder1-api-config-section">
                <div class="api-config-header">
                    <i class="fas fa-cloud"></i>
                    <div>
                        <h3>Claude API Configuration</h3>
                        <p>Configure your Claude API key to enable SuperClaude AI features and live code assistance.</p>
                    </div>
                </div>
                
                <div class="api-key-section">
                    <label for="claudeApiKey">Claude API Key:</label>
                    <div class="api-key-input-container">
                        <input type="password" id="claudeApiKey" class="glassmorphism-input" 
                               placeholder="sk-ant-api03-..." 
                               style="width: 100%; font-family: monospace; font-size: 14px;">
                        <button id="toggleApiKeyVisibility" class="visibility-toggle" title="Toggle visibility">
                            <i class="fas fa-eye"></i>
                        </button>
                    </div>
                </div>
                
                <div class="api-actions">
                    <button id="saveApiKeyBtn" class="coder1-btn save-btn">
                        <i class="fas fa-save"></i>
                        Save API Key
                    </button>
                    <button id="testConnectionBtn" class="coder1-btn test-btn">
                        <i class="fas fa-plug"></i>
                        Test Connection
                    </button>
                    <button id="clearApiKeyBtn" class="coder1-btn clear-btn">
                        <i class="fas fa-trash"></i>
                        Clear
                    </button>
                </div>
                
                <div class="api-help-section">
                    <div class="help-icon">
                        <i class="fas fa-info-circle"></i>
                    </div>
                    <div class="help-content">
                        <h4>📖 How to get your Claude API key:</h4>
                        <ol>
                            <li>Visit <a href="https://console.anthropic.com" target="_blank" rel="noopener">console.anthropic.com</a></li>
                            <li>Sign up or log in to your account</li>
                            <li>Navigate to API Keys section</li>
                            <li>Create a new API key</li>
                            <li>Copy and paste it above</li>
                        </ol>
                    </div>
                </div>
                
                <div class="connection-status">
                    <span class="status-label">Current Status:</span>
                    <div class="status-indicator" id="connectionStatus">
                        <div class="status-dot offline"></div>
                        <span>Not Connected</span>
                    </div>
                </div>
            </div>
            
            <div class="coder1-features-section">
                <div class="features-header">
                    <i class="fas fa-rocket"></i>
                    <h3>IDE Features</h3>
                </div>
                
                <div class="feature-cards">
                    <div class="feature-card">
                        <div class="feature-icon">
                            <i class="fas fa-brain"></i>
                        </div>
                        <div class="feature-info">
                            <h4>SuperClaude Commands:</h4>
                            <p>Use /analyze, /build, /test, /security commands with AI assistance</p>
                        </div>
                    </div>
                    
                    <div class="feature-card">
                        <div class="feature-icon">
                            <i class="fas fa-cube"></i>
                        </div>
                        <div class="feature-info">
                            <h4>ReactBits:</h4>
                            <p>Generate React components with /ui commands</p>
                        </div>
                    </div>
                    
                    <div class="feature-card">
                        <div class="feature-icon">
                            <i class="fas fa-terminal"></i>
                        </div>
                        <div class="feature-info">
                            <h4>Terminal Integration:</h4>
                            <p>Full Claude Code CLI integration coming soon</p>
                        </div>
                    </div>
                </div>
            </div>
        `;
        
        return createGlassContainer('⚙️ IDE Settings', content);
    }
    
    // Documentation View - Comprehensive IDE Guide
    function createDocumentationView() {
        const content = `
            <div class="coder1-documentation-wrapper">
                <div class="coder1-documentation-nav">
                <div class="nav-header">
                    <h3>🚀 Coder1 IDE Overview</h3>
                    <p>Your comprehensive guide to using Coder1 IDE's powerful AI-assisted development features.</p>
                </div>
                
                <div class="nav-sections">
                    <div class="nav-item active" data-section="overview">
                        <i class="fas fa-rocket"></i>
                        <span>Coder1 IDE Overview</span>
                    </div>
                    <div class="nav-item" data-section="features">
                        <i class="fas fa-star"></i>
                        <span>IDE Features Guide</span>
                    </div>
                    <div class="nav-item" data-section="superclaude">
                        <i class="fas fa-brain"></i>
                        <span>SuperClaude AI Assistant</span>
                    </div>
                    <div class="nav-item" data-section="reactbits">
                        <i class="fas fa-cube"></i>
                        <span>React Bits Generator</span>
                    </div>
                    <div class="nav-item" data-section="shortcuts">
                        <i class="fas fa-keyboard"></i>
                        <span>Keyboard Shortcuts</span>
                    </div>
                </div>
            </div>
            
            <div class="coder1-documentation-content">
                <div id="overviewSection" class="doc-section active">
                    <div class="welcome-banner">
                        <h2>Welcome to Coder1 IDE - your AI-powered development environment!</h2>
                    </div>
                    
                    <div class="key-features">
                        <h3>KEY FEATURES</h3>
                        <div class="feature-list">
                            <div class="feature-item">
                                <i class="fas fa-brain"></i>
                                <div>
                                    <strong>🤖 SuperClaude AI Assistant with 8 specialized commands</strong>
                                </div>
                            </div>
                            <div class="feature-item">
                                <i class="fas fa-cube"></i>
                                <div>
                                    <strong>⚛️ React Bits component generation</strong>
                                </div>
                            </div>
                            <div class="feature-item">
                                <i class="fas fa-paint-brush"></i>
                                <div>
                                    <strong>🎨 Visual Landing Page Builder</strong>
                                </div>
                            </div>
                            <div class="feature-item">
                                <i class="fas fa-terminal"></i>
                                <div>
                                    <strong>💻 Advanced terminal with autocomplete</strong>
                                </div>
                            </div>
                            <div class="feature-item">
                                <i class="fas fa-folder"></i>
                                <div>
                                    <strong>📁 Multi-tab file explorer</strong>
                                </div>
                            </div>
                            <div class="feature-item">
                                <i class="fas fa-eye"></i>
                                <div>
                                    <strong>👁️ Live preview panel</strong>
                                </div>
                            </div>
                            <div class="feature-item">
                                <i class="fas fa-keyboard"></i>
                                <div>
                                    <strong>⌨️ Comprehensive keyboard shortcuts</strong>
                                </div>
                            </div>
                        </div>
                    </div>
                    
                    <div class="getting-started">
                        <h3>GETTING STARTED</h3>
                        <div class="step-list">
                            <div class="step-item">
                                <span class="step-number">1</span>
                                <div>
                                    <strong>Use the File Explorer to navigate your project</strong>
                                    <p>Browse and open files in the left sidebar</p>
                                </div>
                            </div>
                            <div class="step-item">
                                <span class="step-number">2</span>
                                <div>
                                    <strong>Open files in the multi-tab editor</strong>
                                    <p>Click files to open them in tabs at the top</p>
                                </div>
                            </div>
                            <div class="step-item">
                                <span class="step-number">3</span>
                                <div>
                                    <strong>Use the Terminal for SuperClaude and React Bits commands</strong>
                                    <p>Access the powerful AI features via the bottom terminal</p>
                                </div>
                            </div>
                            <div class="step-item">
                                <span class="step-number">4</span>
                                <div>
                                    <strong>Preview your work in the Preview Panel</strong>
                                    <p>See live updates of your HTML, CSS, and JavaScript</p>
                                </div>
                            </div>
                            <div class="step-item">
                                <span class="step-number">5</span>
                                <div>
                                    <strong>Access all features via the menu bar or keyboard shortcuts</strong>
                                    <p>Use Cmd/Ctrl shortcuts for faster development</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                
                <div id="featuresSection" class="doc-section" style="display: none;">
                    <h2>IDE Features Guide</h2>
                    <p>Detailed guide to all IDE features coming soon...</p>
                </div>
                
                <div id="superclaudeSection" class="doc-section" style="display: none;">
                    <h2>SuperClaude AI Assistant</h2>
                    <p>Complete SuperClaude documentation coming soon...</p>
                </div>
                
                <div id="reactbitsSection" class="doc-section" style="display: none;">
                    <h2>React Bits Generator</h2>
                    <p>React Bits usage guide coming soon...</p>
                </div>
                
                <div id="shortcutsSection" class="doc-section" style="display: none;">
                    <h2>Keyboard Shortcuts</h2>
                    <p>Complete keyboard shortcuts reference coming soon...</p>
                </div>
            </div>
            </div>
        `;
        
        return createGlassContainer('📖 Documentation', content);
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
            case 'ide-settings':
                content = createIDESettingsView();
                break;
            case 'documentation':
                content = createDocumentationView();
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
        
        // Start sleep timer if sleep mode
        if (type === 'sleep-mode') {
            startSleepTimer();
        }
        
        // Set up handlers for IDE settings
        if (type === 'ide-settings') {
            setTimeout(() => {
                setupIDESettingsHandlers();
            }, 100);
        }
        
        // Set up handlers for documentation navigation
        if (type === 'documentation') {
            setTimeout(() => {
                setupDocumentationHandlers();
            }, 100);
        }
        
        // Define exit function for reuse and back button support
        function exitSpecialView() {
            console.log('Exiting special view');
            
            // Stop sleep timer if active
            if (typeof sleepTimerInterval !== 'undefined' && sleepTimerInterval) {
                clearInterval(sleepTimerInterval);
                sleepTimerInterval = null;
                sleepStartTime = null;
            }
            
            // Remove container
            container.remove();
            
            // Reset global flag
            window.CODER1_SPECIAL_VIEW_ACTIVE = false;
            
            // Show settings section again
            const settingsSection = document.querySelector('.settings-section');
            if (settingsSection) {
                settingsSection.style.display = '';
            }
            
            // Clean up back button handler
            if (container._backButtonHandler) {
                window.removeEventListener('popstate', container._backButtonHandler);
            }
        }
        
        // CRITICAL: Exit button setup must happen AFTER all view-specific handlers
        // to ensure the button element exists and isn't replaced by innerHTML operations
        const setupExitButton = () => {
            const exitBtn = overlay.querySelector('.coder1-exit-btn');
            console.log('Setting up exit button:', exitBtn);
            
            if (exitBtn) {
                // Clear any existing handlers
                exitBtn.onclick = null;
                if (exitBtn._exitHandler) {
                    exitBtn.removeEventListener('click', exitBtn._exitHandler);
                }
                
                // Add click handler
                const exitHandler = (e) => {
                    console.log('Exit button clicked!');
                    e.preventDefault();
                    e.stopPropagation();
                    exitSpecialView();
                    return false;
                };
                
                // Use capture phase to ensure we get the event first
                exitBtn.addEventListener('click', exitHandler, true);
                exitBtn.onclick = exitHandler; // Fallback
                exitBtn._exitHandler = exitHandler; // Store for cleanup
                
                // Make absolutely sure button is clickable
                exitBtn.style.pointerEvents = 'auto';
                exitBtn.style.zIndex = '99999';
                exitBtn.style.cursor = 'pointer';
                exitBtn.style.position = 'absolute';
                
                // Remove any conflicting styles
                exitBtn.style.userSelect = 'none';
                exitBtn.disabled = false;
                
                console.log('Exit button handler attached successfully');
            } else {
                console.error('Exit button not found in overlay!');
            }
        };
        
        // Call setup immediately and also after a delay to handle any async DOM updates
        setupExitButton();
        setTimeout(setupExitButton, 200);
        setTimeout(setupExitButton, 500);
        
        // Add browser back button support
        const backButtonHandler = (e) => {
            if (window.CODER1_SPECIAL_VIEW_ACTIVE) {
                e.preventDefault();
                exitSpecialView();
            }
        };
        
        window.addEventListener('popstate', backButtonHandler);
        
        // Push a new history state so back button works
        window.history.pushState({specialView: type}, '', '');
        
        // Store the back button handler for cleanup
        container._backButtonHandler = backButtonHandler;
        
        // Add escape key handler using the same exit function
        const escapeHandler = (e) => {
            if (e.key === 'Escape') {
                exitSpecialView();
                document.removeEventListener('keydown', escapeHandler);
            }
        };
        document.addEventListener('keydown', escapeHandler);
    }
    
    // Make showSpecialView globally available
    window.showSpecialView = showSpecialView;
    
    // Global exit function for inline onclick
    window.exitSpecialView = function() {
        console.log('Global exitSpecialView called');
        const container = document.querySelector('.coder1-special-view-container');
        if (container) {
            container.remove();
            window.CODER1_SPECIAL_VIEW_ACTIVE = false;
            const settingsSection = document.querySelector('.settings-section');
            if (settingsSection) {
                settingsSection.style.display = '';
            }
            // Handle browser history
            if (window.history.length > 1) {
                window.history.back();
            }
        }
    };
    
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
    
    // Documentation navigation functions
    window.showDocSection = function(sectionId) {
        console.log('showDocSection called with:', sectionId);
        
        // Find the special view container first
        const container = document.querySelector('.coder1-special-view-container');
        if (!container) {
            console.error('Special view container not found');
            return;
        }
        
        // Hide all sections within the container
        const sections = container.querySelectorAll('.doc-section');
        console.log('Found sections:', sections.length);
        sections.forEach(section => {
            section.style.display = 'none';
            section.classList.remove('active');
        });
        
        // Remove active from all nav items within the container
        const navItems = container.querySelectorAll('.nav-item');
        console.log('Found nav items:', navItems.length);
        navItems.forEach(item => {
            item.classList.remove('active');
        });
        
        // Show selected section
        const targetSection = container.querySelector('#' + sectionId + 'Section');
        console.log('Target section:', targetSection);
        if (targetSection) {
            targetSection.style.display = 'block';
            targetSection.classList.add('active');
            console.log('Showed section:', sectionId + 'Section');
        } else {
            console.error('Target section not found:', sectionId + 'Section');
        }
        
        // Add active to clicked nav item
        const navItem = container.querySelector(`[data-section="${sectionId}"]`);
        console.log('Nav item to activate:', navItem);
        if (navItem) {
            navItem.classList.add('active');
            console.log('Activated nav item for:', sectionId);
        } else {
            console.error('Nav item not found for section:', sectionId);
        }
    };
    
    // IDE Settings API key management functions
    window.setupIDESettingsHandlers = function() {
        const apiKeyInput = document.getElementById('claudeApiKey');
        const toggleBtn = document.getElementById('toggleApiKeyVisibility');
        const saveBtn = document.getElementById('saveApiKeyBtn');
        const testBtn = document.getElementById('testConnectionBtn');
        const clearBtn = document.getElementById('clearApiKeyBtn');
        const statusIndicator = document.getElementById('connectionStatus');
        
        if (!apiKeyInput) return; // Not on IDE settings view
        
        // Load saved API key
        const savedKey = localStorage.getItem('claudeApiKey');
        if (savedKey) {
            apiKeyInput.value = savedKey;
            updateConnectionStatus('saved');
        }
        
        // Toggle API key visibility
        if (toggleBtn) {
            toggleBtn.addEventListener('click', () => {
                const isPassword = apiKeyInput.type === 'password';
                apiKeyInput.type = isPassword ? 'text' : 'password';
                const icon = toggleBtn.querySelector('i');
                icon.className = isPassword ? 'fas fa-eye-slash' : 'fas fa-eye';
            });
        }
        
        // Save API key
        if (saveBtn) {
            saveBtn.addEventListener('click', () => {
                const apiKey = apiKeyInput.value.trim();
                if (!apiKey) {
                    alert('Please enter an API key');
                    return;
                }
                
                if (!apiKey.startsWith('sk-ant-api03-')) {
                    alert('Invalid API key format. Claude API keys start with "sk-ant-api03-"');
                    return;
                }
                
                localStorage.setItem('claudeApiKey', apiKey);
                updateConnectionStatus('saved');
                alert('API key saved successfully!');
            });
        }
        
        // Test connection
        if (testBtn) {
            testBtn.addEventListener('click', async () => {
                const apiKey = apiKeyInput.value.trim();
                if (!apiKey) {
                    alert('Please enter an API key first');
                    return;
                }
                
                updateConnectionStatus('testing');
                
                try {
                    // Simple test request to Claude API
                    const response = await fetch('https://api.anthropic.com/v1/messages', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                            'x-api-key': apiKey,
                            'anthropic-version': '2023-06-01'
                        },
                        body: JSON.stringify({
                            model: 'claude-3-haiku-20240307',
                            max_tokens: 10,
                            messages: [{
                                role: 'user',
                                content: 'Hello'
                            }]
                        })
                    });
                    
                    if (response.ok) {
                        updateConnectionStatus('connected');
                        alert('Connection successful! API key is working.');
                    } else {
                        updateConnectionStatus('error');
                        alert('Connection failed. Please check your API key.');
                    }
                } catch (error) {
                    updateConnectionStatus('error');
                    alert('Connection test failed: ' + error.message);
                }
            });
        }
        
        // Clear API key
        if (clearBtn) {
            clearBtn.addEventListener('click', () => {
                if (confirm('Are you sure you want to clear the saved API key?')) {
                    localStorage.removeItem('claudeApiKey');
                    apiKeyInput.value = '';
                    updateConnectionStatus('offline');
                    alert('API key cleared.');
                }
            });
        }
        
        function updateConnectionStatus(status) {
            if (!statusIndicator) return;
            
            const statusDot = statusIndicator.querySelector('.status-dot');
            const statusText = statusIndicator.querySelector('span');
            
            statusDot.className = 'status-dot';
            
            switch (status) {
                case 'connected':
                    statusDot.classList.add('connected');
                    statusText.textContent = 'Connected';
                    break;
                case 'saved':
                    statusDot.classList.add('saved');
                    statusText.textContent = 'API Key Saved';
                    break;
                case 'testing':
                    statusDot.classList.add('testing');
                    statusText.textContent = 'Testing Connection...';
                    break;
                case 'error':
                    statusDot.classList.add('error');
                    statusText.textContent = 'Connection Failed';
                    break;
                default:
                    statusDot.classList.add('offline');
                    statusText.textContent = 'Not Connected';
            }
        }
    };
    
    // Documentation navigation setup function
    window.setupDocumentationHandlers = function() {
        const navItems = document.querySelectorAll('.nav-item[data-section]');
        
        if (navItems.length === 0) {
            console.log('No documentation nav items found');
            return;
        }
        
        navItems.forEach(navItem => {
            const sectionId = navItem.getAttribute('data-section');
            
            navItem.addEventListener('click', (e) => {
                e.preventDefault();
                console.log('Documentation nav clicked:', sectionId);
                showDocSection(sectionId);
            });
            
            // Also add as backup
            navItem.onclick = (e) => {
                e.preventDefault();
                console.log('Documentation nav onclick:', sectionId);
                showDocSection(sectionId);
                return false;
            };
        });
        
        console.log('Documentation navigation handlers set up for', navItems.length, 'items');
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
    
    // Add CSS styles for new views
    const styleSheet = document.createElement('style');
    styleSheet.textContent = `
        /* IDE Settings View Styles - Scoped to special view container */
        .coder1-special-view-container .coder1-api-config-section {
            margin-bottom: 30px;
        }
        
        .coder1-special-view-container .api-config-header {
            display: flex;
            align-items: flex-start;
            gap: 15px;
            margin-bottom: 25px;
            padding: 20px;
            background: rgba(139, 92, 246, 0.1);
            border: 1px solid rgba(139, 92, 246, 0.3);
            border-radius: 12px;
        }
        
        .coder1-special-view-container .api-config-header i {
            color: #8b5cf6;
            font-size: 24px;
            margin-top: 5px;
        }
        
        .coder1-special-view-container .api-key-section {
            margin-bottom: 20px;
        }
        
        .coder1-special-view-container .api-key-input-container {
            position: relative;
            display: flex;
            align-items: center;
            gap: 10px;
            margin-top: 8px;
        }
        
        .coder1-special-view-container .glassmorphism-input {
            flex: 1;
            padding: 12px 45px 12px 15px;
            background: rgba(42, 42, 42, 0.6);
            border: 1px solid rgba(255, 255, 255, 0.1);
            border-radius: 8px;
            color: #ffffff;
            font-size: 14px;
            backdrop-filter: blur(10px);
        }
        
        .coder1-special-view-container .visibility-toggle {
            position: absolute;
            right: 12px;
            background: none;
            border: none;
            color: #a1a1aa;
            cursor: pointer;
            padding: 8px;
            border-radius: 4px;
            transition: color 0.2s;
        }
        
        .coder1-special-view-container .visibility-toggle:hover {
            color: #ffffff;
        }
        
        .coder1-special-view-container .api-actions {
            display: flex;
            gap: 12px;
            margin-bottom: 25px;
            flex-wrap: wrap;
        }
        
        .coder1-special-view-container .coder1-btn {
            padding: 10px 16px;
            border: none;
            border-radius: 8px;
            cursor: pointer;
            font-size: 14px;
            font-weight: 500;
            transition: all 0.2s;
            display: flex;
            align-items: center;
            gap: 8px;
        }
        
        .coder1-special-view-container .save-btn {
            background: #10b981;
            color: #ffffff;
        }
        
        .coder1-special-view-container .save-btn:hover {
            background: #059669;
        }
        
        .coder1-special-view-container .test-btn {
            background: #8b5cf6;
            color: #ffffff;
        }
        
        .coder1-special-view-container .test-btn:hover {
            background: #7c3aed;
        }
        
        .coder1-special-view-container .clear-btn {
            background: #ef4444;
            color: #ffffff;
        }
        
        .coder1-special-view-container .clear-btn:hover {
            background: #dc2626;
        }
        
        .coder1-special-view-container .api-help-section {
            display: flex;
            align-items: flex-start;
            gap: 15px;
            padding: 20px;
            background: rgba(16, 185, 129, 0.1);
            border: 1px solid rgba(16, 185, 129, 0.3);
            border-radius: 12px;
            margin-bottom: 20px;
        }
        
        .coder1-special-view-container .help-icon i {
            color: #10b981;
            font-size: 20px;
        }
        
        .coder1-special-view-container .help-content h4 {
            margin: 0 0 12px 0;
            color: #ffffff;
        }
        
        .coder1-special-view-container .help-content ol {
            margin: 0;
            padding-left: 20px;
        }
        
        .coder1-special-view-container .help-content a {
            color: #10b981;
            text-decoration: none;
        }
        
        .coder1-special-view-container .help-content a:hover {
            text-decoration: underline;
        }
        
        .coder1-special-view-container .connection-status {
            display: flex;
            align-items: center;
            gap: 12px;
            padding: 12px 0;
        }
        
        .coder1-special-view-container .status-label {
            color: #a1a1aa;
            font-size: 14px;
        }
        
        .coder1-special-view-container .status-indicator {
            display: flex;
            align-items: center;
            gap: 8px;
        }
        
        .coder1-special-view-container .status-dot {
            width: 8px;
            height: 8px;
            border-radius: 50%;
            background: #6b7280;
        }
        
        .coder1-special-view-container .status-dot.connected {
            background: #10b981;
        }
        
        .coder1-special-view-container .status-dot.saved {
            background: #f59e0b;
        }
        
        .coder1-special-view-container .status-dot.testing {
            background: #8b5cf6;
        }
        
        .coder1-special-view-container .status-dot.error {
            background: #ef4444;
        }
        
        .coder1-special-view-container .status-dot.offline {
            background: #6b7280;
        }
        
        .coder1-special-view-container .coder1-features-section {
            padding-top: 25px;
            border-top: 1px solid rgba(255, 255, 255, 0.1);
        }
        
        .coder1-special-view-container .features-header {
            display: flex;
            align-items: center;
            gap: 12px;
            margin-bottom: 20px;
        }
        
        .coder1-special-view-container .features-header i {
            color: #8b5cf6;
            font-size: 20px;
        }
        
        .coder1-special-view-container .feature-cards {
            display: grid;
            gap: 15px;
        }
        
        .coder1-special-view-container .feature-card {
            display: flex;
            align-items: flex-start;
            gap: 15px;
            padding: 18px;
            background: rgba(42, 42, 42, 0.4);
            border: 1px solid rgba(255, 255, 255, 0.1);
            border-radius: 10px;
            backdrop-filter: blur(5px);
        }
        
        .coder1-special-view-container .feature-icon {
            width: 40px;
            height: 40px;
            display: flex;
            align-items: center;
            justify-content: center;
            background: rgba(139, 92, 246, 0.2);
            border-radius: 8px;
            color: #8b5cf6;
            font-size: 18px;
        }
        
        .coder1-special-view-container .feature-info h4 {
            margin: 0 0 8px 0;
            color: #ffffff;
            font-size: 16px;
        }
        
        .coder1-special-view-container .feature-info p {
            margin: 0;
            color: #a1a1aa;
            font-size: 14px;
            line-height: 1.5;
        }
        
        /* Documentation View Styles - Scoped to special view container */
        .coder1-special-view-container .coder1-documentation-wrapper {
            display: flex;
            gap: 30px;
            height: 100%;
            width: 100%;
        }
        
        .coder1-special-view-container .coder1-documentation-nav {
            width: 250px;
            flex-shrink: 0;
            padding-right: 25px;
            border-right: 1px solid rgba(255, 255, 255, 0.1);
        }
        
        .coder1-special-view-container .nav-header {
            margin-bottom: 25px;
        }
        
        .coder1-special-view-container .nav-header h3 {
            margin: 0 0 8px 0;
            color: #ffffff;
        }
        
        .coder1-special-view-container .nav-header p {
            margin: 0;
            color: #a1a1aa;
            font-size: 14px;
            line-height: 1.5;
        }
        
        .coder1-special-view-container .nav-sections {
            display: flex;
            flex-direction: column;
            gap: 8px;
        }
        
        .coder1-special-view-container .nav-item {
            display: flex;
            align-items: center;
            gap: 12px;
            padding: 12px 16px;
            border-radius: 8px;
            cursor: pointer;
            transition: all 0.2s;
            color: #a1a1aa;
        }
        
        .coder1-special-view-container .nav-item:hover {
            background: rgba(255, 255, 255, 0.05);
            color: #ffffff;
        }
        
        .coder1-special-view-container .nav-item.active {
            background: rgba(139, 92, 246, 0.2);
            color: #8b5cf6;
        }
        
        .coder1-special-view-container .nav-item i {
            width: 16px;
            text-align: center;
        }
        
        .coder1-special-view-container .coder1-documentation-content {
            flex: 1;
            padding-left: 30px;
            overflow-y: auto;
        }
        
        .doc-section {
            max-height: 60vh;
            overflow-y: auto;
        }
        
        .welcome-banner {
            margin-bottom: 30px;
            padding: 25px;
            background: linear-gradient(135deg, rgba(139, 92, 246, 0.2), rgba(16, 185, 129, 0.2));
            border-radius: 12px;
            border: 1px solid rgba(139, 92, 246, 0.3);
        }
        
        .welcome-banner h2 {
            margin: 0;
            color: #ffffff;
            font-size: 20px;
        }
        
        .key-features, .getting-started {
            margin-bottom: 30px;
        }
        
        .key-features h3, .getting-started h3 {
            margin: 0 0 20px 0;
            color: #8b5cf6;
            font-size: 16px;
            font-weight: 600;
            letter-spacing: 0.5px;
        }
        
        .feature-list {
            display: grid;
            gap: 12px;
        }
        
        .feature-item {
            display: flex;
            align-items: center;
            gap: 12px;
            padding: 12px 0;
        }
        
        .feature-item i {
            color: #10b981;
            width: 20px;
            text-align: center;
        }
        
        .step-list {
            display: grid;
            gap: 16px;
        }
        
        .step-item {
            display: flex;
            align-items: flex-start;
            gap: 15px;
        }
        
        .step-number {
            width: 28px;
            height: 28px;
            display: flex;
            align-items: center;
            justify-content: center;
            background: #8b5cf6;
            color: #ffffff;
            border-radius: 50%;
            font-size: 14px;
            font-weight: 600;
            flex-shrink: 0;
        }
        
        .step-item strong {
            color: #ffffff;
            display: block;
            margin-bottom: 4px;
        }
        
        .step-item p {
            margin: 0;
            color: #a1a1aa;
            font-size: 14px;
            line-height: 1.4;
        }
        
        /* Exit Button Fix */
        .coder1-exit-btn {
            position: absolute !important;
            top: 20px !important;
            right: 20px !important;
            width: 32px !important;
            height: 32px !important;
            background: rgba(239, 68, 68, 0.2) !important;
            border: 1px solid rgba(239, 68, 68, 0.3) !important;
            border-radius: 50% !important;
            color: #ef4444 !important;
            font-size: 16px !important;
            cursor: pointer !important;
            display: flex !important;
            align-items: center !important;
            justify-content: center !important;
            transition: all 0.2s !important;
            z-index: 1000 !important;
            padding: 0 !important;
        }
        
        .coder1-exit-btn:hover {
            background: rgba(239, 68, 68, 0.3) !important;
            border-color: rgba(239, 68, 68, 0.5) !important;
            color: #ffffff !important;
            transform: scale(1.1) !important;
        }
        
        .coder1-exit-btn:active {
            transform: scale(0.95) !important;
        }
        
        /* Ensure panel content fills container properly - Scoped to special views only */
        .coder1-special-view-container .coder1-panel-content {
            flex: 1;
            display: flex;
            flex-direction: column;
            min-height: 0;
        }
    `;
    document.head.appendChild(styleSheet);
    
    console.log('✅ Coder1 Special Views V4 initialized - Full functionality restored!');
})();