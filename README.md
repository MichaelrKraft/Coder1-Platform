# 🚀 Coder1 Platform - Complete Autonomous Coding Environment

A sophisticated dual-mode autonomous coding platform that bridges natural language requirements with executable code through AI-powered workflows.

## 🌟 Features

### Smart PRD Generator
- **AI-Powered Requirements Analysis** - Transform ideas into detailed specifications
- **Expert Consultation System** - Multi-persona AI consultations (Technical Architect, UX Designer, etc.)
- **Automated Wireframe Generation** - Create UI/UX designs from requirements
- **Project Management** - Version control and export capabilities

### Coder1 IDE Integration
- **Parallel Agentic Coding** - Multiple Claude agents working simultaneously
- **Infinite Loop Generation** - Unlimited UI component creation
- **21st.dev Magic Integration** - AI-powered React component generation
- **Real-time Monitoring** - Execution tracking and results comparison

## 🚀 Quick Deploy

### Deploy to Render
1. Connect this repository to Render
2. Set environment variables:
   - `ANTHROPIC_API_KEY` - Your Claude API key
   - `NODE_ENV` - `production`
3. Deploy with default Node.js settings

### Deploy to Railway
1. Connect repository to Railway
2. Add same environment variables
3. Deploy automatically

## 🛠️ Local Development

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Production mode
npm start
```

## 📋 Environment Variables

Required:
- `ANTHROPIC_API_KEY` - Claude API access
- `NODE_ENV` - Environment setting

Optional:
- `AIRTOP_API_KEY` - Browser automation
- `MAGIC_21ST_API_KEY` - 21st.dev Magic integration

## 🎯 API Endpoints

- `GET /` - Smart PRD Generator interface
- `GET /health` - Server health check
- `POST /api/agent/analyze-requirements` - Generate intelligent questions
- `POST /api/agent/generate-enhanced-brief` - Create detailed specifications
- `GET /api/project/:projectId` - Retrieve project data

## 🤖 AI-Powered Features

- **Requirements Gathering** - 5-question intelligent analysis
- **Enhanced Brief Generation** - Detailed project specifications
- **Wireframe Creation** - Automated UI/UX design
- **Expert Consultations** - Multi-persona AI guidance

## 📄 License

MIT License - Open source autonomous coding platform.

---

🤖 Generated with Claude Code

Co-Authored-By: Claude <noreply@anthropic.com># Deployment fix Mon Jul 21 08:53:34 MDT 2025
