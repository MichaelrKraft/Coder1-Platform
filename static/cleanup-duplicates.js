/**
 * File Structure Cleanup Script
 * Identifies and removes duplicate/obsolete files
 */

const fs = require('fs');
const path = require('path');

class FileCleanup {
    constructor() {
        this.basePath = '/Users/michaelkraft/Coder1-Platform';
        this.duplicates = [];
        this.obsoleteFiles = [];
        this.organizationMap = new Map();
    }
    
    async cleanup() {
        console.log('🧹 Starting file structure cleanup...\n');
        
        // Identify obsolete React build files
        this.identifyObsoleteReactBuilds();
        
        // Identify old fix scripts (should use unified system now)
        this.identifyObsoleteFixScripts();
        
        // Identify duplicate JS files
        this.identifyDuplicateFiles();
        
        // Show cleanup plan
        this.showCleanupPlan();
        
        // Execute cleanup (with confirmation)
        // this.executeCleanup();
        
        console.log('✅ Cleanup analysis complete!');
    }
    
    identifyObsoleteReactBuilds() {
        const reactBuildPaths = [
            'ide-build/static/js',
            'coder1-ide/build/static/js',
            'coder1-ide-source/build/static/js',
            'static/js'
        ];
        
        reactBuildPaths.forEach(buildPath => {
            const fullPath = path.join(this.basePath, buildPath);
            if (fs.existsSync(fullPath)) {
                const files = fs.readdirSync(fullPath);
                const mainFiles = files.filter(f => f.startsWith('main.') && f.endsWith('.js'));
                
                if (mainFiles.length > 1) {
                    // Keep the most recent, mark others as obsolete
                    const sorted = mainFiles.sort((a, b) => {
                        const statA = fs.statSync(path.join(fullPath, a));
                        const statB = fs.statSync(path.join(fullPath, b));
                        return statB.mtime - statA.mtime;
                    });
                    
                    // Mark older files for cleanup
                    sorted.slice(1).forEach(file => {
                        this.obsoleteFiles.push({
                            path: path.join(buildPath, file),
                            reason: 'Old React build artifact',
                            size: this.getFileSize(path.join(fullPath, file))
                        });
                    });
                }
            }
        });
    }
    
    identifyObsoleteFixScripts() {
        const fixScriptPatterns = [
            'prd-cleanup.js',
            'prd-fix-final.js', 
            'prd-force-show.js',
            'prd-working-solution.js',
            'remove-blue-x.js',
            'restore-coder1-logo.js',
            'simple-stop-button.js'
        ];
        
        const searchPaths = ['ide-build/static', 'static'];
        
        searchPaths.forEach(searchPath => {
            const fullPath = path.join(this.basePath, searchPath);
            if (fs.existsSync(fullPath)) {
                fixScriptPatterns.forEach(pattern => {
                    const filePath = path.join(fullPath, pattern);
                    if (fs.existsSync(filePath)) {
                        this.obsoleteFiles.push({
                            path: path.join(searchPath, pattern),
                            reason: 'Replaced by ui-cleanup-unified.js',
                            size: this.getFileSize(filePath)
                        });
                    }
                });
            }
        });
    }
    
    identifyDuplicateFiles() {
        const knownDuplicates = [
            {
                keep: 'static/product-creation-hub-refactored.js',
                remove: ['static/product-creation-hub.js'],
                reason: 'Using refactored modular version'
            },
            {
                keep: 'ide-build/static/script-loader.js',
                remove: ['static/smart-prd-script-loader.js'], // Different purposes, both needed
                reason: 'Different script loaders for different apps'
            }
        ];
        
        knownDuplicates.forEach(duplicate => {
            duplicate.remove.forEach(removePath => {
                const fullPath = path.join(this.basePath, removePath);
                if (fs.existsSync(fullPath)) {
                    this.duplicates.push({
                        path: removePath,
                        keepPath: duplicate.keep,
                        reason: duplicate.reason,
                        size: this.getFileSize(fullPath)
                    });
                }
            });
        });
    }
    
    getFileSize(filePath) {
        try {
            const stats = fs.statSync(filePath);
            return this.formatBytes(stats.size);
        } catch (error) {
            return 'Unknown';
        }
    }
    
    formatBytes(bytes) {
        if (bytes === 0) return '0 B';
        const k = 1024;
        const sizes = ['B', 'KB', 'MB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
    }
    
    showCleanupPlan() {
        console.log('📋 CLEANUP PLAN\n');
        
        if (this.obsoleteFiles.length > 0) {
            console.log('🗑️  OBSOLETE FILES TO REMOVE:');
            this.obsoleteFiles.forEach((file, index) => {
                console.log(`  ${index + 1}. ${file.path}`);
                console.log(`     Reason: ${file.reason}`);
                console.log(`     Size: ${file.size}\n`);
            });
        }
        
        if (this.duplicates.length > 0) {
            console.log('📄 DUPLICATE FILES TO REMOVE:');
            this.duplicates.forEach((file, index) => {
                console.log(`  ${index + 1}. ${file.path}`);
                console.log(`     Keep: ${file.keepPath}`);
                console.log(`     Reason: ${file.reason}`);
                console.log(`     Size: ${file.size}\n`);
            });
        }
        
        const totalFiles = this.obsoleteFiles.length + this.duplicates.length;
        console.log(`📊 SUMMARY: ${totalFiles} files identified for cleanup\n`);
        
        // Show organized structure recommendation
        this.showOrganizedStructure();
    }
    
    showOrganizedStructure() {
        console.log('📁 RECOMMENDED FILE ORGANIZATION:\n');
        
        const structure = {
            'static/': {
                'modules/': [
                    'error-handler.js',
                    'session-manager.js', 
                    'api-client.js',
                    'wizard-controller.js',
                    'ui-components.js'
                ],
                'apps/': [
                    'smart-prd-script-loader.js',
                    'product-creation-hub-refactored.js'
                ],
                'shared/': [
                    'utils.js',
                    'smart-prd-voice.js'
                ],
                'legacy/': [
                    'product-creation-hub-original.js (backup)'
                ]
            },
            'ide-build/static/': {
                'core/': [
                    'script-loader.js',
                    'ui-cleanup-unified.js'
                ],
                'features/': [
                    'terminal-voice.js',
                    'coder1-special-views.js',
                    'parallel-agents-modal.js'
                ],
                'config/': [
                    'api-config.js',
                    'api-injection.js'
                ]
            }
        };
        
        this.printStructure(structure, 0);
    }
    
    printStructure(obj, indent) {
        Object.entries(obj).forEach(([key, value]) => {
            console.log('  '.repeat(indent) + '📁 ' + key);
            if (Array.isArray(value)) {
                value.forEach(file => {
                    console.log('  '.repeat(indent + 1) + '📄 ' + file);
                });
            } else if (typeof value === 'object') {
                this.printStructure(value, indent + 1);
            }
        });
    }
    
    executeCleanup() {
        console.log('⚠️  EXECUTING CLEANUP (DRY RUN - FILES NOT ACTUALLY DELETED)\n');
        
        // In a real implementation, this would actually delete files
        // For safety, we're just showing what would be deleted
        
        this.obsoleteFiles.forEach(file => {
            console.log(`Would delete: ${file.path}`);
        });
        
        this.duplicates.forEach(file => {
            console.log(`Would delete: ${file.path} (keeping ${file.keepPath})`);
        });
    }
}

// Run the cleanup analysis
const cleanup = new FileCleanup();
cleanup.cleanup().catch(console.error);