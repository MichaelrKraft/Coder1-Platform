# UX Rules and Principles

## Core UX Principles

### 1. **User Control**
- Users should always know where they are
- Provide clear navigation paths
- Allow users to undo/redo actions
- Never trap users in a flow

### 2. **Consistency**
- Similar actions produce similar results
- Use platform conventions
- Maintain visual and behavioral consistency
- Follow established patterns

### 3. **Feedback**
- Acknowledge every user action
- Provide clear system status
- Show progress for long operations
- Communicate errors constructively

### 4. **Efficiency**
- Minimize steps to complete tasks
- Remember user preferences
- Provide shortcuts for power users
- Optimize for common workflows

### 5. **Error Prevention**
- Validate inputs in real-time
- Provide clear constraints
- Confirm destructive actions
- Offer smart defaults

## Interaction Patterns

### Form Design

```jsx
// Good: Clear labels, validation, and help text
<TextField
  label="Project Name"
  helperText="Choose a memorable name for your project"
  error={hasError}
  errorText="Project name must be unique"
  required
  autoComplete="off"
/>

// Bad: Ambiguous, no guidance
<input placeholder="Name" />
```

### Loading States

**Rules:**
1. Show loading immediately (< 100ms)
2. Use skeleton screens for layout
3. Progressive loading for complex views
4. Maintain layout stability

```jsx
// Loading pattern
{isLoading ? (
  <Skeleton variant="rectangular" height={200} />
) : (
  <ContentCard data={data} />
)}
```

### Error Handling

**Error Message Formula:**
1. What went wrong
2. Why it happened (if known)
3. How to fix it
4. Action to take

```jsx
// Good error message
<Alert severity="error">
  <AlertTitle>Upload Failed</AlertTitle>
  The file size exceeds the 10MB limit. 
  Please compress the file or choose a smaller one.
  <Button size="small" onClick={retry}>Try Again</Button>
</Alert>
```

### Empty States

**Components:**
- Informative illustration
- Clear explanation
- Suggested action

```jsx
<EmptyState
  icon={<FolderOpenIcon />}
  title="No projects yet"
  description="Create your first project to get started"
  action={
    <Button variant="contained" startIcon={<AddIcon />}>
      Create Project
    </Button>
  }
/>
```

## Navigation Patterns

### Information Architecture

```
Home
├── Dashboard (default view)
├── Projects
│   ├── List View
│   ├── Grid View
│   └── Project Detail
├── Settings
│   ├── Profile
│   ├── Preferences
│   └── Security
└── Help
    ├── Documentation
    ├── Tutorials
    └── Support
```

### Navigation Rules

1. **Breadcrumbs** for deep hierarchies
2. **Tabs** for related content at same level
3. **Sidebar** for persistent navigation
4. **Back button** maintains history

## Accessibility Requirements

### WCAG 2.1 AA Compliance

1. **Color Contrast**
   - Normal text: 4.5:1 minimum
   - Large text: 3:1 minimum
   - Active elements: 3:1 minimum

2. **Keyboard Navigation**
   ```jsx
   // All interactive elements must be keyboard accessible
   <Button
     onClick={handleClick}
     onKeyDown={(e) => {
       if (e.key === 'Enter' || e.key === ' ') {
         handleClick();
       }
     }}
     tabIndex={0}
   >
     Click Me
   </Button>
   ```

3. **Screen Reader Support**
   ```jsx
   // Proper ARIA labels
   <IconButton
     aria-label="Delete project"
     onClick={handleDelete}
   >
     <DeleteIcon />
   </IconButton>
   ```

4. **Focus Indicators**
   ```css
   /* Visible focus states */
   .interactive-element:focus-visible {
     outline: 2px solid #8b5cf6;
     outline-offset: 2px;
   }
   ```

## Responsive Design Rules

### Breakpoint Behavior

**Mobile First Approach:**
```jsx
const useStyles = makeStyles((theme) => ({
  container: {
    padding: theme.spacing(2), // Mobile
    [theme.breakpoints.up('md')]: {
      padding: theme.spacing(3), // Tablet
    },
    [theme.breakpoints.up('lg')]: {
      padding: theme.spacing(4), // Desktop
    },
  },
}));
```

### Component Adaptation

| Component | Mobile | Tablet | Desktop |
|-----------|---------|---------|----------|
| Navigation | Bottom bar | Sidebar collapsed | Sidebar expanded |
| Cards | Stack | 2 columns | 3-4 columns |
| Forms | Full width | Centered | Multi-column |
| Tables | Card view | Horizontal scroll | Full table |

## Animation Guidelines

### Performance Rules
1. Use CSS transforms over position
2. Animate opacity and transform only
3. Respect prefers-reduced-motion
4. Keep animations under 300ms

```css
/* Smooth, performant animation */
.element {
  transition: transform 200ms ease-out, opacity 200ms ease-out;
}

/* Respect user preferences */
@media (prefers-reduced-motion: reduce) {
  * {
    animation-duration: 0.01ms !important;
    transition-duration: 0.01ms !important;
  }
}
```

## User Flow Patterns

### Onboarding Flow
```
1. Welcome Screen → 2. Account Setup → 3. First Project → 4. Success
     ↓                    ↓                  ↓
   Skip →              Import →          Templates →
```

### Task Completion Flow
1. **Initiate** - Clear CTA
2. **Configure** - Guided options
3. **Confirm** - Review details
4. **Process** - Show progress
5. **Complete** - Success feedback

## Validation Rules

### Real-time Validation
- Validate on blur
- Show success indicators
- Debounce API calls (300ms)
- Clear, specific error messages

### Form Submission
```jsx
const handleSubmit = async (values) => {
  // 1. Client-side validation
  const errors = validate(values);
  if (errors) return;
  
  // 2. Show loading state
  setLoading(true);
  
  try {
    // 3. Submit
    await api.submit(values);
    // 4. Success feedback
    showSuccess('Saved successfully');
  } catch (error) {
    // 5. Error handling
    showError(formatError(error));
  } finally {
    setLoading(false);
  }
};
```

## Grading Criteria (1-10)

When evaluating UX compliance:

1. **Navigation Clarity** (0-2 points)
   - Can users find what they need?
   - Is the current location clear?

2. **Visual Hierarchy** (0-2 points)
   - Is important content prominent?
   - Does layout guide the eye?

3. **Interaction Feedback** (0-2 points)
   - Are actions acknowledged?
   - Is system status clear?

4. **Error Handling** (0-2 points)
   - Are errors preventable?
   - Is recovery easy?

5. **Accessibility** (0-2 points)
   - Keyboard navigable?
   - Screen reader friendly?

**Total: 10 points maximum**