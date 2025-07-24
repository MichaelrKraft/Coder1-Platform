/**
 * Smart PRD Script Loader
 * Manages modular script loading for the Smart PRD Generator
 */

class SmartPRDScriptLoader {
    constructor() {
        this.version = Date.now();
        this.loadedScripts = new Set();
        this.loadingPromises = new Map();
        
        // Define module dependencies
        this.dependencies = {
            'modules/error-handler.js': [],
            'modules/session-manager.js': ['modules/error-handler.js'],
            'modules/api-client.js': ['modules/error-handler.js'],
            'modules/wizard-controller.js': ['modules/session-manager.js', 'modules/error-handler.js'],
            'modules/ui-components.js': ['modules/error-handler.js'],
            'product-creation-hub-refactored.js': [
                'modules/error-handler.js',
                'modules/session-manager.js',
                'modules/api-client.js', 
                'modules/wizard-controller.js',
                'modules/ui-components.js'
            ]
        };
    }
    
    async loadScript(scriptPath, dependencies = []) {
        // Check if already loaded
        if (this.loadedScripts.has(scriptPath)) {
            return true;
        }
        
        // Check if already loading
        if (this.loadingPromises.has(scriptPath)) {
            return this.loadingPromises.get(scriptPath);
        }
        
        // Create loading promise
        const loadingPromise = this._loadScriptInternal(scriptPath, dependencies);
        this.loadingPromises.set(scriptPath, loadingPromise);
        
        return loadingPromise;
    }
    
    async _loadScriptInternal(scriptPath, dependencies) {
        try {
            // Load dependencies first
            for (const dep of dependencies) {
                await this.loadScript(dep, this.dependencies[dep] || []);
            }
            
            // Load the script
            await this._createScriptElement(scriptPath);
            this.loadedScripts.add(scriptPath);
            
            return true;
        } catch (error) {
            throw error;
        } finally {
            this.loadingPromises.delete(scriptPath);
        }
    }
    
    _createScriptElement(scriptPath) {
        return new Promise((resolve, reject) => {
            const script = document.createElement('script');
            script.src = `static/${scriptPath}?v=${this.version}`;
            script.async = false; // Preserve execution order
            
            script.onload = () => {
                resolve();
            };
            
            script.onerror = () => {
                reject(new Error(`Failed to load script: ${scriptPath}`));
            };
            
            document.head.appendChild(script);
        });
    }
    
    async loadAllModules() {
        const loadOrder = [
            'modules/error-handler.js',
            'modules/session-manager.js',
            'modules/api-client.js',
            'modules/wizard-controller.js', 
            'modules/ui-components.js',
            'product-creation-hub-refactored.js'
        ];
        
        try {
            for (const script of loadOrder) {
                await this.loadScript(script, this.dependencies[script] || []);
            }
            
            // Wait a tick to ensure all modules are initialized
            await new Promise(resolve => setTimeout(resolve, 100));
            
            return true;
        } catch (error) {
            throw error;
        }
    }
}

// Auto-load modules when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', async () => {
        try {
            const loader = new SmartPRDScriptLoader();
            await loader.loadAllModules();
        } catch (error) {
            console.error('Failed to load Smart PRD modules:', error);
        }
    });
} else {
    (async () => {
        try {
            const loader = new SmartPRDScriptLoader();
            await loader.loadAllModules();
        } catch (error) {
            console.error('Failed to load Smart PRD modules:', error);
        }
    })();
}