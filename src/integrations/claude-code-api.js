/**
 * Claude Code API Integration
 * 
 * Provides Claude AI functionality using either:
 * 1. Official Anthropic SDK (default)
 * 2. Claude Code CLI Bridge (to leverage Claude Code Max subscription)
 */

const Anthropic = require('@anthropic-ai/sdk');
const { logger } = require('../monitoring/comprehensive-logger');

// Import CLI bridge as optional dependency
let ClaudeCodeCLIAdapter;
try {
    const bridge = require('./claude-code-cli-bridge');
    ClaudeCodeCLIAdapter = bridge.ClaudeCodeCLIAdapter;
} catch (error) {
    logger.warn('Claude Code CLI Bridge not available');
}

class ClaudeCodeAPI {
    constructor(apiKey, options = {}) {
        this.apiKey = apiKey;
        this.logger = options.logger || logger;
        this.timeout = options.timeout || 30000;
        
        // Check if we should use CLI bridge
        const useCLI = options.useCLI || process.env.USE_CLAUDE_CODE_CLI === 'true';
        
        if (useCLI && ClaudeCodeCLIAdapter) {
            logger.info('Using Claude Code CLI Bridge to leverage Max subscription');
            this.client = new ClaudeCodeCLIAdapter(options);
            this.usingCLI = true;
        } else {
            // Setup Anthropic client
            this.client = new Anthropic({
                apiKey: this.apiKey,
                timeout: this.timeout,
                maxRetries: 3
            });
            this.usingCLI = false;
        }
        
        // Store options for later use
        this.options = options;
    }

    /**
     * Send a message to Claude using the official SDK
     * @param {string} content - The message content
     * @param {Object} options - Additional options
     * @returns {Promise<string|Stream>} Claude's response or stream
     */
    async sendMessage(content, options = {}) {
        try {
            const {
                model = 'claude-3-sonnet-20240229',
                maxTokens = 1000,
                temperature = 0.3,
                systemPrompt = null,
                stream = false
            } = options;

            this.logger.info('Sending message to Claude API', {
                model,
                contentLength: content.length,
                hasSystemPrompt: !!systemPrompt,
                streaming: stream
            });

            // Prepare messages array
            const messages = [{
                role: 'user',
                content: content
            }];

            const requestOptions = {
                model,
                max_tokens: maxTokens,
                temperature,
                messages,
                stream
            };

            // Add system prompt if provided
            if (systemPrompt) {
                requestOptions.system = systemPrompt;
            }

            // Handle streaming if requested
            if (stream) {
                const stream = await this.client.messages.create(requestOptions);
                return stream; // Return the stream for caller to handle
            }

            // Non-streaming request
            const response = await this.client.messages.create(requestOptions);
            
            if (response && response.content && response.content[0]) {
                const responseText = response.content[0].text;
                this.logger.info('Claude API response received', {
                    responseLength: responseText.length,
                    model: response.model,
                    usage: response.usage
                });
                return responseText;
            }
            
            throw new Error('Invalid response format from Claude API');

        } catch (error) {
            this.logger.error('Claude API error:', {
                error: error.message,
                status: error.status,
                type: error.type
            });

            // Handle Anthropic SDK errors
            if (error.status === 401) {
                throw new Error('Claude API authentication failed. Please check your API key.');
            }
            
            if (error.status === 429) {
                throw new Error('Claude API rate limit exceeded. Please try again later.');
            }
            
            if (error.status === 400) {
                throw new Error(`Claude API bad request: ${error.message}`);
            }
            
            throw new Error(`Claude API request failed: ${error.message}`);
        }
    }

    /**
     * Send a streaming message to Claude
     * @param {string} content - The message content
     * @param {Object} options - Additional options
     * @returns {Promise<Stream>} Claude's response stream
     */
    async streamMessage(content, options = {}) {
        return this.sendMessage(content, { ...options, stream: true });
    }

    /**
     * Analyze user request for project type and complexity
     * @param {string} userRequest - The user's request text
     * @returns {Promise<Object>} Analysis result
     */
    async analyzeRequest(userRequest) {
        const analysisPrompt = `Analyze this web development request and categorize it. Respond with valid JSON only:

Request: "${userRequest}"

Analyze the request and return a JSON object with this exact structure:
{
    "projectType": "website|ecommerce|portfolio|blog|dashboard|saas|mobile|other",
    "complexity": "simple|moderate|complex",
    "keyFeatures": ["feature1", "feature2"],
    "missingInfo": ["missing info if any"],
    "technicalRequirements": ["technical needs identified"],
    "businessGoals": ["inferred business objectives"],
    "targetAudience": "who this is likely for"
}

Keep analysis simple and focus only on categorizing the project type and complexity.`;

        try {
            const response = await this.sendMessage(analysisPrompt, {
                model: 'claude-3-haiku-20240307',
                maxTokens: 1000,
                temperature: 0.3
            });

            // Try to parse JSON response
            try {
                const jsonMatch = response.match(/\{[\s\S]*\}/);
                if (jsonMatch) {
                    return JSON.parse(jsonMatch[0]);
                }
            } catch (parseError) {
                this.logger.warn('Could not parse Claude analysis as JSON, using fallback');
            }

            // Fallback analysis
            return this.createFallbackAnalysis(userRequest);

        } catch (error) {
            this.logger.error('Request analysis failed, using fallback:', error.message);
            return this.createFallbackAnalysis(userRequest);
        }
    }

    /**
     * Generate enhanced brief from Q&A session
     * @param {string} originalRequest - Original user request
     * @param {Array} questions - Questions asked
     * @param {Array} answers - User answers
     * @param {Object} analysis - Project analysis
     * @returns {Promise<Object>} Enhanced brief
     */
    async generateEnhancedBrief(originalRequest, questions, answers, analysis) {
        const systemPrompt = `Create an enhanced project brief based on this Q&A session

Original Request: "${originalRequest}"

Q&A Session:
${questions.map((q, i) => `Q: ${q.question || q}\nA: ${answers[i] || 'No answer provided'}`).join('\n\n')}

Project Analysis: ${JSON.stringify(analysis, null, 2)}`;

        try {
            const response = await this.sendMessage(`Create a comprehensive, actionable project brief that a developer could use to build exactly what the user wants. Include all specific requirements, preferences, and details gathered from the Q&A session.

Format as a clear, structured brief with sections for requirements, features, design preferences, technical specifications, and success criteria.`, {
                model: 'claude-3-sonnet-20240229',
                maxTokens: 2000,
                temperature: 0.2,
                systemPrompt
            });

            return {
                originalRequest,
                analysis,
                requirements: this.organizeRequirements(questions, answers),
                enhancedPrompt: response,
                confidence: 'high'
            };

        } catch (error) {
            this.logger.error('Enhanced brief generation failed, using fallback:', error.message);
            return this.createFallbackBrief(originalRequest, questions, answers, analysis);
        }
    }

    /**
     * Create fallback analysis when API is unavailable
     */
    createFallbackAnalysis(userRequest) {
        const projectType = this.determineProjectTypeFromKeywords(userRequest);
        
        return {
            projectType,
            complexity: "moderate",
            keyFeatures: this.extractKeywords(userRequest),
            missingInfo: ["More details needed about specific requirements"],
            technicalRequirements: [],
            businessGoals: ["Create functional web application"],
            targetAudience: "General users"
        };
    }

    /**
     * Create fallback enhanced brief
     */
    createFallbackBrief(originalRequest, questions, answers, analysis) {
        const requirements = this.organizeRequirements(questions, answers);
        
        const enhancedPrompt = `Enhanced Website Build Request:

Original Request: ${originalRequest}

ESSENTIAL REQUIREMENTS:
${requirements.essential.map(r => `• ${r.question} → ${r.answer}`).join('\n')}

PROJECT TYPE: ${analysis.projectType}
COMPLEXITY: ${analysis.complexity}
TARGET AUDIENCE: ${analysis.targetAudience}

Please build a comprehensive, functional website that addresses all the above requirements and delivers a professional result that meets the user's specific needs.`;

        return {
            originalRequest,
            analysis,
            requirements,
            enhancedPrompt,
            confidence: 'medium'
        };
    }

    /**
     * Determine project type from keywords
     */
    determineProjectTypeFromKeywords(request) {
        const text = request.toLowerCase();
        
        if (text.includes('ecommerce') || text.includes('store') || text.includes('shop') || text.includes('sell')) {
            return 'ecommerce';
        }
        if (text.includes('portfolio') || text.includes('showcase') || text.includes('work')) {
            return 'portfolio';
        }
        if (text.includes('blog') || text.includes('article') || text.includes('post')) {
            return 'blog';
        }
        if (text.includes('dashboard') || text.includes('admin') || text.includes('analytics')) {
            return 'dashboard';
        }
        if (text.includes('saas') || text.includes('software') || text.includes('platform')) {
            return 'saas';
        }
        
        return 'website';
    }

    /**
     * Extract keywords from request
     */
    extractKeywords(request) {
        const keywords = [];
        const text = request.toLowerCase();
        
        const features = [
            'authentication', 'login', 'user accounts', 'payment', 'checkout',
            'database', 'search', 'mobile', 'responsive', 'admin panel',
            'api', 'integration', 'analytics', 'seo', 'cms'
        ];
        
        features.forEach(feature => {
            if (text.includes(feature)) {
                keywords.push(feature);
            }
        });
        
        return keywords;
    }

    /**
     * Organize Q&A into requirements structure
     */
    organizeRequirements(questions, answers) {
        const requirements = {
            essential: [],
            technical: [],
            business: []
        };

        questions.forEach((question, index) => {
            const answer = answers[index] || 'No answer provided';
            const category = question.category || 'essential';
            
            requirements[category].push({
                question: question.question || question,
                answer: answer
            });
        });

        return requirements;
    }

    /**
     * Health check for Claude API
     */
    async healthCheck() {
        try {
            const response = await this.sendMessage('Hello Claude, please respond with "API is working"', {
                maxTokens: 50,
                temperature: 0,
                model: 'claude-3-haiku-20240307'
            });
            
            return {
                status: 'healthy',
                response: response.substring(0, 100),
                timestamp: new Date().toISOString()
            };
        } catch (error) {
            return {
                status: 'unhealthy',
                error: error.message,
                timestamp: new Date().toISOString()
            };
        }
    }
}

module.exports = { ClaudeCodeAPI };