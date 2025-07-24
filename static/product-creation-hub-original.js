/**
 * Product Creation Hub - Frontend Controller
 * Integrates with backend services for Smart PRD & Wireframe Generator
 */

class ProductCreationHub {
    constructor() {
        this.currentProject = null;
        this.currentStep = 1;
        this.sessionId = this.generateSessionId();
        this.questions = [];
        this.answers = [];
        this.waitingForAnswer = false;
        this.prdDocument = null;
        this.wireframes = null;
        this.marketInsights = null;
        this.projectIntelligence = null;
        this.eventListenersInitialized = false;
        this.isProcessing = false;
        this.readyForQuestions = false;
        
        this.initializeEventListeners();
        this.initializeAnalytics();
        this.loadExistingProject();
        
        // Project reset utility
        window.clearProject = () => {
            localStorage.removeItem('currentProjectId');
            localStorage.removeItem('currentProject');
            location.reload();
        };
    }

    generateSessionId() {
        return `session-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    }

    getDefaultQuestions() {
        return [
            { question: "Who is your target audience and what are their main needs?" },
            { question: "What are the core features your project must have?" },
            { question: "What platforms should your project support (web, mobile, desktop)?" },
            { question: "Do you have any specific design preferences or branding requirements?" },
            { question: "What is your timeline and budget for this project?" }
        ];
    }

    async initializeAnalytics() {
        try {
            const response = await fetch('/api/analytics/start-session', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    sessionId: this.sessionId,
                    userContext: {
                        userAgent: navigator.userAgent,
                        referrer: document.referrer,
                        timestamp: new Date().toISOString()
                    }
                })
            });
            
            if (response.ok) {
                console.log('Analytics session started:', this.sessionId);
            }
        } catch (error) {
            console.warn('Analytics initialization failed:', error);
        }
    }

    initializeEventListeners() {
        // Prevent multiple initialization
        if (this.eventListenersInitialized) {
            console.log('🚫 Event listeners already initialized, skipping');
            return;
        }
        
        // Send message functionality
        const sendBtn = document.getElementById('sendMessage');
        const messageInput = document.getElementById('messageInput');
        
        console.log('🔗 Initializing event listeners:', {
            sendBtn: !!sendBtn,
            messageInput: !!messageInput
        });
        
        // Remove any existing listeners first
        if (sendBtn) {
            sendBtn.replaceWith(sendBtn.cloneNode(true));
            document.getElementById('sendMessage').addEventListener('click', () => {
                console.log('🖱️ Send button clicked');
                this.sendMessage();
            });
        }
        
        if (messageInput) {
            messageInput.replaceWith(messageInput.cloneNode(true));
            document.getElementById('messageInput').addEventListener('keypress', (e) => {
                console.log('⌨️ Key pressed:', e.key, 'shiftKey:', e.shiftKey);
                if (e.key === 'Enter' && !e.shiftKey) {
                    console.log('✅ Enter key detected - calling sendMessage');
                    e.preventDefault();
                    this.sendMessage();
                }
            });
        }

        // Wizard steps
        document.getElementById('startWizard')?.addEventListener('click', () => this.startWizard());
        document.getElementById('generatePRD')?.addEventListener('click', () => this.generatePRD());
        document.getElementById('startConsultation')?.addEventListener('click', () => this.startConsultation());
        document.getElementById('generateWireframes')?.addEventListener('click', () => this.generateWireframes());
        document.getElementById('manageVersions')?.addEventListener('click', () => this.openVersionManager());
        document.getElementById('exportProject')?.addEventListener('click', () => this.exportProject());

        // PRD actions
        document.getElementById('viewFullPRD')?.addEventListener('click', () => this.viewFullPRD());
        document.getElementById('exportPRD')?.addEventListener('click', () => this.exportPRD());
        document.getElementById('sharePRD')?.addEventListener('click', () => this.sharePRD());
        document.getElementById('sendToClaudeCode')?.addEventListener('click', () => this.sendToClaudeCode());

        // Quick actions
        document.getElementById('duplicateProject')?.addEventListener('click', () => this.duplicateProject());
        document.getElementById('shareProject')?.addEventListener('click', () => this.shareProject());
        document.getElementById('exportAll')?.addEventListener('click', () => this.exportAll());
        document.getElementById('viewAnalytics')?.addEventListener('click', () => this.openAnalyticsDashboard());
        document.getElementById('getHelp')?.addEventListener('click', () => this.getHelp());

        // Modal controls
        document.getElementById('editPRD')?.addEventListener('click', () => this.editPRD());
        document.getElementById('downloadPRD')?.addEventListener('click', () => this.exportPRD());
        document.getElementById('closePRDModal')?.addEventListener('click', () => this.closePRDModal());
        document.getElementById('closeWireframesModal')?.addEventListener('click', () => this.closeWireframesModal());
        document.getElementById('closeSuccessModal')?.addEventListener('click', () => this.closeSuccessModal());
        document.getElementById('closeConsultationModal')?.addEventListener('click', () => this.closeConsultationModal());
        document.getElementById('closeVersionModal')?.addEventListener('click', () => this.closeVersionModal());

        // Consultation controls
        document.getElementById('selectAllPersonas')?.addEventListener('click', () => this.selectAllPersonas());
        document.getElementById('startPersonaConsultation')?.addEventListener('click', () => this.startPersonaConsultation());
        document.getElementById('exportConsultationReport')?.addEventListener('click', () => this.exportConsultationReport());
        document.getElementById('applyRecommendations')?.addEventListener('click', () => this.applyRecommendations());

        // Version management controls
        document.getElementById('createVersion')?.addEventListener('click', () => this.createNewVersion());
        document.getElementById('createBranch')?.addEventListener('click', () => this.createNewBranch());
        document.getElementById('compareVersions')?.addEventListener('click', () => this.compareSelectedVersions());
        document.getElementById('createIterationPlan')?.addEventListener('click', () => this.createIterationPlan());
        document.getElementById('exportVersionHistory')?.addEventListener('click', () => this.exportVersionHistory());
        document.getElementById('rollbackVersion')?.addEventListener('click', () => this.rollbackToSelectedVersion());

        // Version management tab switching (only for version modal)
        document.querySelectorAll('#versionModal .tab-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                this.switchVersionTab(e.target.dataset.tab);
            });
        });
        
        // Consultation tab switching (only for consultation modal)
        document.querySelectorAll('#consultationModal .tab-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                this.switchConsultationTab(e.target.dataset.tab);
            });
        });

        // Expandable sections
        document.querySelectorAll('.expand-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.preventDefault();
                const button = e.currentTarget; // Use currentTarget to get the button, not the clicked icon
                const section = button.dataset.section;
                this.toggleSection(section);
            });
        });

        // Theme toggle
        document.getElementById('themeToggle')?.addEventListener('click', () => this.toggleTheme());
        
        // Context Priming button
        document.getElementById('contextPriming')?.addEventListener('click', () => this.openContextPriming());
        
        // IDE Enter button
        document.getElementById('enterIDE')?.addEventListener('click', () => this.enterIDE());
        
        // Skip buttons
        document.getElementById('skipPRD')?.addEventListener('click', () => this.skipStep(3));
        document.getElementById('skipConsultation')?.addEventListener('click', () => this.skipStep(4));
        document.getElementById('skipWireframes')?.addEventListener('click', () => this.skipStep(5));
        document.getElementById('skipVersions')?.addEventListener('click', () => this.skipStep(6));
        
        // Mark as initialized
        this.eventListenersInitialized = true;
        console.log('✅ Event listeners initialized successfully');
    }

    async sendMessage() {
        console.log('🔄 sendMessage() called');
        
        // Prevent re-entrant calls
        if (this.isProcessing) {
            console.log('🚫 Already processing, ignoring duplicate call');
            return;
        }
        
        const messageInput = document.getElementById('messageInput');
        const message = messageInput.value.trim();
        
        if (!message) {
            console.log('❌ Empty message, returning');
            return;
        }

        // Add user message to chat
        this.addMessageToChat(message, 'user');
        messageInput.value = '';
        
        // Ensure input field retains focus for next message
        setTimeout(() => messageInput.focus(), 100);
        
        // CRITICAL: Prevent any other processing during this function
        const processingFlag = this.isProcessing;
        this.isProcessing = true;

        console.log('📊 sendMessage state:', {
            currentProject: !!this.currentProject,
            waitingForAnswer: this.waitingForAnswer,
            answersLength: this.answers.length,
            questionsLength: this.questions.length,
            message: message.substring(0, 50) + (message.length > 50 ? '...' : '')
        });

        // Check if we're waiting for an answer to a question
        if (this.waitingForAnswer && this.currentProject) {
            console.log('✅ Processing user answer since waitingForAnswer is true');
            try {
                await this.handleUserAnswer(message);
                console.log('✅ handleUserAnswer completed');
                this.isProcessing = processingFlag;
                return;
            } catch (error) {
                console.error('❌ Error in handleUserAnswer:', error);
                this.addMessageToChat('Sorry, there was an error processing your answer. Please try again.', 'assistant');
                this.isProcessing = processingFlag;
                return;
            }
        }

        // Check if this is the initial project description
        console.log('🔍 Checking if this is initial project description:', {
            hasCurrentProject: !!this.currentProject,
            currentProject: this.currentProject,
            messagePreview: message.substring(0, 30)
        });
        
        if (!this.currentProject) {
            console.log('🚀 Processing initial project description - CONFIRMED');
            
            try {
                // Skip API call and go straight to questions
                this.currentProject = {
                    id: `project-${Date.now()}`,
                    originalRequest: message,
                    projectType: 'web-application',
                };
                
                console.log('✅ Project created:', this.currentProject);
                
                // Move to step 2 now that we're starting the questions
                this.setStep(2);
                this.updateProgress(25, 'Answer 5 questions');
                
                // Ensure questions are properly initialized
                const defaultQuestions = this.getDefaultQuestions();
                console.log('📋 Default questions loaded:', defaultQuestions);
                
                // Validate that questions are properly formatted
                if (!defaultQuestions || !Array.isArray(defaultQuestions) || defaultQuestions.length === 0) {
                    console.error('❌ getDefaultQuestions returned invalid data:', defaultQuestions);
                    this.addMessageToChat('Sorry, there was an error initializing the question system. Please refresh the page and try again.', 'assistant');
                    this.isProcessing = processingFlag;
                return;
            }
            
            // Validate each question has the required structure
            const validQuestions = defaultQuestions.every(q => q && typeof q === 'object' && typeof q.question === 'string');
            if (!validQuestions) {
                console.error('❌ Some questions are malformed:', defaultQuestions);
                this.addMessageToChat('Sorry, there was an error with the question format. Please refresh the page and try again.', 'assistant');
                this.isProcessing = processingFlag;
                return;
            }
            
            this.questions = defaultQuestions;
            this.answers = [];
            
            console.log('✅ Project created with validated questions:', {
                questionsLength: this.questions.length,
                questionsArray: this.questions,
                firstQuestion: this.questions[0],
                firstQuestionText: this.questions[0]?.question
            });
            
            this.addMessageToChat(
                `Great! I've analyzed your project idea. I'll now ask you 5 targeted questions to better understand your requirements and create a comprehensive PRD.`,
                'assistant'
            );

            this.updateProgress(10, 'Project idea captured');
            
            // Move to step 2 and show welcome message
            console.log('🎯 About to call setStep(2)...');
            setTimeout(() => {
                this.setStep(2);
                this.updateProgress(25, 'Answer 5 questions');
                console.log('✅ setStep(2) called after delay');
            }, 50);
            
            this.addMessageToChat(
                'Perfect! I understand your project. Let\'s gather some details to create the best possible requirements document.',
                'assistant'
            );
            
            // Add the first question after a brief delay
            setTimeout(() => {
                this.waitingForAnswer = true;
                this.addMessageToChat('Question 1 of 5: Who is your target audience and what are their main needs?', 'assistant');
                
                // Clear the input field for Question 1
                const messageInput = document.getElementById('messageInput');
                if (messageInput) {
                    messageInput.value = '';
                    messageInput.placeholder = '';
                    messageInput.focus();
                }
            }, 500);
            
            console.log('🏁 Resetting processing flag and returning');
            this.isProcessing = processingFlag;
            return;
        }
        
        // Reset processing flag
        this.isProcessing = processingFlag;
    }

    async startWizard() {
        console.log('🚀 startWizard called with full debug info:', {
            currentProject: !!this.currentProject,
            questionsLength: this.questions ? this.questions.length : 'undefined',
            answersLength: this.answers ? this.answers.length : 'undefined',
            questionsArray: this.questions
        });
        
        if (!this.currentProject) {
            console.log('❌ No currentProject, returning from startWizard');
            return;
        }

        if (!this.questions || this.questions.length === 0) {
            console.log('❌ No questions available, loading default questions');
            this.questions = this.getDefaultQuestions();
        }

        console.log('✅ startWizard proceeding with questions:', this.questions.length);
        this.setStep(2);
        this.updateProgress(25, 'Starting interview process');

        // Start the questioning process
        this.addMessageToChat('Perfect! Let\'s gather some details about your project. I\'ll ask you 5 questions to create the best possible requirements document.', 'assistant');
        
        try {
            console.log('🔄 About to call askNextQuestion...');
            await this.askNextQuestion();
            console.log('✅ askNextQuestion completed successfully');
            console.log('🔍 Final state after askNextQuestion:', {
                waitingForAnswer: this.waitingForAnswer,
                questionsLength: this.questions.length,
                answersLength: this.answers.length
            });
        } catch (error) {
            console.error('❌ Error in askNextQuestion:', error);
            console.error('❌ Full error details:', error.stack);
            this.addMessageToChat('Sorry, there was an error starting the questions. Please refresh and try again.', 'assistant');
        }
    }

    async askNextQuestion() {
        const currentQuestionIndex = this.answers.length;
        console.log('❓ askNextQuestion called:', {
            currentQuestionIndex,
            totalQuestions: this.questions ? this.questions.length : 'questions is null/undefined',
            questionsArray: this.questions,
            questionsType: typeof this.questions,
            isArray: Array.isArray(this.questions)
        });
        
        
        // IMMEDIATE: Force reinitialization every time to bypass any corruption
        console.log('🔧 FORCE reinitializing questions to ensure they exist');
        this.questions = this.getDefaultQuestions();
        console.log('📋 Questions FORCE reinitialized:', {
            questions: this.questions,
            length: this.questions.length,
            firstQuestion: this.questions[0],
            firstQuestionStructure: this.questions[0] ? Object.keys(this.questions[0]) : 'undefined'
        });
        
        // Double-check initialization worked
        if (!this.questions || this.questions.length === 0) {
            console.error('❌ FORCE reinitialization FAILED');
            this.addMessageToChat('Critical error: Cannot initialize questions. Please refresh the page.', 'assistant');
            return;
        }
        
        if (currentQuestionIndex >= this.questions.length) {
            console.log('✅ All questions answered - calling completeQuestioning');
            this.completeQuestioning();
            return;
        }

        let question = this.questions[currentQuestionIndex];
        console.log('📋 Asking question at index', currentQuestionIndex, ':', question);
        
        if (!question || !question.question) {
            console.error('❌ Question is undefined or malformed at index:', currentQuestionIndex);
            console.error('❌ Questions array:', this.questions);
            console.error('❌ Question object:', question);
            
            // Try to reinitialize questions and retry once
            this.questions = this.getDefaultQuestions();
            console.log('🔄 Retrying with reinitialized questions');
            const retryQuestion = this.questions[currentQuestionIndex];
            if (!retryQuestion || !retryQuestion.question) {
                console.error('❌ Still no valid question after reinitialize, aborting');
                this.addMessageToChat('Sorry, there was an error with the question system. Please refresh the page and try again.', 'assistant');
                return;
            }
            // Use the retry question
            question = retryQuestion;
        }
        
        // Final safety check before accessing question.question
        if (!question || typeof question !== 'object' || !question.question) {
            console.error('❌ CRITICAL: Question is still invalid after all checks:', {
                question,
                questionType: typeof question,
                hasQuestionProperty: question && 'question' in question,
                questionValue: question && question.question,
                questionsArray: this.questions,
                currentIndex: currentQuestionIndex
            });
            this.addMessageToChat('Sorry, there was an error loading the questions. Please refresh the page and try again.', 'assistant');
            return;
        }

        this.addMessageToChat(
            `Question ${currentQuestionIndex + 1} of ${this.questions.length}: ${question.question}`,
            'assistant'
        );

        // Clear the input field AFTER displaying the question
        setTimeout(() => {
            const messageInput = document.getElementById('messageInput');
            if (messageInput) {
                messageInput.value = '';
                messageInput.placeholder = '';
                messageInput.focus();
            }
        }, 100);

        // Update step progress
        this.updateQuestionProgress(currentQuestionIndex, this.questions.length);

        // Wait for user response
        this.waitingForAnswer = true;
        console.log('🔄 Set waitingForAnswer to TRUE, asking question:', currentQuestionIndex + 1);
        console.log('🔍 Current state after setting waitingForAnswer:', {
            waitingForAnswer: this.waitingForAnswer,
            currentProject: !!this.currentProject,
            answersLength: this.answers.length
        });
        
        // Confirm waitingForAnswer was set correctly
        console.log('✅ waitingForAnswer set to:', this.waitingForAnswer);
    }

    async handleUserAnswer(answer) {
        console.log('🎯 handleUserAnswer called with:', {
            answer: answer.substring(0, 50) + (answer.length > 50 ? '...' : ''),
            waitingForAnswer: this.waitingForAnswer,
            currentAnswersLength: this.answers.length,
            totalQuestions: this.questions.length
        });

        if (!this.waitingForAnswer) {
            console.log('❌ Not waiting for answer, returning early');
            console.log('🔍 Current state details:', {
                waitingForAnswer: this.waitingForAnswer,
                hasCurrentProject: !!this.currentProject,
                questionsLength: this.questions.length,
                answersLength: this.answers.length
            });
            return;
        }

        console.log('✅ handleUserAnswer proceeding - waitingForAnswer is true');

        try {
            this.answers.push({ answer, timestamp: new Date().toISOString() });
            this.waitingForAnswer = false;
            console.log('✅ Answer stored, waitingForAnswer set to false');

            // Track question answering
            await this.trackEvent('question_answered', {
                projectId: this.currentProject.id,
                questionIndex: this.answers.length - 1,
                responseLength: answer.length
            });

            // Ask next question or complete
            if (this.answers.length < this.questions.length) {
                console.log(`📝 ${this.answers.length}/${this.questions.length} questions answered - asking next question`);
                await this.askNextQuestion();
            } else {
                console.log('🎉 All questions answered - completing questioning');
                this.completeQuestioning();
            }
        } catch (error) {
            console.error('❌ Error in handleUserAnswer:', error);
            this.addMessageToChat('Sorry, there was an error processing your answer. Please try again.', 'assistant');
            this.waitingForAnswer = true; // Reset flag so user can try again
        }
    }

    completeQuestioning() {
        this.updateProgress(50, 'Interview completed');
        this.updateQuestionProgress(this.questions.length, this.questions.length);
        
        this.addMessageToChat(
            'Excellent! I have all the information I need. ✅ **Next Step**: Click the "Generate PRD" button in Step 3 on the right to create your Product Requirements Document.',
            'assistant'
        );

        this.setStep(3);
        document.getElementById('generatePRD').disabled = false;
        document.getElementById('skipPRD').disabled = false;
        
        // Add visual highlight to the Generate PRD button
        const generateButton = document.getElementById('generatePRD');
        if (generateButton) {
            generateButton.style.animation = 'pulse 2s infinite';
            generateButton.style.boxShadow = '0 0 20px rgba(139, 92, 246, 0.5)';
        }
    }

    async generatePRD() {
        // Clear the pulse animation
        const generateButton = document.getElementById('generatePRD');
        if (generateButton) {
            generateButton.style.animation = '';
            generateButton.style.boxShadow = '';
        }
        
        this.updateProgress(70, 'Generating PRD...');
        this.setPRDStatus('in-progress');

        try {
            const response = await fetch('/api/generate-prd', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    projectId: this.currentProject.id,
                    originalRequest: this.currentProject.originalRequest,
                    questions: this.questions,
                    answers: this.answers,
                    sessionId: this.sessionId
                })
            });

            const result = await response.json();

            if (result.success) {
                this.prdDocument = result.prdDocument;
                this.updatePRDPreview(this.prdDocument);
                this.setPRDStatus('completed');
                this.updateProgress(80, 'PRD generated successfully');
                
                this.addMessageToChat(
                    'Your Product Requirements Document has been generated! You can view it in the PRD Assistant panel on the right.',
                    'assistant'
                );

                this.setStep(4);
                document.getElementById('startConsultation').disabled = false;
                document.getElementById('skipConsultation').disabled = false;

                // Track PRD generation
                await this.trackEvent('prd_generated', {
                    projectId: this.currentProject.id,
                    contentLength: this.prdDocument.content.length,
                    confidence: this.prdDocument.metadata.confidence
                });

                // Load Success Accelerators after PRD is generated
                try {
                    console.log('🔄 Loading Success Accelerators data after PRD generation...');
                    await this.loadMarketInsights();
                    await this.loadProjectIntelligence();
                    console.log('✅ Success Accelerators data loaded successfully');
                } catch (error) {
                    console.error('⚠️ Failed to load Success Accelerators:', error);
                    // Don't block the flow if accelerators fail to load
                }

            } else {
                throw new Error(result.error || 'Failed to generate PRD');
            }
        } catch (error) {
            console.error('Error generating PRD:', error);
            this.addMessageToChat('Sorry, there was an error generating your PRD. Please try again.', 'assistant');
            this.setPRDStatus('Not Started');
        }
    }

    async generateWireframes() {
        this.updateProgress(90, 'Creating wireframes...');

        try {
            const response = await fetch('/api/wireframes/generate', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    projectId: this.currentProject.id,
                    prdDocument: this.prdDocument,
                    sessionId: this.sessionId
                })
            });

            const result = await response.json();

            if (result.success) {
                this.wireframes = result.wireframes;
                this.updateProgress(100, 'Project complete!');
                
                this.addMessageToChat(
                    `Perfect! I've created ${this.wireframes.wireframes.length} wireframe layouts for your project. Opening wireframes viewer...`,
                    'assistant'
                );

                // Show wireframes immediately after generation
                setTimeout(() => this.viewWireframes(), 1000);

                this.setStep(6);
                document.getElementById('manageVersions').disabled = false;
                document.getElementById('skipVersions').disabled = false;

                // Track wireframe generation
                await this.trackEvent('wireframes_generated', {
                    projectId: this.currentProject.id,
                    wireframeCount: this.wireframes.wireframes.length
                });

            } else {
                throw new Error(result.error || 'Failed to generate wireframes');
            }
        } catch (error) {
            console.error('Error generating wireframes:', error);
            this.addMessageToChat('Sorry, there was an error generating wireframes. Please try again.', 'assistant');
        }
    }

    // Wireframes Viewing Method
    viewWireframes() {
        console.log('🔄 Opening wireframes viewer...');
        console.log('Wireframes data:', this.wireframes);
        
        if (!this.wireframes || !this.wireframes.wireframes) {
            console.error('❌ No wireframes data available');
            this.addMessageToChat('No wireframes available. Please generate wireframes first.', 'assistant');
            return;
        }

        const modal = document.getElementById('wireframesModal');
        const content = document.getElementById('wireframesModalContent');
        
        if (!modal || !content) {
            console.error('❌ Wireframes modal elements not found');
            this.addMessageToChat('Error: Wireframes viewer not available.', 'assistant');
            return;
        }
        
        console.log(`✅ Found ${this.wireframes.wireframes.length} wireframes to display`);
        
        // Debug: Check the first wireframe content
        if (this.wireframes.wireframes.length > 0) {
            console.log('First wireframe HTML content:', this.wireframes.wireframes[0].htmlContent);
        }

        // Store wireframes data for access in button handlers
        window.currentWireframes = this.wireframes.wireframes;
        
        // Populate wireframes content
        content.innerHTML = `
            <div class="wireframes-grid">
                ${this.wireframes.wireframes.map((wireframe, index) => `
                    <div class="wireframe-item">
                        <h4>${wireframe.name}</h4>
                        <div class="wireframe-preview">
                            ${wireframe.htmlContent || '<p>Preview not available</p>'}
                        </div>
                        <div class="wireframe-actions">
                            <button class="btn secondary" onclick="productCreationHub.openWireframeFullView(${index})">
                                <i class="fas fa-external-link-alt"></i>
                                Open Full View
                            </button>
                        </div>
                    </div>
                `).join('')}
            </div>
        `;

        // Show modal
        modal.style.display = 'flex';
        
        console.log('✅ Wireframes modal opened with', this.wireframes.wireframes.length, 'wireframes');
    }

    closeWireframesModal() {
        const modal = document.getElementById('wireframesModal');
        if (modal) {
            modal.style.display = 'none';
        }
    }

    // Multi-Persona Consultation Methods
    async startConsultation() {
        if (!this.currentProject) return;

        this.addMessageToChat(
            'Let\'s get expert insights from our AI consultants! I\'ll analyze your project with multiple specialized personas.',
            'assistant'
        );

        // Show consultation modal
        await this.showConsultationModal();
    }

    async showConsultationModal() {
        try {
            const modal = document.getElementById('consultationModal');
            if (!modal) {
                console.error('Consultation modal not found');
                this.addMessageToChat('Error: Consultation interface not available.', 'assistant');
                return;
            }
            
            console.log('🔄 Opening consultation modal...');
            
            // Load available personas
            await this.loadAvailablePersonas();
            
            // Setup tab switching for consultation
            this.setupTabSwitching();
            
            modal.style.display = 'flex';
            console.log('✅ Consultation modal opened successfully');
        } catch (error) {
            console.error('Error opening consultation modal:', error);
            this.addMessageToChat('Sorry, there was an error opening the AI consultation. Please try again.', 'assistant');
        }
    }

    async loadAvailablePersonas() {
        try {
            console.log('🔄 Loading available personas...');
            const response = await fetch('/api/personas/available');
            
            if (!response.ok) {
                throw new Error(`HTTP ${response.status}: ${response.statusText}`);
            }
            
            const result = await response.json();
            console.log('📊 Personas API response:', result);

            if (result.success && result.personas) {
                this.availablePersonas = result.personas;
                this.renderPersonaGrid(result.personas);
                console.log(`✅ Loaded ${result.personas.length} personas successfully`);
            } else {
                throw new Error(result.error || 'No personas data received');
            }
        } catch (error) {
            console.error('❌ Error loading personas:', error);
            // Show fallback message in the consultation modal
            const grid = document.getElementById('personaGrid');
            if (grid) {
                grid.innerHTML = `
                    <div class="error-message">
                        <i class="fas fa-exclamation-triangle"></i>
                        <p>Unable to load AI experts. Please try again later.</p>
                        <button class="btn secondary" onclick="window.productCreationHub.loadAvailablePersonas()">
                            <i class="fas fa-refresh"></i> Retry
                        </button>
                    </div>
                `;
            }
        }
    }

    renderPersonaGrid(personas) {
        const grid = document.getElementById('personaGrid');
        if (!grid) return;

        grid.innerHTML = personas.map(persona => `
            <div class="persona-card" data-persona-id="${persona.id}">
                <div class="persona-header">
                    <div class="persona-icon" style="background-color: ${persona.color}">
                        <i class="${persona.iconClass}"></i>
                    </div>
                    <h5 class="persona-name">${persona.name}</h5>
                </div>
                <ul class="persona-expertise">
                    ${persona.expertise.map(skill => `<li>${skill}</li>`).join('')}
                </ul>
            </div>
        `).join('');

        // Add click handlers for persona selection
        grid.querySelectorAll('.persona-card').forEach(card => {
            card.addEventListener('click', () => this.togglePersonaSelection(card));
        });
    }

    togglePersonaSelection(card) {
        card.classList.toggle('selected');
        this.updateConsultationButton();
    }

    selectAllPersonas() {
        const cards = document.querySelectorAll('.persona-card');
        const allSelected = Array.from(cards).every(card => card.classList.contains('selected'));
        
        cards.forEach(card => {
            if (allSelected) {
                card.classList.remove('selected');
            } else {
                card.classList.add('selected');
            }
        });
        
        this.updateConsultationButton();
    }

    updateConsultationButton() {
        const selectedCards = document.querySelectorAll('.persona-card.selected');
        const button = document.getElementById('startPersonaConsultation');
        
        if (button) {
            button.disabled = selectedCards.length === 0;
        }
    }

    async startPersonaConsultation() {
        const selectedCards = document.querySelectorAll('.persona-card.selected');
        const selectedPersonas = Array.from(selectedCards).map(card => 
            card.getAttribute('data-persona-id')
        );

        if (selectedPersonas.length === 0) return;

        // Hide persona selection and show loading
        document.getElementById('personaSelection').style.display = 'none';
        document.getElementById('consultationResults').style.display = 'block';

        try {
            const response = await fetch('/api/consultation/analyze', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    projectId: this.currentProject.id,
                    personas: selectedPersonas,
                    prdDocument: this.prdDocument
                })
            });

            const result = await response.json();

            if (result.success) {
                this.consultationResult = result.consultation;
                this.renderConsultationResults(result.consultation);
                
                this.addMessageToChat(
                    `Expert consultation complete! ${result.consultation.summary.totalPersonas} experts have analyzed your project. Check the consultation modal for detailed insights.`,
                    'assistant'
                );

                // Move to next step
                this.setStep(5);
                document.getElementById('generateWireframes').disabled = false;
                document.getElementById('skipWireframes').disabled = false;

                // Track consultation
                await this.trackEvent('consultation_completed', {
                    projectId: this.currentProject.id,
                    personasConsulted: selectedPersonas.length,
                    criticalFindings: result.consultation.summary.criticalFindings
                });

            } else {
                throw new Error(result.error || 'Failed to conduct consultation');
            }
        } catch (error) {
            console.error('Error conducting consultation:', error);
            this.addMessageToChat('Sorry, there was an error conducting the expert consultation. Please try again.', 'assistant');
        }
    }

    renderConsultationResults(consultation) {
        // Update summary metrics
        document.getElementById('totalPersonas').textContent = consultation.summary.totalPersonas;
        document.getElementById('criticalFindings').textContent = consultation.summary.criticalFindings;
        document.getElementById('successProbability').textContent = `${consultation.summary.estimatedSuccessProbability}%`;
        document.getElementById('consensusLevel').textContent = `${consultation.summary.consensusLevel}%`;

        // Render overview tab
        this.renderOverviewTab(consultation);
        
        // Render insights tab
        this.renderInsightsTab(consultation);
        
        // Render actions tab
        this.renderActionsTab(consultation);
        
        // Render risks tab
        this.renderRisksTab(consultation);

        // Setup tab switching
        this.setupTabSwitching();
    }

    renderOverviewTab(consultation) {
        const agreementsEl = document.getElementById('expertAgreements');
        const conflictsEl = document.getElementById('expertConflicts');

        if (agreementsEl && consultation.analysis && consultation.analysis.agreements) {
            agreementsEl.innerHTML = consultation.analysis.agreements
                .map(agreement => `<li>${agreement}</li>`)
                .join('');
        }

        if (conflictsEl && consultation.analysis && consultation.analysis.conflicts) {
            conflictsEl.innerHTML = consultation.analysis.conflicts
                .map(conflict => `<li>${conflict}</li>`)
                .join('');
        }
    }

    renderInsightsTab(consultation) {
        const container = document.getElementById('personaInsights');
        if (!container) return;

        // Convert object of persona insights to array format
        if (consultation.personaInsights && typeof consultation.personaInsights === 'object') {
            const insightsHTML = Object.entries(consultation.personaInsights).map(([personaId, insight]) => {
                // Get persona name from ID
                const personaNames = {
                    'ux-designer': 'UX Designer',
                    'backend-engineer': 'Backend Engineer',
                    'frontend-developer': 'Frontend Developer',
                    'product-manager': 'Product Manager',
                    'security-expert': 'Security Expert',
                    'devops-engineer': 'DevOps Engineer'
                };
                
                return `
                    <div class="persona-insight">
                        <div class="persona-insight-header">
                            <div class="persona-insight-title">
                                <h5>${personaNames[personaId] || personaId}</h5>
                                <span class="insight-priority">Score: ${insight.score || 0}%</span>
                            </div>
                        </div>
                        
                        <div class="insight-section">
                            <h6>Concerns</h6>
                            <ul>
                                ${insight.concerns ? insight.concerns.map(item => `<li>${item}</li>`).join('') : '<li>No concerns identified</li>'}
                            </ul>
                        </div>
                        
                        <div class="insight-section">
                            <h6>Suggestions</h6>
                            <ul>
                                ${insight.suggestions ? insight.suggestions.map(item => `<li>${item}</li>`).join('') : '<li>No suggestions available</li>'}
                            </ul>
                        </div>
                    </div>
                `;
            }).join('');
            
            container.innerHTML = insightsHTML;
        } else {
            container.innerHTML = '<p>No persona insights available</p>';
        }
    }

    renderActionsTab(consultation) {
        const immediateEl = document.getElementById('immediateActions');
        const shortTermEl = document.getElementById('shortTermActions');
        const longTermEl = document.getElementById('longTermActions');

        if (immediateEl && consultation.analysis && consultation.analysis.recommendations && consultation.analysis.recommendations.immediate) {
            immediateEl.innerHTML = consultation.analysis.recommendations.immediate
                .map(action => `<li>${action}</li>`)
                .join('');
        }

        if (shortTermEl && consultation.analysis && consultation.analysis.recommendations && consultation.analysis.recommendations.shortTerm) {
            shortTermEl.innerHTML = consultation.analysis.recommendations.shortTerm
                .map(action => `<li>${action}</li>`)
                .join('');
        }

        if (longTermEl && consultation.analysis && consultation.analysis.recommendations && consultation.analysis.recommendations.longTerm) {
            longTermEl.innerHTML = consultation.analysis.recommendations.longTerm
                .map(action => `<li>${action}</li>`)
                .join('');
        }
    }

    renderRisksTab(consultation) {
        const securityEl = document.getElementById('securityRisks');
        const technicalEl = document.getElementById('technicalRisks');
        const businessEl = document.getElementById('businessRisks');
        const operationalEl = document.getElementById('operationalRisks');

        if (securityEl && consultation.risks && consultation.risks.security) {
            securityEl.innerHTML = consultation.risks.security
                .map(risk => `<li><strong>${risk.risk}:</strong> ${risk.mitigation} <span class="risk-severity ${risk.severity}">(${risk.severity})</span></li>`)
                .join('');
        }

        if (technicalEl && consultation.risks && consultation.risks.technical) {
            technicalEl.innerHTML = consultation.risks.technical
                .map(risk => `<li><strong>${risk.risk}:</strong> ${risk.mitigation} <span class="risk-severity ${risk.severity}">(${risk.severity})</span></li>`)
                .join('');
        }

        if (businessEl && consultation.risks && consultation.risks.business) {
            businessEl.innerHTML = consultation.risks.business
                .map(risk => `<li><strong>${risk.risk}:</strong> ${risk.mitigation} <span class="risk-severity ${risk.severity}">(${risk.severity})</span></li>`)
                .join('');
        }

        if (operationalEl && consultation.risks && consultation.risks.operational) {
            operationalEl.innerHTML = consultation.risks.operational
                .map(risk => `<li><strong>${risk.risk}:</strong> ${risk.mitigation} <span class="risk-severity ${risk.severity}">(${risk.severity})</span></li>`)
                .join('');
        }
    }

    setupTabSwitching() {
        const tabButtons = document.querySelectorAll('.tab-btn');
        const tabPanels = document.querySelectorAll('.tab-panel');

        tabButtons.forEach(button => {
            button.addEventListener('click', () => {
                const targetTab = button.getAttribute('data-tab');
                
                // Update button states
                tabButtons.forEach(btn => btn.classList.remove('active'));
                button.classList.add('active');
                
                // Update panel states
                tabPanels.forEach(panel => panel.classList.remove('active'));
                document.getElementById(targetTab)?.classList.add('active');
            });
        });
    }

    closeConsultationModal() {
        document.getElementById('consultationModal').style.display = 'none';
        
        // Reset modal state
        document.getElementById('personaSelection').style.display = 'block';
        document.getElementById('consultationResults').style.display = 'none';
        
        // Clear selections
        document.querySelectorAll('.persona-card').forEach(card => {
            card.classList.remove('selected');
        });
    }

    async exportConsultationReport() {
        if (!this.consultationResult) return;

        try {
            const response = await fetch(`/api/personas/consultation/${this.currentProject.id}/export`, {
                method: 'GET'
            });

            if (response.ok) {
                const blob = await response.blob();
                const url = window.URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = `consultation-report-${this.currentProject.id}.md`;
                a.click();
                window.URL.revokeObjectURL(url);
            }
        } catch (error) {
            console.error('Export failed:', error);
        }
    }

    applyRecommendations() {
        if (!this.consultationResult || !this.prdDocument) return;

        // Update PRD with expert recommendations
        const recommendations = this.consultationResult.analysis.recommendations;
        const agreements = this.consultationResult.analysis.agreements;
        const risks = this.consultationResult.risks;

        // Append expert insights to PRD
        let updatedContent = this.prdDocument.content + '\n\n## Expert Consultation Results\n\n';
        
        updatedContent += '### Expert Consensus Areas\n';
        agreements.forEach(agreement => {
            updatedContent += `- ${agreement}\n`;
        });
        
        updatedContent += '\n### Immediate Actions (Expert Recommendations)\n';
        recommendations.immediate.forEach(action => {
            updatedContent += `- ${action}\n`;
        });
        
        updatedContent += '\n### Risk Mitigation Strategies\n';
        Object.entries(risks).forEach(([category, riskList]) => {
            updatedContent += `\n**${category.charAt(0).toUpperCase() + category.slice(1)} Risks:**\n`;
            riskList.forEach(risk => {
                updatedContent += `- ${risk.risk}: ${risk.mitigation}\n`;
            });
        });

        // Update the PRD document
        this.prdDocument.content = updatedContent;
        this.prdDocument.metadata.hasExpertConsultation = true;
        
        // Update the PRD preview
        this.updatePRDPreview(this.prdDocument);
        
        this.addMessageToChat(
            'Expert recommendations have been successfully applied to your PRD. The document now includes expert consensus areas, immediate actions, and risk mitigation strategies.',
            'assistant'
        );

        this.closeConsultationModal();
        
        // Move to next step
        this.setStep(5);
        document.getElementById('generateWireframes').disabled = false;
        document.getElementById('skipWireframes').disabled = false;
    }

    async loadMarketInsights() {
        try {
            const response = await fetch(`/api/market-insights/${this.currentProject.id}`);
            const result = await response.json();
            
            if (result.success) {
                this.marketInsights = result.insights;
                this.updateMarketInsights(this.marketInsights);
                this.updateSuccessScore(result.insights.viability.score);
            }
        } catch (error) {
            console.error('Error loading market insights:', error);
        }
    }

    async loadProjectIntelligence() {
        try {
            const response = await fetch(`/api/intelligence/${this.currentProject.id}`);
            const result = await response.json();
            
            if (result.success) {
                this.projectIntelligence = result.intelligence;
                this.updateRecommendations(this.projectIntelligence.recommendations);
                this.updateTrendingFeatures(this.projectIntelligence.marketInsights?.trending);
            }
        } catch (error) {
            console.error('Error loading project intelligence:', error);
        }
    }

    // UI Update Methods
    addMessageToChat(message, sender) {
        const chatMessages = document.getElementById('chatMessages');
        const messageDiv = document.createElement('div');
        messageDiv.className = `message ${sender}-message`;
        
        // Check if this is a question message (starts with "Question X of Y:")
        const isQuestion = sender === 'assistant' && message.match(/^Question \d+ of \d+:/);
        if (isQuestion) {
            messageDiv.className += ' question-message glowing-green-border';
        }
        
        messageDiv.innerHTML = `
            <div class="message-avatar">
                <i class="fas fa-${sender === 'user' ? 'user' : 'robot'}"></i>
            </div>
            <div class="message-content">
                <p>${message}</p>
            </div>
        `;
        
        chatMessages.appendChild(messageDiv);
        chatMessages.scrollTop = chatMessages.scrollHeight;

        // Note: handleUserAnswer is called from sendMessage(), not here to avoid double-processing
    }

    setStep(stepNumber) {
        console.log(`🎯 setStep(${stepNumber}) called`);
        
        // Update wizard steps visual state
        const wizardSteps = document.querySelectorAll('.wizard-step');
        console.log(`📊 Found ${wizardSteps.length} wizard steps`);
        
        wizardSteps.forEach((step, index) => {
            step.classList.remove('active', 'completed');
            
            if (index + 1 === stepNumber) {
                step.classList.add('active');
                console.log(`✅ Set step ${index + 1} as active`);
            } else if (index + 1 < stepNumber) {
                step.classList.add('completed');
                console.log(`✅ Set step ${index + 1} as completed`);
            }
        });
        
        this.currentStep = stepNumber;
    }

    updateProgress(percentage, text) {
        const progressFill = document.getElementById('wizardProgress');
        const progressText = document.getElementById('progressText');
        
        if (progressFill) progressFill.style.width = `${percentage}%`;
        if (progressText) progressText.textContent = text;
    }

    updateQuestionProgress(answered, total) {
        const progressElement = document.getElementById('questionProgress');
        if (progressElement) {
            progressElement.textContent = `${answered}/${total} questions answered`;
        }
    }

    setPRDStatus(status) {
        const statusBadge = document.getElementById('prdStatus');
        if (statusBadge) {
            statusBadge.textContent = status;
            statusBadge.className = `status-badge ${status.toLowerCase().replace(' ', '-')}`;
        }
    }

    updatePRDPreview(prdDocument) {
        const preview = document.getElementById('prdPreview');
        const metrics = document.getElementById('prdMetrics');
        const actions = document.getElementById('prdActions');

        // Show PRD summary in preview
        const summary = this.extractPRDSummary(prdDocument.content);
        preview.innerHTML = `
            <div class="prd-summary">
                <h4>${prdDocument.title}</h4>
                <p>${summary}</p>
            </div>
        `;

        // Update metrics
        const completeness = (this.answers.length / this.questions.length) * 100;
        document.getElementById('completenessBar').style.width = `${completeness}%`;
        document.getElementById('completenessValue').textContent = `${Math.round(completeness)}%`;
        document.getElementById('confidenceIndicator').innerHTML = `
            <span class="confidence-level">${prdDocument.metadata.confidence}</span>
        `;

        // Show metrics and actions
        metrics.style.display = 'block';
        actions.style.display = 'flex';
    }

    updateMarketInsights(insights) {
        const section = document.getElementById('marketInsights').querySelector('.section-content');
        section.innerHTML = `
            <div class="insights-content" style="padding: 15px;">
                <div class="insight-item">
                    <span class="insight-label">Market Viability:</span>
                    <span class="insight-value">${insights.viability.score}/100</span>
                </div>
                <div class="insight-item">
                    <span class="insight-label">Competition Level:</span>
                    <span class="insight-value">${insights.competition.level}</span>
                </div>
                <div class="insight-item">
                    <span class="insight-label">Market Size:</span>
                    <span class="insight-value">${insights.marketSize.size}</span>
                </div>
            </div>
        `;
        
        // Auto-expand the section
        section.classList.remove('collapsed');
        section.classList.add('expanded');
        const button = document.querySelector('[data-section="market"]');
        if (button) {
            const icon = button.querySelector('i');
            if (icon) icon.style.transform = 'rotate(180deg)';
        }
    }

    updateRecommendations(recommendations) {
        const section = document.getElementById('aiRecommendations').querySelector('.section-content');
        const recList = recommendations.slice(0, 3).map(rec => 
            `<div class="recommendation-item">
                <strong>${rec.category}:</strong> ${rec.suggestions[0]}
            </div>`
        ).join('');
        
        section.innerHTML = `<div style="padding: 15px;">${recList}</div>`;
        
        // Auto-expand the section
        section.classList.remove('collapsed');
        section.classList.add('expanded');
        const button = document.querySelector('[data-section="recommendations"]');
        if (button) {
            const icon = button.querySelector('i');
            if (icon) icon.style.transform = 'rotate(180deg)';
        }
    }

    updateTrendingFeatures(trending) {
        if (!trending) return;
        
        const section = document.getElementById('trendingFeatures').querySelector('.section-content');
        const featuresList = trending.features.slice(0, 3).map(feature => 
            `<div class="trending-item">
                <span class="feature-name">${feature.feature}</span>
                <span class="feature-adoption">${feature.adoption}% adoption</span>
            </div>`
        ).join('');
        
        section.innerHTML = `<div style="padding: 15px;">${featuresList}</div>`;
        
        // Auto-expand the section
        section.classList.remove('collapsed');
        section.classList.add('expanded');
        const button = document.querySelector('[data-section="trending"]');
        if (button) {
            const icon = button.querySelector('i');
            if (icon) icon.style.transform = 'rotate(180deg)';
        }
    }

    updateSuccessScore(score) {
        const scoreElement = document.getElementById('successScore');
        if (scoreElement) {
            scoreElement.textContent = `${score}%`;
        }
    }

    // Modal Methods
    viewFullPRD() {
        if (!this.prdDocument) return;
        
        const modal = document.getElementById('prdModal');
        const content = document.getElementById('prdModalContent');
        
        content.innerHTML = `<pre style="white-space: pre-wrap; font-family: 'Inter', sans-serif;">${this.prdDocument.content}</pre>`;
        modal.style.display = 'flex';
    }

    closePRDModal() {
        document.getElementById('prdModal').style.display = 'none';
    }

    closeWireframesModal() {
        document.getElementById('wireframesModal').style.display = 'none';
    }

    closeSuccessModal() {
        document.getElementById('successModal').style.display = 'none';
    }

    closeConsultationModal() {
        const modal = document.getElementById('consultationModal');
        if (modal) {
            modal.style.display = 'none';
        }
    }

    // Section toggle for expandable content
    toggleSection(sectionName) {
        const button = document.querySelector(`[data-section="${sectionName}"]`);
        const section = button.closest('.accelerator-section');
        const content = section.querySelector('.section-content');
        const icon = button.querySelector('i');
        
        if (content.classList.contains('collapsed')) {
            content.classList.remove('collapsed');
            content.classList.add('expanded');
            if (icon) icon.style.transform = 'rotate(180deg)';
        } else {
            content.classList.remove('expanded');
            content.classList.add('collapsed');
            if (icon) icon.style.transform = 'rotate(0deg)';
        }
    }

    // Utility Methods
    extractPRDSummary(content) {
        const lines = content.split('\n');
        const summaryStart = lines.findIndex(line => line.includes('Executive Summary'));
        if (summaryStart === -1) return 'Product Requirements Document generated successfully.';
        
        return lines.slice(summaryStart + 2, summaryStart + 4).join(' ').substring(0, 200) + '...';
    }

    async trackEvent(eventType, eventData) {
        try {
            await fetch('/api/analytics/event', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    sessionId: this.sessionId,
                    eventType,
                    eventData
                })
            });
        } catch (error) {
            console.warn('Analytics tracking failed:', error);
        }
    }

    // Action Methods
    async exportPRD() {
        if (!this.prdDocument) return;
        
        try {
            const response = await fetch(`/api/prd/export/${this.currentProject.id}?format=markdown`, {
                method: 'GET'
            });
            
            if (response.ok) {
                const blob = await response.blob();
                const url = window.URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = `${this.prdDocument.title}-PRD.md`;
                a.click();
                window.URL.revokeObjectURL(url);
            }
        } catch (error) {
            console.error('Export failed:', error);
        }
    }

    editPRD() {
        if (!this.prdDocument) {
            this.addMessageToChat('No PRD available to edit. Please generate a PRD first.', 'assistant');
            return;
        }
        
        // Open PRD modal for editing
        this.viewFullPRD();
        
        // Make content editable
        const modalContent = document.getElementById('prdModalContent');
        if (modalContent) {
            modalContent.contentEditable = true;
            modalContent.style.border = '2px solid #10b981';
            modalContent.style.padding = '20px';
            modalContent.focus();
            
            this.addMessageToChat('PRD is now in edit mode. Click anywhere in the document to edit. Changes are saved automatically.', 'assistant');
            
            // Save changes on blur
            modalContent.addEventListener('blur', () => {
                this.prdDocument.content = modalContent.innerText;
                modalContent.style.border = 'none';
                this.updatePRDPreview(this.prdDocument);
            });
        }
    }

    async sharePRD() {
        if (!this.prdDocument) {
            this.addMessageToChat('No PRD available to share. Please generate a PRD first.', 'assistant');
            return;
        }
        
        try {
            // Create a shareable link (for demo, we'll copy the PRD content)
            const shareData = {
                title: this.prdDocument.title,
                content: this.prdDocument.content,
                projectId: this.currentProject.id,
                sharedAt: new Date().toISOString()
            };
            
            const shareText = `${shareData.title}\n\n${shareData.content}\n\nShared from Coder1 PRD Generator`;
            
            // Try to use the Web Share API if available
            if (navigator.share) {
                await navigator.share({
                    title: shareData.title,
                    text: shareText
                });
                this.addMessageToChat('PRD shared successfully!', 'assistant');
            } else {
                // Fallback to clipboard
                await navigator.clipboard.writeText(shareText);
                this.addMessageToChat('PRD copied to clipboard! You can now paste it anywhere to share.', 'assistant');
            }
        } catch (error) {
            console.error('Share failed:', error);
            this.addMessageToChat('Unable to share. Please try copying the PRD manually.', 'assistant');
        }
    }

    sendToClaudeCode() {
        if (!this.prdDocument || !this.currentProject) {
            this.addMessageToChat('No PRD available to send to Claude Code. Please generate a PRD first.', 'assistant');
            return;
        }
        
        // Format PRD for Claude Code with clear instructions
        const claudeCodePrompt = `# Project: ${this.prdDocument.title}

## Original Request
${this.currentProject.originalRequest}

## Project Requirements (from Q&A session)
${this.answers.map((answer, index) => `**Q${index + 1}**: ${this.questions[index].question}
**A${index + 1}**: ${answer.answer}`).join('\n\n')}

## Complete Product Requirements Document
${this.prdDocument.content}

---

**Instructions for Claude Code:**
This is a complete Product Requirements Document generated from a structured interview process. You can use this to:
1. Create the project structure and files
2. Generate initial code based on the requirements  
3. Set up the development environment
4. Plan implementation phases

Please analyze this PRD and help me build this project step by step.`;

        // Copy to clipboard
        navigator.clipboard.writeText(claudeCodePrompt).then(() => {
            this.addMessageToChat(
                '📋 **PRD copied to clipboard!** \n\n' +
                'Your complete Product Requirements Document has been formatted for Claude Code and copied to your clipboard. \n\n' +
                '**Next steps:**\n' +
                '1. Click "Enter Coder1 IDE" to open the development environment\n' +
                '2. Paste the PRD into Claude Code to start building your project\n' +
                '3. Claude Code will help you create the project structure and implementation',
                'assistant'
            );
            
            // Store the formatted prompt for IDE transfer as well
            localStorage.setItem('claudeCodePrompt', claudeCodePrompt);
            localStorage.setItem('promptReady', 'true');
            
        }).catch(() => {
            this.addMessageToChat('Failed to copy PRD to clipboard. Please try again.', 'assistant');
        });
    }

    async exportProject() {
        if (!this.currentProject) {
            this.addMessageToChat('No active project to export. Please complete the steps first.', 'assistant');
            return;
        }
        
        try {
            const response = await fetch('/api/project/export', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    projectId: this.currentProject.id,
                    format: 'json'
                })
            });
            
            const result = await response.json();
            
            if (result.success) {
                // Create a downloadable JSON file with all project data
                const projectData = {
                    project: this.currentProject,
                    prd: this.prdDocument,
                    wireframes: this.wireframes,
                    questions: this.questions,
                    answers: this.answers,
                    exportedAt: new Date().toISOString()
                };
                
                const blob = new Blob([JSON.stringify(projectData, null, 2)], { type: 'application/json' });
                const url = window.URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = `${this.currentProject.id}-complete-project.json`;
                a.click();
                window.URL.revokeObjectURL(url);
                
                // Store comprehensive project data for IDE transfer
                this.prepareProjectForIDE();
                
                // Show transfer message
                this.addMessageToChat(
                    '🎉 Project exported successfully! Redirecting you to the Coder1 IDE with your complete PRD ready for Claude Code...',
                    'assistant'
                );
                
                // Auto-redirect to IDE after short delay to show message
                setTimeout(() => {
                    window.location.href = '/ide?project=transfer';
                }, 2000);
                
            }
        } catch (error) {
            console.error('Export failed:', error);
            this.addMessageToChat('Sorry, there was an error exporting your project. Please try again.', 'assistant');
        }
    }

    duplicateProject() {
        if (!this.currentProject) return;
        
        const newRequest = this.currentProject.originalRequest + ' (Copy)';
        document.getElementById('messageInput').value = newRequest;
        this.sendMessage();
    }

    shareProject() {
        if (!this.currentProject) return;
        
        const shareData = {
            title: 'Check out my project idea',
            text: this.currentProject.originalRequest,
            url: window.location.href
        };
        
        if (navigator.share) {
            navigator.share(shareData);
        } else {
            navigator.clipboard.writeText(`${shareData.text}\n${shareData.url}`);
            alert('Project details copied to clipboard!');
        }
    }

    exportAll() {
        this.exportProject();
    }

    getHelp() {
        this.addMessageToChat(
            'I\'m here to help! You can:\n\n' +
            '• Describe any type of web project or application\n' +
            '• Answer the 5 questions to get a detailed PRD\n' +
            '• Generate wireframes to visualize your project\n' +
            '• Export everything when you\'re done\n\n' +
            'Just tell me what you want to build and I\'ll guide you through the process!',
            'assistant'
        );
    }
    
    openWireframeFullView(index) {
        if (!window.currentWireframes || !window.currentWireframes[index]) {
            console.error('Wireframe not found');
            return;
        }
        
        const wireframe = window.currentWireframes[index];
        
        // Create a new window with the wireframe content
        const newWindow = window.open('', '_blank');
        if (newWindow) {
            // Write the basic HTML structure
            newWindow.document.write(`
                <!DOCTYPE html>
                <html lang="en">
                <head>
                    <meta charset="UTF-8">
                    <meta name="viewport" content="width=device-width, initial-scale=1.0">
                    <title>${wireframe.name} - Wireframe</title>
                    <style>
                        body {
                            margin: 0;
                            padding: 20px;
                            background: #0a0a0a;
                            color: #fff;
                            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
                        }
                        .wireframe-container {
                            max-width: 1200px;
                            margin: 0 auto;
                        }
                        h1 {
                            color: #8b5cf6;
                            margin-bottom: 20px;
                        }
                        .close-button {
                            position: fixed;
                            top: 20px;
                            right: 20px;
                            background: #8b5cf6;
                            color: white;
                            border: none;
                            padding: 10px 20px;
                            border-radius: 8px;
                            cursor: pointer;
                            font-size: 16px;
                        }
                        .close-button:hover {
                            background: #10b981;
                        }
                    </style>
                </head>
                <body>
                    <button class="close-button" onclick="window.close()">Close</button>
                    <div class="wireframe-container">
                        <h1>${wireframe.name}</h1>
                        <div id="wireframe-content"></div>
                    </div>
                </body>
                </html>
            `);
            
            // Use innerHTML to properly render the HTML content
            const contentDiv = newWindow.document.getElementById('wireframe-content');
            if (contentDiv) {
                // Check if the content is already HTML or needs to be unescaped
                const tempDiv = document.createElement('div');
                tempDiv.innerHTML = wireframe.htmlContent;
                
                // If the content appears to be escaped, use the text content
                if (tempDiv.textContent.includes('<div') && !tempDiv.querySelector('div')) {
                    contentDiv.innerHTML = tempDiv.textContent;
                } else {
                    contentDiv.innerHTML = wireframe.htmlContent;
                }
            }
            
            newWindow.document.close();
        } else {
            alert('Please allow pop-ups to view the wireframe in full screen.');
        }
    }

    toggleTheme() {
        document.body.classList.toggle('light-theme');
        const icon = document.querySelector('#themeToggle i');
        icon.className = document.body.classList.contains('light-theme') 
            ? 'fas fa-sun' 
            : 'fas fa-moon';
    }

    prepareProjectForIDE() {
        if (!this.currentProject) return;
        
        // Prepare comprehensive project data for Claude Code
        const projectData = {
            id: this.currentProject.id,
            title: this.currentProject.originalRequest,
            projectType: this.currentProject.projectType,
            questions: this.questions,
            answers: this.answers.map(a => a.answer),
            prd: this.prdDocument ? {
                title: this.prdDocument.title,
                content: this.prdDocument.content,
                metadata: this.prdDocument.metadata
            } : null,
            wireframes: this.wireframes,
            consultation: this.consultationResult,
            marketInsights: this.marketInsights,
            projectIntelligence: this.projectIntelligence,
            timestamp: new Date().toISOString(),
            status: 'ready-for-development'
        };
        
        // Store in localStorage for IDE access
        localStorage.setItem('productCreationProject', JSON.stringify(projectData));
        localStorage.setItem('projectTransferReady', 'true');
        
        // Prepare PRD for Context Priming
        if (this.prdDocument) {
            const prdContent = this.formatPRDForContext();
            const contextPrimingData = {
                files: [{
                    name: 'project-prd.md',
                    content: prdContent,
                    size: new Blob([prdContent]).size,
                    type: 'text/markdown',
                    isVirtual: true,
                    autoLoaded: true
                }],
                timestamp: new Date().toISOString(),
                projectId: this.currentProject.id
            };
            localStorage.setItem('contextPrimingAutoLoad', JSON.stringify(contextPrimingData));
            localStorage.setItem('contextPrimingReady', 'true');
        }
        
        console.log('Project data prepared for IDE transfer:', projectData);
    }
    
    formatPRDForContext() {
        if (!this.prdDocument) return '';
        
        let content = `# ${this.prdDocument.title || 'Product Requirements Document'}\n\n`;
        content += `**Generated:** ${new Date().toISOString()}\n\n`;
        content += `## Project Overview\n${this.currentProject.originalRequest}\n\n`;
        
        if (this.questions && this.answers.length > 0) {
            content += `## Requirements Gathering Q&A\n\n`;
            this.answers.forEach((answer, index) => {
                content += `**Q${index + 1}:** ${this.questions[index].question}\n`;
                content += `**A${index + 1}:** ${answer.answer}\n\n`;
            });
        }
        
        content += `## Full PRD Content\n\n${this.prdDocument.content}`;
        
        if (this.wireframes && this.wireframes.length > 0) {
            content += `\n\n## Wireframes\n\n`;
            this.wireframes.forEach((wireframe, index) => {
                content += `### ${wireframe.title || `Wireframe ${index + 1}`}\n`;
                content += `- Type: ${wireframe.type}\n`;
                content += `- Description: ${wireframe.description || 'N/A'}\n\n`;
            });
        }
        
        return content;
    }
    
    openContextPriming() {
        // Navigate to Context Priming page
        window.location.href = '/context-priming';
    }
    
    enterIDE() {
        // Prepare project data if available
        if (this.currentProject) {
            this.prepareProjectForIDE();
        }
        
        // Navigate to Coder1 IDE with context
        const ideUrl = this.currentProject 
            ? '/ide?project=transfer'
            : '/ide';
            
        window.open(ideUrl, '_blank');
        
        // Show transfer message
        if (this.currentProject) {
            this.addMessageToChat(
                '🚀 Opening Coder1 IDE with your project data! Your PRD and project details have been prepared for Claude Code integration.',
                'assistant'
            );
        }
    }

    skipStep(stepNumber) {
        console.log(`Skipping step ${stepNumber}`);
        
        // Move to next step
        const nextStep = stepNumber + 1;
        if (nextStep <= 7) {
            this.setStep(nextStep);
            this.updateProgress(Math.min(100, (nextStep - 1) * 16.67), `Step ${nextStep} ready`);
            
            // Enable the next step's buttons based on which step we're moving to
            switch (nextStep) {
                case 4:
                    document.getElementById('startConsultation').disabled = false;
                    document.getElementById('skipConsultation').disabled = false;
                    break;
                case 5:
                    document.getElementById('generateWireframes').disabled = false;
                    document.getElementById('skipWireframes').disabled = false;
                    break;
                case 6:
                    document.getElementById('manageVersions').disabled = false;
                    document.getElementById('skipVersions').disabled = false;
                    break;
                case 7:
                    document.getElementById('exportProject').disabled = false;
                    break;
            }
        } else {
            // All steps complete
            this.updateProgress(100, 'Project ready!');
            document.getElementById('exportProject').disabled = false;
        }
        
        // Show skip confirmation message
        this.addMessageToChat(`✅ Step ${stepNumber} skipped. You can return to this step later if needed.`, 'assistant');
    }

    loadExistingProject() {
        // Check if there's a project ID in the URL or localStorage
        const urlParams = new URLSearchParams(window.location.search);
        const projectId = urlParams.get('project') || localStorage.getItem('currentProjectId');
        
        console.log('Checking for existing project:', projectId);
        if (projectId) {
            console.log('Loading existing project:', projectId);
            this.loadProject(projectId);
        } else {
            console.log('No existing project found');
        }
    }

    async loadProject(projectId) {
        try {
            const response = await fetch(`/api/project/${projectId}`);
            
            if (response.status === 404) {
                console.log('Project not found, clearing stored project ID');
                localStorage.removeItem('currentProjectId');
                localStorage.removeItem('currentProject');
                return;
            }
            
            const result = await response.json();
            
            if (result.success) {
                this.currentProject = result.project;
                this.prdDocument = result.prd;
                this.wireframes = result.wireframes;
                
                // Update UI to reflect loaded project
                this.updateUIForLoadedProject();
            } else {
                console.log('Failed to load project, clearing stored project ID');
                localStorage.removeItem('currentProjectId');
                localStorage.removeItem('currentProject');
            }
        } catch (error) {
            console.error('Error loading project:', error);
            localStorage.removeItem('currentProjectId');
            localStorage.removeItem('currentProject');
        }
    }

    updateUIForLoadedProject() {
        if (!this.currentProject) return;
        
        // Update project name in header
        document.getElementById('websiteInput').value = this.currentProject.title || 'Loaded Project';
        
        // Update wizard progress based on what's completed
        if (this.prdDocument) {
            this.setStep(this.wireframes ? 5 : 4);
            this.updateProgress(this.wireframes ? 100 : 80, 
                this.wireframes ? 'Project complete!' : 'PRD generated');
            this.updatePRDPreview(this.prdDocument);
        }
        
        // Add welcome back message
        this.addMessageToChat('Welcome back! Your project has been loaded and you can continue where you left off.', 'assistant');
    }

    // Save project state to localStorage
    saveProjectState() {
        if (!this.currentProject) return;
        
        localStorage.setItem('currentProjectId', this.currentProject.id);
        localStorage.setItem('productCreationState', JSON.stringify({
            project: this.currentProject,
            step: this.currentStep,
            answers: this.answers,
            timestamp: new Date().toISOString()
        }));
    }

    // Auto-save functionality
    setupAutoSave() {
        setInterval(() => {
            this.saveProjectState();
        }, 30000); // Save every 30 seconds
    }

    // Version Management Methods

    async openVersionManager() {
        const modal = document.getElementById('versionModal');
        modal.style.display = 'flex';
        
        // Initialize version management data
        await this.loadVersionHistory();
        await this.loadIterationPlans();
        
        // Move to step 7 (Ready to Build!) and enable export
        this.setStep(7);
        this.updateProgress(100, 'Project ready to build!');
        document.getElementById('exportProject').disabled = false;
        
        // Add completion message with IDE redirect info
        this.addMessageToChat(
            '🎉 Congratulations! Your project is now complete with version management set up. Automatically redirecting to Coder1 IDE in 3 seconds...',
            'assistant'
        );
        
        // Auto-redirect to Coder1 IDE after 3 seconds
        setTimeout(() => {
            this.addMessageToChat('🚀 Launching Coder1 IDE with your project...', 'assistant');
            this.enterIDE();
        }, 3000);
    }

    closeVersionModal() {
        document.getElementById('versionModal').style.display = 'none';
    }

    switchVersionTab(tabName) {
        // Update tab buttons (only within version modal)
        document.querySelectorAll('#versionModal .tab-btn').forEach(btn => {
            btn.classList.remove('active');
        });
        document.querySelector(`#versionModal [data-tab="${tabName}"]`).classList.add('active');

        // Update tab panels (only within version modal)
        document.querySelectorAll('#versionModal .tab-panel').forEach(panel => {
            panel.classList.remove('active');
        });
        document.getElementById(`${tabName}-panel`).classList.add('active');

        // Load tab-specific data
        switch (tabName) {
            case 'history':
                this.loadVersionHistory();
                break;
            case 'compare':
                this.loadVersionSelectors();
                break;
            case 'iterations':
                this.loadIterationPlans();
                break;
        }
    }
    
    switchConsultationTab(tabName) {
        // Update tab buttons (only within consultation modal)
        document.querySelectorAll('#consultationModal .tab-btn').forEach(btn => {
            btn.classList.remove('active');
        });
        document.querySelector(`#consultationModal [data-tab="${tabName}"]`).classList.add('active');

        // Update tab panels (only within consultation modal)
        document.querySelectorAll('#consultationModal .tab-panel').forEach(panel => {
            panel.classList.remove('active');
        });
        document.getElementById(`${tabName}`).classList.add('active');
    }

    async loadVersionHistory() {
        if (!this.currentProject) return;

        try {
            const response = await fetch(`/api/versions/${this.currentProject.id}`);
            const data = await response.json();

            if (data.success) {
                this.renderVersionList(data.versions);
                this.renderVersionTree(data.versions);
            }
        } catch (error) {
            console.error('Failed to load version history:', error);
        }
    }

    renderVersionList(versions) {
        const versionList = document.getElementById('versionList');
        
        if (!versions || versions.length === 0) {
            versionList.innerHTML = `
                <div style="text-align: center; color: rgba(255, 255, 255, 0.6); padding: 40px;">
                    <i class="fas fa-history" style="font-size: 48px; margin-bottom: 16px;"></i>
                    <p>No versions yet. Create your first version when you're ready to save your progress.</p>
                </div>
            `;
            return;
        }

        versionList.innerHTML = versions.map(version => `
            <div class="version-item ${version.isCurrentVersion ? 'current' : ''}" data-version-id="${version.id}">
                <div class="version-info">
                    <div class="version-number">${version.versionNumber}</div>
                    <div class="version-title">${version.title}</div>
                    <div class="version-meta">
                        <span><i class="fas fa-user"></i> ${version.createdBy}</span>
                        <span><i class="fas fa-clock"></i> ${new Date(version.createdAt).toLocaleDateString()}</span>
                        <span><i class="fas fa-code-branch"></i> ${version.branchName}</span>
                        <span><i class="fas fa-gauge"></i> ${version.confidence}% confidence</span>
                    </div>
                    <div class="version-tags">
                        ${version.tags.map(tag => `<span class="version-tag ${tag}">${tag}</span>`).join('')}
                    </div>
                </div>
                <div class="version-node-actions">
                    <button class="version-action-btn" onclick="productCreationHub.viewVersion('${version.id}')">
                        <i class="fas fa-eye"></i> View
                    </button>
                    <button class="version-action-btn" onclick="productCreationHub.createBranchFromVersion('${version.id}')">
                        <i class="fas fa-code-branch"></i> Branch
                    </button>
                    ${!version.isCurrentVersion ? `
                        <button class="version-action-btn" onclick="productCreationHub.rollbackToVersion('${version.id}')">
                            <i class="fas fa-undo"></i> Restore
                        </button>
                    ` : ''}
                </div>
            </div>
        `).join('');
    }

    renderVersionTree(versions) {
        const versionTree = document.getElementById('versionTree');
        
        if (!versions || versions.length === 0) {
            versionTree.innerHTML = '<p style="color: rgba(255, 255, 255, 0.6); text-align: center;">No version tree available</p>';
            return;
        }

        // Create simplified tree view
        versionTree.innerHTML = versions.map(version => `
            <div class="version-node ${version.isCurrentVersion ? 'current' : ''} ${version.branchName !== 'main' ? 'branch' : ''}" 
                 data-version-id="${version.id}">
                <div class="version-node-icon">
                    <i class="fas fa-${version.iterationType === 'major' ? 'star' : version.iterationType === 'minor' ? 'circle' : 'dot-circle'}"></i>
                </div>
                <div class="version-node-content">
                    <div class="version-node-title">${version.versionNumber} - ${version.title}</div>
                    <div class="version-node-meta">
                        <span>${new Date(version.createdAt).toLocaleDateString()}</span>
                        <span>${version.changeCount} changes</span>
                        <span>${version.approvalStatus}</span>
                    </div>
                </div>
            </div>
        `).join('');
    }

    async createNewVersion() {
        if (!this.currentProject) {
            alert('No active project found');
            return;
        }

        const description = prompt('Enter a description for this version:');
        if (!description) return;

        const iterationType = prompt('Version type (major/minor/patch):', 'minor');
        if (!['major', 'minor', 'patch'].includes(iterationType)) {
            alert('Invalid version type');
            return;
        }

        try {
            const projectData = {
                questions: this.questions,
                answers: this.answers,
                prdDocument: this.prdDocument,
                wireframes: this.wireframes,
                consultationResults: this.consultationResults
            };

            const response = await fetch('/api/versions/create', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    projectId: this.currentProject.id,
                    projectData,
                    changeDescription: description,
                    createdBy: 'Current User',
                    iterationType
                })
            });

            const result = await response.json();
            if (result.success) {
                alert(`Version ${result.version.versionNumber} created successfully!`);
                await this.loadVersionHistory();
            } else {
                alert('Failed to create version: ' + result.error);
            }
        } catch (error) {
            console.error('Error creating version:', error);
            alert('Failed to create version');
        }
    }

    async createNewBranch() {
        const currentVersionId = this.getCurrentVersionId();
        if (!currentVersionId) {
            alert('No current version found');
            return;
        }

        const branchName = prompt('Enter branch name:');
        if (!branchName) return;

        try {
            const response = await fetch('/api/versions/branch', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    versionId: currentVersionId,
                    branchName,
                    createdBy: 'Current User',
                    description: `New branch: ${branchName}`
                })
            });

            const result = await response.json();
            if (result.success) {
                alert(`Branch "${branchName}" created successfully!`);
                await this.loadVersionHistory();
            } else {
                alert('Failed to create branch: ' + result.error);
            }
        } catch (error) {
            console.error('Error creating branch:', error);
            alert('Failed to create branch');
        }
    }

    async loadVersionSelectors() {
        if (!this.currentProject) return;

        try {
            const response = await fetch(`/api/versions/${this.currentProject.id}`);
            const data = await response.json();

            if (data.success) {
                const versionASelect = document.getElementById('versionA');
                const versionBSelect = document.getElementById('versionB');

                const optionsHTML = data.versions.map(v => 
                    `<option value="${v.id}">${v.versionNumber} - ${v.title}</option>`
                ).join('');

                versionASelect.innerHTML = '<option value="">Select version...</option>' + optionsHTML;
                versionBSelect.innerHTML = '<option value="">Select version...</option>' + optionsHTML;
            }
        } catch (error) {
            console.error('Failed to load version selectors:', error);
        }
    }

    async compareSelectedVersions() {
        const versionAId = document.getElementById('versionA').value;
        const versionBId = document.getElementById('versionB').value;

        if (!versionAId || !versionBId) {
            alert('Please select both versions to compare');
            return;
        }

        try {
            const response = await fetch('/api/versions/compare', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ versionAId, versionBId })
            });

            const result = await response.json();
            if (result.success) {
                this.renderComparisonResults(result.comparison);
            } else {
                alert('Failed to compare versions: ' + result.error);
            }
        } catch (error) {
            console.error('Error comparing versions:', error);
            alert('Failed to compare versions');
        }
    }

    renderComparisonResults(comparison) {
        const resultsContainer = document.getElementById('comparisonResults');
        
        resultsContainer.innerHTML = `
            <div class="comparison-summary">
                <div class="comparison-stat">
                    <div class="stat-value">${comparison.statistics.totalChanges}</div>
                    <div class="stat-label">Total Changes</div>
                </div>
                <div class="comparison-stat">
                    <div class="stat-value">${comparison.statistics.addedItems}</div>
                    <div class="stat-label">Added Items</div>
                </div>
                <div class="comparison-stat">
                    <div class="stat-value">${comparison.statistics.modifiedItems}</div>
                    <div class="stat-label">Modified Items</div>
                </div>
                <div class="comparison-stat">
                    <div class="stat-value">${comparison.statistics.removedItems}</div>
                    <div class="stat-label">Removed Items</div>
                </div>
            </div>
            
            <div class="comparison-details">
                ${comparison.differences.map(diff => `
                    <div class="comparison-section">
                        <div class="comparison-section-title">
                            <i class="fas fa-${this.getSectionIcon(diff.section)}"></i>
                            ${diff.section.charAt(0).toUpperCase() + diff.section.slice(1)} Changes
                        </div>
                        <div class="comparison-changes">
                            ${diff.changes.map(change => `
                                <div class="comparison-change">
                                    <span class="change-type ${change.changeType}">${change.changeType}</span>
                                    <span>${change.description}</span>
                                </div>
                            `).join('')}
                        </div>
                    </div>
                `).join('')}
            </div>
        `;
    }

    getSectionIcon(section) {
        const icons = {
            questions: 'question-circle',
            prd: 'file-alt',
            wireframes: 'drafting-compass',
            consultation: 'users',
            settings: 'cog'
        };
        return icons[section] || 'file';
    }

    async loadIterationPlans() {
        if (!this.currentProject) return;

        try {
            const response = await fetch(`/api/iterations/${this.currentProject.id}`);
            const data = await response.json();

            if (data.success) {
                this.renderIterationPlans(data.plans);
            }
        } catch (error) {
            console.error('Failed to load iteration plans:', error);
        }
    }

    renderIterationPlans(plans) {
        const iterationList = document.getElementById('iterationList');
        
        if (!plans || plans.length === 0) {
            iterationList.innerHTML = `
                <div style="text-align: center; color: rgba(255, 255, 255, 0.6); padding: 40px;">
                    <i class="fas fa-tasks" style="font-size: 48px; margin-bottom: 16px;"></i>
                    <p>No iteration plans yet. Create your first plan to organize future development.</p>
                </div>
            `;
            return;
        }

        iterationList.innerHTML = plans.map(plan => `
            <div class="iteration-item">
                <div class="iteration-header">
                    <div>
                        <div class="iteration-title">${plan.title}</div>
                        <p style="color: rgba(255, 255, 255, 0.7); margin: 0;">${plan.description}</p>
                    </div>
                    <span class="iteration-status ${plan.status}">${plan.status.replace('_', ' ')}</span>
                </div>
                
                <div class="iteration-meta">
                    <div class="iteration-meta-item">
                        <span class="meta-label">Target Version</span>
                        <span class="meta-value">${plan.targetVersion}</span>
                    </div>
                    <div class="iteration-meta-item">
                        <span class="meta-label">Estimated Hours</span>
                        <span class="meta-value">${plan.resources.estimatedHours}h</span>
                    </div>
                    <div class="iteration-meta-item">
                        <span class="meta-label">Planned Changes</span>
                        <span class="meta-value">${plan.plannedChangesCount}</span>
                    </div>
                    <div class="iteration-meta-item">
                        <span class="meta-label">Risk Level</span>
                        <span class="meta-value">${plan.risksCount} risks identified</span>
                    </div>
                </div>
            </div>
        `).join('');
    }

    async createIterationPlan() {
        // This would open a detailed form for creating iteration plans
        alert('Iteration plan creation form would open here. This is a complex feature that would include:\n\n• Target version selection\n• Planned changes definition\n• Timeline planning\n• Resource allocation\n• Risk assessment');
    }

    async exportVersionHistory() {
        if (!this.currentProject) return;

        try {
            const response = await fetch(`/api/versions/${this.currentProject.id}`);
            const data = await response.json();

            if (data.success) {
                const exportData = {
                    projectId: this.currentProject.id,
                    exportDate: new Date().toISOString(),
                    versions: data.versions,
                    totalVersions: data.totalVersions
                };

                const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
                const url = URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = `version-history-${this.currentProject.id}.json`;
                a.click();
                URL.revokeObjectURL(url);
            }
        } catch (error) {
            console.error('Failed to export version history:', error);
            alert('Failed to export version history');
        }
    }

    async rollbackToSelectedVersion() {
        // Get selected version from UI
        const selectedVersion = document.querySelector('.version-item.selected');
        if (!selectedVersion) {
            alert('Please select a version to rollback to');
            return;
        }

        const versionId = selectedVersion.dataset.versionId;
        await this.rollbackToVersion(versionId);
    }

    async rollbackToVersion(versionId) {
        if (!confirm('Are you sure you want to rollback to this version? This will create a new version with the previous state.')) {
            return;
        }

        try {
            const response = await fetch('/api/versions/rollback', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    projectId: this.currentProject.id,
                    targetVersionId: versionId,
                    rollbackBy: 'Current User'
                })
            });

            const result = await response.json();
            if (result.success) {
                alert('Successfully rolled back to previous version!');
                await this.loadVersionHistory();
                // Reload project data
                location.reload();
            } else {
                alert('Failed to rollback: ' + result.error);
            }
        } catch (error) {
            console.error('Error during rollback:', error);
            alert('Failed to rollback version');
        }
    }

    viewVersion(versionId) {
        // This would show version details in a modal
        alert(`View version details for: ${versionId}\n\nThis would show:\n• Complete project state at that version\n• Changes made\n• Metadata and tags`);
    }

    createBranchFromVersion(versionId) {
        const branchName = prompt('Enter branch name:');
        if (!branchName) return;

        fetch('/api/versions/branch', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                versionId,
                branchName,
                createdBy: 'Current User',
                description: `Branch from version ${versionId}`
            })
        })
        .then(response => response.json())
        .then(result => {
            if (result.success) {
                alert(`Branch "${branchName}" created successfully!`);
                this.loadVersionHistory();
            } else {
                alert('Failed to create branch: ' + result.error);
            }
        })
        .catch(error => {
            console.error('Error creating branch:', error);
            alert('Failed to create branch');
        });
    }

    getCurrentVersionId() {
        // Helper method to get current version ID
        if (this.currentProject && this.currentProject.currentVersionId) {
            return this.currentProject.currentVersionId;
        }
        return null;
    }

    /**
     * Analytics Dashboard Implementation
     */
    async openAnalyticsDashboard() {
        const modal = document.getElementById('analyticsModal');
        if (!modal) return;

        // Show loading state
        this.showAnalyticsLoading();
        modal.style.display = 'flex';

        try {
            // Load analytics data
            const dateRange = document.getElementById('analyticsDateRange')?.value || 30;
            await this.loadAnalyticsDashboard(dateRange);
            
            // Setup analytics event listeners
            this.setupAnalyticsEventListeners();

            // Track analytics view
            await this.trackEvent('analytics_opened', {
                dateRange,
                timestamp: new Date().toISOString()
            });
        } catch (error) {
            console.error('Error opening analytics dashboard:', error);
            this.showAnalyticsError('Failed to load analytics data');
        }
    }

    showAnalyticsLoading() {
        const sections = ['overviewMetrics', 'projectTypesChart', 'featureAdoption', 'userEngagement', 'performanceMetrics', 'aiInsights', 'recommendations'];
        sections.forEach(sectionId => {
            const element = document.getElementById(sectionId);
            if (element) {
                element.innerHTML = '<div class="loading-spinner"><i class="fas fa-spinner fa-spin"></i> Loading...</div>';
            }
        });
    }

    showAnalyticsError(message) {
        const sections = ['overviewMetrics', 'projectTypesChart', 'featureAdoption', 'userEngagement', 'performanceMetrics', 'aiInsights', 'recommendations'];
        sections.forEach(sectionId => {
            const element = document.getElementById(sectionId);
            if (element) {
                element.innerHTML = `<div class="error-message"><i class="fas fa-exclamation-triangle"></i> ${message}</div>`;
            }
        });
    }

    async loadAnalyticsDashboard(dateRange = 30) {
        try {
            const response = await fetch(`/api/analytics/dashboard?dateRange=${dateRange}`, {
                method: 'GET',
                headers: { 'Content-Type': 'application/json' }
            });

            if (!response.ok) {
                throw new Error(`HTTP ${response.status}: ${response.statusText}`);
            }

            const data = await response.json();
            
            if (data.success) {
                this.renderAnalyticsDashboard(data.dashboard);
            } else {
                throw new Error(data.error || 'Failed to load analytics');
            }
        } catch (error) {
            console.error('Error loading analytics dashboard:', error);
            this.showAnalyticsError('Failed to load analytics data');
        }
    }

    renderAnalyticsDashboard(dashboard) {
        // Render overview metrics
        this.renderOverviewMetrics(dashboard.overview);
        
        // Render project analytics charts
        this.renderProjectCharts(dashboard.projectAnalytics);
        
        // Render feature adoption
        this.renderFeatureAdoption(dashboard.featureAdoption);
        
        // Render user engagement
        this.renderUserEngagement(dashboard.userEngagement);
        
        // Render performance metrics
        this.renderPerformanceMetrics(dashboard.performanceMetrics);
        
        // Render AI insights
        this.renderAIInsights(dashboard.insights);
        
        // Render recommendations
        this.renderRecommendations(dashboard.recommendations);
    }

    renderOverviewMetrics(overview) {
        const container = document.getElementById('overviewMetrics');
        if (!container) return;

        container.innerHTML = `
            <div class="metric-card">
                <div class="metric-icon"><i class="fas fa-project-diagram"></i></div>
                <div class="metric-content">
                    <div class="metric-value">${overview.totalProjects || 0}</div>
                    <div class="metric-label">Total Projects</div>
                    <div class="metric-change positive">+${overview.weeklyGrowth || 0}% this week</div>
                </div>
            </div>
            <div class="metric-card">
                <div class="metric-icon"><i class="fas fa-check-circle"></i></div>
                <div class="metric-content">
                    <div class="metric-value">${overview.completedProjects || 0}</div>
                    <div class="metric-label">Completed</div>
                    <div class="metric-change">${overview.successRate || 0}% success rate</div>
                </div>
            </div>
            <div class="metric-card">
                <div class="metric-icon"><i class="fas fa-clock"></i></div>
                <div class="metric-content">
                    <div class="metric-value">${overview.averageCompletionTime || 0}m</div>
                    <div class="metric-label">Avg. Completion</div>
                    <div class="metric-change">Time to finish</div>
                </div>
            </div>
            <div class="metric-card">
                <div class="metric-icon"><i class="fas fa-star"></i></div>
                <div class="metric-content">
                    <div class="metric-value">${overview.averageComplexity || 0}</div>
                    <div class="metric-label">Avg. Complexity</div>
                    <div class="metric-change">Project difficulty</div>
                </div>
            </div>
        `;
    }

    renderProjectCharts(projectAnalytics) {
        // Render project types chart
        const typesChart = document.getElementById('projectTypesChart');
        if (typesChart && projectAnalytics.projectTypes) {
            const types = projectAnalytics.projectTypes.slice(0, 5); // Top 5
            typesChart.innerHTML = `
                <div class="chart-bars">
                    ${types.map(type => `
                        <div class="chart-bar">
                            <div class="bar-label">${type.type}</div>
                            <div class="bar-container">
                                <div class="bar-fill" style="width: ${type.percentage}%"></div>
                            </div>
                            <div class="bar-value">${type.count} (${type.percentage}%)</div>
                        </div>
                    `).join('')}
                </div>
            `;
        }

        // Render completion times chart
        const timesChart = document.getElementById('completionTimesChart');
        if (timesChart && projectAnalytics.completionTimes) {
            timesChart.innerHTML = `
                <div class="completion-stats">
                    <div class="stat-item">
                        <span class="stat-label">Average Time</span>
                        <span class="stat-value">${projectAnalytics.completionTimes.average || 0} min</span>
                    </div>
                    <div class="stat-item">
                        <span class="stat-label">Fastest</span>
                        <span class="stat-value">${projectAnalytics.completionTimes.fastest || 0} min</span>
                    </div>
                    <div class="stat-item">
                        <span class="stat-label">Median</span>
                        <span class="stat-value">${projectAnalytics.completionTimes.median || 0} min</span>
                    </div>
                </div>
            `;
        }
    }

    renderFeatureAdoption(featureAdoption) {
        const container = document.getElementById('featureAdoption');
        if (!container || !featureAdoption.adoptionRates) return;

        const features = Object.entries(featureAdoption.adoptionRates);
        container.innerHTML = `
            <div class="adoption-grid">
                ${features.map(([feature, rate]) => `
                    <div class="adoption-item">
                        <div class="adoption-header">
                            <span class="feature-name">${this.formatFeatureName(feature)}</span>
                            <span class="adoption-rate">${rate}%</span>
                        </div>
                        <div class="adoption-bar">
                            <div class="adoption-fill" style="width: ${rate}%"></div>
                        </div>
                    </div>
                `).join('')}
            </div>
        `;
    }

    renderUserEngagement(userEngagement) {
        const container = document.getElementById('userEngagement');
        if (!container) return;

        container.innerHTML = `
            <div class="engagement-grid">
                <div class="engagement-card">
                    <h4><i class="fas fa-users"></i> Session Metrics</h4>
                    <div class="engagement-stat">
                        <span>Avg. Session Duration</span>
                        <span>${userEngagement.sessionMetrics?.averageDuration || 0} min</span>
                    </div>
                    <div class="engagement-stat">
                        <span>Pages per Session</span>
                        <span>${userEngagement.sessionMetrics?.pagesPerSession || 0}</span>
                    </div>
                </div>
                <div class="engagement-card">
                    <h4><i class="fas fa-chart-line"></i> Engagement Score</h4>
                    <div class="score-display">
                        <div class="score-value">${userEngagement.engagementScore || 0}</div>
                        <div class="score-label">out of 100</div>
                    </div>
                </div>
                <div class="engagement-card">
                    <h4><i class="fas fa-redo"></i> Retention</h4>
                    <div class="engagement-stat">
                        <span>7-day Return Rate</span>
                        <span>${userEngagement.retentionRate || 0}%</span>
                    </div>
                </div>
            </div>
        `;
    }

    renderPerformanceMetrics(performanceMetrics) {
        const container = document.getElementById('performanceMetrics');
        if (!container || !performanceMetrics.systemHealth) return;

        const health = performanceMetrics.systemHealth;
        container.innerHTML = `
            <div class="performance-grid">
                <div class="performance-card">
                    <div class="performance-icon"><i class="fas fa-tachometer-alt"></i></div>
                    <div class="performance-content">
                        <div class="performance-value">${health.averageResponseTime}ms</div>
                        <div class="performance-label">Response Time</div>
                    </div>
                </div>
                <div class="performance-card">
                    <div class="performance-icon"><i class="fas fa-exclamation-triangle"></i></div>
                    <div class="performance-content">
                        <div class="performance-value">${(health.errorRate * 100).toFixed(2)}%</div>
                        <div class="performance-label">Error Rate</div>
                    </div>
                </div>
                <div class="performance-card">
                    <div class="performance-icon"><i class="fas fa-server"></i></div>
                    <div class="performance-content">
                        <div class="performance-value">${health.uptime}%</div>
                        <div class="performance-label">Uptime</div>
                    </div>
                </div>
                <div class="performance-card">
                    <div class="performance-icon"><i class="fas fa-chart-line"></i></div>
                    <div class="performance-content">
                        <div class="performance-value">${health.throughput}</div>
                        <div class="performance-label">Requests/min</div>
                    </div>
                </div>
            </div>
        `;
    }

    renderAIInsights(insights) {
        const container = document.getElementById('aiInsights');
        if (!container || !insights.keyFindings) return;

        container.innerHTML = `
            <div class="insights-list">
                ${insights.keyFindings.map(finding => `
                    <div class="insight-item ${finding.impact}">
                        <div class="insight-header">
                            <span class="insight-type">${this.formatInsightType(finding.type)}</span>
                            <span class="insight-impact ${finding.impact}">${finding.impact}</span>
                        </div>
                        <h4>${finding.title}</h4>
                        <p>${finding.description}</p>
                        <div class="insight-recommendation">
                            <strong>Recommendation:</strong> ${finding.recommendation}
                        </div>
                        <div class="insight-confidence">
                            Confidence: ${Math.round(finding.confidence * 100)}%
                        </div>
                    </div>
                `).join('')}
            </div>
        `;
    }

    renderRecommendations(recommendations) {
        const container = document.getElementById('recommendations');
        if (!container) return;

        const allRecommendations = [
            ...recommendations.immediate.map(r => ({ ...r, timeframe: 'immediate' })),
            ...recommendations.shortTerm.map(r => ({ ...r, timeframe: 'short-term' })),
            ...recommendations.longTerm.map(r => ({ ...r, timeframe: 'long-term' }))
        ];

        container.innerHTML = `
            <div class="recommendations-list">
                ${allRecommendations.map(rec => `
                    <div class="recommendation-item ${rec.priority}">
                        <div class="recommendation-header">
                            <span class="rec-priority ${rec.priority}">${rec.priority}</span>
                            <span class="rec-category">${rec.category}</span>
                            <span class="rec-timeline">${rec.timeline}</span>
                        </div>
                        <h4>${rec.title}</h4>
                        <p>${rec.description}</p>
                        <div class="recommendation-impact">
                            <strong>Expected Impact:</strong> ${rec.expectedImpact}
                        </div>
                        <div class="recommendation-effort">
                            Effort: ${rec.effort} | Timeline: ${rec.timeline}
                        </div>
                    </div>
                `).join('')}
            </div>
        `;
    }

    setupAnalyticsEventListeners() {
        // Close modal
        document.getElementById('closeAnalyticsModal')?.addEventListener('click', () => {
            document.getElementById('analyticsModal').style.display = 'none';
        });

        // Date range change
        document.getElementById('analyticsDateRange')?.addEventListener('change', (e) => {
            this.loadAnalyticsDashboard(e.target.value);
        });

        // Refresh button
        document.getElementById('refreshAnalytics')?.addEventListener('click', () => {
            const dateRange = document.getElementById('analyticsDateRange')?.value || 30;
            this.loadAnalyticsDashboard(dateRange);
        });

        // Export button
        document.getElementById('exportAnalytics')?.addEventListener('click', () => {
            this.exportAnalyticsData();
        });
    }

    async exportAnalyticsData() {
        try {
            const dateRange = document.getElementById('analyticsDateRange')?.value || 30;
            const response = await fetch(`/api/analytics/export?dateRange=${dateRange}&format=json`);
            const data = await response.json();

            if (data.success) {
                const blob = new Blob([data.data], { type: 'application/json' });
                const url = URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = `analytics-export-${new Date().toISOString().split('T')[0]}.json`;
                a.click();
                URL.revokeObjectURL(url);

                // Track export
                await this.trackEvent('analytics_exported', {
                    dateRange,
                    format: 'json',
                    timestamp: new Date().toISOString()
                });
            }
        } catch (error) {
            console.error('Error exporting analytics:', error);
            alert('Failed to export analytics data');
        }
    }

    formatFeatureName(feature) {
        const names = {
            'multiPersonaConsultation': 'Multi-Persona Consultation',
            'versionControl': 'Version Control',
            'templateUsage': 'Template Usage',
            'collaboration': 'Team Collaboration',
            'export': 'Export Features'
        };
        return names[feature] || feature;
    }

    formatInsightType(type) {
        const types = {
            'success_pattern': 'Success Pattern',
            'optimization': 'Optimization',
            'feature_gap': 'Feature Gap',
            'user_behavior': 'User Behavior'
        };
        return types[type] || type;
    }

    // Initialize version management when project starts
    async initializeVersioning() {
        if (!this.currentProject) return;

        // Create initial version when project is first created
        const projectData = {
            questions: this.questions || [],
            answers: this.answers || [],
            prdDocument: this.prdDocument,
            wireframes: this.wireframes,
            consultationResults: this.consultationResults
        };

        try {
            const response = await fetch('/api/versions/create-initial', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    projectId: this.currentProject.id,
                    projectData,
                    createdBy: 'Current User',
                    title: 'Project Initialization'
                })
            });

            const result = await response.json();
            if (result.success) {
                this.currentProject.currentVersionId = result.version.id;
                console.log('Initial version created:', result.version.versionNumber);
            }
        } catch (error) {
            console.error('Failed to create initial version:', error);
        }
    }
}

// Initialize the Product Creation Hub when the page loads
document.addEventListener('DOMContentLoaded', () => {
    console.log('🔄 DOM Content Loaded - initializing ProductCreationHub');
    
    // Verify critical elements exist
    const sendBtn = document.getElementById('sendMessage');
    const messageInput = document.getElementById('messageInput');
    
    console.log('🔍 Critical elements check:', {
        sendMessage: !!sendBtn,
        messageInput: !!messageInput,
        sendButtonHTML: sendBtn ? sendBtn.outerHTML.substring(0, 100) : 'NOT FOUND',
        inputHTML: messageInput ? messageInput.outerHTML.substring(0, 100) : 'NOT FOUND'
    });
    
    window.productCreationHub = new ProductCreationHub();
    window.productCreationHub.setupAutoSave();
    
    console.log('✅ ProductCreationHub initialized and available as window.productCreationHub');
});

// Handle page visibility for analytics
document.addEventListener('visibilitychange', () => {
    if (document.hidden && window.productCreationHub) {
        window.productCreationHub.saveProjectState();
    }
});