/**
 * Terminal Command Parser
 * Parses Claude Code-like commands and integrates with the Anthropic SDK
 */

const { ClaudeCodeAPI } = require('../integrations/claude-code-api');
const { logger } = require('../monitoring/comprehensive-logger');
const fs = require('fs').promises;
const path = require('path');

class CommandParser {
    constructor(options = {}) {
        this.claudeAPI = new ClaudeCodeAPI(
            process.env.ANTHROPIC_API_KEY || process.env.CLAUDE_CODE_API_KEY
        );
        
        this.projectRoot = options.projectRoot || process.cwd();
        this.allowedCommands = new Set([
            'ui', 'create', 'generate', 'fix', 'explain', 
            'refactor', 'test', 'help', 'context', 'save'
        ]);
        
        this.contextManager = {
            currentFile: null,
            projectStructure: null,
            recentCommands: [],
            generatedFiles: []
        };
    }
    
    /**
     * Parse and execute a terminal command
     * @param {string} command - The command string
     * @param {Object} options - Execution options
     * @returns {Promise<Object>} Command result
     */
    async parseCommand(command, options = {}) {
        const trimmed = command.trim();
        
        // Check for special command prefix
        if (!trimmed.startsWith('/')) {
            return {
                type: 'chat',
                content: await this.handleChatMessage(trimmed, options)
            };
        }
        
        // Parse command structure
        const parts = trimmed.substring(1).split(/\s+/);
        const mainCommand = parts[0].toLowerCase();
        
        if (!this.allowedCommands.has(mainCommand)) {
            return {
                type: 'error',
                message: `Unknown command: /${mainCommand}. Type /help for available commands.`
            };
        }
        
        // Route to appropriate handler
        switch (mainCommand) {
            case 'ui':
                return await this.handleUICommand(parts.slice(1), options);
            case 'create':
                return await this.handleCreateCommand(parts.slice(1), options);
            case 'generate':
                return await this.handleGenerateCommand(parts.slice(1), options);
            case 'fix':
                return await this.handleFixCommand(parts.slice(1), options);
            case 'explain':
                return await this.handleExplainCommand(parts.slice(1), options);
            case 'refactor':
                return await this.handleRefactorCommand(parts.slice(1), options);
            case 'test':
                return await this.handleTestCommand(parts.slice(1), options);
            case 'context':
                return await this.handleContextCommand(parts.slice(1), options);
            case 'save':
                return await this.handleSaveCommand(parts.slice(1), options);
            case 'help':
                return this.handleHelpCommand();
            default:
                return {
                    type: 'error',
                    message: 'Command not implemented yet'
                };
        }
    }
    
    /**
     * Handle UI component generation commands
     */
    async handleUICommand(args, options) {
        const request = args.join(' ');
        
        if (!request) {
            return {
                type: 'error',
                message: 'Please specify what UI component to create. Example: /ui create a login form'
            };
        }
        
        const prompt = `Generate a React component based on this request: "${request}"
        
Requirements:
- Use modern React with hooks
- Include proper TypeScript types if applicable
- Add basic styling (CSS modules or styled-components)
- Make it responsive and accessible
- Include usage example

Return the complete component code with proper imports.`;

        try {
            const response = await this.claudeAPI.sendMessage(prompt, {
                model: 'claude-3-sonnet-20240229',
                maxTokens: 2000,
                temperature: 0.3,
                stream: options.stream
            });
            
            // Parse response to extract code blocks
            const codeBlocks = this.extractCodeBlocks(response);
            
            return {
                type: 'ui-component',
                content: response,
                codeBlocks,
                message: 'UI component generated successfully'
            };
            
        } catch (error) {
            logger.error('UI command error:', error);
            return {
                type: 'error',
                message: `Failed to generate UI component: ${error.message}`
            };
        }
    }
    
    /**
     * Handle file creation commands
     */
    async handleCreateCommand(args, options) {
        const fileName = args[0];
        const description = args.slice(1).join(' ');
        
        if (!fileName) {
            return {
                type: 'error',
                message: 'Please specify a file name. Example: /create Button.jsx a reusable button component'
            };
        }
        
        const fileExtension = path.extname(fileName);
        const fileType = this.getFileType(fileExtension);
        
        const prompt = `Create a ${fileType} file named "${fileName}" with the following purpose: ${description || 'general purpose'}

Requirements:
- Follow best practices for ${fileType} files
- Include proper documentation/comments
- Make it production-ready
- Include any necessary imports or dependencies

Return the complete file content.`;

        try {
            const response = await this.claudeAPI.sendMessage(prompt, {
                model: 'claude-3-sonnet-20240229',
                maxTokens: 2000,
                temperature: 0.3,
                stream: options.stream
            });
            
            return {
                type: 'file-create',
                fileName,
                content: response,
                message: `File ${fileName} content generated`
            };
            
        } catch (error) {
            logger.error('Create command error:', error);
            return {
                type: 'error',
                message: `Failed to create file: ${error.message}`
            };
        }
    }
    
    /**
     * Handle code generation commands
     */
    async handleGenerateCommand(args, options) {
        const target = args.join(' ');
        
        const prompt = `Generate code for: ${target}

Context:
- Current project: ${this.contextManager.currentFile || 'New project'}
- Framework: React/Next.js
- Language: JavaScript/TypeScript

Provide complete, working code with:
1. All necessary imports
2. Proper error handling
3. Comments explaining key parts
4. Example usage if applicable`;

        try {
            const response = await this.claudeAPI.sendMessage(prompt, {
                model: 'claude-3-sonnet-20240229',
                maxTokens: 2000,
                temperature: 0.3,
                stream: options.stream
            });
            
            const codeBlocks = this.extractCodeBlocks(response);
            
            return {
                type: 'code-generate',
                content: response,
                codeBlocks,
                message: 'Code generated successfully'
            };
            
        } catch (error) {
            logger.error('Generate command error:', error);
            return {
                type: 'error',
                message: `Failed to generate code: ${error.message}`
            };
        }
    }
    
    /**
     * Handle code fix commands
     */
    async handleFixCommand(args, options) {
        const issue = args.join(' ');
        
        if (!this.contextManager.currentFile) {
            return {
                type: 'error',
                message: 'No file context. Please open a file first or use /context set <file>'
            };
        }
        
        // Read current file content
        let fileContent = '';
        try {
            const filePath = path.join(this.projectRoot, this.contextManager.currentFile);
            fileContent = await fs.readFile(filePath, 'utf-8');
        } catch (error) {
            logger.warn('Could not read current file:', error);
        }
        
        const prompt = `Fix the following issue: "${issue}"

Current file: ${this.contextManager.currentFile}
File content:
\`\`\`
${fileContent}
\`\`\`

Provide the fixed code with explanations of what was changed and why.`;

        try {
            const response = await this.claudeAPI.sendMessage(prompt, {
                model: 'claude-3-sonnet-20240229',
                maxTokens: 2000,
                temperature: 0.2,
                stream: options.stream
            });
            
            const codeBlocks = this.extractCodeBlocks(response);
            
            return {
                type: 'code-fix',
                content: response,
                codeBlocks,
                originalFile: this.contextManager.currentFile,
                message: 'Fix generated successfully'
            };
            
        } catch (error) {
            logger.error('Fix command error:', error);
            return {
                type: 'error',
                message: `Failed to generate fix: ${error.message}`
            };
        }
    }
    
    /**
     * Handle code explanation commands
     */
    async handleExplainCommand(args, options) {
        const target = args.join(' ') || 'this code';
        
        const prompt = `Explain ${target} in detail.

If code is provided, explain:
1. What it does
2. How it works
3. Key concepts used
4. Potential improvements
5. Common use cases

Make the explanation clear and suitable for developers.`;

        try {
            const response = await this.claudeAPI.sendMessage(prompt, {
                model: 'claude-3-sonnet-20240229',
                maxTokens: 1500,
                temperature: 0.3,
                stream: options.stream
            });
            
            return {
                type: 'explanation',
                content: response,
                message: 'Explanation generated'
            };
            
        } catch (error) {
            logger.error('Explain command error:', error);
            return {
                type: 'error',
                message: `Failed to generate explanation: ${error.message}`
            };
        }
    }
    
    /**
     * Handle refactoring commands
     */
    async handleRefactorCommand(args, options) {
        const target = args.join(' ');
        
        if (!this.contextManager.currentFile) {
            return {
                type: 'error',
                message: 'No file context. Please open a file first or use /context set <file>'
            };
        }
        
        const prompt = `Refactor the code to ${target || 'improve quality and maintainability'}.

Current file: ${this.contextManager.currentFile}

Refactoring goals:
1. Improve code organization
2. Enhance readability
3. Reduce complexity
4. Follow best practices
5. Maintain functionality

Provide the refactored code with explanations of changes.`;

        try {
            const response = await this.claudeAPI.sendMessage(prompt, {
                model: 'claude-3-sonnet-20240229',
                maxTokens: 2000,
                temperature: 0.2,
                stream: options.stream
            });
            
            const codeBlocks = this.extractCodeBlocks(response);
            
            return {
                type: 'refactor',
                content: response,
                codeBlocks,
                originalFile: this.contextManager.currentFile,
                message: 'Refactoring suggestions generated'
            };
            
        } catch (error) {
            logger.error('Refactor command error:', error);
            return {
                type: 'error',
                message: `Failed to generate refactoring: ${error.message}`
            };
        }
    }
    
    /**
     * Handle test generation commands
     */
    async handleTestCommand(args, options) {
        const target = args.join(' ') || 'the current file';
        
        const prompt = `Generate comprehensive tests for ${target}.

Test requirements:
1. Use Jest and React Testing Library (if React component)
2. Cover happy paths and edge cases
3. Include unit and integration tests
4. Add descriptive test names
5. Mock external dependencies appropriately

Provide complete test file(s) with all necessary imports.`;

        try {
            const response = await this.claudeAPI.sendMessage(prompt, {
                model: 'claude-3-sonnet-20240229',
                maxTokens: 2000,
                temperature: 0.3,
                stream: options.stream
            });
            
            const codeBlocks = this.extractCodeBlocks(response);
            
            return {
                type: 'test-generate',
                content: response,
                codeBlocks,
                message: 'Tests generated successfully'
            };
            
        } catch (error) {
            logger.error('Test command error:', error);
            return {
                type: 'error',
                message: `Failed to generate tests: ${error.message}`
            };
        }
    }
    
    /**
     * Handle context management commands
     */
    async handleContextCommand(args, options) {
        const subCommand = args[0];
        const value = args.slice(1).join(' ');
        
        switch (subCommand) {
            case 'set':
                if (!value) {
                    return {
                        type: 'error',
                        message: 'Please specify a file. Example: /context set src/App.jsx'
                    };
                }
                this.contextManager.currentFile = value;
                return {
                    type: 'context-update',
                    message: `Context set to: ${value}`
                };
                
            case 'show':
                return {
                    type: 'context-info',
                    context: this.contextManager,
                    message: 'Current context information'
                };
                
            case 'clear':
                this.contextManager.currentFile = null;
                return {
                    type: 'context-update',
                    message: 'Context cleared'
                };
                
            default:
                return {
                    type: 'error',
                    message: 'Usage: /context [set|show|clear] [file]'
                };
        }
    }
    
    /**
     * Handle save commands
     */
    async handleSaveCommand(args, options) {
        const fileName = args[0] || `generated-${Date.now()}.js`;
        const lastGenerated = this.contextManager.generatedFiles[this.contextManager.generatedFiles.length - 1];
        
        if (!lastGenerated) {
            return {
                type: 'error',
                message: 'No generated content to save. Generate something first.'
            };
        }
        
        const filePath = path.join(this.projectRoot, fileName);
        
        try {
            await fs.writeFile(filePath, lastGenerated.content, 'utf-8');
            
            return {
                type: 'file-saved',
                fileName,
                path: filePath,
                message: `File saved to: ${fileName}`
            };
            
        } catch (error) {
            logger.error('Save command error:', error);
            return {
                type: 'error',
                message: `Failed to save file: ${error.message}`
            };
        }
    }
    
    /**
     * Handle help command
     */
    handleHelpCommand() {
        return {
            type: 'help',
            content: `
Available Commands:

/ui <description>       - Generate UI components
  Example: /ui create a responsive navigation bar

/create <file> <desc>   - Create a new file with generated content
  Example: /create Button.jsx a reusable button component

/generate <description> - Generate code based on description
  Example: /generate API endpoint for user authentication

/fix <issue>           - Fix issues in current file
  Example: /fix typescript errors

/explain <code/topic>  - Explain code or concepts
  Example: /explain how React hooks work

/refactor <goal>       - Refactor current file
  Example: /refactor to use custom hooks

/test <target>         - Generate tests
  Example: /test the UserCard component

/context set <file>    - Set current file context
/context show          - Show current context
/context clear         - Clear context

/save <filename>       - Save last generated content

/help                  - Show this help message

Tips:
- You can also chat naturally without commands
- Use Ctrl+C to stop streaming responses
- Generated code includes proper imports and documentation
            `,
            message: 'Help information'
        };
    }
    
    /**
     * Handle regular chat messages
     */
    async handleChatMessage(message, options) {
        try {
            const response = await this.claudeAPI.sendMessage(message, {
                model: 'claude-3-sonnet-20240229',
                maxTokens: 1500,
                temperature: 0.7,
                stream: options.stream
            });
            
            return response;
            
        } catch (error) {
            logger.error('Chat message error:', error);
            throw error;
        }
    }
    
    /**
     * Extract code blocks from response
     */
    extractCodeBlocks(text) {
        const codeBlocks = [];
        const regex = /```(\w+)?\n([\s\S]*?)```/g;
        let match;
        
        while ((match = regex.exec(text)) !== null) {
            codeBlocks.push({
                language: match[1] || 'plaintext',
                code: match[2].trim()
            });
        }
        
        return codeBlocks;
    }
    
    /**
     * Determine file type from extension
     */
    getFileType(extension) {
        const typeMap = {
            '.js': 'JavaScript',
            '.jsx': 'React component',
            '.ts': 'TypeScript',
            '.tsx': 'React TypeScript component',
            '.css': 'CSS stylesheet',
            '.scss': 'SCSS stylesheet',
            '.json': 'JSON configuration',
            '.md': 'Markdown documentation',
            '.html': 'HTML document',
            '.py': 'Python script',
            '.sql': 'SQL script'
        };
        
        return typeMap[extension.toLowerCase()] || 'text';
    }
}

module.exports = { CommandParser };