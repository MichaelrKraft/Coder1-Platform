# Coder1 IDE Source

A React-based IDE component built with TypeScript that provides a modern development environment with file exploration, code editing, and real-time collaboration features. This is the source code for the React IDE component that gets built and deployed to the main Coder1 Platform.

## Features

- **File Explorer**: Visual file and folder navigation with expand/collapse functionality
- **Code Editor**: Syntax highlighting and intelligent code completion
- **Real-time Collaboration**: Multi-user editing with conflict resolution
- **Hivemind Dashboard**: AI-powered development insights and suggestions
- **Preview Panel**: Live preview of web applications and components
- **Socket.io Integration**: Real-time communication between IDE instances

## Architecture

This IDE is built as a standalone React application that:
- Compiles to static assets in the `build/` directory
- Gets deployed to the main Coder1 Platform at `/ide-build/`
- Integrates with the backend Express.js server via WebSocket connections
- Provides a modern VS Code-like interface for web development

## Prerequisites

- Node.js 18+ (check with `node --version`)
- npm 9+ or yarn 3+
- TypeScript 4.9+

### macOS Users - Important Note
Due to known Node.js connectivity issues on macOS, if you encounter server connection problems:
```bash
# Use specific port binding
PORT=3001 npm start

# Or use Python server for static testing
npm run build && python3 -m http.server 3001 --bind 127.0.0.1 --directory build
```

## Quick Start

1. **Navigate to the IDE source directory**:
   ```bash
   cd coder1-ide-source
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Start development server**:
   ```bash
   npm start
   ```

4. **Open in browser**:
   - Development: http://localhost:3000
   - Or with port override: http://localhost:3001

5. **Verify setup**:
   - You should see the IDE interface with Explorer, Editor, and Preview panels
   - Check browser console for any connection errors

## Development Commands

### Core Development
```bash
# Start development server with hot reload
npm start

# Build for production (outputs to build/ directory)
npm run build

# Run test suite
npm test

# Run tests in watch mode
npm run test -- --watch

# Build and verify production bundle
npm run build && serve -s build -l 3001
```

### Building for Production
```bash
# Create optimized production build
npm run build

# The build artifacts will be in the build/ directory
# These files are then copied to ../ide-build/ in the main platform
```

## Project Structure

```
coder1-ide-source/
├── public/                 # Static assets and HTML template
│   ├── index.html         # Main HTML template
│   └── favicon.ico        # App icon
├── src/                   # Source code
│   ├── components/        # React components
│   │   ├── Explorer.tsx   # File explorer component
│   │   ├── Preview.tsx    # Code preview panel
│   │   ├── Sidebar.tsx    # Navigation sidebar
│   │   └── HivemindDashboard.tsx  # AI collaboration dashboard
│   ├── utils/             # Utility functions
│   │   └── api.ts         # API client for backend communication
│   ├── App.tsx            # Main application component
│   ├── index.tsx          # Application entry point
│   └── index.css          # Global styles
├── build/                 # Production build output (generated)
└── package.json           # Dependencies and scripts
```

## Component Overview

### Explorer Component (`src/components/Explorer.tsx`)
- File and folder tree visualization
- Expandable/collapsible directory structure
- File type icons and syntax highlighting

### Preview Component (`src/components/Preview.tsx`)
- Live preview of HTML/CSS/JavaScript
- Responsive design testing
- Error display and debugging information

### Hivemind Dashboard (`src/components/HivemindDashboard.tsx`)
- AI-powered development suggestions
- Real-time collaboration metrics
- Code quality insights and recommendations

### Sidebar (`src/components/Sidebar.tsx`)
- Navigation between different IDE panels
- Tool and feature shortcuts
- Settings and configuration access

## API Integration

The IDE communicates with the backend server through:

### WebSocket Connection
```typescript
// Real-time collaboration and live updates
const socket = io('ws://localhost:3000');

socket.on('code-change', (data) => {
  // Handle real-time code updates
});

socket.emit('join-session', { sessionId, userId });
```

### REST API Calls
```typescript
// File operations and project management
import { apiClient } from './utils/api';

// Save file
await apiClient.post('/api/files/save', {
  path: '/src/App.tsx',
  content: sourceCode
});

// Load project
const project = await apiClient.get('/api/projects/123');
```

## Environment Variables

Create a `.env` file in the root directory:

```bash
# Backend API URL
REACT_APP_API_URL=http://localhost:3000

# WebSocket server URL
REACT_APP_WS_URL=ws://localhost:3000

# Enable development features
REACT_APP_DEBUG=true

# IDE configuration
REACT_APP_IDE_THEME=dark
REACT_APP_ENABLE_COLLABORATION=true
```

## Testing

### Running Tests
```bash
# Run all tests
npm test

# Run tests in watch mode
npm run test -- --watch

# Run tests with coverage
npm run test -- --coverage

# Run specific test file
npm test -- Explorer.test.tsx
```

### Test Structure
```
src/
├── components/
│   ├── Explorer.test.tsx
│   ├── Preview.test.tsx
│   └── HivemindDashboard.test.tsx
├── utils/
│   └── api.test.ts
└── App.test.tsx
```

## Build Process

### Development Build
```bash
npm start
# - Starts development server with hot reload
# - Source maps enabled for debugging
# - Error overlay for quick issue resolution
```

### Production Build
```bash
npm run build
# - Creates optimized bundle in build/ directory
# - Minifies code and assets
# - Generates cache-friendly filenames with hashes
# - Outputs build stats and bundle analysis
```

### Deployment to Main Platform
```bash
# After building, files are copied to the main platform
cd ..
cp -r coder1-ide-source/build/* ide-build/
# ⚠️ WARNING: The ide-build/ directory contains working production code
# See main platform CLAUDE.md for critical deployment warnings
```

## Troubleshooting

### Development Server Won't Start
**Problem**: `npm start` fails or shows port conflicts
**Solution**:
```bash
# Clear node modules and reinstall
rm -rf node_modules package-lock.json
npm install

# Use different port
PORT=3001 npm start

# Check for port conflicts
lsof -ti:3000 | xargs kill -9
```

### Build Failures
**Problem**: `npm run build` fails with TypeScript errors
**Solution**:
```bash
# Check TypeScript configuration
npx tsc --noEmit

# Fix common issues
npm install --save-dev @types/react @types/react-dom

# Clean build cache
rm -rf build/ node_modules/.cache/
```

### WebSocket Connection Issues
**Problem**: Real-time features not working
**Solution**:
1. Verify backend server is running on correct port
2. Check REACT_APP_WS_URL environment variable
3. Ensure firewall allows WebSocket connections
4. Test with: `wscat -c ws://localhost:3000`

### Hot Reload Not Working
**Problem**: Changes not reflected immediately
**Solution**:
```bash
# Restart development server
npm start

# Clear browser cache and service workers
# In DevTools: Application > Storage > Clear Storage

# Check for file system watching issues
echo fs.inotify.max_user_watches=524288 | sudo tee -a /etc/sysctl.conf
sudo sysctl -p
```

### Memory Issues During Build
**Problem**: Build process runs out of memory
**Solution**:
```bash
# Increase Node.js memory limit
NODE_OPTIONS="--max-old-space-size=4096" npm run build

# Or use alternative build approach
npm run build -- --max_old_space_size=4096
```

### Component Import Errors
**Problem**: Module resolution failures
**Solution**:
1. Check file paths and naming conventions
2. Verify TypeScript path mapping in `tsconfig.json`
3. Ensure all dependencies are installed
4. Clear TypeScript cache: `rm -rf node_modules/.cache/`

## Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/ide-enhancement`
3. Make your changes and add tests
4. Run the test suite: `npm test`
5. Build and verify: `npm run build`
6. Commit your changes: `git commit -m 'Add IDE enhancement'`
7. Push to the branch: `git push origin feature/ide-enhancement`
8. Open a Pull Request

## Related Projects

- [Coder1 Platform](../) - Main platform that hosts this IDE
- [Autonomous Vibe Interface](../../autonomous_vibe_interface/) - AI coding assistant
- [Browser Testing Framework](../../browser-testing-framework/) - Automated testing

## Support

For issues specific to the IDE component:
- Check the troubleshooting section above
- Review the main platform CLAUDE.md for deployment guidelines
- Test in both development and production builds
- Verify WebSocket connectivity to the backend server
