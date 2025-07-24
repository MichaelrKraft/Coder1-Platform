/**
 * Agent Requirements Analysis Routes
 * Handles AI-powered requirement analysis and question generation
 */

const express = require('express');
const router = express.Router();
const { ClaudeCodeAPI } = require('../integrations/claude-code-api');

// Initialize Claude API
const claudeAPI = new ClaudeCodeAPI(process.env.ANTHROPIC_API_KEY || process.env.CLAUDE_CODE_API_KEY);

/**
 * Analyze requirements and generate intelligent questions
 */
router.post('/analyze-requirements', async (req, res) => {
    try {
        const { request } = req.body;
        
        if (!request || request.trim() === '') {
            return res.status(400).json({
                success: false,
                error: 'Request cannot be empty'
            });
        }

        console.log('📋 Analyzing requirements for:', request.substring(0, 50) + '...');

        // Step 1: Analyze the request
        const analysis = await claudeAPI.analyzeRequest(request);
        
        // Step 2: Generate targeted questions based on the analysis
        const questions = await generateQuestions(request, analysis);
        
        res.json({
            success: true,
            analysis,
            questions,
            sessionId: `session-${Date.now()}`
        });
        
    } catch (error) {
        console.error('❌ Requirements analysis error:', error);
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
});

/**
 * Generate enhanced brief from Q&A session
 */
router.post('/generate-brief', async (req, res) => {
    try {
        const { originalRequest, questions, answers, analysis, sessionId } = req.body;
        
        console.log('📝 Generating enhanced brief for session:', sessionId);
        
        // Generate enhanced brief using Claude
        const brief = await claudeAPI.generateEnhancedBrief(
            originalRequest,
            questions,
            answers,
            analysis
        );
        
        res.json({
            success: true,
            brief,
            sessionId
        });
        
    } catch (error) {
        console.error('❌ Brief generation error:', error);
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
});

/**
 * Generate intelligent questions based on project analysis
 */
async function generateQuestions(request, analysis) {
    const { projectType, complexity, missingInfo, keyFeatures } = analysis;
    
    // Base questions that apply to all projects
    const baseQuestions = [
        {
            id: 'q1',
            question: "What is the primary goal or purpose of this project?",
            category: 'essential',
            importance: 'high'
        },
        {
            id: 'q2',
            question: "Who is your target audience or user base?",
            category: 'essential',
            importance: 'high'
        }
    ];
    
    // Type-specific questions
    const typeQuestions = getTypeSpecificQuestions(projectType);
    
    // Feature-specific questions
    const featureQuestions = getFeatureQuestions(keyFeatures);
    
    // Complexity-based questions
    const complexityQuestions = getComplexityQuestions(complexity);
    
    // Combine and limit to 5 questions total
    const allQuestions = [
        ...baseQuestions,
        ...typeQuestions,
        ...featureQuestions,
        ...complexityQuestions
    ];
    
    // Prioritize and select top 5 questions
    return selectTopQuestions(allQuestions, 5);
}

/**
 * Get questions specific to project type
 */
function getTypeSpecificQuestions(projectType) {
    const questions = {
        ecommerce: [
            {
                id: 'ec1',
                question: "What types of products will you be selling?",
                category: 'business',
                importance: 'high'
            },
            {
                id: 'ec2',
                question: "Do you need payment processing integration? If so, which payment providers?",
                category: 'technical',
                importance: 'high'
            }
        ],
        portfolio: [
            {
                id: 'pf1',
                question: "What type of work will you be showcasing?",
                category: 'content',
                importance: 'high'
            },
            {
                id: 'pf2',
                question: "Do you need a contact form or booking system?",
                category: 'features',
                importance: 'medium'
            }
        ],
        blog: [
            {
                id: 'bl1',
                question: "What topics will you be writing about?",
                category: 'content',
                importance: 'medium'
            },
            {
                id: 'bl2',
                question: "Do you need user comments or social sharing features?",
                category: 'features',
                importance: 'medium'
            }
        ],
        dashboard: [
            {
                id: 'db1',
                question: "What data or metrics need to be displayed?",
                category: 'technical',
                importance: 'high'
            },
            {
                id: 'db2',
                question: "Who will have access to the dashboard?",
                category: 'security',
                importance: 'high'
            }
        ],
        saas: [
            {
                id: 'sa1',
                question: "What is the core functionality of your SaaS product?",
                category: 'business',
                importance: 'high'
            },
            {
                id: 'sa2',
                question: "What pricing model will you use?",
                category: 'business',
                importance: 'high'
            }
        ]
    };
    
    return questions[projectType] || [];
}

/**
 * Get questions based on detected features
 */
function getFeatureQuestions(features) {
    const questions = [];
    
    if (features.includes('authentication') || features.includes('login')) {
        questions.push({
            id: 'ft1',
            question: "What authentication methods do you need? (email/password, social login, etc.)",
            category: 'security',
            importance: 'high'
        });
    }
    
    if (features.includes('payment')) {
        questions.push({
            id: 'ft2',
            question: "What payment methods should be supported?",
            category: 'technical',
            importance: 'high'
        });
    }
    
    if (features.includes('mobile') || features.includes('responsive')) {
        questions.push({
            id: 'ft3',
            question: "What devices and screen sizes are most important?",
            category: 'design',
            importance: 'medium'
        });
    }
    
    return questions;
}

/**
 * Get questions based on project complexity
 */
function getComplexityQuestions(complexity) {
    const questions = {
        simple: [
            {
                id: 'cm1',
                question: "Do you have any specific design preferences or brand guidelines?",
                category: 'design',
                importance: 'medium'
            }
        ],
        moderate: [
            {
                id: 'cm2',
                question: "What is your expected timeline for this project?",
                category: 'planning',
                importance: 'medium'
            },
            {
                id: 'cm3',
                question: "Are there any third-party services or APIs you need to integrate?",
                category: 'technical',
                importance: 'medium'
            }
        ],
        complex: [
            {
                id: 'cm4',
                question: "What are your scalability requirements?",
                category: 'technical',
                importance: 'high'
            },
            {
                id: 'cm5',
                question: "Do you have specific security or compliance requirements?",
                category: 'security',
                importance: 'high'
            }
        ]
    };
    
    return questions[complexity] || questions.moderate;
}

/**
 * Select top N questions based on importance and diversity
 */
function selectTopQuestions(allQuestions, limit) {
    // Sort by importance
    const sorted = allQuestions.sort((a, b) => {
        const importanceWeight = { high: 3, medium: 2, low: 1 };
        return (importanceWeight[b.importance] || 0) - (importanceWeight[a.importance] || 0);
    });
    
    // Ensure category diversity
    const selected = [];
    const categoriesUsed = new Set();
    
    for (const question of sorted) {
        if (selected.length >= limit) break;
        
        // Add question if we haven't used too many from this category
        const categoryCount = selected.filter(q => q.category === question.category).length;
        if (categoryCount < 2) {
            selected.push(question);
            categoriesUsed.add(question.category);
        }
    }
    
    // Fill remaining slots if needed
    for (const question of sorted) {
        if (selected.length >= limit) break;
        if (!selected.includes(question)) {
            selected.push(question);
        }
    }
    
    return selected.slice(0, limit);
}

module.exports = router;