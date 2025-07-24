// Terminal AI Service - Using Claude/Anthropic
const { ClaudeCodeAPI } = require('../integrations/claude-code-api');

class TerminalAI {
    constructor() {
        // Use existing Claude API integration
        const apiKey = process.env.ANTHROPIC_API_KEY || process.env.CLAUDE_CODE_API_KEY;
        
        if (apiKey) {
            this.claude = new ClaudeCodeAPI(apiKey, {
                timeout: 30000
                // Will automatically use CLI if USE_CLAUDE_CODE_CLI=true
            });
            const usingCLI = process.env.USE_CLAUDE_CODE_CLI === 'true';
            console.log(`✅ Terminal AI initialized with Claude ${usingCLI ? '(via CLI - using Max subscription)' : '(via API)'}`);
        } else {
            this.claude = null;
            console.warn('⚠️  Terminal AI running in mock mode (no Anthropic API key)');
        }
        
        // System prompt for concise terminal responses
        this.systemPrompt = `You are an AI terminal assistant. Be extremely concise.
- Give direct answers, no explanations unless asked
- For code generation, show only the code
- For file operations, describe action in <10 words
- Use function calls for file/command operations
- Never use markdown formatting in responses
- Keep responses under 2 lines when possible`;
        
        // Track sessions
        this.sessions = new Map();
    }

    async processMessage(message, options = {}) {
        const { sessionId = 'default', context = 'terminal' } = options;
        
        try {
            // Get or create session
            let session = this.sessions.get(sessionId);
            if (!session) {
                session = {
                    id: sessionId,
                    messages: [{ role: 'system', content: this.systemPrompt }],
                    createdAt: Date.now()
                };
                this.sessions.set(sessionId, session);
            }
            
            // Add user message
            session.messages.push({ role: 'user', content: message });
            
            // Check if Claude is available
            if (!this.claude) {
                // Mock mode - provide helpful responses
                return this.mockProcessMessage(message, session, sessionId);
            }
            
            // Create prompt that encourages tool-like responses
            const toolPrompt = this.createToolPrompt(message);
            
            // Call Claude API
            const response = await this.claude.sendMessage(toolPrompt, {
                model: 'claude-3-haiku-20240307', // Fast model for terminal
                maxTokens: 200,
                temperature: 0.3,
                systemPrompt: this.systemPrompt
            });
            
            // Parse response for actions and text
            const { responseText, toolCalls } = this.parseClaudeResponse(response, message);
            
            // Add to session
            session.messages.push({ role: 'assistant', content: responseText });
            
            // Clean up old sessions (older than 1 hour)
            this.cleanupSessions();
            
            return {
                response: responseText,
                toolCalls,
                sessionId
            };
            
        } catch (error) {
            console.error('❌ Terminal AI error:', error);
            
            // Handle common Claude errors
            if (error.message.includes('authentication failed')) {
                return {
                    response: 'API authentication failed. Check your Anthropic API key.',
                    toolCalls: [],
                    sessionId
                };
            }
            
            if (error.message.includes('rate limit')) {
                return {
                    response: 'API rate limit exceeded. Please try again later.',
                    toolCalls: [],
                    sessionId
                };
            }
            
            throw error;
        }
    }

    // Mock mode for when Claude isn't available
    mockProcessMessage(message, session, sessionId) {
        const lowerMessage = message.toLowerCase();
        let response = '';
        let toolCalls = [];

        // Parse common requests
        if (lowerMessage.includes('create') && lowerMessage.includes('file')) {
            // Extract filename if possible
            const fileMatch = message.match(/(?:file|component|page)\s+(?:called|named)?\s*(\S+)/i);
            const fileName = fileMatch ? fileMatch[1] : 'newfile.js';
            
            response = `Creating ${fileName}`;
            toolCalls.push({
                type: 'create_file',
                args: {
                    path: fileName,
                    content: '// New file created by AI assistant\n'
                },
                id: `tool_${Date.now()}`
            });
        } else if (lowerMessage.includes('help')) {
            response = 'Commands: create file, edit file, search, run command. Prefix with $ for bash.';
        } else if (lowerMessage.includes('hello') || lowerMessage.includes('hi')) {
            response = 'Hello! I can help you create files, edit code, and run commands.';
        } else if (lowerMessage.includes('search')) {
            response = 'Search functionality requires API key. Add ANTHROPIC_API_KEY to .env';
        } else {
            response = 'Mock mode active. Add ANTHROPIC_API_KEY to .env file.';
        }

        // Add mock response to session
        session.messages.push({ role: 'assistant', content: response });

        return {
            response,
            toolCalls,
            sessionId
        };
    }

    // Create a prompt that encourages Claude to respond with actions
    createToolPrompt(message) {
        const lowerMessage = message.toLowerCase();
        
        // Check if this is a file operation request
        if (lowerMessage.includes('create') || lowerMessage.includes('edit') || 
            lowerMessage.includes('make') || lowerMessage.includes('build')) {
            return `${message}

If this requires creating or editing files, respond with:
ACTION: [create_file|edit_file] PATH: [filepath] 
Then provide a very brief confirmation message.`;
        }
        
        // Check if this is a search request
        if (lowerMessage.includes('search') || lowerMessage.includes('find') || 
            lowerMessage.includes('look for')) {
            return `${message}

If this requires searching, respond with:
ACTION: search_code QUERY: [search term]
Then provide a very brief result summary.`;
        }
        
        // Default - just the message
        return message;
    }

    // Parse Claude's response to extract actions and text
    parseClaudeResponse(response, originalMessage) {
        let responseText = response;
        const toolCalls = [];
        
        // Check for ACTION patterns in the response
        const actionMatch = response.match(/ACTION:\s*(\w+)\s*(?:PATH|QUERY):\s*([^\n]+)/i);
        
        if (actionMatch) {
            const [fullMatch, action, param] = actionMatch;
            
            // Remove the ACTION line from the response text
            responseText = response.replace(fullMatch, '').trim();
            
            // Create appropriate tool call
            switch (action.toLowerCase()) {
                case 'create_file':
                    toolCalls.push({
                        type: 'create_file',
                        args: {
                            path: param.trim(),
                            content: this.generateFileContent(param.trim(), originalMessage)
                        },
                        id: `tool_${Date.now()}`
                    });
                    break;
                    
                case 'edit_file':
                    toolCalls.push({
                        type: 'edit_file',
                        args: {
                            path: param.trim(),
                            content: '// Updated by AI assistant\n',
                            preview: true
                        },
                        id: `tool_${Date.now()}`
                    });
                    break;
                    
                case 'search_code':
                    toolCalls.push({
                        type: 'search_code',
                        args: {
                            query: param.trim()
                        },
                        id: `tool_${Date.now()}`
                    });
                    break;
            }
        }
        
        // Ensure we have some response text
        if (!responseText || responseText.length < 5) {
            responseText = this.generateBriefResponse(originalMessage, toolCalls);
        }
        
        return { responseText, toolCalls };
    }

    // Generate appropriate file content based on filename
    generateFileContent(filename, context) {
        const ext = filename.split('.').pop()?.toLowerCase();
        
        switch (ext) {
            case 'html':
                return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>New Page</title>
</head>
<body>
    <h1>Hello World</h1>
</body>
</html>`;
            
            case 'jsx':
            case 'tsx':
                return `import React from 'react';

const Component = () => {
    return (
        <div>
            <h1>New Component</h1>
        </div>
    );
};

export default Component;`;
            
            case 'js':
            case 'ts':
                return `// ${filename}
// Created by AI assistant

function main() {
    console.log('Hello from ${filename}');
}

main();`;
            
            default:
                return `// New file: ${filename}\n// Created by AI assistant\n`;
        }
    }

    // Generate brief response when Claude doesn't provide one
    generateBriefResponse(message, toolCalls) {
        if (toolCalls.length > 0) {
            const action = toolCalls[0];
            switch (action.type) {
                case 'create_file':
                    return `Creating ${action.args.path}`;
                case 'edit_file':
                    return `Editing ${action.args.path}`;
                case 'search_code':
                    return `Searching for "${action.args.query}"`;
                default:
                    return 'Done.';
            }
        }
        
        // Generic responses
        const lowerMessage = message.toLowerCase();
        if (lowerMessage.includes('hello') || lowerMessage.includes('hi')) {
            return 'Hello! How can I help?';
        }
        if (lowerMessage.includes('thank')) {
            return "You're welcome!";
        }
        
        return 'Ready.';
    }


    cleanupSessions() {
        const oneHourAgo = Date.now() - (60 * 60 * 1000);
        
        for (const [sessionId, session] of this.sessions.entries()) {
            if (session.createdAt < oneHourAgo) {
                this.sessions.delete(sessionId);
            }
        }
    }

    // Clear a specific session
    clearSession(sessionId) {
        this.sessions.delete(sessionId);
    }

    // Get session history
    getSessionHistory(sessionId) {
        const session = this.sessions.get(sessionId);
        if (!session) return [];
        
        // Return messages without system prompt
        return session.messages.filter(msg => msg.role !== 'system');
    }
}

// Export singleton instance
module.exports = new TerminalAI();