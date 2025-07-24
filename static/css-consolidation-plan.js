/**
 * CSS Consolidation Plan
 * Analysis and migration plan for moving to unified design system
 */

const fs = require('fs');
const path = require('path');

class CSSConsolidation {
    constructor() {
        this.basePath = '/Users/michaelkraft/Coder1-Platform';
        this.cssFiles = [];
        this.consolidationPlan = {};
        this.duplicateRules = [];
        this.migrationMap = new Map();
    }
    
    async analyze() {
        console.log('🎨 Starting CSS consolidation analysis...\n');
        
        // Find all CSS files
        this.findCSSFiles();
        
        // Analyze patterns
        this.analyzePatterns();
        
        // Create consolidation plan
        this.createConsolidationPlan();
        
        // Show migration strategy
        this.showMigrationStrategy();
        
        console.log('✅ CSS analysis complete!');
    }
    
    findCSSFiles() {
        const searchPaths = [
            'static',
            'ide-build/static',
            'coder1-ide-source/src'
        ];
        
        searchPaths.forEach(searchPath => {
            const fullPath = path.join(this.basePath, searchPath);
            this.findCSSInDirectory(fullPath, searchPath);
        });
        
        // Filter out build artifacts and focus on source files
        this.cssFiles = this.cssFiles.filter(file => {
            return !file.path.includes('main.') || // Skip React build files
                   file.path.includes('product-creation-hub.css') ||
                   file.path.includes('terminal-voice.css') ||
                   file.path.includes('styles.css');
        });
    }
    
    findCSSInDirectory(dir, relativePath) {
        try {
            const files = fs.readdirSync(dir);
            
            files.forEach(file => {
                const filePath = path.join(dir, file);
                const relativeFilePath = path.join(relativePath, file);
                const stat = fs.statSync(filePath);
                
                if (stat.isDirectory() && !file.includes('node_modules')) {
                    this.findCSSInDirectory(filePath, relativeFilePath);
                } else if (file.endsWith('.css')) {
                    this.cssFiles.push({
                        name: file,
                        path: relativeFilePath,
                        fullPath: filePath,
                        size: this.getFileSize(filePath),
                        category: this.categorizeFile(file, relativeFilePath)
                    });
                }
            });
        } catch (error) {
            // Directory doesn't exist or no permission
        }
    }
    
    categorizeFile(filename, path) {
        if (path.includes('static/css/main.')) return 'react-build';
        if (filename.includes('product-creation-hub')) return 'app-specific';
        if (filename.includes('terminal-voice')) return 'feature-specific';
        if (filename.includes('styles.css')) return 'global';
        if (filename.includes('fix-') || filename.includes('aggressive-')) return 'patches';
        if (path.includes('src/components/')) return 'component';
        return 'utility';
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
    
    analyzePatterns() {
        console.log('📊 CSS FILE ANALYSIS:\n');
        
        const categories = {};
        let totalSize = 0;
        
        this.cssFiles.forEach(file => {
            if (!categories[file.category]) {
                categories[file.category] = [];
            }
            categories[file.category].push(file);
        });
        
        Object.entries(categories).forEach(([category, files]) => {
            console.log(`📁 ${category.toUpperCase()}:`);
            files.forEach(file => {
                console.log(`   📄 ${file.path} (${file.size})`);
            });
            console.log('');
        });
        
        console.log(`📊 Total CSS files: ${this.cssFiles.length}\n`);
    }
    
    createConsolidationPlan() {
        this.consolidationPlan = {
            'Keep and Migrate': [
                {
                    file: 'static/product-creation-hub.css',
                    action: 'Merge core styles into design-system.css',
                    priority: 'high',
                    reason: 'Main application styles with design tokens'
                },
                {
                    file: 'static/features/terminal-voice.css',
                    action: 'Keep as feature-specific module, update to use design tokens',
                    priority: 'medium',
                    reason: 'Feature-specific styles, well organized'
                }
            ],
            'Replace with Design System': [
                {
                    files: ['static/styles.css', 'ide-build/styles.css'],
                    action: 'Replace with design-system.css import',
                    priority: 'high',
                    reason: 'Global styles now covered by design system'
                },
                {
                    files: ['ide-build/static/fix-*.css', 'ide-build/static/aggressive-*.css'],
                    action: 'Remove - functionality moved to unified cleanup system',
                    priority: 'high',
                    reason: 'Patches replaced by systematic approach'
                }
            ],
            'Archive/Remove': [
                {
                    files: ['static/css/main.*.css', 'ide-build/static/css/main.*.css'],
                    action: 'Remove old React build artifacts',
                    priority: 'medium',
                    reason: 'Old build files, replaced by current build'
                },
                {
                    files: ['coder1-ide-source/src/components/*.css'],
                    action: 'Keep for source, but use design system in builds',
                    priority: 'low',
                    reason: 'Source files for React components'
                }
            ]
        };
    }
    
    showMigrationStrategy() {
        console.log('🗺️  CSS CONSOLIDATION PLAN:\n');
        
        Object.entries(this.consolidationPlan).forEach(([action, items]) => {
            console.log(`📋 ${action.toUpperCase()}:`);
            items.forEach((item, index) => {
                console.log(`  ${index + 1}. ${item.file || item.files.join(', ')}`);
                console.log(`     Action: ${item.action}`);
                console.log(`     Priority: ${item.priority}`);
                console.log(`     Reason: ${item.reason}\n`);
            });
        });
        
        console.log('🎯 MIGRATION STEPS:\n');
        console.log('1. Update HTML files to use design-system.css');
        console.log('2. Migrate custom styles to use design tokens');
        console.log('3. Remove old CSS files systematically');
        console.log('4. Test all applications for style consistency');
        console.log('5. Update component styles to use utility classes\n');
        
        console.log('📈 EXPECTED BENEFITS:\n');
        console.log('• Reduced CSS bundle size by ~60%');
        console.log('• Consistent design across all applications');
        console.log('• Easier maintenance with centralized tokens');
        console.log('• Better performance with consolidated files');
        console.log('• Improved developer experience with utility classes\n');
        
        this.showImplementationGuide();
    }
    
    showImplementationGuide() {
        console.log('🛠️  IMPLEMENTATION GUIDE:\n');
        
        const steps = [
            {
                step: 'Phase 1: Core Integration',
                tasks: [
                    'Add design-system.css to main HTML files',
                    'Update smart-prd-generator.html to use new system',
                    'Update ide-build/index.html to use new system',
                    'Test basic functionality'
                ]
            },
            {
                step: 'Phase 2: Component Migration',
                tasks: [
                    'Update button classes to use .btn variants',
                    'Replace custom modal styles with .modal classes',
                    'Convert form elements to use .input classes',
                    'Update card components to use .card classes'
                ]
            },
            {
                step: 'Phase 3: Cleanup',
                tasks: [
                    'Remove obsolete CSS files',
                    'Update build processes',
                    'Remove duplicate styles',
                    'Optimize CSS loading order'
                ]
            }
        ];
        
        steps.forEach((phase, index) => {
            console.log(`${index + 1}. ${phase.step}:`);
            phase.tasks.forEach(task => {
                console.log(`   • ${task}`);
            });
            console.log('');
        });
    }
    
    generateMigrationScript() {
        // Generate a script to help with the migration
        const script = `#!/bin/bash
# CSS Migration Script - Auto-generated

echo "🎨 Starting CSS migration to design system..."

# Phase 1: Backup existing files
echo "📦 Creating backups..."
mkdir -p css-backups
cp static/product-creation-hub.css css-backups/
cp static/styles.css css-backups/
cp ide-build/static/features/terminal-voice.css css-backups/

# Phase 2: Remove obsolete files
echo "🗑️  Removing obsolete CSS files..."
rm -f ide-build/static/css/main.*.css.map
rm -f ide-build/static/aggressive-fixes.css
rm -f ide-build/static/fix-terminal-header.css

# Phase 3: Update HTML files to reference design system
echo "📝 Updating HTML references..."
# (Manual step - update script loaders and HTML files)

echo "✅ CSS migration preparation complete!"
echo "📋 Next steps:"
echo "   1. Update HTML files to import design-system.css"
echo "   2. Test all applications"
echo "   3. Remove old CSS imports"
`;
        
        const scriptPath = path.join(this.basePath, 'css-migration.sh');
        fs.writeFileSync(scriptPath, script);
        console.log(`📄 Migration script created: css-migration.sh\n`);
    }
}

// Run the analysis
const consolidation = new CSSConsolidation();
consolidation.analyze().then(() => {
    consolidation.generateMigrationScript();
}).catch(console.error);