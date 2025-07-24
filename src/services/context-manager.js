// Context Manager Service
const fs = require('fs').promises;
const path = require('path');
const { exec } = require('child_process');
const util = require('util');
const execPromise = util.promisify(exec);

class ContextManager {
    constructor() {
        this.currentContext = new Map();
        this.recipes = new Map();
        this.projectRoot = process.cwd();
        this.loadSavedRecipes();
    }
    
    // Get files for a preset configuration
    async getPresetFiles(preset) {
        switch (preset) {
            case 'project':
                return await this.getProjectOverviewFiles();
            case 'current':
                return await this.getCurrentWorkFiles();
            case 'recent':
                return await this.getRecentChangesFiles();
            default:
                throw new Error('Unknown preset: ' + preset);
        }
    }
    
    // Get project overview files (README, package.json, main files)
    async getProjectOverviewFiles() {
        const files = [];
        
        // Common project files to look for
        const projectFiles = [
            'README.md',
            'readme.md',
            'package.json',
            'src/index.js',
            'src/app.js',
            'src/main.js',
            'index.js',
            'app.js',
            'server.js'
        ];
        
        for (const fileName of projectFiles) {
            try {
                const filePath = path.join(this.projectRoot, fileName);
                const stats = await fs.stat(filePath);
                
                if (stats.isFile()) {
                    const content = await fs.readFile(filePath, 'utf-8');
                    files.push({
                        name: fileName,
                        path: fileName,
                        size: stats.size,
                        tokens: this.estimateTokens(content),
                        content: content
                    });
                }
            } catch (error) {
                // File doesn't exist, skip it
            }
        }
        
        return files;
    }
    
    // Get recently modified files
    async getCurrentWorkFiles() {
        try {
            // Use git to find recently modified files
            const { stdout } = await execPromise('git diff --name-only HEAD~5..HEAD || find . -type f -mtime -1 -name "*.js" -o -name "*.jsx" -o -name "*.ts" -o -name "*.tsx" | head -10');
            
            const fileNames = stdout.trim().split('\n').filter(f => f);
            const files = [];
            
            for (const fileName of fileNames.slice(0, 5)) { // Limit to 5 files
                try {
                    const filePath = path.join(this.projectRoot, fileName);
                    const stats = await fs.stat(filePath);
                    const content = await fs.readFile(filePath, 'utf-8');
                    
                    files.push({
                        name: path.basename(fileName),
                        path: fileName,
                        size: stats.size,
                        tokens: this.estimateTokens(content),
                        content: content
                    });
                } catch (error) {
                    // Skip files that can't be read
                }
            }
            
            return files;
            
        } catch (error) {
            // Fallback to mock data if git not available
            return [
                {
                    name: 'recent-file.js',
                    path: 'src/recent-file.js',
                    size: 2048,
                    tokens: 512,
                    content: '// Recently modified file'
                }
            ];
        }
    }
    
    // Get recent changes from git
    async getRecentChangesFiles() {
        try {
            // Get git diff
            const { stdout: diffOutput } = await execPromise('git diff HEAD~3..HEAD --name-only || echo ""');
            const changedFiles = diffOutput.trim().split('\n').filter(f => f);
            
            const files = [];
            
            // Add recent commits info as a virtual file
            try {
                const { stdout: logOutput } = await execPromise('git log --oneline -10 || echo "No git history"');
                files.push({
                    name: 'recent-commits.txt',
                    path: '.git/recent-commits.txt',
                    size: logOutput.length,
                    tokens: this.estimateTokens(logOutput),
                    content: logOutput
                });
            } catch (error) {
                // Git not available
            }
            
            // Add changed files
            for (const fileName of changedFiles.slice(0, 3)) {
                try {
                    const filePath = path.join(this.projectRoot, fileName);
                    const content = await fs.readFile(filePath, 'utf-8');
                    const stats = await fs.stat(filePath);
                    
                    files.push({
                        name: path.basename(fileName),
                        path: fileName,
                        size: stats.size,
                        tokens: this.estimateTokens(content),
                        content: content
                    });
                } catch (error) {
                    // Skip unreadable files
                }
            }
            
            return files;
            
        } catch (error) {
            // Fallback for non-git projects
            return [
                {
                    name: 'recent-changes.txt',
                    path: 'recent-changes.txt',
                    size: 100,
                    tokens: 25,
                    content: 'No git repository found. Recent changes unavailable.'
                }
            ];
        }
    }
    
    // Process custom files
    async processFiles(files) {
        const processedFiles = [];
        
        for (const file of files) {
            if (file.content) {
                // File already has content
                processedFiles.push({
                    ...file,
                    tokens: file.tokens || this.estimateTokens(file.content)
                });
            } else if (file.path) {
                // Need to read file content
                try {
                    const filePath = path.join(this.projectRoot, file.path);
                    const content = await fs.readFile(filePath, 'utf-8');
                    const stats = await fs.stat(filePath);
                    
                    processedFiles.push({
                        name: file.name || path.basename(file.path),
                        path: file.path,
                        size: stats.size,
                        tokens: this.estimateTokens(content),
                        content: content
                    });
                } catch (error) {
                    console.error('Error reading file:', file.path, error);
                }
            }
        }
        
        return processedFiles;
    }
    
    // Estimate token count (rough approximation)
    estimateTokens(content) {
        // Simple estimation: ~4 characters per token
        return Math.ceil(content.length / 4);
    }
    
    // Get current context state
    async getCurrentContext() {
        return {
            files: Array.from(this.currentContext.values()),
            totalTokens: Array.from(this.currentContext.values()).reduce((sum, f) => sum + f.tokens, 0),
            fileCount: this.currentContext.size
        };
    }
    
    // Save a recipe
    async saveRecipe(recipe) {
        const key = recipe.name.toLowerCase().replace(/\s+/g, '-');
        this.recipes.set(key, recipe);
        
        // Save to file
        await this.saveRecipesToFile();
        
        return recipe;
    }
    
    // Get all recipes
    async getRecipes() {
        const recipes = {};
        this.recipes.forEach((recipe, key) => {
            recipes[key] = recipe;
        });
        return recipes;
    }
    
    // Load a specific recipe
    async loadRecipe(recipeName) {
        return this.recipes.get(recipeName);
    }
    
    // Clear current context
    async clearContext() {
        this.currentContext.clear();
    }
    
    // Load saved recipes from file
    async loadSavedRecipes() {
        try {
            const recipesPath = path.join(this.projectRoot, '.context-recipes.json');
            const data = await fs.readFile(recipesPath, 'utf-8');
            const recipes = JSON.parse(data);
            
            Object.entries(recipes).forEach(([key, recipe]) => {
                this.recipes.set(key, recipe);
            });
        } catch (error) {
            // No saved recipes or error reading file
            // Initialize with default recipes
            this.initializeDefaultRecipes();
        }
    }
    
    // Save recipes to file
    async saveRecipesToFile() {
        try {
            const recipesPath = path.join(this.projectRoot, '.context-recipes.json');
            const recipes = {};
            
            this.recipes.forEach((recipe, key) => {
                recipes[key] = recipe;
            });
            
            await fs.writeFile(recipesPath, JSON.stringify(recipes, null, 2));
        } catch (error) {
            console.error('Error saving recipes:', error);
        }
    }
    
    // Initialize with default recipes
    initializeDefaultRecipes() {
        this.recipes.set('debug', {
            name: 'Debug Mode',
            description: 'Load error logs and main application files',
            files: [],
            created: new Date().toISOString()
        });
        
        this.recipes.set('feature', {
            name: 'New Feature',
            description: 'Load project structure and component templates',
            files: [],
            created: new Date().toISOString()
        });
        
        this.recipes.set('review', {
            name: 'Code Review',
            description: 'Load recent changes and test files',
            files: [],
            created: new Date().toISOString()
        });
    }
}

// Export singleton instance
module.exports = new ContextManager();