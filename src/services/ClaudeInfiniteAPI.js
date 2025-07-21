import fs from 'fs/promises';
import path from 'path';

class ClaudeInfiniteAPI {
  constructor() {
    this.apiKey = process.env.ANTHROPIC_API_KEY;
    this.baseURL = 'https://api.anthropic.com/v1/messages';
    this.model = 'claude-3-sonnet-20240229';
    
    if (!this.apiKey) {
      console.warn('⚠️ ANTHROPIC_API_KEY not found. Running in simulation mode.');
    }
  }

  async sendMessage(prompt, maxTokens = 4000) {
    if (!this.apiKey) {
      throw new Error('Claude API key not configured');
    }

    try {
      const response = await fetch(this.baseURL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': this.apiKey,
          'anthropic-version': '2023-06-01'
        },
        body: JSON.stringify({
          model: this.model,
          max_tokens: maxTokens,
          messages: [
            {
              role: 'user',
              content: prompt
            }
          ]
        })
      });

      if (!response.ok) {
        const errorData = await response.text();
        throw new Error(`Claude API Error ${response.status}: ${errorData}`);
      }

      const data = await response.json();
      return data.content[0].text;
    } catch (error) {
      console.error('Claude API Error:', error);
      throw error;
    }
  }

  async processInfinitePrompt(specPath, outputDirectory, count, iterationNumber) {
    try {
      // Read the infinite prompt template
      const infinitePromptPath = path.join(process.cwd(), 'coder1-ide', 'infinite.md');
      const promptTemplate = await fs.readFile(infinitePromptPath, 'utf8');
      
      // Read the spec file
      const specContent = await fs.readFile(specPath, 'utf8');
      
      // Create the sub-agent prompt
      const subAgentPrompt = `${promptTemplate}

## Current Task
You are sub-agent working on iteration ${iterationNumber} of the infinite agentic loop.

Spec Content:
${specContent}

Output Directory: ${outputDirectory}
Iteration Number: ${iterationNumber}
Count Setting: ${count}

## Instructions for this iteration:
1. Read and understand the spec requirements
2. Generate a complete, self-contained HTML file
3. Make it unique from previous iterations (theme, functionality, design)
4. Include all CSS, JavaScript, and HTML in a single file
5. Make it functionally complete and visually distinct
6. Use iteration number in the filename as specified in the spec

Generate the complete HTML file content now. Start with <!DOCTYPE html> and end with </html>. Make it production-ready and fully functional.`;

      console.log(`🤖 Sending iteration ${iterationNumber} to Claude API...`);
      const response = await this.sendMessage(subAgentPrompt, 4000);
      
      return {
        iterationNumber,
        content: response,
        success: true
      };
      
    } catch (error) {
      console.error(`❌ Error processing iteration ${iterationNumber}:`, error);
      return {
        iterationNumber,
        content: null,
        success: false,
        error: error.message
      };
    }
  }

  async generateWave(specPath, outputDirectory, count, waveNumber) {
    const iterationStart = (waveNumber - 1) * 5 + 1;
    const iterationEnd = waveNumber * 5;
    
    console.log(`🌊 Starting Wave ${waveNumber} (Iterations ${iterationStart}-${iterationEnd})`);
    
    // Create parallel promises for 5 agents
    const agentPromises = [];
    for (let i = iterationStart; i <= iterationEnd; i++) {
      agentPromises.push(this.processInfinitePrompt(specPath, outputDirectory, count, i));
    }
    
    try {
      const results = await Promise.all(agentPromises);
      
      // Process and save the results
      const savedFiles = [];
      for (const result of results) {
        if (result.success && result.content) {
          try {
            const filename = await this.saveGeneratedFile(result.content, result.iterationNumber, outputDirectory);
            savedFiles.push({
              iteration: result.iterationNumber,
              filename,
              success: true
            });
            console.log(`✅ Saved iteration ${result.iterationNumber}: ${filename}`);
          } catch (saveError) {
            console.error(`❌ Failed to save iteration ${result.iterationNumber}:`, saveError);
            savedFiles.push({
              iteration: result.iterationNumber,
              filename: null,
              success: false,
              error: saveError.message
            });
          }
        } else {
          savedFiles.push({
            iteration: result.iterationNumber,
            filename: null,
            success: false,
            error: result.error || 'Unknown error'
          });
        }
      }
      
      return {
        waveNumber,
        iterationRange: `${iterationStart}-${iterationEnd}`,
        results: savedFiles,
        successCount: savedFiles.filter(f => f.success).length,
        totalCount: savedFiles.length
      };
      
    } catch (error) {
      console.error(`❌ Wave ${waveNumber} failed:`, error);
      throw error;
    }
  }

  async saveGeneratedFile(content, iterationNumber, outputDirectory) {
    try {
      // Ensure output directory exists
      await fs.mkdir(outputDirectory, { recursive: true });
      
      // Extract filename from content or generate one
      let filename = this.extractFilename(content, iterationNumber);
      
      if (!filename) {
        // Generate a default filename
        filename = `${iterationNumber.toString().padStart(2, '0')}_generated_ui.html`;
      }
      
      const filepath = path.join(outputDirectory, filename);
      
      // Clean the content (remove any markdown formatting if present)
      const cleanContent = this.cleanGeneratedContent(content);
      
      // Write the file
      await fs.writeFile(filepath, cleanContent, 'utf8');
      
      return filename;
    } catch (error) {
      console.error('Error saving file:', error);
      throw error;
    }
  }

  extractFilename(content, iterationNumber) {
    // Try to extract filename from HTML title or content
    const titleMatch = content.match(/<title>(.*?)<\/title>/i);
    if (titleMatch) {
      const title = titleMatch[1]
        .toLowerCase()
        .replace(/[^a-z0-9\s]/g, '')
        .replace(/\s+/g, '_')
        .substring(0, 30);
      return `${iterationNumber.toString().padStart(2, '0')}_${title}_ui.html`;
    }
    
    // Look for theme keywords in the content
    const themes = ['neural', 'cyber', 'quantum', 'bio', 'matrix', 'hologram', 'plasma', 'crystal'];
    for (const theme of themes) {
      if (content.toLowerCase().includes(theme)) {
        return `${iterationNumber.toString().padStart(2, '0')}_${theme}_ui.html`;
      }
    }
    
    return null;
  }

  cleanGeneratedContent(content) {
    // Remove markdown code blocks if present
    let cleaned = content.replace(/```html\s*/gi, '').replace(/```\s*$/g, '');
    
    // Ensure it starts with DOCTYPE
    if (!cleaned.trim().toLowerCase().startsWith('<!doctype')) {
      if (cleaned.trim().toLowerCase().startsWith('<html')) {
        cleaned = '<!DOCTYPE html>\n' + cleaned;
      }
    }
    
    return cleaned.trim();
  }

  async testConnection() {
    if (!this.apiKey) {
      return { success: false, error: 'No API key configured' };
    }
    
    try {
      const response = await this.sendMessage('Hello, are you working?', 100);
      return { 
        success: true, 
        message: 'Claude API connection successful',
        response: response.substring(0, 100)
      };
    } catch (error) {
      return { 
        success: false, 
        error: error.message 
      };
    }
  }
}

export default ClaudeInfiniteAPI;