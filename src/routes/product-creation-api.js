// Product Creation API Routes
const express = require('express');
const router = express.Router();

// Health check
router.get('/health', (req, res) => {
    res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Generate PRD endpoint
router.post('/generate-prd', (req, res) => {
    const { answers, projectName, sessionId } = req.body;
    
    // Mock PRD generation
    const mockPRD = {
        success: true,
        prd: {
            projectName: projectName || 'New Project',
            overview: 'AI-generated product requirements document',
            features: ['Feature 1', 'Feature 2', 'Feature 3'],
            timeline: '4-6 weeks',
            budget: '$10,000 - $50,000'
        },
        sessionId: sessionId || 'mock-session'
    };
    
    res.json(mockPRD);
});

// Other mock endpoints
router.get('/personas/available', (req, res) => {
    res.json({
        success: true,
        personas: [
            { id: 'tech', name: 'Technical Lead', expertise: 'Architecture & Development' },
            { id: 'design', name: 'UX Designer', expertise: 'User Experience & Design' },
            { id: 'business', name: 'Business Analyst', expertise: 'Market & Strategy' }
        ]
    });
});

module.exports = router;