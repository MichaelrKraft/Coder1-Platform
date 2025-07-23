// Parallel Agents Modal Enhancement
// This script adds a plan selection interface when Parallel Agents is activated

console.log('🚀 Parallel Agents Modal Enhancement Loading...');

// Define available templates
const parallelAgentTemplates = [
    {
        id: 'fullstack-web',
        name: 'Full-Stack Web App Development',
        description: 'Coordinate frontend, backend, and database agents to build complete web applications',
        agents: ['Frontend Developer', 'Backend Engineer', 'Database Architect'],
        tasks: [
            'Design responsive UI components',
            'Implement RESTful API endpoints',
            'Set up database schema and queries',
            'Integrate frontend with backend services',
            'Add authentication and authorization'
        ]
    },
    {
        id: 'ai-feature',
        name: 'AI-Powered Feature Implementation',
        description: 'Multiple agents work together to integrate AI capabilities into your application',
        agents: ['AI Integration Specialist', 'API Developer', 'UI/UX Designer'],
        tasks: [
            'Research and select appropriate AI models',
            'Create API wrapper for AI services',
            'Design intuitive user interface',
            'Implement real-time AI processing',
            'Add error handling and fallbacks'
        ]
    },
    {
        id: 'component-library',
        name: 'UI/UX Component Library',
        description: 'Build a comprehensive component library with multiple specialized agents',
        agents: ['Component Architect', 'Style System Designer', 'Documentation Writer'],
        tasks: [
            'Design component architecture',
            'Create reusable React components',
            'Develop consistent style system',
            'Write comprehensive documentation',
            'Add interactive component demos'
        ]
    },
    {
        id: 'api-integration',
        name: 'API Integration Suite',
        description: 'Connect multiple third-party services with specialized integration agents',
        agents: ['API Integration Expert', 'Data Transformer', 'Error Handler'],
        tasks: [
            'Research API documentation',
            'Implement API client libraries',
            'Create data transformation layers',
            'Add retry logic and error handling',
            'Build unified API interface'
        ]
    },
    {
        id: 'testing-qa',
        name: 'Testing & QA Automation',
        description: 'Comprehensive testing strategy with multiple QA agents',
        agents: ['Unit Test Developer', 'Integration Tester', 'E2E Automation Engineer'],
        tasks: [
            'Write unit tests for all functions',
            'Create integration test suites',
            'Develop end-to-end test scenarios',
            'Set up continuous testing pipeline',
            'Generate test coverage reports'
        ]
    }
];

// Create modal HTML structure
function createParallelAgentsModal() {
    const modal = document.createElement('div');
    modal.id = 'parallel-agents-modal';
    modal.className = 'parallel-modal-overlay';
    modal.innerHTML = `
        <div class="parallel-modal-content">
            <div class="parallel-modal-header">
                <h2>⚡ Parallel Agentic Coding</h2>
                <button class="parallel-modal-close" onclick="closeParallelModal()">×</button>
            </div>
            
            <div class="parallel-modal-body">
                <div class="plan-selection">
                    <h3>Plan Selection</h3>
                    <div class="radio-group">
                        <label class="radio-option">
                            <input type="radio" name="planType" value="template" checked onchange="handlePlanTypeChange(this)">
                            <span class="radio-custom"></span>
                            Use Template Plan
                        </label>
                        <label class="radio-option">
                            <input type="radio" name="planType" value="custom" onchange="handlePlanTypeChange(this)">
                            <span class="radio-custom"></span>
                            Custom Plan
                        </label>
                    </div>
                    
                    <div id="templateSection" class="template-section">
                        <label for="templateSelect">Select Template:</label>
                        <select id="templateSelect" class="template-dropdown" onchange="handleTemplateChange(this)">
                            <option value="">Choose a template...</option>
                            ${parallelAgentTemplates.map(template => 
                                `<option value="${template.id}">${template.name}</option>`
                            ).join('')}
                        </select>
                        
                        <div id="templateDetails" class="template-details" style="display: none;">
                            <!-- Template details will be inserted here -->
                        </div>
                    </div>
                    
                    <div id="customSection" class="custom-section" style="display: none;">
                        <label for="customPlan">Enter Your Custom Plan:</label>
                        <textarea id="customPlan" class="custom-plan-input" rows="6" 
                                  placeholder="Describe what you want the parallel agents to build..."></textarea>
                    </div>
                </div>
                
                <div class="parallel-info-grid">
                    <div class="info-card">
                        <h4>⚡ How Parallel Agentic Coding Works</h4>
                        <ul>
                            <li>Creates isolated git work trees for each agent</li>
                            <li>Multiple Claude agents work on the same plan simultaneously</li>
                            <li>Each agent develops a unique approach to the problem</li>
                            <li>Compare results and merge the best implementation</li>
                            <li>Leverage non-deterministic nature of LLMs for creativity</li>
                        </ul>
                    </div>
                    
                    <div class="info-card">
                        <h4>🎯 Best Practices</h4>
                        <ul>
                            <li>Write detailed, clear plans for better results</li>
                            <li>Use 3-5 agents for optimal variety vs. cost</li>
                            <li>Review all successful agents before choosing</li>
                            <li>Clean up sessions to avoid git branch bloat</li>
                            <li>Test on smaller features before large implementations</li>
                        </ul>
                    </div>
                </div>
            </div>
            
            <div class="parallel-modal-footer">
                <button class="parallel-cancel-btn" onclick="closeParallelModal()">Cancel</button>
                <button class="parallel-start-btn" onclick="startParallelExecution()">
                    🚀 Start Parallel Execution
                </button>
            </div>
        </div>
    `;
    
    return modal;
}

// Handle plan type change
window.handlePlanTypeChange = function(radio) {
    const templateSection = document.getElementById('templateSection');
    const customSection = document.getElementById('customSection');
    
    if (radio.value === 'template') {
        templateSection.style.display = 'block';
        customSection.style.display = 'none';
    } else {
        templateSection.style.display = 'none';
        customSection.style.display = 'block';
    }
};

// Handle template selection
window.handleTemplateChange = function(select) {
    const templateId = select.value;
    const detailsDiv = document.getElementById('templateDetails');
    
    if (!templateId) {
        detailsDiv.style.display = 'none';
        return;
    }
    
    const template = parallelAgentTemplates.find(t => t.id === templateId);
    if (!template) return;
    
    detailsDiv.innerHTML = `
        <div class="template-info">
            <h4>${template.name}</h4>
            <p class="template-description">${template.description}</p>
            
            <div class="template-agents">
                <h5>🤖 Agents:</h5>
                <div class="agent-list">
                    ${template.agents.map(agent => 
                        `<span class="agent-badge">${agent}</span>`
                    ).join('')}
                </div>
            </div>
            
            <div class="template-tasks">
                <h5>📋 Tasks:</h5>
                <ul class="task-list">
                    ${template.tasks.map(task => 
                        `<li>${task}</li>`
                    ).join('')}
                </ul>
            </div>
        </div>
    `;
    
    detailsDiv.style.display = 'block';
};

// Close modal
window.closeParallelModal = function() {
    const modal = document.getElementById('parallel-agents-modal');
    if (modal) {
        modal.style.opacity = '0';
        setTimeout(() => {
            modal.remove();
        }, 300);
    }
};

// Start parallel execution
window.startParallelExecution = async function() {
    const planType = document.querySelector('input[name="planType"]:checked').value;
    let executionPlan = {};
    
    if (planType === 'template') {
        const templateId = document.getElementById('templateSelect').value;
        if (!templateId) {
            showNotification('⚠️ Please select a template', 'warning');
            return;
        }
        
        const template = parallelAgentTemplates.find(t => t.id === templateId);
        executionPlan = {
            type: 'template',
            templateId: templateId,
            template: template
        };
    } else {
        const customPlan = document.getElementById('customPlan').value.trim();
        if (!customPlan) {
            showNotification('⚠️ Please enter a custom plan', 'warning');
            return;
        }
        
        executionPlan = {
            type: 'custom',
            plan: customPlan
        };
    }
    
    // Close modal
    closeParallelModal();
    
    // Show starting notification
    showNotification('🚀 Starting Parallel Agents...', 'info');
    
    try {
        // Send to API
        const response = await fetch('/api/parallel-agents/start', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(executionPlan)
        });
        
        const data = await response.json();
        
        if (data.success) {
            showNotification(`✅ Parallel execution started with ${data.agentCount} agents`, 'success');
            
            // Start monitoring progress
            if (data.sessionId) {
                monitorParallelProgress(data.sessionId);
            }
        } else {
            showNotification(`❌ Failed to start: ${data.message}`, 'error');
        }
    } catch (error) {
        // Fallback to demo mode
        showNotification('🎮 Running in demo mode', 'info');
        simulateParallelExecution(executionPlan);
    }
};

// Monitor parallel execution progress
function monitorParallelProgress(sessionId) {
    let pollCount = 0;
    
    const pollInterval = setInterval(async () => {
        pollCount++;
        
        try {
            const response = await fetch(`/api/parallel-agents/status/${sessionId}`);
            const data = await response.json();
            
            if (data.status === 'completed') {
                clearInterval(pollInterval);
                showNotification(`✅ Parallel execution completed! ${data.successfulAgents} agents succeeded`, 'success');
            } else if (data.status === 'failed') {
                clearInterval(pollInterval);
                showNotification(`❌ Parallel execution failed: ${data.error}`, 'error');
            } else {
                // Update progress
                showNotification(`⚡ Progress: ${data.completedAgents}/${data.totalAgents} agents completed`, 'info');
            }
            
            // Stop after 5 minutes
            if (pollCount > 100) {
                clearInterval(pollInterval);
            }
        } catch (error) {
            console.error('Error polling status:', error);
        }
    }, 3000);
}

// Simulate parallel execution for demo mode
function simulateParallelExecution(executionPlan) {
    const agentCount = executionPlan.type === 'template' ? 
        executionPlan.template.agents.length : 3;
    
    let completed = 0;
    
    // Simulate agents completing work
    for (let i = 0; i < agentCount; i++) {
        setTimeout(() => {
            completed++;
            showNotification(`🤖 Agent ${i + 1} completed its implementation`, 'success');
            
            if (completed === agentCount) {
                setTimeout(() => {
                    showNotification(`🎉 All ${agentCount} agents completed! Review implementations in your git branches`, 'success');
                }, 1000);
            }
        }, (i + 1) * 2000 + Math.random() * 2000);
    }
}

// Notification system
function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `parallel-notification ${type}`;
    notification.textContent = message;
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        padding: 12px 20px;
        border-radius: 6px;
        background: ${type === 'error' ? '#f7768e' : type === 'success' ? '#9ece6a' : type === 'warning' ? '#f7aa00' : '#7aa2f7'};
        color: white;
        font-size: 14px;
        z-index: 100000;
        animation: slideIn 0.3s ease-out;
        box-shadow: 0 4px 12px rgba(0,0,0,0.3);
    `;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.style.animation = 'slideOut 0.3s ease-in';
        setTimeout(() => notification.remove(), 300);
    }, 4000);
}

// Override the parallel agents button click
function enhanceParallelAgentsButton() {
    const checkInterval = setInterval(() => {
        const parallelBtn = document.querySelector('button[title="Parallel Agents"]');
        
        if (parallelBtn) {
            clearInterval(checkInterval);
            
            // Override click handler
            parallelBtn.onclick = (e) => {
                e.preventDefault();
                showParallelAgentsModal();
            };
            
            console.log('✅ Parallel Agents button enhanced with modal');
        }
    }, 200);
}

// Show the modal
function showParallelAgentsModal() {
    // Remove any existing modal
    const existingModal = document.getElementById('parallel-agents-modal');
    if (existingModal) {
        existingModal.remove();
    }
    
    // Create and add new modal
    const modal = createParallelAgentsModal();
    document.body.appendChild(modal);
    
    // Animate in
    setTimeout(() => {
        modal.style.opacity = '1';
    }, 10);
}

// Add CSS styles
const style = document.createElement('style');
style.textContent = `
    /* Modal Overlay */
    .parallel-modal-overlay {
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0, 0, 0, 0.8);
        backdrop-filter: blur(10px);
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 10000;
        opacity: 0;
        transition: opacity 0.3s ease;
    }
    
    .parallel-modal-overlay {
        opacity: 1;
    }
    
    /* Modal Content */
    .parallel-modal-content {
        background: #1a1b26;
        border: 1px solid #414868;
        border-radius: 12px;
        width: 90%;
        max-width: 800px;
        max-height: 90vh;
        overflow: hidden;
        display: flex;
        flex-direction: column;
        box-shadow: 0 20px 60px rgba(0, 0, 0, 0.5);
    }
    
    /* Modal Header */
    .parallel-modal-header {
        background: #24283b;
        padding: 20px 24px;
        border-bottom: 1px solid #414868;
        display: flex;
        justify-content: space-between;
        align-items: center;
    }
    
    .parallel-modal-header h2 {
        margin: 0;
        color: #c0caf5;
        font-size: 24px;
        font-weight: 600;
    }
    
    .parallel-modal-close {
        background: none;
        border: none;
        color: #565f89;
        font-size: 28px;
        cursor: pointer;
        padding: 0;
        width: 32px;
        height: 32px;
        display: flex;
        align-items: center;
        justify-content: center;
        border-radius: 6px;
        transition: all 0.2s;
    }
    
    .parallel-modal-close:hover {
        background: #414868;
        color: #c0caf5;
    }
    
    /* Modal Body */
    .parallel-modal-body {
        flex: 1;
        overflow-y: auto;
        padding: 24px;
    }
    
    /* Plan Selection */
    .plan-selection {
        margin-bottom: 24px;
    }
    
    .plan-selection h3 {
        color: #c0caf5;
        margin: 0 0 16px 0;
        font-size: 18px;
    }
    
    /* Radio Group */
    .radio-group {
        display: flex;
        gap: 24px;
        margin-bottom: 20px;
    }
    
    .radio-option {
        display: flex;
        align-items: center;
        color: #a9b1d6;
        cursor: pointer;
        font-size: 14px;
    }
    
    .radio-option input[type="radio"] {
        display: none;
    }
    
    .radio-custom {
        width: 20px;
        height: 20px;
        border: 2px solid #565f89;
        border-radius: 50%;
        margin-right: 8px;
        position: relative;
        transition: all 0.2s;
    }
    
    .radio-option input[type="radio"]:checked + .radio-custom {
        border-color: #7aa2f7;
        background: #7aa2f7;
    }
    
    .radio-option input[type="radio"]:checked + .radio-custom::after {
        content: '';
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        width: 8px;
        height: 8px;
        background: white;
        border-radius: 50%;
    }
    
    /* Template Section */
    .template-section label {
        display: block;
        color: #a9b1d6;
        margin-bottom: 8px;
        font-size: 14px;
    }
    
    .template-dropdown {
        width: 100%;
        background: #24283b;
        border: 1px solid #414868;
        border-radius: 6px;
        color: #c0caf5;
        padding: 10px 12px;
        font-size: 14px;
        cursor: pointer;
        transition: all 0.2s;
    }
    
    .template-dropdown:hover {
        border-color: #565f89;
    }
    
    .template-dropdown:focus {
        outline: none;
        border-color: #7aa2f7;
        box-shadow: 0 0 0 3px rgba(122, 162, 247, 0.2);
    }
    
    /* Template Details */
    .template-details {
        margin-top: 20px;
        padding: 16px;
        background: #24283b;
        border: 1px solid #414868;
        border-radius: 8px;
    }
    
    .template-info h4 {
        margin: 0 0 8px 0;
        color: #7aa2f7;
        font-size: 16px;
    }
    
    .template-description {
        color: #a9b1d6;
        margin: 0 0 16px 0;
        font-size: 14px;
        line-height: 1.5;
    }
    
    .template-agents h5,
    .template-tasks h5 {
        margin: 0 0 8px 0;
        color: #c0caf5;
        font-size: 14px;
        font-weight: 600;
    }
    
    .agent-list {
        display: flex;
        flex-wrap: wrap;
        gap: 8px;
        margin-bottom: 16px;
    }
    
    .agent-badge {
        background: #414868;
        color: #9ece6a;
        padding: 4px 12px;
        border-radius: 16px;
        font-size: 12px;
        font-weight: 500;
    }
    
    .task-list {
        margin: 0;
        padding-left: 20px;
        color: #a9b1d6;
        font-size: 14px;
        line-height: 1.8;
    }
    
    /* Custom Section */
    .custom-plan-input {
        width: 100%;
        background: #24283b;
        border: 1px solid #414868;
        border-radius: 6px;
        color: #c0caf5;
        padding: 12px;
        font-size: 14px;
        font-family: inherit;
        resize: vertical;
        transition: all 0.2s;
    }
    
    .custom-plan-input:focus {
        outline: none;
        border-color: #7aa2f7;
        box-shadow: 0 0 0 3px rgba(122, 162, 247, 0.2);
    }
    
    /* Info Grid */
    .parallel-info-grid {
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: 20px;
        margin-top: 24px;
    }
    
    .info-card {
        background: #24283b;
        border: 1px solid #414868;
        border-radius: 8px;
        padding: 16px;
    }
    
    .info-card h4 {
        margin: 0 0 12px 0;
        color: #c0caf5;
        font-size: 16px;
        font-weight: 600;
    }
    
    .info-card ul {
        margin: 0;
        padding-left: 20px;
        color: #a9b1d6;
        font-size: 13px;
        line-height: 1.8;
    }
    
    /* Modal Footer */
    .parallel-modal-footer {
        background: #24283b;
        padding: 16px 24px;
        border-top: 1px solid #414868;
        display: flex;
        justify-content: flex-end;
        gap: 12px;
    }
    
    .parallel-cancel-btn,
    .parallel-start-btn {
        padding: 10px 20px;
        border: none;
        border-radius: 6px;
        font-size: 14px;
        font-weight: 500;
        cursor: pointer;
        transition: all 0.2s;
    }
    
    .parallel-cancel-btn {
        background: #414868;
        color: #a9b1d6;
    }
    
    .parallel-cancel-btn:hover {
        background: #565f89;
        color: #c0caf5;
    }
    
    .parallel-start-btn {
        background: #7aa2f7;
        color: white;
    }
    
    .parallel-start-btn:hover {
        background: #5a8dd7;
        transform: translateY(-1px);
        box-shadow: 0 4px 12px rgba(122, 162, 247, 0.3);
    }
    
    /* Notifications */
    @keyframes slideIn {
        from {
            transform: translateX(100%);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
    
    @keyframes slideOut {
        from {
            transform: translateX(0);
            opacity: 1;
        }
        to {
            transform: translateX(100%);
            opacity: 0;
        }
    }
    
    /* Responsive */
    @media (max-width: 768px) {
        .parallel-info-grid {
            grid-template-columns: 1fr;
        }
        
        .radio-group {
            flex-direction: column;
            gap: 12px;
        }
    }
`;
document.head.appendChild(style);

// Initialize
enhanceParallelAgentsButton();
console.log('✅ Parallel Agents Modal Enhancement Ready');