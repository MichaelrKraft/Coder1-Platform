# Smart Todo List Feature Plan for CoderOne

## Vision: Simple Vibe Coding Task Management

### Core Concept from User Notes
Just a Smart Todo List - copying what works from Augment Code's implementation.

### 1. Basic Task List (Like TodoWrite tool)
- Shows up in the terminal when AI detects complex request
- Simple text list with checkboxes
- Click to edit task text
- Delete button for each task
- "Run All" button

### 2. The Magic: Auto-Generation
When user types something complex like "build a login system", AI automatically creates:
- □ Create login form component
- □ Add authentication endpoint
- □ Set up session management
- □ Add password hashing
- □ Create user database table

### 3. Manual Control
- Add new tasks with a simple "+" button
- Edit by clicking on the text
- Check off completed tasks
- No drag-and-drop, no dependencies, no kanban boards

### 4. Smart Execution
- Run tasks one at a time
- Show which task is currently running
- Simple pass/fail for each task
- Continue to next task automatically

**Key Philosophy**: No music integration, no flow state detection, no parallel execution. Just:
- AI breaks down big requests into tasks
- User can edit the list
- Click "Run All" to execute

## Implementation Plan

### Phase 1: Backend Infrastructure (Low Risk)
**New File**: `/src/routes/todos.js`
```javascript
// Simple CRUD operations for todos
// GET /api/todos - List all todos
// POST /api/todos - Create new todo
// PUT /api/todos/:id - Update todo
// DELETE /api/todos/:id - Delete todo
// POST /api/todos/run-all - Execute all pending todos
```

**Storage**: JSON files in `/projects/todos/` directory
- Session-based todo lists
- Simple file structure: `{sessionId}-todos.json`

### Phase 2: React UI Components (Controlled Risk)
**New Component**: `/coder1-ide-source/src/components/TodoList.tsx`
- Simple checkbox list UI
- Inline editing capability
- Add/Delete buttons
- "Run All" button with progress indicator

**Sidebar Integration**:
- Add 4th button to Sidebar.tsx: 📋 (Tasks)
- Extend App.tsx state: `activeView: 'explorer' | 'terminal' | 'preview' | 'todos'`

### Phase 3: AI Auto-Generation (Smart Feature)
**Terminal Enhancement**: Update Terminal.tsx
```typescript
// Detect complex commands
const isComplexCommand = (cmd: string) => {
  const complexPatterns = [
    /build .+ system/i,
    /create .+ application/i,
    /implement .+ feature/i,
    /set up .+/i
  ];
  return complexPatterns.some(pattern => pattern.test(cmd));
};

// Auto-generate todos when complex command detected
if (isComplexCommand(command)) {
  const todos = await generateTodosFromCommand(command);
  await saveTodos(sessionId, todos);
  setActiveView('todos'); // Switch to todo view
}
```

### Phase 4: Task Execution Engine
**Sequential Execution**:
- Execute todos one by one via existing command system
- Show real-time progress in UI
- Handle errors gracefully (stop or continue options)
- Update todo status as tasks complete

## Technical Architecture

### Data Structure
```typescript
interface Todo {
  id: string;
  content: string;
  status: 'pending' | 'running' | 'completed' | 'failed';
  createdAt: string;
  completedAt?: string;
  command?: string; // Associated terminal command
  output?: string; // Execution output
}
```

### API Routes Integration
Add to `/src/app-simple.js`:
```javascript
try {
  const todoRoutes = require('./routes/todos');
  app.use('/api/todos', todoRoutes);
  console.log('✅ Todo routes loaded successfully');
} catch (error) {
  console.warn('⚠️ Failed to load todo routes:', error.message);
}
```

### UI State Management
In App.tsx:
```typescript
const [todos, setTodos] = useState<Todo[]>([]);
const [activeTodoId, setActiveTodoId] = useState<string | null>(null);
```

## Safety Measures

1. **No modifications to `/ide-build/` directory** (production build)
2. **Graceful degradation** - if todos fail, terminal still works
3. **Isolated feature** - contained in its own components
4. **No external dependencies** - uses existing patterns
5. **Progressive enhancement** - start simple, add features carefully

## Implementation Priority

1. **Backend API** first (completely isolated)
2. **Basic UI** without auto-generation
3. **Manual todo creation** and editing
4. **Auto-generation** from AI commands
5. **"Run All" execution** engine

## Success Criteria

- Simple, clean UI that doesn't overwhelm
- Automatic task breakdown for complex requests
- One-click execution of all tasks
- Keeps AI focused on completing multi-step workflows
- No added cognitive overhead for users

## Notes for Implementation

- Keep it simple - resist feature creep
- Match existing glassmorphism design
- Use existing terminal command infrastructure
- Test thoroughly before building to production
- Consider adding keyboard shortcuts (Ctrl+T for todos?)

---

**Status**: Planning complete, ready for implementation when user is ready.