# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

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