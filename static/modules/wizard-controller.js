/**
 * Wizard Controller Module
 * Manages the 7-step wizard flow and UI state
 */

class WizardController {
    constructor() {
        this.currentStep = 1;
        this.totalSteps = 7;
        this.questions = [];
        this.answers = [];
        this.waitingForAnswer = false;
        this.isProcessing = false;
        
        // Default questions for the wizard
        this.defaultQuestions = [
            { question: "Who is your target audience and what are their main needs?" },
            { question: "What are the core features your project must have?" },
            { question: "What platforms should your project support (web, mobile, desktop)?" },
            { question: "Do you have any specific design preferences or branding requirements?" },
            { question: "What is your timeline and budget for this project?" }
        ];
    }
    
    initializeWizard(initialRequest) {
        this.questions = [...this.defaultQuestions];
        this.answers = [];
        this.currentStep = 1;
        this.waitingForAnswer = false;
        this.isProcessing = false;
        
        // Create project
        const project = {
            id: `project-${Date.now()}`,
            originalRequest: initialRequest,
            createdAt: new Date().toISOString(),
            projectType: this.inferProjectType(initialRequest)
        };
        
        // Save initial state
        window.SessionManager.saveProject(project);
        this.saveWizardState();
        
        return project;
    }
    
    inferProjectType(request) {
        const lower = request.toLowerCase();
        if (lower.includes('website') || lower.includes('web')) return 'web-application';
        if (lower.includes('mobile') || lower.includes('app')) return 'mobile-app';
        if (lower.includes('desktop')) return 'desktop-app';
        if (lower.includes('api') || lower.includes('service')) return 'api-service';
        return 'web-application'; // default
    }
    
    startQuestionFlow() {
        if (this.questions.length === 0) {
            this.questions = [...this.defaultQuestions];
        }
        
        this.waitingForAnswer = true;
        this.askNextQuestion();
    }
    
    askNextQuestion() {
        const questionIndex = this.answers.length;
        
        if (questionIndex >= this.questions.length) {
            this.completeQuestionFlow();
            return;
        }
        
        const question = this.questions[questionIndex];
        const questionText = `Question ${questionIndex + 1} of ${this.questions.length}: ${question.question}`;
        
        // Add to chat
        window.UIComponents.addMessageToChat(questionText, 'assistant');
        this.waitingForAnswer = true;
        this.saveWizardState();
    }
    
    submitAnswer(answer) {
        if (!this.waitingForAnswer) return false;
        
        const questionIndex = this.answers.length;
        
        // Save answer
        this.answers.push({
            question: this.questions[questionIndex].question,
            answer: answer,
            timestamp: new Date().toISOString()
        });
        
        // Add to chat
        window.UIComponents.addMessageToChat(answer, 'user');
        
        this.waitingForAnswer = false;
        this.saveWizardState();
        
        // Ask next question or complete
        if (this.answers.length < this.questions.length) {
            setTimeout(() => this.askNextQuestion(), 1000);
        } else {
            this.completeQuestionFlow();
        }
        
        return true;
    }
    
    completeQuestionFlow() {
        this.waitingForAnswer = false;
        this.updateProgress(40); // Questions complete = 40% progress
        
        window.UIComponents.addMessageToChat(
            "Great! I have all the information I need. You can now generate your PRD by clicking the 'Generate PRD' button.",
            'assistant'
        );
        
        this.updateWizardStep(2); // Move to PRD generation step
        this.saveWizardState();
    }
    
    updateWizardStep(step) {
        this.currentStep = Math.min(step, this.totalSteps);
        
        // Update UI indicators
        this.updateStepIndicators();
        this.updateButtons();
        this.saveWizardState();
    }
    
    updateStepIndicators() {
        for (let i = 1; i <= this.totalSteps; i++) {
            const indicator = document.querySelector(`[data-step="${i}"]`);
            if (indicator) {
                indicator.classList.remove('active', 'completed', 'future');
                
                if (i < this.currentStep) {
                    indicator.classList.add('completed');
                } else if (i === this.currentStep) {
                    indicator.classList.add('active');
                } else {
                    indicator.classList.add('future');
                }
            }
        }
    }
    
    updateButtons() {
        const buttons = {
            startWizard: this.currentStep === 1,
            generatePRD: this.currentStep === 2 && this.answers.length === this.questions.length,
            startConsultation: this.currentStep >= 3,
            generateWireframes: this.currentStep >= 4,
            manageVersions: this.currentStep >= 3,
            exportProject: this.currentStep >= 3
        };
        
        Object.entries(buttons).forEach(([buttonId, enabled]) => {
            const button = document.getElementById(buttonId);
            if (button) {
                button.disabled = !enabled;
                button.style.opacity = enabled ? '1' : '0.5';
            }
        });
    }
    
    updateProgress(percentage) {
        const progressBar = document.querySelector('.progress-fill');
        const progressText = document.querySelector('.progress-text');
        
        if (progressBar) {
            progressBar.style.width = `${percentage}%`;
        }
        
        if (progressText) {
            progressText.textContent = `${percentage}% Complete`;
        }
    }
    
    saveWizardState() {
        const state = {
            currentStep: this.currentStep,
            questions: this.questions,
            answers: this.answers,
            waitingForAnswer: this.waitingForAnswer,
            isProcessing: this.isProcessing,
            savedAt: new Date().toISOString()
        };
        
        window.SessionManager.saveWizardState(state);
    }
    
    loadWizardState() {
        const state = window.SessionManager.loadWizardState();
        
        if (state) {
            this.currentStep = state.currentStep || 1;
            this.questions = state.questions || [...this.defaultQuestions];
            this.answers = state.answers || [];
            this.waitingForAnswer = state.waitingForAnswer || false;
            this.isProcessing = state.isProcessing || false;
            
            // Restore UI state
            this.updateStepIndicators();
            this.updateButtons();
            
            return true;
        }
        
        return false;
    }
    
    resetWizard() {
        this.currentStep = 1;
        this.questions = [...this.defaultQuestions];
        this.answers = [];
        this.waitingForAnswer = false;
        this.isProcessing = false;
        
        this.updateStepIndicators();
        this.updateButtons();
        this.updateProgress(0);
        
        window.SessionManager.clearProject();
    }
    
    getCompletionStatus() {
        return {
            questionsComplete: this.answers.length === this.questions.length,
            currentStep: this.currentStep,
            totalSteps: this.totalSteps,
            progressPercentage: Math.round((this.currentStep / this.totalSteps) * 100),
            canGeneratePRD: this.answers.length === this.questions.length,
            waitingForAnswer: this.waitingForAnswer
        };
    }
}

// Export singleton instance
window.WizardController = new WizardController();