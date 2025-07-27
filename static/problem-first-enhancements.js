/**
 * Problem-First Flow Enhancements for Product Creation Hub
 * Implements Mike's 8-Step Method for better product specifications
 */

class ProblemFirstEnhancements {
    constructor(hub) {
        this.hub = hub;
        this.initializeEnhancements();
    }

    initializeEnhancements() {
        // Add new methods to the ProductCreationHub prototype
        this.enhanceProductCreationHub();
        
        // Add problem-first UI elements
        this.updateUIForProblemFirst();
    }

    enhanceProductCreationHub() {
        // Add problem detection method
        ProductCreationHub.prototype.isProblemStatement = function(message) {
            const problemIndicators = [
                'problem', 'issue', 'struggle', 'difficulty', 'challenge',
                'pain point', 'frustrat', 'waste', 'lose', 'can\'t', 'unable'
            ];
            const messageLower = message.toLowerCase();
            return problemIndicators.some(indicator => messageLower.includes(indicator));
        };

        // Add MVP decision handler
        ProductCreationHub.prototype.handleMVPDecision = async function(decision) {
            if (decision.toLowerCase() === 'skip') {
                this.waitingForMVPDecision = false;
                this.startProblemAwareQuestions();
            } else if (decision.toLowerCase() === 'mvp') {
                this.showMVPDefinitionModal();
            }
        };

        // Enhanced question flow for problem-first approach
        ProductCreationHub.prototype.startProblemAwareQuestions = function() {
            this.waitingForMVPDecision = false;
            
            // Generate smart questions based on problem/solution
            this.questions = this.generateSmartQuestions();
            
            this.addMessageToChat(
                `Perfect! I'll now ask you ${this.questions.length} targeted questions to create a comprehensive PRD that addresses your specific problem and solution.`,
                'assistant'
            );

            this.setStep(2);
            this.updateProgress(25, 'Smart questions ready');
            
            setTimeout(() => {
                this.askNextQuestion();
            }, 500);
        };

        // Generate context-aware questions
        ProductCreationHub.prototype.generateSmartQuestions = function() {
            const problemContext = this.problemStatement || '';
            const solutionContext = this.solutionDescription || '';
            
            const questions = [
                {
                    question: `Who specifically experiences "${problemContext}"? Describe their role, demographics, and technical expertise.`,
                    category: 'target-audience'
                },
                {
                    question: `How will you measure if your solution successfully solves this problem? What are the key success metrics?`,
                    category: 'success-metrics'
                },
                {
                    question: `What makes your solution different from how people currently solve "${problemContext}"?`,
                    category: 'differentiation'
                },
                {
                    question: `What technical requirements or constraints do you have? (platforms, integrations, performance needs)`,
                    category: 'technical'
                },
                {
                    question: `What is your timeline and budget for launching the MVP?`,
                    category: 'timeline-budget'
                }
            ];

            // Add contextual questions based on solution type
            if (solutionContext.includes('team') || solutionContext.includes('collaborat')) {
                questions.push({
                    question: `How will teams collaborate in your solution? Describe workflows and permission needs.`,
                    category: 'collaboration'
                });
            }

            if (solutionContext.includes('data') || solutionContext.includes('analytic')) {
                questions.push({
                    question: `What data privacy and security requirements do you have?`,
                    category: 'security'
                });
            }

            return questions;
        };

        // MVP Definition Modal
        ProductCreationHub.prototype.showMVPDefinitionModal = function() {
            const modalHTML = `
                <div class="modal-overlay" id="mvpModal">
                    <div class="modal-container glassmorphism">
                        <div class="modal-header">
                            <h3><i class="fas fa-rocket"></i> Define Your MVP Scope</h3>
                            <button class="modal-close" onclick="window.productCreationHub.closeMVPModal()">
                                <i class="fas fa-times"></i>
                            </button>
                        </div>
                        <div class="modal-content">
                            <p>Select features for your initial MVP. Start small and iterate!</p>
                            
                            <div class="mvp-features">
                                <h4>User Management</h4>
                                <label><input type="checkbox" value="auth" checked> User login/signup</label>
                                <label><input type="checkbox" value="social"> Social login (Google, GitHub)</label>
                                <label><input type="checkbox" value="profile"> User profiles</label>
                                
                                <h4>Core Features</h4>
                                <div id="dynamicCoreFeatures">
                                    <!-- Dynamically populated based on solution -->
                                </div>
                                
                                <h4>Data Management</h4>
                                <label><input type="checkbox" value="create" checked> Create new items</label>
                                <label><input type="checkbox" value="read" checked> View/retrieve items</label>
                                <label><input type="checkbox" value="update" checked> Edit existing items</label>
                                <label><input type="checkbox" value="delete" checked> Delete items</label>
                                <label><input type="checkbox" value="search"> Search functionality</label>
                                <label><input type="checkbox" value="filter"> Advanced filtering</label>
                                
                                <h4>Collaboration</h4>
                                <label><input type="checkbox" value="share"> Share items</label>
                                <label><input type="checkbox" value="permissions"> Permission levels</label>
                                <label><input type="checkbox" value="teams"> Team workspaces</label>
                            </div>
                            
                            <div class="modal-actions">
                                <button class="wizard-btn secondary" onclick="window.productCreationHub.skipMVP()">
                                    Skip This Step
                                </button>
                                <button class="wizard-btn primary" onclick="window.productCreationHub.confirmMVP()">
                                    Confirm MVP Scope
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            `;
            
            // Add modal to page
            document.body.insertAdjacentHTML('beforeend', modalHTML);
            
            // Populate dynamic core features based on solution
            this.populateDynamicFeatures();
        };

        // Populate features based on solution context
        ProductCreationHub.prototype.populateDynamicFeatures = function() {
            const container = document.getElementById('dynamicCoreFeatures');
            const solution = this.solutionDescription || '';
            
            let features = [];
            
            if (solution.includes('repository') || solution.includes('store')) {
                features = [
                    'Organize items in folders/categories',
                    'Tag system for organization',
                    'Quick access/favorites',
                    'Import/export functionality'
                ];
            } else if (solution.includes('dashboard') || solution.includes('analytic')) {
                features = [
                    'Real-time data visualization',
                    'Custom metrics dashboard',
                    'Report generation',
                    'Data export'
                ];
            } else {
                features = [
                    'Core functionality (customize based on your solution)',
                    'User dashboard',
                    'Settings/preferences',
                    'Help/documentation'
                ];
            }
            
            container.innerHTML = features.map(f => 
                `<label><input type="checkbox" value="${f.toLowerCase().replace(/\s+/g, '-')}" checked> ${f}</label>`
            ).join('');
        };

        // Close MVP Modal
        ProductCreationHub.prototype.closeMVPModal = function() {
            document.getElementById('mvpModal')?.remove();
        };

        // Skip MVP Definition
        ProductCreationHub.prototype.skipMVP = function() {
            this.closeMVPModal();
            this.mvpFeatures = 'default';
            this.waitingForMVPDecision = false;
            this.startProblemAwareQuestions();
        };

        // Confirm MVP Selection
        ProductCreationHub.prototype.confirmMVP = function() {
            const checkboxes = document.querySelectorAll('#mvpModal input[type="checkbox"]:checked');
            this.mvpFeatures = Array.from(checkboxes).map(cb => cb.value);
            
            this.closeMVPModal();
            this.waitingForMVPDecision = false;
            
            this.addMessageToChat(
                `Great! I've captured your MVP scope with ${this.mvpFeatures.length} features. Now let's dive into the details.`,
                'assistant'
            );
            
            this.startProblemAwareQuestions();
        };

        // Override the original sendMessage to handle MVP decision
        const originalSendMessage = ProductCreationHub.prototype.sendMessage;
        ProductCreationHub.prototype.sendMessage = async function() {
            const messageInput = document.getElementById('messageInput');
            const message = messageInput.value.trim();
            
            // Check if waiting for MVP decision
            if (this.waitingForMVPDecision && message) {
                this.addMessageToChat(message, 'user');
                messageInput.value = '';
                await this.handleMVPDecision(message);
                return;
            }
            
            // Call original sendMessage
            return originalSendMessage.call(this);
        };
    }

    updateUIForProblemFirst() {
        // Update the placeholder text to encourage problem-first thinking
        const messageInput = document.getElementById('messageInput');
        if (messageInput) {
            messageInput.placeholder = "Start by describing the problem you want to solve...";
        }

        // Update Step 1 text
        const step1Title = document.querySelector('#step-1 h4');
        if (step1Title) {
            step1Title.textContent = '1. Define Your Problem';
        }
        
        const step1Description = document.querySelector('#step-1 p');
        if (step1Description) {
            step1Description.textContent = 'Tell us what problem you\'re trying to solve';
        }

        // Add helper text with examples
        const examplesHTML = `
            <div class="problem-examples" style="margin-top: 20px; padding: 15px; background: rgba(139, 92, 246, 0.1); border-radius: 8px;">
                <h5 style="color: var(--accent-primary); margin-bottom: 10px;">
                    <i class="fas fa-lightbulb"></i> Example Problems:
                </h5>
                <ul style="font-size: 0.9em; opacity: 0.8; margin-left: 20px;">
                    <li>Teams waste time searching for commonly used prompts</li>
                    <li>Developers recreate the same boilerplate code repeatedly</li>
                    <li>Small businesses struggle to track feedback across channels</li>
                </ul>
            </div>
        `;
        
        const step1Actions = document.querySelector('#step-1 .step-actions');
        if (step1Actions) {
            step1Actions.insertAdjacentHTML('beforebegin', examplesHTML);
        }
    }
}

// Initialize enhancements when ProductCreationHub is ready
function initializeProblemFirstEnhancements() {
    // Wait for ProductCreationHub to be initialized
    if (window.productCreationHub) {
        console.log('🚀 Initializing Problem-First Enhancements');
        new ProblemFirstEnhancements(window.productCreationHub);
    } else {
        // Retry after a short delay
        setTimeout(initializeProblemFirstEnhancements, 100);
    }
}

// Start initialization when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializeProblemFirstEnhancements);
} else {
    // DOM already loaded
    initializeProblemFirstEnhancements();
}