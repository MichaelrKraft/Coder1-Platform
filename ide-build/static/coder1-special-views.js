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
    
    console.log('✅ Coder1 Special Views initialized');
})();