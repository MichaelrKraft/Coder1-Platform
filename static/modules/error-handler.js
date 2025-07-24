/**
 * Centralized Error Handler Module
 * Provides consistent error handling, logging, and user feedback across the application
 */

class ErrorHandler {
    constructor() {
        this.errorLog = [];
        this.maxLogEntries = 100;
        this.isDebugMode = this.checkDebugMode();
        
        // Error types with different handling strategies
        this.errorTypes = {
            NETWORK: 'network',
            API: 'api', 
            VALIDATION: 'validation',
            UI: 'ui',
            PERMISSION: 'permission',
            TIMEOUT: 'timeout',
            UNKNOWN: 'unknown'
        };
        
        // Set up global error handlers
        this.setupGlobalHandlers();
    }
    
    checkDebugMode() {
        return window.location.search.includes('debug=true') || 
               localStorage.getItem('debugMode') === 'true';
    }
    
    setupGlobalHandlers() {
        // Catch unhandled promise rejections
        window.addEventListener('unhandledrejection', (event) => {
            this.handleError(event.reason, {
                type: this.errorTypes.UNKNOWN,
                context: 'unhandledrejection',
                preventToast: false
            });
        });
        
        // Catch JavaScript errors
        window.addEventListener('error', (event) => {
            this.handleError(event.error || event.message, {
                type: this.errorTypes.UNKNOWN,
                context: 'javascript_error',
                filename: event.filename,
                lineno: event.lineno,
                preventToast: true // Prevent spam from minor errors
            });
        });
    }
    
    /**
     * Main error handling method
     * @param {Error|string} error - The error object or message
     * @param {Object} options - Error handling options
     */
    handleError(error, options = {}) {
        const errorData = this.processError(error, options);
        
        // Log the error
        this.logError(errorData);
        
        // Show user feedback if needed
        if (!options.preventToast && !options.silent) {
            this.showUserFeedback(errorData);
        }
        
        // Report to analytics if configured
        if (options.reportToAnalytics !== false) {
            this.reportToAnalytics(errorData);
        }
        
        return errorData;
    }
    
    processError(error, options) {
        const errorData = {
            id: this.generateErrorId(),
            timestamp: new Date().toISOString(),
            type: options.type || this.inferErrorType(error),
            message: this.extractMessage(error),
            stack: error?.stack,
            context: options.context || 'unknown',
            severity: options.severity || this.inferSeverity(error, options.type),
            userAgent: navigator.userAgent,
            url: window.location.href,
            userId: this.getUserId(),
            sessionId: window.SessionManager?.getSessionId(),
            metadata: options.metadata || {}
        };
        
        return errorData;
    }
    
    extractMessage(error) {
        if (typeof error === 'string') return error;
        if (error?.message) return error.message;
        if (error?.toString) return error.toString();
        return 'Unknown error occurred';
    }
    
    inferErrorType(error) {
        const message = this.extractMessage(error).toLowerCase();
        
        if (message.includes('network') || message.includes('fetch') || message.includes('connection')) {
            return this.errorTypes.NETWORK;
        }
        if (message.includes('timeout')) {
            return this.errorTypes.TIMEOUT;
        }
        if (message.includes('permission') || message.includes('unauthorized')) {
            return this.errorTypes.PERMISSION;
        }
        if (message.includes('validation') || message.includes('invalid')) {
            return this.errorTypes.VALIDATION;
        }
        if (message.includes('api') || message.includes('http')) {
            return this.errorTypes.API;
        }
        
        return this.errorTypes.UNKNOWN;
    }
    
    inferSeverity(error, type) {
        if (type === this.errorTypes.PERMISSION) return 'high';
        if (type === this.errorTypes.API || type === this.errorTypes.NETWORK) return 'medium';
        if (type === this.errorTypes.VALIDATION) return 'low';
        return 'medium';
    }
    
    generateErrorId() {
        return `err-${Date.now()}-${Math.random().toString(36).substr(2, 6)}`;
    }
    
    getUserId() {
        // Try to get user ID from various sources
        return localStorage.getItem('userId') || 
               window.currentUser?.id || 
               'anonymous';
    }
    
    logError(errorData) {
        // Add to internal log
        this.errorLog.unshift(errorData);
        
        // Trim log if too large
        if (this.errorLog.length > this.maxLogEntries) {
            this.errorLog = this.errorLog.slice(0, this.maxLogEntries);
        }
        
        // Console logging based on severity and debug mode
        if (this.isDebugMode || errorData.severity === 'high') {
            console.group(`🚨 Error [${errorData.type.toUpperCase()}] - ${errorData.severity.toUpperCase()}`);
            console.error('Message:', errorData.message);
            console.error('Context:', errorData.context);
            console.error('Timestamp:', errorData.timestamp);
            console.error('Error ID:', errorData.id);
            if (errorData.stack && this.isDebugMode) {
                console.error('Stack:', errorData.stack);
            }
            if (Object.keys(errorData.metadata).length > 0) {
                console.error('Metadata:', errorData.metadata);
            }
            console.groupEnd();
        }
    }
    
    showUserFeedback(errorData) {
        if (!window.UIComponents) return;
        
        const userMessage = this.getUserFriendlyMessage(errorData);
        const toastType = this.getToastType(errorData.severity);
        
        window.UIComponents.showToast(userMessage, toastType);
    }
    
    getUserFriendlyMessage(errorData) {
        switch (errorData.type) {
            case this.errorTypes.NETWORK:
                return 'Connection issue. Please check your internet and try again.';
            case this.errorTypes.API:
                return 'Service temporarily unavailable. Please try again later.';
            case this.errorTypes.VALIDATION:
                return errorData.message; // Validation messages are usually user-friendly
            case this.errorTypes.PERMISSION:
                return 'Access denied. Please check your permissions.';
            case this.errorTypes.TIMEOUT:
                return 'Request timed out. Please try again.';
            case this.errorTypes.UI:
                return 'Interface issue occurred. Please refresh if problems persist.';
            default:
                if (this.isDebugMode) {
                    return `Error: ${errorData.message} (ID: ${errorData.id})`;
                }
                return 'An unexpected error occurred. Please try again.';
        }
    }
    
    getToastType(severity) {
        switch (severity) {
            case 'high': return 'error';
            case 'medium': return 'warning';
            case 'low': return 'info';
            default: return 'warning';
        }
    }
    
    async reportToAnalytics(errorData) {
        try {
            if (window.APIClient) {
                await window.APIClient.sendAnalyticsEvent({
                    type: 'error_occurred',
                    data: {
                        errorId: errorData.id,
                        errorType: errorData.type,
                        severity: errorData.severity,
                        message: errorData.message,
                        context: errorData.context,
                        url: errorData.url
                    }
                });
            }
        } catch (reportingError) {
            // Fail silently - don't create error loops
        }
    }
    
    // Utility methods for specific error types
    networkError(message, context) {
        return this.handleError(message, {
            type: this.errorTypes.NETWORK,
            context,
            severity: 'medium'
        });
    }
    
    apiError(error, endpoint, context) {
        return this.handleError(error, {
            type: this.errorTypes.API,
            context: context || `api_${endpoint}`,
            severity: 'medium',
            metadata: { endpoint }
        });
    }
    
    validationError(message, field, context) {
        return this.handleError(message, {
            type: this.errorTypes.VALIDATION,
            context: context || 'validation',
            severity: 'low',
            metadata: { field }
        });
    }
    
    uiError(message, component, context) {
        return this.handleError(message, {
            type: this.errorTypes.UI,
            context: context || `ui_${component}`,
            severity: 'low',
            metadata: { component }
        });
    }
    
    // Recovery and retry methods
    async withRetry(fn, maxRetries = 3, backoffMs = 1000) {
        let lastError;
        
        for (let attempt = 1; attempt <= maxRetries; attempt++) {
            try {
                return await fn();
            } catch (error) {
                lastError = error;
                
                this.handleError(error, {
                    context: `retry_attempt_${attempt}`,
                    silent: attempt < maxRetries, // Only show error on final attempt
                    preventToast: attempt < maxRetries,
                    metadata: { attempt, maxRetries }
                });
                
                if (attempt < maxRetries) {
                    await this.sleep(backoffMs * attempt); // Exponential backoff
                }
            }
        }
        
        throw lastError;
    }
    
    sleep(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }
    
    // Debug and monitoring methods
    getErrorLog() {
        return [...this.errorLog];
    }
    
    getErrorStats() {
        const stats = {
            total: this.errorLog.length,
            byType: {},
            bySeverity: {},
            recent: this.errorLog.slice(0, 10)
        };
        
        this.errorLog.forEach(error => {
            stats.byType[error.type] = (stats.byType[error.type] || 0) + 1;
            stats.bySeverity[error.severity] = (stats.bySeverity[error.severity] || 0) + 1;
        });
        
        return stats;
    }
    
    clearErrorLog() {
        this.errorLog = [];
    }
    
    toggleDebugMode() {
        this.isDebugMode = !this.isDebugMode;
        localStorage.setItem('debugMode', this.isDebugMode.toString());
        return this.isDebugMode;
    }
    
    // Export error log for debugging
    exportErrorLog() {
        const exportData = {
            errors: this.errorLog,
            stats: this.getErrorStats(),
            exportedAt: new Date().toISOString(),
            userAgent: navigator.userAgent,
            url: window.location.href
        };
        
        const blob = new Blob([JSON.stringify(exportData, null, 2)], { 
            type: 'application/json' 
        });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `error-log-${Date.now()}.json`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
    }
}

// Export singleton instance
window.ErrorHandler = new ErrorHandler();

// Expose debug utilities globally
window.debugErrors = () => window.ErrorHandler.getErrorStats();
window.exportErrors = () => window.ErrorHandler.exportErrorLog();
window.toggleDebug = () => window.ErrorHandler.toggleDebugMode();