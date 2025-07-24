// Context Priming JavaScript
class ContextPriming {
    constructor() {
        this.loadedFiles = new Map();
        this.totalTokens = 0;
        this.maxTokens = 4000; // Conservative limit
        this.recipes = this.loadRecipes();
        
        this.initializeElements();
        this.attachEventListeners();
        this.checkForAutoLoad();
        this.updateUI();
    }
    
    initializeElements() {
        // Quick action buttons
        this.projectBtn = document.getElementById('loadProject');
        this.currentBtn = document.getElementById('loadCurrent');
        this.recentBtn = document.getElementById('loadRecent');
        
        // Recipe elements
        this.recipeSelect = document.getElementById('recipeSelect');
        this.saveRecipeBtn = document.getElementById('saveRecipe');
        
        // Drop zone
        this.dropZone = document.getElementById('dropZone');
        this.fileInput = document.getElementById('fileInput');
        
        // Context meter
        this.meterFill = document.getElementById('meterFill');
        this.tokenCount = document.getElementById('tokenCount');
        this.contextStatus = document.getElementById('contextStatus');
        
        // File list
        this.fileList = document.getElementById('fileList');
        
        // Action buttons
        this.clearBtn = document.getElementById('clearContext');
        this.startBtn = document.getElementById('startCoding');
        
        // Modal elements
        this.modal = document.getElementById('saveRecipeModal');
        this.recipeName = document.getElementById('recipeName');
        this.recipeDescription = document.getElementById('recipeDescription');
        this.cancelSave = document.getElementById('cancelSave');
        this.confirmSave = document.getElementById('confirmSave');
    }
    
    attachEventListeners() {
        // Quick action buttons
        this.projectBtn.addEventListener('click', () => this.loadPreset('project'));
        this.currentBtn.addEventListener('click', () => this.loadPreset('current'));
        this.recentBtn.addEventListener('click', () => this.loadPreset('recent'));
        
        // Recipe selection
        this.recipeSelect.addEventListener('change', (e) => {
            if (e.target.value) {
                this.loadRecipe(e.target.value);
            }
        });
        
        // Save recipe button
        this.saveRecipeBtn.addEventListener('click', () => this.showSaveRecipeModal());
        
        // Drop zone events
        this.dropZone.addEventListener('click', () => this.fileInput.click());
        this.dropZone.addEventListener('dragover', (e) => this.handleDragOver(e));
        this.dropZone.addEventListener('drop', (e) => this.handleDrop(e));
        this.dropZone.addEventListener('dragleave', () => this.dropZone.classList.remove('drag-over'));
        
        // File input
        this.fileInput.addEventListener('change', (e) => this.handleFileSelect(e));
        
        // Action buttons
        this.clearBtn.addEventListener('click', () => this.clearContext());
        this.startBtn.addEventListener('click', () => this.startCoding());
        
        // Modal events
        this.cancelSave.addEventListener('click', () => this.hideModal());
        this.confirmSave.addEventListener('click', () => this.saveCurrentRecipe());
    }
    
    async loadPreset(preset) {
        this.showMessage('Loading preset...', 'info');
        
        try {
            const response = await fetch('/api/context/load-preset', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ preset })
            });
            
            const data = await response.json();
            
            if (data.success) {
                // Add files to context
                for (const file of data.files) {
                    this.addFileToContext(file);
                }
                this.showMessage(`Loaded ${data.files.length} files`, 'success');
            } else {
                // Mock mode - simulate loading
                this.simulatePresetLoad(preset);
            }
        } catch (error) {
            // Fallback to simulation
            this.simulatePresetLoad(preset);
        }
    }
    
    simulatePresetLoad(preset) {
        // Clear existing context first
        this.clearContext();
        
        // Simulate loading files based on preset
        const mockFiles = {
            project: [
                { name: 'README.md', path: 'README.md', size: 2048, tokens: 512 },
                { name: 'package.json', path: 'package.json', size: 1024, tokens: 256 },
                { name: 'src/index.js', path: 'src/index.js', size: 4096, tokens: 1024 }
            ],
            current: [
                { name: 'src/components/Header.jsx', path: 'src/components/Header.jsx', size: 2048, tokens: 512 },
                { name: 'src/styles/main.css', path: 'src/styles/main.css', size: 1536, tokens: 384 }
            ],
            recent: [
                { name: 'src/api/auth.js', path: 'src/api/auth.js', size: 3072, tokens: 768 },
                { name: 'src/utils/helpers.js', path: 'src/utils/helpers.js', size: 1024, tokens: 256 }
            ]
        };
        
        const files = mockFiles[preset] || [];
        files.forEach(file => this.addFileToContext(file));
        
        this.showMessage(`Loaded ${preset} context (${files.length} files)`, 'success');
    }
    
    loadRecipe(recipeName) {
        const recipe = this.recipes[recipeName];
        if (!recipe) return;
        
        this.clearContext();
        
        // Load files from recipe
        recipe.files.forEach(file => this.addFileToContext(file));
        
        this.showMessage(`Loaded recipe: ${recipe.name}`, 'success');
    }
    
    handleDragOver(e) {
        e.preventDefault();
        this.dropZone.classList.add('drag-over');
    }
    
    handleDrop(e) {
        e.preventDefault();
        this.dropZone.classList.remove('drag-over');
        
        const files = Array.from(e.dataTransfer.files);
        this.processFiles(files);
    }
    
    handleFileSelect(e) {
        const files = Array.from(e.target.files);
        this.processFiles(files);
    }
    
    async processFiles(files) {
        for (const file of files) {
            // Skip non-text files
            if (!this.isTextFile(file)) {
                this.showMessage(`Skipped ${file.name} (not a text file)`, 'error');
                continue;
            }
            
            // Check token limit
            const estimatedTokens = Math.ceil(file.size / 4); // Rough estimation
            if (this.totalTokens + estimatedTokens > this.maxTokens) {
                this.showMessage('Token limit reached', 'error');
                break;
            }
            
            // Read file content
            const content = await this.readFile(file);
            const fileData = {
                name: file.name,
                path: file.name,
                size: file.size,
                tokens: estimatedTokens,
                content: content
            };
            
            this.addFileToContext(fileData);
        }
    }
    
    isTextFile(file) {
        const textExtensions = ['.js', '.jsx', '.ts', '.tsx', '.json', '.md', '.txt', '.css', '.html', '.py', '.java', '.cpp', '.c', '.h', '.yml', '.yaml', '.xml'];
        const extension = file.name.substring(file.name.lastIndexOf('.')).toLowerCase();
        return textExtensions.includes(extension) || file.type.startsWith('text/');
    }
    
    readFile(file) {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = (e) => resolve(e.target.result);
            reader.onerror = reject;
            reader.readAsText(file);
        });
    }
    
    addFileToContext(fileData) {
        // Check if file already loaded
        if (this.loadedFiles.has(fileData.path || fileData.name)) {
            return;
        }
        
        // Ensure file has all required properties
        const file = {
            name: fileData.name,
            path: fileData.path || fileData.name,
            size: fileData.size || (fileData.content ? fileData.content.length : 0),
            tokens: fileData.tokens || this.estimateTokens(fileData.content),
            content: fileData.content || '',
            isVirtual: fileData.isVirtual || false,
            autoLoaded: fileData.autoLoaded || false
        };
        
        // Add to loaded files
        this.loadedFiles.set(file.path, file);
        this.totalTokens += file.tokens;
        
        // Update UI
        this.updateUI();
    }
    
    removeFileFromContext(filePath) {
        const file = this.loadedFiles.get(filePath);
        if (file) {
            this.totalTokens -= file.tokens;
            this.loadedFiles.delete(filePath);
            this.updateUI();
        }
    }
    
    clearContext() {
        this.loadedFiles.clear();
        this.totalTokens = 0;
        this.updateUI();
        this.showMessage('Context cleared', 'info');
    }
    
    updateUI() {
        // Update meter
        const percentage = Math.min((this.totalTokens / this.maxTokens) * 100, 100);
        this.meterFill.style.width = `${percentage}%`;
        this.tokenCount.textContent = `${this.totalTokens} tokens`;
        
        // Update status
        if (this.totalTokens === 0) {
            this.contextStatus.textContent = 'Ready to start';
        } else if (percentage < 70) {
            this.contextStatus.textContent = 'Good to go!';
        } else if (percentage < 90) {
            this.contextStatus.textContent = 'Near limit';
        } else {
            this.contextStatus.textContent = 'Token limit reached';
        }
        
        // Update file list
        this.fileList.innerHTML = '';
        this.loadedFiles.forEach((file, path) => {
            const li = document.createElement('li');
            li.className = 'file-item';
            
            // Add special styling for auto-loaded PRD files
            if (file.autoLoaded) {
                li.classList.add('auto-loaded');
            }
            
            li.innerHTML = `
                <div class="file-info">
                    <span class="file-icon">${this.getFileIcon(file.name)}</span>
                    <span class="file-name">${file.name}${file.autoLoaded ? ' <small style="color: #ff8c00;">(from PRD)</small>' : ''}</span>
                    <span class="file-size">${this.formatSize(file.size)}</span>
                </div>
                <button class="remove-file" data-path="${path}">✕</button>
            `;
            
            li.querySelector('.remove-file').addEventListener('click', (e) => {
                this.removeFileFromContext(e.target.dataset.path);
            });
            
            this.fileList.appendChild(li);
        });
        
        // Enable/disable start button
        this.startBtn.disabled = this.totalTokens === 0;
    }
    
    getFileIcon(fileName) {
        const ext = fileName.substring(fileName.lastIndexOf('.')).toLowerCase();
        const iconMap = {
            '.js': '📄',
            '.jsx': '⚛️',
            '.ts': '📘',
            '.tsx': '⚛️',
            '.json': '📋',
            '.md': '📝',
            '.css': '🎨',
            '.html': '🌐',
            '.py': '🐍',
            '.java': '☕',
            '.cpp': '⚙️',
            '.c': '⚙️'
        };
        return iconMap[ext] || '📄';
    }
    
    formatSize(bytes) {
        const sizes = ['B', 'KB', 'MB', 'GB'];
        if (bytes === 0) return '0 B';
        const i = Math.floor(Math.log(bytes) / Math.log(1024));
        return Math.round(bytes / Math.pow(1024, i) * 100) / 100 + ' ' + sizes[i];
    }
    
    showSaveRecipeModal() {
        if (this.loadedFiles.size === 0) {
            this.showMessage('No files loaded to save as recipe', 'error');
            return;
        }
        
        this.modal.style.display = 'flex';
        this.recipeName.value = '';
        this.recipeDescription.value = '';
        this.recipeName.focus();
    }
    
    hideModal() {
        this.modal.style.display = 'none';
    }
    
    saveCurrentRecipe() {
        const name = this.recipeName.value.trim();
        if (!name) {
            this.showMessage('Please enter a recipe name', 'error');
            return;
        }
        
        const recipe = {
            name: name,
            description: this.recipeDescription.value.trim(),
            files: Array.from(this.loadedFiles.values()),
            created: new Date().toISOString()
        };
        
        // Save to localStorage (in production, would save to backend)
        const recipes = this.loadRecipes();
        const key = name.toLowerCase().replace(/\s+/g, '-');
        recipes[key] = recipe;
        localStorage.setItem('contextRecipes', JSON.stringify(recipes));
        
        // Add to select dropdown
        const option = document.createElement('option');
        option.value = key;
        option.textContent = `📦 ${name}`;
        this.recipeSelect.appendChild(option);
        
        this.hideModal();
        this.showMessage(`Recipe "${name}" saved successfully`, 'success');
    }
    
    loadRecipes() {
        const stored = localStorage.getItem('contextRecipes');
        return stored ? JSON.parse(stored) : {
            debug: {
                name: 'Debug Mode',
                files: [
                    { name: 'src/app.js', path: 'src/app.js', size: 4096, tokens: 1024 },
                    { name: 'logs/error.log', path: 'logs/error.log', size: 2048, tokens: 512 }
                ]
            },
            feature: {
                name: 'New Feature',
                files: [
                    { name: 'src/components/NewFeature.jsx', path: 'src/components/NewFeature.jsx', size: 2048, tokens: 512 },
                    { name: 'README.md', path: 'README.md', size: 1024, tokens: 256 }
                ]
            }
        };
    }
    
    async startCoding() {
        if (this.totalTokens === 0) {
            this.showMessage('Please load some context first', 'error');
            return;
        }
        
        this.showMessage('Preparing context for AI...', 'info');
        
        // Prepare context data
        const contextData = {
            files: Array.from(this.loadedFiles.values()),
            totalTokens: this.totalTokens,
            timestamp: new Date().toISOString()
        };
        
        // Store in sessionStorage for other pages to access
        sessionStorage.setItem('primeContext', JSON.stringify(contextData));
        
        // Navigate to appropriate page (could be terminal, IDE, or PRD generator)
        const destination = this.getDestinationPage();
        
        setTimeout(() => {
            window.location.href = destination;
        }, 1000);
    }
    
    getDestinationPage() {
        // Check where user came from or default to homepage
        const referrer = document.referrer;
        
        if (referrer.includes('smart-prd-generator')) {
            return '/smart-prd-generator.html?context=loaded';
        } else if (referrer.includes('ide')) {
            return '/ide-build/index.html?context=loaded';
        } else {
            return '/homepage.html?context=loaded';
        }
    }
    
    showMessage(text, type = 'info') {
        const container = document.getElementById('messageContainer');
        const message = document.createElement('div');
        message.className = `message ${type}`;
        message.textContent = text;
        
        container.appendChild(message);
        
        // Auto-remove after 3 seconds
        setTimeout(() => {
            message.remove();
        }, 3000);
    }
    
    checkForAutoLoad() {
        // Check if there's PRD data to auto-load from Smart PRD Generator
        const autoLoadData = localStorage.getItem('contextPrimingAutoLoad');
        const isReady = localStorage.getItem('contextPrimingReady');
        
        if (isReady === 'true' && autoLoadData) {
            try {
                const data = JSON.parse(autoLoadData);
                console.log('Auto-loading PRD into Context Priming:', data);
                
                // Add each file to the loaded files
                if (data.files && Array.isArray(data.files)) {
                    data.files.forEach(file => {
                        // Add file using the standard method
                        this.addFileToContext({
                            name: file.name,
                            path: file.name,
                            size: file.size,
                            content: file.content,
                            isVirtual: true,
                            autoLoaded: true
                        });
                    });
                    
                    // Clear the auto-load data after loading
                    localStorage.removeItem('contextPrimingAutoLoad');
                    localStorage.removeItem('contextPrimingReady');
                    
                    // Update UI
                    this.updateUI();
                    
                    // Show notification
                    this.showMessage('✅ PRD automatically loaded from Smart PRD Generator', 'success');
                }
            } catch (error) {
                console.error('Error auto-loading PRD:', error);
            }
        }
    }
    
    estimateTokens(content) {
        // Rough estimation: ~1 token per 4 characters (common for English text)
        // This is a simplified approach; actual tokenization varies by model
        if (!content) return 0;
        return Math.ceil(content.length / 4);
    }
}

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    new ContextPriming();
});