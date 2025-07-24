/**
 * Product Creation Hub - Refactored Frontend Controller
 * Integrates with backend services for Smart PRD & Wireframe Generator
 * Uses modular architecture with separated concerns
 */

class ProductCreationHub {
    constructor() {
        // Core properties
        this.currentProject = null;
        this.prdDocument = null;
        this.wireframes = null;
        this.marketInsights = null;
        this.projectIntelligence = null;
        this.eventListenersInitialized = false;
        this.isProcessing = false;
        
        // Initialize dependencies (modules are loaded via script-loader.js)
        this.sessionManager = window.SessionManager;
        this.apiClient = window.APIClient;
        this.wizardController = window.WizardController;
        this.uiComponents = window.UIComponents;
        
        // Initialize the application
        this.initialize();
        
        // Expose utility methods globally
        this.exposeUtilities();
    }
    
    async initialize() {
        try {
            await this.initializeAnalytics();
            this.initializeEventListeners();
            this.loadExistingProject();
            this.updateUI();
        } catch (error) {
            if (window.ErrorHandler) {
                window.ErrorHandler.handleError(error, {
                    type: 'ui',
                    context: 'app_initialization',
                    severity: 'high'
                });
            } else {
                this.uiComponents.showToast('Failed to initialize application', 'error');
            }
        }
    }
    
    exposeUtilities() {
        // Project reset utility
        window.clearProject = () => {
            this.sessionManager.clearProject();
            this.wizardController.resetWizard();
            this.uiComponents.clearChat();
            location.reload();
        };
        
        // Debug utilities
        window.getProjectState = () => this.getProjectState();
        window.exportProject = () => this.exportProject();
    }
    
    async initializeAnalytics() {
        try {
            const sessionId = this.sessionManager.getSessionId();
            const result = await this.apiClient.request('/analytics/start-session', {
                method: 'POST',
                body: { sessionId, timestamp: new Date().toISOString() }
            });
            
            if (!result.success) {
                // Analytics failure is non-critical
            }
        } catch (error) {
            // Analytics failure is non-critical
        }
    }
    
    initializeEventListeners() {
        if (this.eventListenersInitialized) return;
        
        // Main action buttons
        this.bindButton('startWizard', () => this.handleStartWizard());
        this.bindButton('generatePRD', () => this.handleGeneratePRD());
        this.bindButton('startConsultation', () => this.handleStartConsultation());
        this.bindButton('generateWireframes', () => this.handleGenerateWireframes());
        this.bindButton('manageVersions', () => this.handleManageVersions());
        this.bindButton('exportProject', () => this.handleExportProject());
        
        // Tab management
        this.initializeTabSystem();
        
        // Chat interface (handled by UIComponents module)
        // Event listeners are set up in ui-components.js
        
        this.eventListenersInitialized = true;
    }
    
    bindButton(buttonId, handler) {
        const button = document.getElementById(buttonId);
        if (button) {
            button.addEventListener('click', handler);
        }
    }
    
    initializeTabSystem() {
        // Consultation modal tabs
        document.querySelectorAll('.consultation-tab').forEach(tab => {
            tab.addEventListener('click', (e) => this.switchConsultationTab(e.target));
        });
        
        // Version management modal tabs
        document.querySelectorAll('.version-tab').forEach(tab => {
            tab.addEventListener('click', (e) => this.switchVersionTab(e.target));
        });
    }
    
    loadExistingProject() {
        const project = this.sessionManager.loadProject();
        const wizardState = this.sessionManager.loadWizardState();
        
        if (project) {
            this.currentProject = project;
            
            if (wizardState) {
                this.wizardController.loadWizardState();
            }
            
            this.updateUI();
        }
    }
    
    updateUI() {
        const status = this.wizardController.getCompletionStatus();
        this.uiComponents.updateStepProgress(
            status.currentStep,
            status.totalSteps,
            status.progressPercentage
        );
    }
    
    // Event Handlers
    async handleStartWizard() {
        this.uiComponents.addMessageToChat(
            "Welcome! Let's create your PRD. Please describe your project idea:",
            'assistant'
        );
        
        // Enable message input for project description
        const messageInput = document.getElementById('messageInput');
        if (messageInput) {
            messageInput.focus();
            messageInput.placeholder = "Describe your project idea...";
        }
    }
    
    async handleGeneratePRD() {
        const status = this.wizardController.getCompletionStatus();
        
        if (!status.canGeneratePRD) {
            this.uiComponents.showToast('Please complete the questionnaire first', 'warning');
            return;
        }
        
        const generateButton = document.getElementById('generatePRD');
        this.uiComponents.showLoadingState(generateButton, 'Generating PRD...');
        
        try {
            const projectData = this.buildProjectData();
            const result = await this.apiClient.generatePRD(projectData);
            
            if (result.success) {
                this.prdDocument = result.data.prd;
                this.displayPRD(this.prdDocument);
                this.wizardController.updateWizardStep(3);
                this.uiComponents.showToast('PRD generated successfully!', 'success');
                
                // Analytics
                await this.trackEvent('prd_generated', { projectId: this.currentProject?.id });
            } else {
                throw new Error(result.error || 'Failed to generate PRD');
            }
        } catch (error) {
            this.uiComponents.showToast(`Failed to generate PRD: ${error.message}`, 'error');
        } finally {
            this.uiComponents.hideLoadingState(generateButton);
        }
    }
    
    async handleStartConsultation() {
        if (!this.currentProject) {
            this.uiComponents.showToast('Please create a project first', 'warning');
            return;
        }
        
        try {
            const personas = await this.apiClient.getAvailablePersonas();
            if (personas.success) {
                this.showConsultationModal(personas.data);
            } else {
                throw new Error('Failed to load personas');
            }
        } catch (error) {
            this.uiComponents.showToast('Failed to start consultation', 'error');
        }
    }
    
    async handleGenerateWireframes() {
        if (!this.prdDocument) {
            this.uiComponents.showToast('Please generate PRD first', 'warning');
            return;
        }
        
        const wireframeButton = document.getElementById('generateWireframes');
        this.uiComponents.showLoadingState(wireframeButton, 'Generating wireframes...');
        
        try {
            const result = await this.apiClient.generateWireframes({
                projectId: this.currentProject.id,
                prd: this.prdDocument
            });
            
            if (result.success) {
                this.wireframes = result.data.wireframes;
                this.displayWireframes(this.wireframes);
                this.wizardController.updateWizardStep(5);
                this.uiComponents.showToast('Wireframes generated successfully!', 'success');
                
                // Analytics
                await this.trackEvent('wireframes_generated', { projectId: this.currentProject?.id });
            } else {
                throw new Error(result.error || 'Failed to generate wireframes');
            }
        } catch (error) {
            this.uiComponents.showToast(`Failed to generate wireframes: ${error.message}`, 'error');
        } finally {
            this.uiComponents.hideLoadingState(wireframeButton);
        }
    }
    
    async handleManageVersions() {
        if (!this.currentProject) {
            this.uiComponents.showToast('Please create a project first', 'warning');
            return;
        }
        
        try {
            const versions = await this.apiClient.getVersions(this.currentProject.id);
            if (versions.success) {
                this.showVersionModal(versions.data);
            } else {
                throw new Error('Failed to load versions');
            }
        } catch (error) {
            this.uiComponents.showToast('Failed to load versions', 'error');
        }
    }
    
    async handleExportProject() {
        if (!this.currentProject) {
            this.uiComponents.showToast('Please create a project first', 'warning');
            return;
        }
        
        try {
            const exportData = this.sessionManager.exportProjectData();
            const result = await this.apiClient.exportProject(exportData);
            
            if (result.success) {
                this.downloadFile(result.data.fileContent, result.data.filename);
                this.uiComponents.showToast('Project exported successfully!', 'success');
                
                // Analytics
                await this.trackEvent('project_exported', { projectId: this.currentProject?.id });
            } else {
                throw new Error(result.error || 'Export failed');
            }
        } catch (error) {
            this.uiComponents.showToast(`Failed to export project: ${error.message}`, 'error');
        }
    }
    
    // Modal Management
    showConsultationModal(personas) {
        const modalContent = this.buildConsultationModalContent(personas);
        this.uiComponents.showModal('consultationModal', modalContent);
    }
    
    showVersionModal(versions) {
        const modalContent = this.buildVersionModalContent(versions);
        this.uiComponents.showModal('versionModal', modalContent);
    }
    
    buildConsultationModalContent(personas) {
        return `
            <div class="modal-header">
                <h2>Expert Consultation</h2>
            </div>
            <div class="modal-tabs">
                <button class="consultation-tab active" data-tab="select">Select Personas</button>
                <button class="consultation-tab" data-tab="analysis">Analysis</button>
                <button class="consultation-tab" data-tab="recommendations">Recommendations</button>
            </div>
            <div class="modal-body">
                <div class="tab-content" data-tab="select">
                    ${this.buildPersonaSelection(personas)}
                </div>
                <div class="tab-content" data-tab="analysis" style="display: none;">
                    <div id="analysisContent">Select personas and start analysis</div>
                </div>
                <div class="tab-content" data-tab="recommendations" style="display: none;">
                    <div id="recommendationsContent">Analysis will generate recommendations</div>
                </div>
            </div>
        `;
    }
    
    buildPersonaSelection(personas) {
        return personas.map(persona => `
            <div class="persona-card">
                <input type="checkbox" id="persona-${persona.id}" value="${persona.id}">
                <label for="persona-${persona.id}">
                    <strong>${persona.name}</strong>
                    <span class="persona-specialty">${persona.specialty}</span>
                    <p>${persona.description}</p>
                </label>
            </div>
        `).join('') + `
            <button id="startAnalysis" class="btn-primary">Start Analysis</button>
        `;
    }
    
    buildVersionModalContent(versions) {
        return `
            <div class="modal-header">
                <h2>Version Management</h2>
            </div>
            <div class="modal-tabs">
                <button class="version-tab active" data-tab="current">Current Version</button>
                <button class="version-tab" data-tab="history">Version History</button>
                <button class="version-tab" data-tab="create">Create Version</button>
            </div>
            <div class="modal-body">
                <div class="tab-content" data-tab="current">
                    ${this.buildCurrentVersionContent()}
                </div>
                <div class="tab-content" data-tab="history" style="display: none;">
                    ${this.buildVersionHistoryContent(versions)}
                </div>
                <div class="tab-content" data-tab="create" style="display: none;">
                    ${this.buildCreateVersionContent()}
                </div>
            </div>
        `;
    }
    
    buildCurrentVersionContent() {
        return `
            <div class="current-version">
                <h3>Current Project State</h3>
                <div class="version-info">
                    <p><strong>Project:</strong> ${this.currentProject?.originalRequest || 'Unnamed Project'}</p>
                    <p><strong>Created:</strong> ${this.currentProject?.createdAt ? new Date(this.currentProject.createdAt).toLocaleString() : 'Unknown'}</p>
                    <p><strong>Status:</strong> ${this.wizardController.getCompletionStatus().progressPercentage}% Complete</p>
                </div>
            </div>
        `;
    }
    
    buildVersionHistoryContent(versions) {
        if (!versions.length) {
            return '<p>No saved versions yet.</p>';
        }
        
        return versions.map(version => `
            <div class="version-item">
                <h4>${version.name}</h4>
                <p>${version.description}</p>
                <small>Created: ${new Date(version.createdAt).toLocaleString()}</small>
                <button onclick="window.ProductCreationHub.loadVersion('${version.id}')">Load</button>
            </div>
        `).join('');
    }
    
    buildCreateVersionContent() {
        return `
            <form id="createVersionForm">
                <div class="form-group">
                    <label for="versionName">Version Name:</label>
                    <input type="text" id="versionName" required>
                </div>
                <div class="form-group">
                    <label for="versionDescription">Description:</label>
                    <textarea id="versionDescription" rows="3"></textarea>
                </div>
                <button type="submit">Save Version</button>
            </form>
        `;
    }
    
    // Tab Management
    switchConsultationTab(tab) {
        this.switchTab(tab, '.consultation-tab', 'consultationModal');
    }
    
    switchVersionTab(tab) {
        this.switchTab(tab, '.version-tab', 'versionModal');
    }
    
    switchTab(activeTab, tabSelector, modalId) {
        const modal = document.getElementById(modalId);
        if (!modal) return;
        
        // Update tab states
        modal.querySelectorAll(tabSelector).forEach(tab => {
            tab.classList.remove('active');
        });
        activeTab.classList.add('active');
        
        // Update content visibility
        const targetTab = activeTab.dataset.tab;
        modal.querySelectorAll('.tab-content').forEach(content => {
            content.style.display = content.dataset.tab === targetTab ? 'block' : 'none';
        });
    }
    
    // Utility Methods
    buildProjectData() {
        const status = this.wizardController.getCompletionStatus();
        return {
            project: this.currentProject,
            questions: this.wizardController.questions,
            answers: this.wizardController.answers,
            sessionId: this.sessionManager.getSessionId(),
            completionStatus: status
        };
    }
    
    displayPRD(prd) {
        const prdContainer = document.getElementById('prdDocument');
        if (prdContainer) {
            prdContainer.innerHTML = this.formatPRDForDisplay(prd);
            prdContainer.style.display = 'block';
        }
    }
    
    displayWireframes(wireframes) {
        const wireframeContainer = document.getElementById('wireframeContainer');
        if (wireframeContainer) {
            wireframeContainer.innerHTML = this.formatWireframesForDisplay(wireframes);
            wireframeContainer.style.display = 'block';
        }
    }
    
    formatPRDForDisplay(prd) {
        return `
            <div class="prd-document">
                <h2>${prd.title || 'Product Requirements Document'}</h2>
                <div class="prd-content">${prd.content || prd}</div>
            </div>
        `;
    }
    
    formatWireframesForDisplay(wireframes) {
        if (Array.isArray(wireframes)) {
            return wireframes.map((wireframe, index) => `
                <div class="wireframe-item">
                    <h3>Wireframe ${index + 1}</h3>
                    <div class="wireframe-content">${wireframe}</div>
                </div>
            `).join('');
        }
        return `<div class="wireframe-content">${wireframes}</div>`;
    }
    
    downloadFile(content, filename) {
        const blob = new Blob([content], { type: 'text/plain' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = filename;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
    }
    
    async trackEvent(eventType, data = {}) {
        try {
            await this.apiClient.sendAnalyticsEvent({
                type: eventType,
                data,
                sessionId: this.sessionManager.getSessionId(),
                timestamp: new Date().toISOString()
            });
        } catch (error) {
            // Analytics failure is non-critical
        }
    }
    
    getProjectState() {
        return {
            currentProject: this.currentProject,
            wizardStatus: this.wizardController.getCompletionStatus(),
            sessionId: this.sessionManager.getSessionId(),
            hasPRD: !!this.prdDocument,
            hasWireframes: !!this.wireframes
        };
    }
    
    async exportProject() {
        return this.sessionManager.exportProjectData();
    }
}

// Initialize the application when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    window.ProductCreationHub = new ProductCreationHub();
});

// Also handle the case where DOM is already loaded
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        if (!window.ProductCreationHub) {
            window.ProductCreationHub = new ProductCreationHub();
        }
    });
} else {
    if (!window.ProductCreationHub) {
        window.ProductCreationHub = new ProductCreationHub();
    }
}