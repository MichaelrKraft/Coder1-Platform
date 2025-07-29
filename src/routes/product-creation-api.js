// Product Creation API Routes
const express = require('express');
const router = express.Router();
const EnhancedPRDGenerator = require('../templates/enhanced-prd-generator');

// Health check
router.get('/health', (req, res) => {
    res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Generate PRD endpoint with enhanced format
router.post('/generate-prd', (req, res) => {
    const { answers, projectName, sessionId, problem, solution, mvpFeatures } = req.body;
    
    try {
        // Prepare project data for enhanced PRD generation
        const projectData = {
            id: sessionId || `prd-${Date.now()}`,
            problem: problem || answers?.[0]?.answer || 'Problem to be defined',
            solution: solution || answers?.[1]?.answer || 'Solution to be defined',
            originalRequest: projectName || 'New Project',
            questions: answers?.map(a => a.question) || [],
            answers: answers || [],
            mvpFeatures: mvpFeatures || 'default',
            consultation: null,
            analysis: {
                keyBenefit: 'increased efficiency and productivity',
                outcome: 'measurable improvement in key metrics',
                targetAudience: 'business professionals and teams',
                coreFeatures: [
                    {
                        action: 'manage their workflow',
                        benefit: 'I can increase productivity',
                        criteria: ['Dashboard shows current tasks', 'Can create and edit tasks', 'Can mark tasks complete']
                    },
                    {
                        action: 'collaborate with team members',
                        benefit: 'we can work together effectively',
                        criteria: ['Can share items', 'Can leave comments', 'Can see team activity']
                    }
                ]
            }
        };
        
        // Generate the comprehensive PRD
        const prdContent = EnhancedPRDGenerator.generatePRD(projectData);
        
        // Convert markdown to structured response
        const mockPRD = {
            success: true,
            prd: {
                projectName: projectName || 'New Project',
                content: prdContent,
                format: 'markdown',
                sections: {
                    elevatorPitch: 'Included',
                    problemStatement: 'Included',
                    targetAudience: 'Included',
                    usp: 'Included',
                    platforms: 'Included',
                    features: 'User story format',
                    uxui: 'Comprehensive state management',
                    nonFunctional: 'Performance, Security, Scalability, Accessibility',
                    monetization: 'Multiple revenue models',
                    questions: 'Critical clarifications',
                    nextSteps: 'Detailed timeline'
                },
                metadata: {
                    generatedAt: new Date().toISOString(),
                    version: '2.0',
                    format: 'Mike\'s 8-Step Method'
                }
            },
            sessionId: sessionId || 'mock-session'
        };
        
        res.json(mockPRD);
    } catch (error) {
        console.error('Error generating PRD:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to generate PRD',
            message: error.message
        });
    }
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