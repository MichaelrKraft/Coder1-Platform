// Simplified app.js for deployment
require('dotenv').config();

const express = require('express');
const cors = require('cors');
const path = require('path');
const EventEmitter = require('events');

// Global terminal emitter for real-time output
global.terminalEmitter = new EventEmitter();

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
    const filePath = path.join(__dirname, '../smart-prd-generator.html');
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

// Serve main static assets (for logo, CSS, JS files)
app.use('/static', express.static(path.join(__dirname, '../static')));

// Serve IDE static assets (for CSS, JS files)
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
  const { projectId, originalRequest, questions, answers, sessionId } = req.body;
  
  // Generate a comprehensive PRD based on the questions and answers
  const prdContent = generatePRDContent(originalRequest, questions, answers);
  
  res.json({
    success: true,
    prdDocument: {
      id: `prd-${projectId}`,
      title: `Product Requirements Document - ${originalRequest.substring(0, 50)}`,
      content: prdContent,
      metadata: {
        confidence: 85,
        completeness: 100,
        generatedAt: new Date().toISOString(),
        sessionId: sessionId
      },
      sections: [
        'Executive Summary',
        'Project Overview',
        'Target Audience',
        'Core Features',
        'Technical Requirements',
        'Design Requirements',
        'Timeline & Budget',
        'Success Metrics'
      ]
    }
  });
});

// Helper function to generate PRD content
function generatePRDContent(originalRequest, questions, answers) {
  let content = `# Product Requirements Document\n\n`;
  content += `## Executive Summary\n${originalRequest}\n\n`;
  
  content += `## Requirements Analysis\n\n`;
  
  // Map questions and answers to PRD sections
  if (questions && answers) {
    questions.forEach((q, index) => {
      if (answers[index]) {
        content += `### ${q.question}\n`;
        content += `${answers[index].answer}\n\n`;
      }
    });
  }
  
  content += `## Next Steps\n`;
  content += `1. Review and refine requirements\n`;
  content += `2. Create detailed technical specifications\n`;
  content += `3. Design wireframes and mockups\n`;
  content += `4. Begin development planning\n`;
  
  return content;
}

// API endpoint for available personas
app.get('/api/personas/available', (req, res) => {
  res.json({
    success: true,
    personas: [
      {
        id: 'ux-designer',
        name: 'UX Designer',
        color: '#8B5CF6',
        iconClass: 'fas fa-paint-brush',
        expertise: ['User Experience', 'Visual Design', 'Prototyping', 'User Research']
      },
      {
        id: 'backend-engineer',
        name: 'Backend Engineer',
        color: '#3B82F6',
        iconClass: 'fas fa-server',
        expertise: ['API Design', 'Database Architecture', 'Scalability', 'Security']
      },
      {
        id: 'frontend-developer',
        name: 'Frontend Developer',
        color: '#10B981',
        iconClass: 'fas fa-code',
        expertise: ['React/Vue/Angular', 'Responsive Design', 'Performance', 'Accessibility']
      },
      {
        id: 'product-manager',
        name: 'Product Manager',
        color: '#F59E0B',
        iconClass: 'fas fa-chart-line',
        expertise: ['Market Analysis', 'User Stories', 'Roadmapping', 'Metrics']
      },
      {
        id: 'security-expert',
        name: 'Security Expert',
        color: '#EF4444',
        iconClass: 'fas fa-shield-alt',
        expertise: ['Threat Modeling', 'Compliance', 'Encryption', 'Best Practices']
      },
      {
        id: 'devops-engineer',
        name: 'DevOps Engineer',
        color: '#6366F1',
        iconClass: 'fas fa-cogs',
        expertise: ['CI/CD', 'Infrastructure', 'Monitoring', 'Deployment']
      }
    ]
  });
});

// API endpoint for persona consultation
app.post('/api/consultation/analyze', (req, res) => {
  const { projectId, personas, prdDocument } = req.body;
  
  // Simulate consultation analysis with proper structure
  const consultationResults = {
    success: true,
    consultation: {
      summary: {
        totalPersonas: personas ? personas.length : 6,
        criticalFindings: 3,
        estimatedSuccessProbability: 78,
        consensusLevel: 85
      },
      analysis: {
        consensusLevel: 85,
        successProbability: 78,
        criticalFindings: 3,
        agreements: [
          'Focus on user-centric design approach',
          'Implement robust security measures from the start',
          'Use agile development methodology',
          'Prioritize mobile-first responsive design'
        ],
        conflicts: [
          'Timeline expectations vs. feature complexity',
          'Performance requirements vs. budget constraints',
          'Scalability needs vs. initial MVP scope'
        ],
        recommendations: {
          immediate: [
            'Define MVP scope clearly',
            'Set up development environment',
            'Create user personas and journey maps'
          ],
          shortTerm: [
            'Develop proof of concept',
            'Conduct user testing',
            'Establish monitoring systems'
          ],
          longTerm: [
            'Plan for scalability',
            'Consider international expansion',
            'Build team expertise'
          ]
        }
      },
      personaInsights: {
        'ux-designer': {
          score: 85,
          concerns: ['User flow complexity', 'Mobile experience'],
          suggestions: ['Simplify navigation', 'Add user onboarding']
        },
        'backend-engineer': {
          score: 75,
          concerns: ['Database scaling', 'API performance'],
          suggestions: ['Use caching strategy', 'Implement rate limiting']
        },
        'security-expert': {
          score: 90,
          concerns: ['Data encryption', 'Authentication flow'],
          suggestions: ['Use JWT tokens', 'Implement 2FA']
        }
      },
      risks: {
        security: [
          { risk: 'Data breach vulnerability', severity: 'high', mitigation: 'Implement encryption at rest' },
          { risk: 'API exposure', severity: 'medium', mitigation: 'Use API keys and rate limiting' }
        ],
        technical: [
          { risk: 'Scaling issues', severity: 'medium', mitigation: 'Design for horizontal scaling' },
          { risk: 'Technical debt', severity: 'low', mitigation: 'Regular refactoring cycles' }
        ],
        business: [
          { risk: 'Market competition', severity: 'high', mitigation: 'Focus on unique value proposition' },
          { risk: 'User adoption', severity: 'medium', mitigation: 'Implement referral program' }
        ],
        operational: [
          { risk: 'Support scaling', severity: 'low', mitigation: 'Build self-service documentation' }
        ]
      }
    }
  };
  
  res.json(consultationResults);
});

// API endpoint for wireframe generation
app.post('/api/wireframes/generate', (req, res) => {
  const { projectId, prdDocument } = req.body;
  
  // Simulate wireframe generation
  res.json({
    success: true,
    wireframes: {
      wireframes: [
        {
          name: 'Homepage',
          htmlFile: '/wireframes/homepage.html',
          htmlContent: '<div style="padding: 20px; background: #1a1a1a; border: 2px solid #333; border-radius: 8px; color: #fff;"><h2 style="color: #8b5cf6; margin: 0 0 15px 0;">Homepage Wireframe</h2><div style="display: flex; flex-direction: column; gap: 10px;"><div style="background: #2a2a2a; padding: 10px; border-radius: 4px; text-align: center;">Navigation Bar</div><div style="background: #2a2a2a; padding: 30px; border-radius: 4px; text-align: center;">Hero Section</div><div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 10px;"><div style="background: #2a2a2a; padding: 20px; border-radius: 4px; text-align: center;">Feature 1</div><div style="background: #2a2a2a; padding: 20px; border-radius: 4px; text-align: center;">Feature 2</div><div style="background: #2a2a2a; padding: 20px; border-radius: 4px; text-align: center;">Feature 3</div></div><div style="background: #2a2a2a; padding: 15px; border-radius: 4px; text-align: center;">Footer</div></div></div>'
        },
        {
          name: 'Dashboard',
          htmlFile: '/wireframes/dashboard.html',
          htmlContent: '<div style="padding: 20px; background: #1a1a1a; border: 2px solid #333; border-radius: 8px; color: #fff;"><h2 style="color: #8b5cf6; margin: 0 0 15px 0;">Dashboard Wireframe</h2><div style="display: grid; grid-template-columns: 200px 1fr; gap: 15px; height: 300px;"><div style="background: #2a2a2a; padding: 15px; border-radius: 4px;"><h4 style="margin: 0 0 10px 0; color: #8b5cf6;">Sidebar</h4><div style="display: flex; flex-direction: column; gap: 5px;"><div style="background: #3a3a3a; padding: 8px; border-radius: 4px;">Menu Item 1</div><div style="background: #3a3a3a; padding: 8px; border-radius: 4px;">Menu Item 2</div><div style="background: #3a3a3a; padding: 8px; border-radius: 4px;">Menu Item 3</div></div></div><div style="display: flex; flex-direction: column; gap: 10px;"><div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 10px;"><div style="background: #2a2a2a; padding: 20px; border-radius: 4px; text-align: center;">Stat Card 1</div><div style="background: #2a2a2a; padding: 20px; border-radius: 4px; text-align: center;">Stat Card 2</div><div style="background: #2a2a2a; padding: 20px; border-radius: 4px; text-align: center;">Stat Card 3</div></div><div style="background: #2a2a2a; padding: 20px; border-radius: 4px; flex: 1;">Main Content Area</div></div></div></div>'
        },
        {
          name: 'User Profile',
          htmlFile: '/wireframes/profile.html',
          htmlContent: '<div style="padding: 20px; background: #1a1a1a; border: 2px solid #333; border-radius: 8px; color: #fff;"><h2 style="color: #8b5cf6; margin: 0 0 15px 0;">User Profile Wireframe</h2><div style="display: flex; gap: 20px;"><div style="background: #2a2a2a; width: 100px; height: 100px; border-radius: 50%; display: flex; align-items: center; justify-content: center;">Avatar</div><div style="flex: 1;"><div style="background: #2a2a2a; padding: 15px; border-radius: 4px; margin-bottom: 10px;"><h4 style="margin: 0; color: #8b5cf6;">User Information</h4><p style="margin: 5px 0;">Name, Email, Role</p></div><div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 10px;"><div style="background: #2a2a2a; padding: 15px; border-radius: 4px; text-align: center;">Settings</div><div style="background: #2a2a2a; padding: 15px; border-radius: 4px; text-align: center;">Activity Log</div></div></div></div></div>'
        }
      ],
      metadata: {
        generatedAt: new Date().toISOString(),
        totalPages: 3
      }
    }
  });
});

// API endpoint for version management
app.get('/api/versions/:projectId', (req, res) => {
  const { projectId } = req.params;
  
  res.json({
    success: true,
    versions: [
      {
        id: 'v1.0',
        name: 'Initial Version',
        createdAt: new Date().toISOString(),
        description: 'First complete PRD with all requirements'
      }
    ]
  });
});

// API endpoint for project export
app.post('/api/project/export', (req, res) => {
  const { projectId, format } = req.body;
  
  res.json({
    success: true,
    exportData: {
      format: format || 'json',
      downloadUrl: `/downloads/project-${projectId}.${format || 'json'}`,
      expiresAt: new Date(Date.now() + 3600000).toISOString()
    }
  });
});

// API endpoint for market insights
app.get('/api/market-insights/:projectId', (req, res) => {
  const { projectId } = req.params;
  
  res.json({
    success: true,
    insights: {
      viability: {
        score: 85,
        factors: [
          'High market demand',
          'Growing user base',
          'Clear value proposition'
        ]
      },
      competition: {
        level: 'Moderate',
        mainCompetitors: 3,
        analysis: 'Several established players but room for differentiation'
      },
      marketSize: {
        size: '$2.5B',
        growth: '15% YoY',
        targetMarket: 'SMB and Enterprise'
      }
    }
  });
});

// API endpoint for project intelligence
app.get('/api/intelligence/:projectId', (req, res) => {
  const { projectId } = req.params;
  
  res.json({
    success: true,
    intelligence: {
      recommendations: [
        {
          category: 'Core Features',
          suggestions: [
            'Implement user authentication with OAuth 2.0',
            'Add real-time collaboration features',
            'Include mobile-responsive design'
          ]
        },
        {
          category: 'Performance',
          suggestions: [
            'Use CDN for static assets',
            'Implement lazy loading for images',
            'Add caching strategy'
          ]
        },
        {
          category: 'Security',
          suggestions: [
            'Enable HTTPS everywhere',
            'Implement rate limiting',
            'Add input validation'
          ]
        }
      ],
      marketInsights: {
        trending: {
          features: [
            { feature: 'AI Integration', adoption: 78 },
            { feature: 'Real-time Updates', adoption: 65 },
            { feature: 'Dark Mode', adoption: 82 },
            { feature: 'Mobile App', adoption: 71 }
          ]
        }
      }
    }
  });
});

// API endpoint for iteration plans
app.get('/api/iterations/:projectId', (req, res) => {
  const { projectId } = req.params;
  
  res.json({
    success: true,
    plans: [
      {
        id: 'iter-1',
        name: 'Sprint 1 - Foundation',
        description: 'Set up basic project structure and core components',
        status: 'completed',
        startDate: '2024-01-01',
        endDate: '2024-01-14',
        goals: [
          'Project setup and configuration',
          'Basic authentication system',
          'Core UI components'
        ]
      },
      {
        id: 'iter-2',
        name: 'Sprint 2 - Core Features',
        description: 'Implement main functionality and user workflows',
        status: 'in-progress',
        startDate: '2024-01-15',
        endDate: '2024-01-28',
        goals: [
          'User dashboard implementation',
          'Main feature development',
          'Basic testing setup'
        ]
      },
      {
        id: 'iter-3',
        name: 'Sprint 3 - Enhancement',
        description: 'Polish UI, add advanced features, and optimize performance',
        status: 'planned',
        startDate: '2024-01-29',
        endDate: '2024-02-11',
        goals: [
          'UI/UX improvements',
          'Performance optimization',
          'Advanced features'
        ]
      }
    ]
  });
});

// Import and use infinite loop routes (using simple version to avoid dependency issues)
try {
  // Try simple version first (no external dependencies)
  const infiniteLoopRoutes = require('./routes/infinite-loop-simple');
  app.use('/api/infinite', infiniteLoopRoutes);
  console.log('✅ Infinite loop routes loaded successfully (simple mode)');
} catch (error) {
  console.error('❌ Failed to load infinite loop routes:');
  console.error('  Error:', error.message);
  console.error('  Stack:', error.stack);
  
  // Try loading the original version as fallback
  try {
    const infiniteLoopRoutes = require('./routes/infinite-loop');
    app.use('/api/infinite', infiniteLoopRoutes);
    console.log('✅ Infinite loop routes loaded (original version)');
  } catch (fallbackError) {
    console.error('❌ Fallback also failed:', fallbackError.message);
  }
}

// Import and use hivemind routes
try {
  const hivemindRoutes = require('./routes/hivemind');
  app.use('/api/hivemind', hivemindRoutes);
  console.log('✅ Hivemind routes loaded successfully');
} catch (error) {
  console.error('❌ Failed to load hivemind routes:');
  console.error('  Error:', error.message);
  console.error('  Stack:', error.stack);
}

// Import and use parallel agents routes
try {
  const parallelAgentsRoutes = require('./routes/parallel-agents');
  app.use('/api/parallel-agents', parallelAgentsRoutes);
  console.log('✅ Parallel agents routes loaded successfully');
} catch (error) {
  console.error('❌ Failed to load parallel agents routes:');
  console.error('  Error:', error.message);
  console.error('  Stack:', error.stack);
}

// Import and use voice routes
try {
  const voiceRoutes = require('./routes/voice');
  app.use('/api/voice', voiceRoutes);
  console.log('✅ Voice routes loaded successfully');
} catch (error) {
  console.error('❌ Failed to load voice routes:', error.message);
}

// Import and use other API routes if available
try {
  const productCreationRoutes = require('./routes/product-creation-api');
  app.use('/api', productCreationRoutes);
  console.log('✅ Product creation routes loaded successfully');
} catch (error) {
  console.warn('⚠️ Failed to load product creation routes:', error.message);
}

// Error handling
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something went wrong!' });
});

// Export the app for server.js
module.exports = app;