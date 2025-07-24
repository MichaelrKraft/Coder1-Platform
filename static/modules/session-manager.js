/**
 * Session Manager Module
 * Handles session state, localStorage, and project persistence
 */

class SessionManager {
    constructor() {
        this.storageKeys = {
            PROJECT: 'currentProject',
            PROJECT_ID: 'currentProjectId',
            SESSION_ID: 'sessionId',
            WIZARD_STATE: 'wizardState'
        };
    }
    
    generateSessionId() {
        return `session-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    }
    
    saveProject(project) {
        try {
            localStorage.setItem(this.storageKeys.PROJECT, JSON.stringify(project));
            localStorage.setItem(this.storageKeys.PROJECT_ID, project.id);
            return true;
        } catch (error) {
            if (window.ErrorHandler) {
                window.ErrorHandler.handleError(error, {
                    type: 'ui',
                    context: 'session_save_project',
                    silent: true
                });
            }
            return false;
        }
    }
    
    loadProject() {
        try {
            const projectData = localStorage.getItem(this.storageKeys.PROJECT);
            return projectData ? JSON.parse(projectData) : null;
        } catch (error) {
            if (window.ErrorHandler) {
                window.ErrorHandler.handleError(error, {
                    type: 'ui',
                    context: 'session_load_project',
                    silent: true
                });
            }
            return null;
        }
    }
    
    saveWizardState(state) {
        try {
            localStorage.setItem(this.storageKeys.WIZARD_STATE, JSON.stringify(state));
            return true;
        } catch (error) {
            return false;
        }
    }
    
    loadWizardState() {
        try {
            const stateData = localStorage.getItem(this.storageKeys.WIZARD_STATE);
            return stateData ? JSON.parse(stateData) : null;
        } catch (error) {
            return null;
        }
    }
    
    clearProject() {
        Object.values(this.storageKeys).forEach(key => {
            localStorage.removeItem(key);
        });
    }
    
    getSessionId() {
        let sessionId = localStorage.getItem(this.storageKeys.SESSION_ID);
        if (!sessionId) {
            sessionId = this.generateSessionId();
            localStorage.setItem(this.storageKeys.SESSION_ID, sessionId);
        }
        return sessionId;
    }
    
    // Export project data for sharing/backup
    exportProjectData() {
        const project = this.loadProject();
        const wizardState = this.loadWizardState();
        
        return {
            project,
            wizardState,
            exportedAt: new Date().toISOString(),
            version: '1.0'
        };
    }
    
    // Import project data from backup
    importProjectData(data) {
        try {
            if (data.project) {
                this.saveProject(data.project);
            }
            if (data.wizardState) {
                this.saveWizardState(data.wizardState);
            }
            return true;
        } catch (error) {
            return false;
        }
    }
}

// Export singleton instance
window.SessionManager = new SessionManager();