# Getting Started with Coder1 Platform

## Prerequisites

- Node.js 18.x or higher
- npm or yarn
- Git

## Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/michaelkraft/autonomous_vibe_interface.git
   cd autonomous_vibe_interface
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Set up environment variables:**
   ```bash
   cp .env.example .env
   ```

## Setting Up Claude AI Integration

The Coder1 Platform uses Claude AI for intelligent code generation. You need an Anthropic API key to enable AI features.

### Getting an Anthropic API Key

1. **Visit the Anthropic Console:**
   - Go to https://console.anthropic.com/
   - Click "Sign Up" if you don't have an account

2. **Create an Account:**
   - Use your email to sign up
   - Verify your email address
   - Complete the onboarding process

3. **Generate an API Key:**
   - Navigate to the "API Keys" section
   - Click "Create Key"
   - Give your key a name (e.g., "Coder1 Platform")
   - Copy the generated key (starts with `sk-ant-api03-...`)

4. **Add to Environment:**
   - Open `.env` file in your project
   - Replace the placeholder with your key:
     ```
     ANTHROPIC_API_KEY=sk-ant-api03-your-actual-key-here
     ```

### Pricing Information

- Anthropic uses pay-per-token pricing
- Claude 3 Haiku: ~$0.25 per million input tokens
- Claude 3 Sonnet: ~$3 per million input tokens
- Claude 3 Opus: ~$15 per million input tokens
- See current pricing at: https://www.anthropic.com/pricing

## Running the Application

1. **Start the development server:**
   ```bash
   npm run dev
   ```

2. **Access the application:**
   - Main interface: http://localhost:3000
   - Smart PRD Generator: http://localhost:3000/
   - IDE Interface: http://localhost:3000/ide
   - Platform Homepage: http://localhost:3000/platform

3. **Test the setup:**
   ```bash
   # Test Claude API connection
   node test-claude-api.js
   
   # Check server health
   curl http://localhost:3000/health
   ```

## Features Overview

### Smart PRD Generator
- AI-powered requirement gathering
- Interactive questioning system
- Automated PRD generation
- Multiple expert persona consultations

### WebSocket Streaming
- Real-time AI response streaming
- Demo available at: http://localhost:3000/static/streaming-demo.html

### Terminal Commands
- Claude Code-like terminal interface
- Commands: `/ui`, `/create`, `/generate`, `/fix`, `/explain`
- Type `/help` in the terminal for full command list

## Troubleshooting

### Invalid API Key Error
If you see "invalid x-api-key" errors:
1. Verify your API key starts with `sk-ant-api03-`
2. Check there are no extra spaces or quotes
3. Ensure the key hasn't expired
4. Try generating a new key

### Port Already in Use
If port 3000 is busy:
```bash
# Find and kill the process
lsof -i :3000
kill -9 <PID>

# Or use a different port
PORT=3001 npm start
```

### Claude API Not Working
The system includes fallback mock data when the API is unavailable. To verify real AI is working:
1. Check the console logs for "🚀 Generating PRD with Claude"
2. Look for "aiGenerated: true" in API responses
3. Run the test script: `node test-claude-api.js`

## Production Deployment

The application auto-deploys to Render from the main branch:
- Production URL: https://coder1-platform.onrender.com
- Deployment status: Check GitHub Actions

## Support

- GitHub Issues: https://github.com/michaelkraft/autonomous_vibe_interface/issues
- Documentation: `/docs` directory
- CLAUDE.md: Project-specific AI instructions