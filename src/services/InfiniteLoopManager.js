// InfiniteLoopManager - manages infinite agent execution sessions
const { spawn } = require('child_process');
const path = require('path');
const fs = require('fs').promises;
const { ClaudeCodeAPI } = require('../integrations/claude-code-api');
const { logger } = require('../monitoring/comprehensive-logger');

class InfiniteLoopManager {
  constructor() {
    this.sessions = new Map();
    this.isRunning = false;
    this.projectsDir = path.join(__dirname, '../../projects');
    
    // Initialize Claude API
    this.claudeAPI = new ClaudeCodeAPI(
      process.env.ANTHROPIC_API_KEY || process.env.CLAUDE_CODE_API_KEY
    );
    
    // Check if we have valid API key
    this.hasValidApiKey = !!(process.env.ANTHROPIC_API_KEY || process.env.CLAUDE_CODE_API_KEY);
    this.useMockMode = !this.hasValidApiKey;
    
    if (this.useMockMode) {
      logger.warn('InfiniteLoopManager: No valid API key found, running in mock mode');
    } else {
      logger.info('InfiniteLoopManager: Initialized with Claude API');
    }
  }

  // Test Claude connection
  async testClaudeConnection() {
    console.log('Testing Claude connection...');
    
    if (!this.hasValidApiKey) {
      return {
        success: false,
        message: 'No API key configured. Add ANTHROPIC_API_KEY to your .env file',
        apiStatus: 'missing_key',
        mockMode: true
      };
    }
    
    try {
      // Make actual API test call
      const testResult = await this.claudeAPI.healthCheck();
      
      return {
        success: testResult.status === 'healthy',
        message: testResult.response || 'Claude API is ready',
        apiStatus: testResult.status,
        mockMode: false,
        timestamp: testResult.timestamp
      };
    } catch (error) {
      logger.error('Claude connection test failed:', error);
      return {
        success: false,
        message: `API test failed: ${error.message}`,
        apiStatus: 'error',
        mockMode: this.useMockMode,
        error: error.message
      };
    }
  }

  // Start an infinite loop session
  async startInfiniteLoop(command) {
    const sessionId = `infinite-${Date.now()}`;
    const projectPath = path.join(this.projectsDir, sessionId);
    
    // Create project directory
    await fs.mkdir(projectPath, { recursive: true });
    
    const session = {
      id: sessionId,
      command,
      status: 'running',
      startTime: new Date(),
      projectPath,
      waves: [],
      currentWave: 0,
      totalGenerated: 0,
      process: null,
      buffer: '',
      isExecuting: false
    };
    
    this.sessions.set(sessionId, session);
    console.log('Started infinite loop session:', sessionId, command);
    
    // Start the actual execution
    await this.startExecution(session);
    
    return session;
  }
  
  // Start actual execution with terminal
  async startExecution(session) {
    try {
      session.isExecuting = true;
      
      logger.info(`Starting infinite loop execution: ${session.command}`);
      
      // Parse command for parameters
      const commandParts = session.command.split(' ');
      const spec = commandParts[1] || 'React components';
      const outputDir = commandParts[2] || 'ai-generated-components';
      const count = commandParts[3] || 'infinite';
      
      session.spec = spec;
      session.outputDir = outputDir;
      session.targetCount = count === 'infinite' ? -1 : parseInt(count);
      
      // Initial wave generation
      await this.generateNextWave(session);
      
      // Set up continuous generation for infinite mode
      if (session.targetCount === -1) {
        session.interval = setInterval(async () => {
          if (session.status !== 'running') {
            clearInterval(session.interval);
            return;
          }
          
          await this.generateNextWave(session);
          
        }, 15000); // Generate new wave every 15 seconds
      }
      
    } catch (error) {
      logger.error('Failed to start execution:', error);
      session.status = 'failed';
      session.error = error.message;
    }
  }
  
  // Generate next wave of components
  async generateNextWave(session) {
    try {
      session.currentWave++;
      
      // Emit starting message
      const startOutput = `\n🔄 Wave ${session.currentWave} - Starting generation...\n`;
      session.buffer += startOutput;
      this.emitOutput(session.id, startOutput);
      
      if (this.useMockMode) {
        // Mock mode - simulate generation
        await this.generateMockWave(session);
      } else {
        // Real AI generation
        await this.generateRealWave(session);
      }
      
      // Check if we've reached target count
      if (session.targetCount > 0 && session.totalGenerated >= session.targetCount) {
        session.status = 'completed';
        const completeOutput = `\n✅ Infinite loop completed - Generated ${session.totalGenerated} components\n`;
        session.buffer += completeOutput;
        this.emitOutput(session.id, completeOutput);
        
        if (session.interval) {
          clearInterval(session.interval);
        }
      }
      
    } catch (error) {
      logger.error(`Wave ${session.currentWave} generation failed:`, error);
      const errorOutput = `\n❌ Wave ${session.currentWave} failed: ${error.message}\n`;
      session.buffer += errorOutput;
      this.emitOutput(session.id, errorOutput);
    }
  }
  
  // Generate real components using Claude API
  async generateRealWave(session) {
    const waveNumber = session.currentWave;
    
    try {
      // Create prompt for component generation
      const prompt = `Generate 3 unique React components based on this specification: "${session.spec}"

Requirements:
- Wave number: ${waveNumber}
- Each component should be different and serve a unique purpose
- Use modern React with hooks
- Include TypeScript types
- Add proper comments
- Make them production-ready

For each component, provide:
1. Component name
2. File name (e.g., ComponentName.tsx)
3. Complete component code

Format your response with clear separators between components.`;

      // Call Claude API
      const response = await this.claudeAPI.sendMessage(prompt, {
        model: 'claude-3-sonnet-20240229',
        maxTokens: 3000,
        temperature: 0.8
      });
      
      // Parse components from response
      const components = this.parseComponentsFromResponse(response);
      
      // Write components to files
      const written = await this.writeComponentsToProject(session, components, waveNumber);
      
      // Update session stats
      session.totalGenerated += written;
      session.waves.push({
        waveNumber,
        componentsGenerated: written,
        timestamp: new Date()
      });
      
      // Emit success message
      const output = `\n✅ Wave ${waveNumber} completed - Generated ${written} components using Claude AI\n`;
      components.forEach((comp, idx) => {
        session.buffer += `  ${idx + 1}. ${comp.name} -> ${comp.fileName}\n`;
      });
      session.buffer += output;
      this.emitOutput(session.id, output);
      
    } catch (error) {
      throw new Error(`AI generation failed: ${error.message}`);
    }
  }
  
  // Generate mock wave for testing
  async generateMockWave(session) {
    const waveNumber = session.currentWave;
    
    // Mock components
    const mockComponents = [
      {
        name: `Button${waveNumber}`,
        fileName: `Button${waveNumber}.tsx`,
        code: `import React from 'react';\n\ninterface Button${waveNumber}Props {\n  label: string;\n  onClick: () => void;\n}\n\nexport const Button${waveNumber}: React.FC<Button${waveNumber}Props> = ({ label, onClick }) => {\n  return (\n    <button className="wave-${waveNumber}-button" onClick={onClick}>\n      {label}\n    </button>\n  );\n};`
      },
      {
        name: `Card${waveNumber}`,
        fileName: `Card${waveNumber}.tsx`,
        code: `import React from 'react';\n\ninterface Card${waveNumber}Props {\n  title: string;\n  content: string;\n}\n\nexport const Card${waveNumber}: React.FC<Card${waveNumber}Props> = ({ title, content }) => {\n  return (\n    <div className="wave-${waveNumber}-card">\n      <h3>{title}</h3>\n      <p>{content}</p>\n    </div>\n  );\n};`
      }
    ];
    
    // Write mock components
    const written = await this.writeComponentsToProject(session, mockComponents, waveNumber);
    
    // Update session
    session.totalGenerated += written;
    session.waves.push({
      waveNumber,
      componentsGenerated: written,
      timestamp: new Date(),
      mockMode: true
    });
    
    // Emit output
    const output = `\n✅ Wave ${waveNumber} completed - Generated ${written} components (MOCK MODE)\n`;
    session.buffer += output;
    this.emitOutput(session.id, output);
  }
  
  // Emit output to websocket
  emitOutput(sessionId, output) {
    if (global.terminalEmitter) {
      global.terminalEmitter.emit('infinite-output', {
        sessionId,
        output
      });
    }
  }

  // Parse components from Claude's response
  parseComponentsFromResponse(response) {
    const components = [];
    
    try {
      // Look for component blocks in the response
      // Pattern 1: Component name followed by code block
      const componentPattern = /(?:Component|File):\s*(\w+\.tsx?)\s*\n```(?:typescript|tsx|jsx|javascript)?\n([\s\S]*?)```/gi;
      let match;
      
      while ((match = componentPattern.exec(response)) !== null) {
        const fileName = match[1];
        const code = match[2].trim();
        const name = fileName.replace(/\.(tsx?|jsx?)$/, '');
        
        components.push({
          name,
          fileName,
          code
        });
      }
      
      // Pattern 2: If no matches, try to find any code blocks
      if (components.length === 0) {
        const codeBlockPattern = /```(?:typescript|tsx|jsx|javascript)?\n([\s\S]*?)```/g;
        let blockIndex = 0;
        
        while ((match = codeBlockPattern.exec(response)) !== null) {
          const code = match[1].trim();
          
          // Try to extract component name from the code
          const nameMatch = code.match(/(?:export\s+)?(?:const|function|class)\s+(\w+)/);
          const name = nameMatch ? nameMatch[1] : `Component${blockIndex + 1}`;
          
          components.push({
            name,
            fileName: `${name}.tsx`,
            code
          });
          
          blockIndex++;
        }
      }
      
      logger.info(`Parsed ${components.length} components from AI response`);
      
    } catch (error) {
      logger.error('Error parsing components:', error);
    }
    
    return components;
  }
  
  // Write components to project directory
  async writeComponentsToProject(session, components, waveNumber) {
    try {
      const waveDir = path.join(session.projectPath, session.outputDir || 'components', `wave-${waveNumber}`);
      await fs.mkdir(waveDir, { recursive: true });
      
      let writtenCount = 0;
      
      for (const component of components) {
        const filePath = path.join(waveDir, component.fileName);
        await fs.writeFile(filePath, component.code, 'utf8');
        writtenCount++;
        
        logger.info(`📝 Wrote component: ${filePath}`);
      }
      
      logger.info(`📁 Wrote ${writtenCount} components to ${waveDir}`);
      return writtenCount;
      
    } catch (error) {
      logger.error('Failed to write components:', error);
      return 0;
    }
  }

  // Get session status
  getSessionStatus(sessionId) {
    return this.sessions.get(sessionId);
  }

  // Stop a session
  stopSession(sessionId) {
    const session = this.sessions.get(sessionId);
    if (session) {
      session.status = 'stopped';
      session.endTime = new Date();
      
      // Clear interval if running
      if (session.interval) {
        clearInterval(session.interval);
        session.interval = null;
      }
      
      // Kill process if running
      if (session.process && !session.process.killed) {
        session.process.kill();
      }
      
      const output = `\n🛑 Infinite loop session stopped\n`;
      session.buffer += output;
      
      // Emit stop notification
      if (global.terminalEmitter) {
        global.terminalEmitter.emit('infinite-output', {
          sessionId: session.id,
          output: output
        });
      }
      
      return session;
    }
    return null;
  }

  // List active sessions
  listActiveSessions() {
    return Array.from(this.sessions.values())
      .filter(session => session.status === 'running')
      .map(session => ({
        id: session.id,
        command: session.command,
        startTime: session.startTime,
        currentWave: session.currentWave,
        totalGenerated: session.totalGenerated
      }));
  }

  // Legacy methods for compatibility
  createLoop(config) {
    console.log('Creating infinite loop:', config);
    return { id: Date.now(), status: 'running' };
  }

  stopLoop(id) {
    console.log('Stopping loop:', id);
    return true;
  }

  getLoops() {
    return this.listActiveSessions();
  }
}

module.exports = InfiniteLoopManager;