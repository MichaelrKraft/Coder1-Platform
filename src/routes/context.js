// Context Management Routes
const express = require('express');
const router = express.Router();
const contextManager = require('../services/context-manager');
const fs = require('fs').promises;
const path = require('path');

// Load preset context configurations
router.post('/load-preset', async (req, res) => {
    try {
        const { preset } = req.body;
        
        if (!preset) {
            return res.status(400).json({
                success: false,
                error: 'Preset name required'
            });
        }
        
        // Get files based on preset
        const files = await contextManager.getPresetFiles(preset);
        
        res.json({
            success: true,
            files: files,
            preset: preset
        });
        
    } catch (error) {
        console.error('Error loading preset:', error);
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
});

// Add custom files to context
router.post('/add-files', async (req, res) => {
    try {
        const { files } = req.body;
        
        if (!files || !Array.isArray(files)) {
            return res.status(400).json({
                success: false,
                error: 'Files array required'
            });
        }
        
        // Process and validate files
        const processedFiles = await contextManager.processFiles(files);
        
        res.json({
            success: true,
            files: processedFiles,
            totalTokens: processedFiles.reduce((sum, f) => sum + f.tokens, 0)
        });
        
    } catch (error) {
        console.error('Error adding files:', error);
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
});

// Get current context state
router.get('/current', async (req, res) => {
    try {
        const currentContext = await contextManager.getCurrentContext();
        
        res.json({
            success: true,
            context: currentContext
        });
        
    } catch (error) {
        console.error('Error getting context:', error);
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
});

// Save context recipe
router.post('/save-recipe', async (req, res) => {
    try {
        const { name, description, files } = req.body;
        
        if (!name || !files) {
            return res.status(400).json({
                success: false,
                error: 'Recipe name and files required'
            });
        }
        
        // Save recipe
        const recipe = await contextManager.saveRecipe({
            name,
            description,
            files,
            created: new Date().toISOString()
        });
        
        res.json({
            success: true,
            recipe: recipe
        });
        
    } catch (error) {
        console.error('Error saving recipe:', error);
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
});

// Get all saved recipes
router.get('/recipes', async (req, res) => {
    try {
        const recipes = await contextManager.getRecipes();
        
        res.json({
            success: true,
            recipes: recipes
        });
        
    } catch (error) {
        console.error('Error getting recipes:', error);
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
});

// Load a specific recipe
router.post('/load-recipe', async (req, res) => {
    try {
        const { recipeName } = req.body;
        
        if (!recipeName) {
            return res.status(400).json({
                success: false,
                error: 'Recipe name required'
            });
        }
        
        const recipe = await contextManager.loadRecipe(recipeName);
        
        if (!recipe) {
            return res.status(404).json({
                success: false,
                error: 'Recipe not found'
            });
        }
        
        res.json({
            success: true,
            recipe: recipe
        });
        
    } catch (error) {
        console.error('Error loading recipe:', error);
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
});

// Clear context
router.post('/clear', async (req, res) => {
    try {
        await contextManager.clearContext();
        
        res.json({
            success: true,
            message: 'Context cleared successfully'
        });
        
    } catch (error) {
        console.error('Error clearing context:', error);
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
});

// Get file content for preview
router.post('/preview-file', async (req, res) => {
    try {
        const { filePath } = req.body;
        
        if (!filePath) {
            return res.status(400).json({
                success: false,
                error: 'File path required'
            });
        }
        
        // Validate file path (prevent directory traversal)
        const safePath = path.normalize(filePath).replace(/^(\.\.(\/|\\|$))+/, '');
        const fullPath = path.join(process.cwd(), safePath);
        
        // Check if file exists and is within project
        if (!fullPath.startsWith(process.cwd())) {
            return res.status(403).json({
                success: false,
                error: 'Access denied'
            });
        }
        
        const content = await fs.readFile(fullPath, 'utf-8');
        const stats = await fs.stat(fullPath);
        
        res.json({
            success: true,
            file: {
                path: filePath,
                content: content,
                size: stats.size,
                modified: stats.mtime
            }
        });
        
    } catch (error) {
        console.error('Error previewing file:', error);
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
});

module.exports = router;