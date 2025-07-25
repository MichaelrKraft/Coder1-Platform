/**
 * Automated Script Loader with Cache-Busting
 * Manages script loading order and automatic versioning
 */

class ScriptLoader {
    constructor() {
        this.version = Date.now();
        this.loadedScripts = new Set();
        this.dependencies = {
            'config/api-config.js': [],
            'features/terminal-voice.js': ['config/api-config.js'],
            'config/api-injection.js': ['config/api-config.js'],
            'features/parallel-agents-modal.js': ['config/api-injection.js'],
            'features/coder1-special-views.js': ['config/api-injection.js'],
            'core/ui-cleanup-unified.js': []
        };
    }
    
    async loadScript(scriptPath, dependencies = []) {
        // Check if already loaded
        if (this.loadedScripts.has(scriptPath)) {
            return true;
        }
        
        // Load dependencies first
        for (const dep of dependencies) {
            await this.loadScript(dep, this.dependencies[dep] || []);
        }
        
        return new Promise((resolve, reject) => {
            const script = document.createElement('script');
            script.src = `./static/${scriptPath}?v=${this.version}`;
            script.async = false; // Preserve execution order
            
            script.onload = () => {
                this.loadedScripts.add(scriptPath);
                resolve(true);
            };
            
            script.onerror = () => {
                reject(new Error(`Failed to load script: ${scriptPath}`));
            };
            
            document.head.appendChild(script);
        });
    }
    
    async loadAllScripts() {
        const scriptOrder = [
            'core/ui-cleanup-unified.js',
            'config/api-config.js',
            'features/terminal-voice.js',
            'config/api-injection.js',
            'features/parallel-agents-modal.js',
            'features/coder1-special-views.js'
        ];
        
        try {
            for (const script of scriptOrder) {
                await this.loadScript(script, this.dependencies[script]);
            }
            return true;
        } catch (error) {
            return false;
        }
    }
}

// Auto-load scripts when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', async () => {
        const loader = new ScriptLoader();
        await loader.loadAllScripts();
    });
} else {
    const loader = new ScriptLoader();
    loader.loadAllScripts();
}