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

// Serve static files from static directory
app.use(express.static(path.join(__dirname, '../static')));

// Main page - Product Creation Hub
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '../static', 'product-creation-hub.html'));
});

// Product Creation Hub route
app.get('/product-creation', (req, res) => {
    res.sendFile(path.join(__dirname, '../static', 'product-creation-hub.html'));
});

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

// Export the app
module.exports = app;

// Start server if not in production
if (process.env.NODE_ENV !== 'production') {
  app.listen(PORT, () => {
    console.log(`🚀 Coder1 Platform is running on port ${PORT}`);
    console.log(`📱 Frontend: http://localhost:${PORT}`);
    console.log(`🏥 Health check: http://localhost:${PORT}/health`);
  });
}