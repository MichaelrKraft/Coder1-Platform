// Simplified app.js for deployment
require('dotenv').config();

const express = require('express');
const cors = require('cors');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// Enable CORS
app.use(cors());

// Parse JSON bodies
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Define static directory path
const staticPath = path.join(__dirname, '../static');
console.log('Static directory path:', staticPath);

// Main page - PRD Generator (must come BEFORE static files)
app.get('/', (req, res) => {
    const filePath = path.join(staticPath, 'product-creation-hub.html');
    console.log('Serving main page from:', filePath);
    res.sendFile(filePath, (err) => {
        if (err) {
            console.error('Error serving main page:', err);
            res.status(404).send('File not found');
        }
    });
});

// Product Creation Hub route
app.get('/product-creation', (req, res) => {
    const filePath = path.join(staticPath, 'product-creation-hub.html');
    console.log('Serving product creation from:', filePath);
    res.sendFile(filePath, (err) => {
        if (err) {
            console.error('Error serving product creation page:', err);
            res.status(404).send('File not found');
        }
    });
});

// Coder1 Platform homepage route
app.get('/platform', (req, res) => {
    const filePath = path.join(staticPath, 'homepage.html');
    console.log('Serving Coder1 platform page from:', filePath);
    res.sendFile(filePath, (err) => {
        if (err) {
            console.error('Error serving platform page:', err);
            res.status(404).send('Platform page not found');
        }
    });
});

// Serve IDE static assets first (for CSS, JS files)
app.use('/ide/static', express.static(path.join(__dirname, '../ide-build/static')));

// Test route for debugging
app.get('/ide/test', (req, res) => {
    const filePath = path.join(__dirname, '../ide-build', 'test.html');
    console.log('Serving IDE test from:', filePath);
    res.sendFile(filePath, (err) => {
        if (err) {
            console.error('Error serving IDE test page:', err);
            res.status(404).send('IDE test not found');
        }
    });
});

// Coder1 IDE route - serve the built React app
app.get('/ide', (req, res) => {
    const filePath = path.join(__dirname, '../ide-build', 'index.html');
    console.log('Serving IDE from:', filePath);
    
    // Add cache-busting headers
    res.set({
        'Cache-Control': 'no-cache, no-store, must-revalidate',
        'Pragma': 'no-cache',
        'Expires': '0'
    });
    
    res.sendFile(filePath, (err) => {
        if (err) {
            console.error('Error serving IDE page:', err);
            res.status(404).send('IDE interface not found');
        }
    });
});

// Alternative IDE routes
app.get('/coder1-ide', (req, res) => {
    res.redirect('/ide');
});

// Serve static files from static directory (comes AFTER custom routes)
app.use(express.static(staticPath));

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({
    status: 'healthy',
    message: 'Coder1 Platform is running!',
    timestamp: new Date().toISOString()
  });
});

// Basic API endpoint for PRD generation
app.post('/api/generate-prd', (req, res) => {
  const { projectName, description } = req.body;
  
  // Simple response for now
  res.json({
    success: true,
    prd: {
      title: projectName,
      description: description,
      sections: [
        'Executive Summary',
        'Project Overview',
        'Technical Requirements',
        'User Experience',
        'Timeline & Milestones'
      ],
      generatedAt: new Date().toISOString()
    }
  });
});

// Error handling
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something went wrong!' });
});

// Export the app for server.js
module.exports = app;