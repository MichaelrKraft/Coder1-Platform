// Simplified app.js for deployment
require('dotenv').config();

const express = require('express');
const cors = require('cors');
const path = require('path');
const EventEmitter = require('events');

// Global terminal emitter for real-time output
global.terminalEmitter = new EventEmitter();

const app = express();
const PORT = process.env.PORT || 8080;

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

// Context Priming route
app.get('/context-priming', (req, res) => {
    const filePath = path.join(__dirname, '../context-priming.html');
    console.log('Serving context priming page from:', filePath);
    res.sendFile(filePath, (err) => {
        if (err) {
            console.error('Error serving context priming page:', err);
            res.status(404).send('Context priming page not found');
        }
    });
});

// Website Customization Studio routes
app.get('/website-studio', (req, res) => {
    const filePath = path.join(__dirname, '../website-studio-landing.html');
    console.log('Serving website studio landing page from:', filePath);
    res.sendFile(filePath, (err) => {
        if (err) {
            console.error('Error serving website studio landing page:', err);
            res.status(404).send('Website Studio landing page not found');
        }
    });
});

app.get('/website-studio-app', (req, res) => {
    const filePath = path.join(__dirname, '../website-studio-app.html');
    console.log('Serving website studio app from:', filePath);
    res.sendFile(filePath, (err) => {
        if (err) {
            console.error('Error serving website studio app:', err);
            res.status(404).send('Website Studio app not found');
        }
    });
});

// Serve main static assets (for logo, CSS, JS files)
app.use('/static', express.static(path.join(__dirname, '../static')));

// Serve IDE static assets (for CSS, JS files) with cache control
app.use('/ide/static', express.static(path.join(__dirname, '../ide-build/static'), {
    setHeaders: (res, path) => {
        // Set cache control headers for CSS and JS files
        if (path.endsWith('.css') || path.endsWith('.js')) {
            res.set({
                'Cache-Control': 'no-cache, no-store, must-revalidate',
                'Pragma': 'no-cache',
                'Expires': '0'
            });
        }
    }
}));

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

// Import Claude API at the top
const { ClaudeCodeAPI } = require('./integrations/claude-code-api');
const claudeAPI = new ClaudeCodeAPI(process.env.ANTHROPIC_API_KEY || process.env.CLAUDE_CODE_API_KEY);

// Import Enhanced PRD Generator
const EnhancedPRDGenerator = require('./templates/enhanced-prd-generator');

// Enhanced API endpoint for PRD generation using Claude
app.post('/api/generate-prd', async (req, res) => {
  try {
    const { projectId, originalRequest, questions, answers, sessionId, analysis } = req.body;
    
    console.log('🚀 Generating PRD with Claude for project:', projectId);
    
    // Extract problem and solution from request if available
    const projectData = {
      id: projectId,
      originalRequest,
      problem: req.body.problem || null,
      solution: req.body.solution || null,
      questions,
      answers,
      mvpFeatures: req.body.mvpFeatures || 'default',
      sessionId,
      analysis: analysis || {}
    };
    
    // Generate enhanced brief using Claude
    const brief = await claudeAPI.generateEnhancedBrief(
      originalRequest,
      questions,
      answers,
      analysis || {}
    );
    
    // Merge brief data into project data
    projectData.analysis = { ...projectData.analysis, ...brief };
    
    // Generate structured PRD content using enhanced generator
    const prdContent = EnhancedPRDGenerator.generatePRD(projectData);
    
    res.json({
      success: true,
      prdDocument: {
        id: `prd-${projectId}`,
        title: `Product Requirements Document - ${originalRequest.substring(0, 50)}`,
        content: prdContent,
        metadata: {
          confidence: brief.confidence === 'high' ? 95 : 85,
          completeness: 100,
          generatedAt: new Date().toISOString(),
          sessionId: sessionId,
          aiGenerated: true
        },
        sections: [
          'Elevator Pitch',
          'Problem Statement',
          'Target Audience',
          'USP',
          'Target Platforms',
          'Features List',
          'UX/UI Considerations',
          'Non-Functional Requirements',
          'Monetization',
          'Critical Questions',
          'Next Steps'
        ]
      }
    });
  } catch (error) {
    console.error('❌ PRD generation error:', error);
    
    // Fallback to enhanced generation without Claude
    const projectData = {
      id: projectId,
      originalRequest,
      problem: req.body.problem || null,
      solution: req.body.solution || null,
      questions,
      answers,
      mvpFeatures: req.body.mvpFeatures || 'default',
      sessionId,
      analysis: {}
    };
    
    const prdContent = EnhancedPRDGenerator.generatePRD(projectData);
    
    res.json({
      success: true,
      prdDocument: {
        id: `prd-${projectId}`,
        title: `Product Requirements Document - ${originalRequest.substring(0, 50)}`,
        content: prdContent,
        metadata: {
          confidence: 75,
          completeness: 100,
          generatedAt: new Date().toISOString(),
          sessionId: sessionId,
          aiGenerated: false
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
  }
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

// Enhanced PRD content generation with AI insights
async function generateEnhancedPRDContent(originalRequest, questions, answers, brief) {
  let content = `# Product Requirements Document\n\n`;
  
  // Executive Summary from AI brief
  content += `## Executive Summary\n`;
  content += `${brief.enhancedPrompt ? brief.enhancedPrompt.split('\n')[0] : originalRequest}\n\n`;
  
  // Project Overview
  content += `## Project Overview\n`;
  content += `**Original Request:** ${originalRequest}\n\n`;
  content += `**Project Type:** ${brief.analysis?.projectType || 'Website'}\n`;
  content += `**Complexity:** ${brief.analysis?.complexity || 'Moderate'}\n`;
  content += `**Confidence Level:** ${brief.confidence || 'Medium'}\n\n`;
  
  // Target Audience
  content += `## Target Audience\n`;
  content += `${brief.analysis?.targetAudience || 'General users'}\n\n`;
  
  // Core Features
  content += `## Core Features\n`;
  if (brief.analysis?.keyFeatures && brief.analysis.keyFeatures.length > 0) {
    brief.analysis.keyFeatures.forEach(feature => {
      content += `- ${feature}\n`;
    });
  } else {
    content += `- To be determined based on requirements\n`;
  }
  content += `\n`;
  
  // Requirements from Q&A
  content += `## Detailed Requirements\n\n`;
  if (questions && answers) {
    questions.forEach((q, index) => {
      if (answers[index]) {
        content += `### ${q.question || q}\n`;
        content += `${answers[index].answer || answers[index]}\n\n`;
      }
    });
  }
  
  // Technical Requirements
  content += `## Technical Requirements\n`;
  if (brief.analysis?.technicalRequirements && brief.analysis.technicalRequirements.length > 0) {
    brief.analysis.technicalRequirements.forEach(req => {
      content += `- ${req}\n`;
    });
  } else {
    content += `- Modern web technologies\n`;
    content += `- Responsive design\n`;
    content += `- Cross-browser compatibility\n`;
  }
  content += `\n`;
  
  // AI-Generated Recommendations
  if (brief.enhancedPrompt) {
    content += `## AI Recommendations\n`;
    content += `${brief.enhancedPrompt}\n\n`;
  }
  
  // Success Metrics
  content += `## Success Metrics\n`;
  content += `- User satisfaction and engagement\n`;
  content += `- Performance benchmarks met\n`;
  content += `- All features functioning as specified\n`;
  content += `- Positive user feedback\n\n`;
  
  // Next Steps
  content += `## Next Steps\n`;
  content += `1. Review and approve this PRD\n`;
  content += `2. Create detailed technical architecture\n`;
  content += `3. Design UI/UX mockups and wireframes\n`;
  content += `4. Set up development environment\n`;
  content += `5. Begin iterative development\n`;
  
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

// Helper function to parse AI consultation analysis
function parseConsultationAnalysis(aiResponse, personas) {
  try {
    // Extract structured data from AI response
    const consensusMatch = aiResponse.match(/consensus.*?(\d+)/i);
    const successMatch = aiResponse.match(/success.*?probability.*?(\d+)/i);
    const criticalMatch = aiResponse.match(/critical.*?findings?.*?(\d+)/i);
    
    const consensusLevel = consensusMatch ? parseInt(consensusMatch[1]) : 75;
    const successProbability = successMatch ? parseInt(successMatch[1]) : 80;
    const criticalFindings = criticalMatch ? parseInt(criticalMatch[1]) : 2;
    
    // Extract agreements and conflicts
    const agreements = [];
    const conflicts = [];
    const recommendations = {
      immediate: [],
      shortTerm: [],
      longTerm: []
    };
    
    // Parse agreements section
    const agreementSection = aiResponse.match(/agreements?:?\s*\n([\s\S]*?)(?:\n\n|conflicts?:|$)/i);
    if (agreementSection) {
      const items = agreementSection[1].match(/[-•]\s*(.+)/g) || [];
      items.forEach(item => agreements.push(item.replace(/[-•]\s*/, '').trim()));
    }
    
    // Parse conflicts section
    const conflictSection = aiResponse.match(/conflicts?:?\s*\n([\s\S]*?)(?:\n\n|recommendations?:|$)/i);
    if (conflictSection) {
      const items = conflictSection[1].match(/[-•]\s*(.+)/g) || [];
      items.forEach(item => conflicts.push(item.replace(/[-•]\s*/, '').trim()));
    }
    
    // Parse recommendations
    const recoSection = aiResponse.match(/recommendations?:?\s*\n([\s\S]*?)$/i);
    if (recoSection) {
      const immediateMatch = recoSection[1].match(/immediate:?\s*\n([\s\S]*?)(?:\n\n|short.?term:|$)/i);
      const shortTermMatch = recoSection[1].match(/short.?term:?\s*\n([\s\S]*?)(?:\n\n|long.?term:|$)/i);
      const longTermMatch = recoSection[1].match(/long.?term:?\s*\n([\s\S]*?)$/i);
      
      if (immediateMatch) {
        const items = immediateMatch[1].match(/[-•]\s*(.+)/g) || [];
        items.forEach(item => recommendations.immediate.push(item.replace(/[-•]\s*/, '').trim()));
      }
      if (shortTermMatch) {
        const items = shortTermMatch[1].match(/[-•]\s*(.+)/g) || [];
        items.forEach(item => recommendations.shortTerm.push(item.replace(/[-•]\s*/, '').trim()));
      }
      if (longTermMatch) {
        const items = longTermMatch[1].match(/[-•]\s*(.+)/g) || [];
        items.forEach(item => recommendations.longTerm.push(item.replace(/[-•]\s*/, '').trim()));
      }
    }
    
    // Generate persona insights
    const personaInsights = {};
    personas.forEach(persona => {
      const personaSection = aiResponse.match(new RegExp(`${persona.name}[:\\s]+([\\s\\S]*?)(?:\\n\\n|$)`, 'i'));
      const score = 75 + Math.floor(Math.random() * 20);
      
      personaInsights[persona.id] = {
        score,
        concerns: personaSection ? ['Identified in analysis'] : ['General concerns about implementation'],
        suggestions: personaSection ? ['Based on expert perspective'] : ['Standard recommendations']
      };
    });
    
    return {
      success: true,
      consultation: {
        summary: {
          totalPersonas: personas.length,
          criticalFindings,
          estimatedSuccessProbability: successProbability,
          consensusLevel
        },
        analysis: {
          consensusLevel,
          successProbability,
          criticalFindings,
          agreements: agreements.length > 0 ? agreements : [
            'Focus on user-centric design approach',
            'Implement robust security measures from the start',
            'Use agile development methodology'
          ],
          conflicts: conflicts.length > 0 ? conflicts : [
            'Timeline expectations vs. feature complexity',
            'Performance requirements vs. budget constraints'
          ],
          recommendations
        },
        personaInsights,
        risks: {
          security: [
            { risk: 'Data breach vulnerability', severity: 'high', mitigation: 'Implement encryption at rest' }
          ],
          technical: [
            { risk: 'Scaling issues', severity: 'medium', mitigation: 'Design for horizontal scaling' }
          ],
          business: [
            { risk: 'Market competition', severity: 'high', mitigation: 'Focus on unique value proposition' }
          ],
          operational: [
            { risk: 'Support scaling', severity: 'low', mitigation: 'Build self-service documentation' }
          ]
        }
      },
      aiGenerated: true
    };
  } catch (error) {
    console.error('Error parsing consultation analysis:', error);
    // Return a basic structure on parse error
    return {
      success: true,
      consultation: {
        summary: {
          totalPersonas: personas.length,
          criticalFindings: 2,
          estimatedSuccessProbability: 75,
          consensusLevel: 80
        },
        analysis: {
          consensusLevel: 80,
          successProbability: 75,
          criticalFindings: 2,
          agreements: ['AI analysis completed but parsing failed'],
          conflicts: ['Unable to parse specific conflicts'],
          recommendations: {
            immediate: ['Review AI response manually'],
            shortTerm: ['Refine parsing logic'],
            longTerm: ['Improve AI prompt structure']
          }
        },
        personaInsights: {},
        risks: {
          security: [],
          technical: [],
          business: [],
          operational: []
        }
      },
      aiGenerated: true
    };
  }
}

// API endpoint for persona consultation with real AI analysis
app.post('/api/consultation/analyze', async (req, res) => {
  try {
    const { projectId, personas, prdDocument } = req.body;
    
    console.log('🤝 Running AI consultation for project:', projectId);
    
    // Generate AI consultation if we have Claude API
    if (claudeAPI) {
      const consultationPrompt = `Analyze this PRD from multiple expert perspectives and provide consultation insights:

PRD Content:
${prdDocument?.content || 'No PRD content provided'}

Expert Personas to simulate:
${personas?.map(p => `- ${p.name}: ${p.expertise?.join(', ')}`).join('\n')}

Provide a comprehensive consultation analysis including:
1. Consensus level among experts (0-100)
2. Success probability assessment
3. Critical findings and risks
4. Areas of agreement and conflict
5. Specific recommendations from each persona perspective

Format the response as a structured analysis that addresses technical, business, and user experience aspects.`;

      try {
        const aiAnalysis = await claudeAPI.sendMessage(consultationPrompt, {
          model: 'claude-3-sonnet-20240229',
          maxTokens: 2000,
          temperature: 0.7
        });
        
        // Parse and structure the AI response
        const consultationResults = parseConsultationAnalysis(aiAnalysis, personas);
        
        return res.json({
          success: true,
          consultation: consultationResults,
          aiGenerated: true
        });
      } catch (aiError) {
        console.warn('⚠️ AI consultation failed, using enhanced mock:', aiError.message);
      }
    }
    
    // Enhanced mock consultation with more realistic data
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
    
  } catch (error) {
    console.error('❌ Consultation endpoint error:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
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

// Import and use infinite loop routes based on API availability
try {
  const hasApiKey = !!(process.env.ANTHROPIC_API_KEY || process.env.CLAUDE_CODE_API_KEY);
  
  if (hasApiKey) {
    // Try loading the real implementation first
    try {
      const infiniteLoopRoutes = require('./routes/infinite-loop');
      app.use('/api/infinite', infiniteLoopRoutes);
      console.log('✅ Infinite loop routes loaded (AI-powered mode)');
    } catch (error) {
      console.warn('⚠️  Failed to load AI infinite loop, falling back to mock:', error.message);
      const infiniteLoopRoutes = require('./routes/infinite-loop-simple');
      app.use('/api/infinite', infiniteLoopRoutes);
      console.log('✅ Infinite loop routes loaded (mock mode)');
    }
  } else {
    // No API key, use mock version
    const infiniteLoopRoutes = require('./routes/infinite-loop-simple');
    app.use('/api/infinite', infiniteLoopRoutes);
    console.log('✅ Infinite loop routes loaded (mock mode - no API key)');
  }
} catch (error) {
  console.error('❌ Failed to load any infinite loop routes:', error.message);
}

// Import and use agent requirements routes
try {
  const agentRequirementsRoutes = require('./routes/agent-requirements');
  app.use('/api/agent', agentRequirementsRoutes);
  console.log('✅ Agent requirements routes loaded successfully');
} catch (error) {
  console.error('❌ Failed to load agent requirements routes:');
  console.error('  Error:', error.message);
  console.error('  Stack:', error.stack);
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

// Import and use terminal chat routes
try {
  const terminalChatRoutes = require('./routes/terminal-chat');
  app.use('/api/terminal', terminalChatRoutes);
  console.log('✅ Terminal chat routes loaded successfully');
} catch (error) {
  console.error('❌ Failed to load terminal chat routes:', error.message);
}

// Import and use other API routes if available
try {
  const productCreationRoutes = require('./routes/product-creation-api');
  app.use('/api', productCreationRoutes);
  console.log('✅ Product creation routes loaded successfully');
} catch (error) {
  console.warn('⚠️ Failed to load product creation routes:', error.message);
}

// Load context management routes
try {
  const contextRoutes = require('./routes/context');
  app.use('/api/context', contextRoutes);
  console.log('✅ Context management routes loaded successfully');
} catch (error) {
  console.warn('⚠️ Failed to load context routes:', error.message);
}

// Load Website Customization Studio routes
try {
  const websiteDetectRoutes = require('./routes/website-detect-platform');
  app.use('/api/website', websiteDetectRoutes);
  console.log('✅ Website platform detection routes loaded successfully');
} catch (error) {
  console.warn('⚠️ Failed to load website platform detection routes:', error.message);
}

try {
  const websiteGenerateRoutes = require('./routes/website-generate-css');
  app.use('/api/website', websiteGenerateRoutes);
  console.log('✅ Website CSS generation routes loaded successfully');
} catch (error) {
  console.warn('⚠️ Failed to load website CSS generation routes:', error.message);
}

try {
  const websiteMockupRoutes = require('./routes/website-create-mockup');
  app.use('/api/website', websiteMockupRoutes);
  console.log('✅ Website mockup creation routes loaded successfully');
} catch (error) {
  console.warn('⚠️ Failed to load website mockup creation routes:', error.message);
}

try {
  const websiteAuthRoutes = require('./routes/website-auth');
  app.use('/api/website', websiteAuthRoutes);
  console.log('✅ Website authentication routes loaded successfully');
} catch (error) {
  console.warn('⚠️ Failed to load website authentication routes:', error.message);
}

// Load 21st.dev Magic routes for React Bits
try {
  // Try to load enhanced magic routes first
  let magicRoutes;
  try {
    magicRoutes = require('./routes/magic-enhanced');
    console.log('✅ Enhanced Magic routes loaded successfully (53 components)');
  } catch (enhancedError) {
    // Fallback to original magic routes
    magicRoutes = require('./routes/magic');
    console.log('✅ 21st.dev Magic routes loaded successfully (React Bits integration)');
  }
  app.use('/api/magic', magicRoutes);
} catch (error) {
  console.warn('⚠️ Failed to load Magic routes:', error.message);
}

// Error handling
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something went wrong!' });
});

// Export the app for server.js
module.exports = app;