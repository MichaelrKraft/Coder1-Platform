/**
 * GitManager - Automatic git commit system for Coder1 projects
 */

const { spawn } = require('child_process');
const path = require('path');
const fs = require('fs').promises;

class GitManager {
  constructor() {
    this.projectsPath = process.env.PROJECTS_PATH || path.join(require('os').homedir(), 'Documents', 'Coder1Projects');
  }

  /**
   * Execute git command in a specific directory
   */
  async executeGit(projectPath, args) {
    return new Promise((resolve, reject) => {
      const git = spawn('git', args, { cwd: projectPath });
      let output = '';
      let errorOutput = '';

      git.stdout.on('data', (data) => {
        output += data.toString();
      });

      git.stderr.on('data', (data) => {
        errorOutput += data.toString();
      });

      git.on('close', (code) => {
        if (code === 0) {
          resolve(output);
        } else {
          reject(new Error(`Git command failed: ${errorOutput || output}`));
        }
      });
    });
  }

  /**
   * Initialize a new git repository for a project
   */
  async initProject(projectPath, projectName) {
    try {
      // Initialize git repository
      await this.executeGit(projectPath, ['init']);
      console.log(`✅ Initialized git repository for ${projectName}`);

      // Create .gitignore
      const gitignoreContent = `# Dependencies
node_modules/
.pnp
.pnp.js

# Production
build/
dist/

# Environment
.env
.env.local

# IDE
.vscode/
.idea/
*.swp
*.swo

# OS
.DS_Store
Thumbs.db

# Logs
logs/
*.log

# Temporary
tmp/
temp/
`;
      await fs.writeFile(path.join(projectPath, '.gitignore'), gitignoreContent);

      // Make initial commit
      await this.executeGit(projectPath, ['add', '-A']);
      
      const commitMessage = `Initial commit: ${projectName}

🤖 Generated with Coder1 Platform
📅 ${new Date().toISOString()}
🔧 Project Type: ${this.detectProjectType(projectPath)}`;

      await this.executeGit(projectPath, ['commit', '-m', commitMessage]);
      console.log(`✅ Created initial commit for ${projectName}`);

      return { success: true, message: 'Git repository initialized' };
    } catch (error) {
      console.error('❌ Git init error:', error.message);
      return { success: false, error: error.message };
    }
  }

  /**
   * Commit changes to an existing project
   */
  async commitChanges(projectPath, message, details = {}) {
    try {
      // Check if there are changes to commit
      const status = await this.executeGit(projectPath, ['status', '--porcelain']);
      
      if (!status.trim()) {
        console.log('📝 No changes to commit');
        return { success: true, message: 'No changes to commit' };
      }

      // Add all changes
      await this.executeGit(projectPath, ['add', '-A']);

      // Create detailed commit message
      const fullMessage = `${message}

🤖 Auto-committed by Coder1
📅 ${new Date().toISOString()}
${details.component ? `🧩 Component: ${details.component}` : ''}
${details.feature ? `✨ Feature: ${details.feature}` : ''}
${details.aiModel ? `🧠 AI Model: ${details.aiModel}` : ''}
${details.sessionId ? `🔗 Session: ${details.sessionId}` : ''}`;

      await this.executeGit(projectPath, ['commit', '-m', fullMessage]);
      console.log(`✅ Committed changes: ${message}`);

      return { success: true, message: `Committed: ${message}` };
    } catch (error) {
      console.error('❌ Git commit error:', error.message);
      return { success: false, error: error.message };
    }
  }

  /**
   * Auto-commit after AI generation
   */
  async autoCommitGeneration(projectPath, generationType, details) {
    const messages = {
      'component': `Add ${details.count || 1} new component(s)`,
      'landing-page': `Generate landing page structure`,
      'webapp': `Create web application scaffolding`,
      'fullstack': `Set up full-stack application`,
      'feature': `Implement ${details.feature || 'new feature'}`,
      'refactor': `Refactor ${details.target || 'code'}`,
      'test': `Add tests for ${details.target || 'components'}`
    };

    const message = messages[generationType] || `Update project files`;
    
    return await this.commitChanges(projectPath, message, {
      ...details,
      generationType,
      aiModel: process.env.DEFAULT_MODEL || 'claude-3-opus'
    });
  }

  /**
   * Get git history for a project
   */
  async getHistory(projectPath, limit = 10) {
    try {
      const format = '--pretty=format:%H|%an|%ae|%ad|%s';
      const log = await this.executeGit(projectPath, ['log', format, `--max-count=${limit}`]);
      
      const commits = log.trim().split('\n').map(line => {
        const [hash, author, email, date, subject] = line.split('|');
        return { hash, author, email, date, subject };
      });

      return { success: true, commits };
    } catch (error) {
      console.error('❌ Git log error:', error.message);
      return { success: false, error: error.message, commits: [] };
    }
  }

  /**
   * Create a branch for a new feature
   */
  async createFeatureBranch(projectPath, branchName) {
    try {
      const safeBranchName = branchName
        .toLowerCase()
        .replace(/[^a-z0-9-]/g, '-')
        .replace(/-+/g, '-')
        .replace(/^-|-$/g, '');

      await this.executeGit(projectPath, ['checkout', '-b', `feature/${safeBranchName}`]);
      console.log(`✅ Created branch: feature/${safeBranchName}`);

      return { success: true, branch: `feature/${safeBranchName}` };
    } catch (error) {
      console.error('❌ Branch creation error:', error.message);
      return { success: false, error: error.message };
    }
  }

  /**
   * Detect project type based on files
   */
  detectProjectType(projectPath) {
    try {
      const files = require('fs').readdirSync(projectPath);
      
      if (files.includes('package.json')) {
        const pkg = require(path.join(projectPath, 'package.json'));
        if (pkg.dependencies?.next) return 'Next.js Full-Stack';
        if (pkg.dependencies?.react) return 'React Web App';
        if (pkg.dependencies?.express) return 'Express Backend';
      }
      
      if (files.some(f => f.endsWith('.html'))) return 'Landing Page';
      
      return 'Web Project';
    } catch {
      return 'Unknown';
    }
  }

  /**
   * Push to remote repository (if configured)
   */
  async pushToRemote(projectPath, remote = 'origin', branch = 'main') {
    try {
      // Check if remote exists
      const remotes = await this.executeGit(projectPath, ['remote', '-v']);
      
      if (!remotes.includes(remote)) {
        return { success: false, error: 'No remote repository configured' };
      }

      // Push changes
      await this.executeGit(projectPath, ['push', remote, branch]);
      console.log(`✅ Pushed to ${remote}/${branch}`);

      return { success: true, message: `Pushed to ${remote}/${branch}` };
    } catch (error) {
      console.error('❌ Git push error:', error.message);
      return { success: false, error: error.message };
    }
  }
}

// Singleton instance
let gitManager = null;

module.exports = {
  getGitManager: () => {
    if (!gitManager) {
      gitManager = new GitManager();
    }
    return gitManager;
  },
  GitManager
};