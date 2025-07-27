# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Mandatory Development Workflow

**IMPORTANT: Follow these rules for EVERY coding task:**

1. **First think through the problem**, read the codebase for relevant files, and write a plan to `tasks/todo.md`.

2. **The plan should have a list of todo items** that you can check off as you complete them.

3. **Before you begin working, check in with me** and I will verify the plan.

4. **Then, begin working on the todo items**, marking them as complete as you go.

5. **Please every step of the way just give me a high level explanation** of what changes you made.

6. **Make every task and code change you do as simple as possible**. We want to avoid making any massive or complex changes. Every change should impact as little code as possible. Everything is about simplicity.

7. **Finally, add a review section** to the `todo.md` file with a summary of the changes you made and any other relevant information.

8. **DO NOT BE LAZY. NEVER BE LAZY.** IF THERE IS A BUG FIND THE ROOT CAUSE AND FIX IT. NO TEMPORARY FIXES. YOU ARE A SENIOR DEVELOPER. NEVER BE LAZY.

9. **MAKE ALL FIXES AND CODE CHANGES AS SIMPLE AS HUMANLY POSSIBLE.** THEY SHOULD ONLY IMPACT NECESSARY CODE RELEVANT TO THE TASK AND NOTHING ELSE. IT SHOULD IMPACT AS LITTLE CODE AS POSSIBLE. YOUR GOAL IS TO NOT INTRODUCE ANY BUGS. IT'S ALL ABOUT SIMPLICITY.

## ⚠️ CRITICAL: IDE Build Directory - DO NOT MODIFY

**The `ide-build/` directory contains the WORKING production IDE and must NOT be modified directly.**

### Important Context (2025-01-24):
- The IDE in `ide-build/` is the working version with all features (terminal buttons, logo, settings, etc.)
- This was restored from commit `f4bd7dd` after previous attempts to "fix" it actually broke it
- The IDE uses specific files: `main.5c128812.css` and `main.a1cfdcd5.js` 
- It includes many custom scripts for UI enhancements, logos, and terminal features

### DO NOT:
- ❌ Replace `ide-build/index.html` with a basic React build
- ❌ Delete or modify the custom scripts in `ide-build/static/`
- ❌ Try to "clean up" or "simplify" the IDE build
- ❌ Copy files from `coder1-ide-source/build/` directly to `ide-build/`

### DO:
- ✅ If the IDE appears broken, check git history before making changes
- ✅ The working IDE is deployed at: https://michaelrkraft.github.io/Coder1-Platform/ide-build/
- ✅ If you need to modify the IDE, work in `coder1-ide-source/` and build properly
- ✅ Always preserve the custom scripts and enhancements in the production build

## Development Commands

### ⚠️ CRITICAL NETWORKING ISSUE - READ THIS FIRST

**Node.js Server Connectivity Problem (Discovered 2025-01-23):**
- Node.js/Express servers show "running" but are NOT accessible via browser
- Issue affects ALL Node.js servers (Express, basic HTTP, etc.) 
- Python HTTP server works perfectly on same ports
- **Root Cause**: Unknown - possibly macOS Security/Firewall blocking Node.js network access

**WORKING SOLUTION - Use Python HTTP Server for Testing:**
```bash
# Kill any Node processes first
pkill -f node

# Start Python server (WORKS)
python3 -m http.server 8892 --bind 127.0.0.1

# Test URLs that WORK:
# SmartPRD Voice: http://127.0.0.1:8892/smart-prd-generator.html
# Terminal Voice: http://127.0.0.1:8892/ide-build/index.html
# Health Check: http://127.0.0.1:8892/static/ (file listing)
```

**Voice Integration Status:** ✅ COMPLETE - All files created and included in HTML
- Terminal voice: `/ide-build/static/terminal-voice.js` + `.css` 
- SmartPRD voice: `/static/smart-prd-voice.js`
- Backend routes: `/src/routes/voice.js` (not needed for frontend-only testing)

### Core Application (May Not Work - See Above)
```bash
# Start production server
npm start

# Start development server with auto-reload
npm run dev

# Build (deployment preparation)
npm run build
```

### React IDE Component
```bash
# Build React IDE from source (when needed)
cd coder1-ide-source
npm run build
# Built files are copied to /ide-build/ directory
```

## High-Level Architecture

### Multi-Interface Platform Structure
This is a Node.js/Express platform serving multiple AI-powered interfaces:

**Primary Interface:** Smart PRD & Wireframe Generator (`smart-prd-generator.html`)
- 7-step wizard for product requirements documentation
- AI persona consultation system
- Real-time wireframe generation
- Version management and iteration planning

**Secondary Interface:** React IDE Component (`ide-react.html`)
- Advanced React-based code editor
- Built from `/coder1-ide-source/` TypeScript project
- Compiled artifacts in `/ide-build/` directory

### Core System Components

**Backend API Layer (`src/app-simple.js`)**
- Express server with modular route loading
- RESTful endpoints for PRD generation, personas, wireframes
- Mock data services for development/demo
- Event-driven terminal emitter for real-time communication

**Frontend Controller (`static/product-creation-hub.js`)**
- Main JavaScript class managing wizard state
- Session management and question/answer flow
- Modal system for expert consultations and version control
- Analytics integration and progress tracking

**Routing Strategy**
- `/` → Smart PRD Generator (main interface)
- `/ide` → React IDE Component
- `/api/*` → Backend services (PRD, personas, wireframes, etc.)
- `/static/*` → Static assets and standalone components

### State Management Architecture

**Session-Based Workflow**
- Each user session generates unique ID for tracking
- Progressive question/answer collection (exactly 5 questions)
- State persistence through `ProductCreationHub` singleton
- Mock implementations for AI services (development/demo mode)

**Modal Management System**
- Separate tab systems for different modals (consultation vs version management)
- Event delegation to prevent tab conflicts
- Dynamic content loading based on tab selection

### API Services Architecture

**Core Endpoints**
- `POST /api/generate-prd` - Creates comprehensive PRD from Q&A
- `GET /api/personas/available` - Returns AI expert personas
- `POST /api/consultation/analyze` - Multi-persona project analysis
- `POST /api/wireframes/generate` - Generates HTML wireframes
- `GET /api/market-insights/:id` - Market analysis data
- `GET /api/intelligence/:id` - AI recommendations

**Modular Route Loading**
The system dynamically loads route modules with error handling:
- Infinite loop AI agents (`/api/infinite`)
- Hivemind collaboration (`/api/hivemind`) 
- Parallel agents (`/api/parallel-agents`)
- Voice interface (`/api/voice`)

### Frontend Architecture Patterns

**Wizard State Management**
- 7-step progression with visual indicators
- Each step has distinct UI state (active/completed/future)
- Progress tracking with percentage and text updates
- Button state management (enabled/disabled based on completion)

**Real-time UI Updates**
- DOM manipulation for dynamic content injection
- CSS class-based state changes (opacity, borders, backgrounds)
- Event-driven updates for success accelerators and metrics

**Modal System Design**
- Overlay-based modal containers
- Tab-based content organization within modals
- Scoped event listeners to prevent cross-modal interference
- Dynamic content population from API responses

## Key Development Considerations

### File Organization
- Main application files are in root directory (`smart-prd-generator.html`, `homepage.html`)
- Backend logic in `/src/` directory with modular routes
- Static assets in `/static/` with organized CSS/JS structure
- React IDE source in `/coder1-ide-source/` with TypeScript

### Error Handling Strategy
- Try-catch blocks around all route loading attempts
- Graceful degradation when optional modules fail to load
- Console logging with emoji indicators for status visibility
- Mock fallbacks for AI service failures

### Session and State Persistence
- In-memory session management (no database required)
- Project metadata stored in `/projects/` directory as JSON
- State reconstruction from session data on page reload
- Event emitter pattern for real-time terminal communication

### API Response Patterns
All API endpoints follow consistent response structure:
```javascript
{
  success: boolean,
  [dataKey]: { /* response data */ },
  metadata?: { /* timestamps, IDs, etc. */ }
}
```

### CSS Architecture
- Glassmorphism design system with consistent variables
- Dark theme with purple accent colors (`--accent-primary: #8b5cf6`)
- Responsive grid layouts for wizard steps and accelerator panels
- Animation-based state transitions (opacity, transforms)

## Current Project Goals (January 2024)

### Immediate Goal: Personal Use Setup ✅ COMPLETE
- Configure platform for personal development use
- Leverage Claude Code Max subscription
- Create efficient workflow for landing pages, web apps, and full-stack projects
- Implement auto-git commits and project organization

### Long-term Goal: Commercial Deployment
- Transform into SaaS platform with authentication and billing
- Target individual developers, small teams, and agencies
- Achieve $500K ARR in Year 1

## Work Completed So Far

### Personal Setup (January 26, 2024) ✅
1. **Electron Wrapper** - Created electron-main.js to bypass Node.js/macOS networking issue
2. **Claude Code Max Integration** - Configured API keys and model preferences
3. **Git Auto-commit System** - Built GitManager service for automatic version control
4. **Project Organization** - Set up ~/Documents/Coder1Projects/ directory structure
5. **Terminal Shortcuts** - Added /landing, /webapp, /fullstack commands
6. **Package.json Updates** - Configured for Electron app with proper scripts

### Core Platform Features ✅
- Smart PRD Generator with 7-step wizard
- AI-powered question generation and consultation
- Multiple AI personas for expert consultation
- Wireframe generation
- Infinite Loop agent (real implementation ready)
- Parallel Agents for multi-task coordination
- WebSocket streaming infrastructure

## Next Steps to Tackle

### 1. Smart Todo List Implementation (Priority: HIGH)
- Implement based on SMART_TODO_LIST_PLAN.md
- Simple UI in terminal for task management
- Auto-generation from complex commands
- "Run All" execution feature

### 2. Project Templates (Priority: MEDIUM)
- Create starter templates for landing pages
- React app boilerplate with best practices
- Full-stack template with auth and database

### 3. Enhanced Export Features (Priority: LOW)
- PDF export for PRDs
- ZIP download for entire projects
- GitHub integration for direct push

## Important Context and Decisions

### Technical Decisions
1. **Electron over Node.js** - Due to macOS networking issue, Electron wrapper provides reliable local development
2. **Claude Code Max** - Using Opus for complex tasks, Sonnet for simpler generations
3. **Git-first Approach** - Every AI generation is automatically committed for full history
4. **Project Naming** - Date-based format: YYYY-MM-DD-project-name

### Architecture Decisions
1. **Modular Route System** - Each feature is a separate route file for easy maintenance
2. **Mock Mode Fallback** - All AI features gracefully degrade without API keys
3. **Session-based Storage** - Projects stored as JSON files, no database dependency
4. **WebSocket Ready** - Infrastructure in place for real-time streaming

### Configuration Context
- API Keys stored in .env (gitignored)
- Projects saved to ~/Documents/Coder1Projects/
- Electron app configured for macOS
- All AI models use Claude Code API

### Current Blockers
1. Node.js servers don't work on macOS (solved with Electron)
2. Some IDE special views were broken (v4 is working)
3. Todo system not yet visible in UI (next priority)

### Recent Changes (January 26, 2024)
- Added comprehensive personal setup
- Configured git auto-commits
- Created terminal shortcuts
- Set up Electron wrapper
- Updated command parser with new commands

## Global Auto-Commit Hook (January 27, 2025)
This project now uses a global Claude Code auto-commit hook that automatically commits and pushes changes to GitHub after successful file edits. The hook is configured in `~/.claude/settings.json` and works across all git repositories.