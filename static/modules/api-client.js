/**
 * API Client Module
 * Handles all API communications with consistent error handling
 */

class APIClient {
    constructor() {
        this.baseURL = '/api';
        this.defaultHeaders = {
            'Content-Type': 'application/json'
        };
        this.requestTimeout = 30000; // 30 seconds
    }
    
    async request(endpoint, options = {}) {
        const url = `${this.baseURL}${endpoint}`;
        const config = {
            method: options.method || 'GET',
            headers: { ...this.defaultHeaders, ...options.headers },
            ...options
        };
        
        if (config.body && typeof config.body === 'object') {
            config.body = JSON.stringify(config.body);
        }
        
        try {
            const controller = new AbortController();
            const timeoutId = setTimeout(() => controller.abort(), this.requestTimeout);
            
            const response = await fetch(url, {
                ...config,
                signal: controller.signal
            });
            
            clearTimeout(timeoutId);
            
            if (!response.ok) {
                throw new Error(`HTTP ${response.status}: ${response.statusText}`);
            }
            
            const data = await response.json();
            return { success: true, data };
            
        } catch (error) {
            let errorType = 'api';
            let errorMessage = error.message;
            
            if (error.name === 'AbortError') {
                errorType = 'timeout';
                errorMessage = 'Request timeout';
            }
            
            // Use centralized error handling
            if (window.ErrorHandler) {
                window.ErrorHandler.handleError(error, {
                    type: errorType,
                    context: `api_request_${endpoint}`,
                    metadata: { endpoint, method: config.method }
                });
            }
            
            return { success: false, error: errorMessage };
        }
    }
    
    // PRD Generation
    async generatePRD(projectData) {
        return this.request('/generate-prd', {
            method: 'POST',
            body: projectData
        });
    }
    
    // Persona Management
    async getAvailablePersonas() {
        return this.request('/personas/available');
    }
    
    async startConsultation(consultationData) {
        return this.request('/consultation/analyze', {
            method: 'POST',
            body: consultationData
        });
    }
    
    // Wireframes
    async generateWireframes(projectData) {
        return this.request('/wireframes/generate', {
            method: 'POST',
            body: projectData
        });
    }
    
    // Version Management
    async getVersions(projectId) {
        return this.request(`/versions/${projectId}`);
    }
    
    async saveVersion(versionData) {
        return this.request('/versions', {
            method: 'POST',
            body: versionData
        });
    }
    
    // Export
    async exportProject(exportData) {
        return this.request('/project/export', {
            method: 'POST',
            body: exportData
        });
    }
    
    // Market Insights
    async getMarketInsights(projectId) {
        return this.request(`/market-insights/${projectId}`);
    }
    
    // Project Intelligence
    async getProjectIntelligence(projectId) {
        return this.request(`/intelligence/${projectId}`);
    }
    
    // Iteration Plans
    async getIterationPlans(projectId) {
        return this.request(`/iterations/${projectId}`);
    }
    
    // Analytics
    async sendAnalyticsEvent(eventData) {
        return this.request('/analytics/event', {
            method: 'POST',
            body: eventData
        });
    }
    
    // Health check
    async healthCheck() {
        return this.request('/health');
    }
}

// Export singleton instance
window.APIClient = new APIClient();