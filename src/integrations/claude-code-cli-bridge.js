/**
 * Claude Code CLI Bridge
 * Interfaces with Claude Code CLI to leverage your Max plan subscription
 */

const { spawn } = require('child_process');
const { logger } = require('../monitoring/comprehensive-logger');
const { EventEmitter } = require('events');

class ClaudeCodeCLIBridge extends EventEmitter {
    constructor(options = {}) {
        super();
        this.cliPath = options.cliPath || 'claude'; // Assumes claude is in PATH
        this.timeout = options.timeout || 30000;
        this.activeProcesses = new Map();
    }

    /**
     * Execute a Claude Code CLI command
     * @param {string} prompt - The prompt to send
     * @param {Object} options - Execution options
     * @returns {Promise<Object>} Response from Claude Code
     */
    async executeCommand(prompt, options = {}) {
        return new Promise((resolve, reject) => {
            const id = this.generateId();
            const args = this.buildArgs(prompt, options);
            
            logger.info(`Executing Claude Code CLI command ${id}`);
            
            // Spawn Claude Code process
            const process = spawn(this.cliPath, args, {
                env: { ...process.env },
                shell: true
            });
            
            this.activeProcesses.set(id, process);
            
            let output = '';
            let errorOutput = '';
            let timeout;
            
            // Set timeout
            timeout = setTimeout(() => {
                this.killProcess(id);
                reject(new Error('Claude Code CLI command timed out'));
            }, this.timeout);
            
            // Handle stdout
            process.stdout.on('data', (data) => {
                const chunk = data.toString();
                output += chunk;
                
                // Emit streaming data
                this.emit('stream', {
                    id,
                    chunk,
                    accumulated: output
                });
            });
            
            // Handle stderr
            process.stderr.on('data', (data) => {
                errorOutput += data.toString();
            });
            
            // Handle process completion
            process.on('close', (code) => {
                clearTimeout(timeout);
                this.activeProcesses.delete(id);
                
                if (code === 0) {
                    resolve({
                        success: true,
                        output: output.trim(),
                        id
                    });
                } else {
                    reject(new Error(`Claude Code CLI exited with code ${code}: ${errorOutput}`));
                }
            });
            
            // Handle process errors
            process.on('error', (error) => {
                clearTimeout(timeout);
                this.activeProcesses.delete(id);
                reject(error);
            });
        });
    }

    /**
     * Build command line arguments
     */
    buildArgs(prompt, options) {
        const args = [];
        
        // Add the prompt
        args.push(`"${prompt.replace(/"/g, '\\"')}"`);
        
        // Add options if provided
        if (options.model) {
            args.push('--model', options.model);
        }
        
        if (options.maxTokens) {
            args.push('--max-tokens', options.maxTokens);
        }
        
        if (options.temperature) {
            args.push('--temperature', options.temperature);
        }
        
        // Add JSON output format for easier parsing
        args.push('--format', 'json');
        
        return args;
    }

    /**
     * Check if Claude Code CLI is available
     */
    async checkAvailability() {
        try {
            const result = await this.executeCommand('--version');
            return {
                available: true,
                version: result.output
            };
        } catch (error) {
            return {
                available: false,
                error: error.message
            };
        }
    }

    /**
     * Kill a running process
     */
    killProcess(id) {
        const process = this.activeProcesses.get(id);
        if (process) {
            process.kill('SIGTERM');
            this.activeProcesses.delete(id);
        }
    }

    /**
     * Generate unique ID
     */
    generateId() {
        return `cli-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    }
}

/**
 * Adapter to make CLI bridge compatible with ClaudeCodeAPI interface
 */
class ClaudeCodeCLIAdapter {
    constructor(options = {}) {
        this.bridge = new ClaudeCodeCLIBridge(options);
        this.logger = options.logger || logger;
    }

    async sendMessage(content, options = {}) {
        try {
            const result = await this.bridge.executeCommand(content, options);
            
            // Parse JSON output if available
            try {
                const parsed = JSON.parse(result.output);
                return parsed.content || result.output;
            } catch {
                // Return raw output if not JSON
                return result.output;
            }
        } catch (error) {
            this.logger.error('Claude Code CLI error:', error);
            throw error;
        }
    }

    async streamMessage(content, options = {}) {
        // Create a stream-like interface
        const streamEmitter = new EventEmitter();
        
        // Set up bridge event forwarding
        this.bridge.once('stream', (data) => {
            streamEmitter.emit('chunk', data.chunk);
        });
        
        // Execute command asynchronously
        this.bridge.executeCommand(content, options)
            .then(result => {
                streamEmitter.emit('end', result.output);
            })
            .catch(error => {
                streamEmitter.emit('error', error);
            });
        
        return streamEmitter;
    }

    async analyzeRequest(userRequest) {
        const prompt = `Analyze this request and return JSON with projectType, complexity, keyFeatures, missingInfo, technicalRequirements, businessGoals, and targetAudience: "${userRequest}"`;
        
        try {
            const result = await this.sendMessage(prompt);
            return JSON.parse(result);
        } catch (error) {
            // Fallback analysis
            return {
                projectType: 'website',
                complexity: 'moderate',
                keyFeatures: [],
                missingInfo: ['More details needed'],
                technicalRequirements: [],
                businessGoals: ['Build functional application'],
                targetAudience: 'General users'
            };
        }
    }

    async generateEnhancedBrief(originalRequest, questions, answers, analysis) {
        const prompt = `Create an enhanced project brief based on:
Original Request: ${originalRequest}
Q&A: ${JSON.stringify({ questions, answers })}
Analysis: ${JSON.stringify(analysis)}`;

        const response = await this.sendMessage(prompt);
        
        return {
            originalRequest,
            analysis,
            requirements: { essential: [], technical: [], business: [] },
            enhancedPrompt: response,
            confidence: 'high'
        };
    }

    async healthCheck() {
        const availability = await this.bridge.checkAvailability();
        
        return {
            status: availability.available ? 'healthy' : 'unhealthy',
            response: availability.version || availability.error,
            timestamp: new Date().toISOString()
        };
    }
}

module.exports = { ClaudeCodeCLIBridge, ClaudeCodeCLIAdapter };