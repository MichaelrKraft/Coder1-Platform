# Coder1 Platform Style Guide

## Overview

This style guide defines the visual design system and component patterns for the Coder1 Platform. It follows Material UI principles while maintaining our unique brand identity with glassmorphism effects and purple accent colors.

## Core Principles

### 1. **Clarity First**
- Information hierarchy should be immediately apparent
- Use contrast and spacing to guide the eye
- Minimize cognitive load

### 2. **Consistent Experience**
- Components behave predictably across contexts
- Visual patterns reinforce functionality
- Maintain consistency with Material UI patterns

### 3. **AI-Friendly Structure**
- Components are modular and composable
- Clear naming conventions for AI agents
- Predictable prop interfaces

### 4. **Accessible by Default**
- WCAG 2.1 AA compliance minimum
- Keyboard navigation support
- Screen reader optimized

## Quick Reference

### Colors
- **Primary**: `#8b5cf6` (Purple)
- **Secondary**: `#06b6d4` (Cyan)
- **Background**: `#0a0a0a` (Dark)
- **Surface**: `#1a1a1a` (Elevated)
- **Error**: `#ef4444`
- **Success**: `#10b981`
- **Warning**: `#f59e0b`

### Typography
- **Font Family**: Inter, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif
- **Base Size**: 16px
- **Scale**: 1.25 (Major Third)

### Spacing
- **Base Unit**: 8px
- **Scale**: 0, 4, 8, 12, 16, 20, 24, 32, 40, 48, 56, 64

### Breakpoints
- **Mobile**: < 640px
- **Tablet**: 640px - 1024px
- **Desktop**: > 1024px

## Component Categories

### 1. **Layout Components**
- Container
- Grid
- Flex
- Spacer

### 2. **Navigation**
- AppBar
- Sidebar
- Tabs
- Breadcrumbs

### 3. **Input Components**
- TextField
- Button
- Select
- Checkbox/Radio
- Switch

### 4. **Feedback**
- Alert
- Snackbar
- Progress
- Skeleton

### 5. **Data Display**
- Table
- List
- Card
- Chip

### 6. **Surfaces**
- Paper
- Modal
- Drawer
- Popover

## Implementation Guidelines

### React Component Structure

```jsx
// Component template
import React from 'react';
import { styled } from '@mui/material/styles';

const StyledComponent = styled('div')(({ theme }) => ({
  // Base styles
  padding: theme.spacing(2),
  borderRadius: theme.shape.borderRadius,
  
  // Glassmorphism effect
  background: 'rgba(255, 255, 255, 0.05)',
  backdropFilter: 'blur(10px)',
  border: '1px solid rgba(255, 255, 255, 0.1)',
  
  // Responsive
  [theme.breakpoints.up('md')]: {
    padding: theme.spacing(3),
  },
}));

export const MyComponent = ({ children, ...props }) => {
  return (
    <StyledComponent {...props}>
      {children}
    </StyledComponent>
  );
};
```

### CSS-in-JS Patterns

```javascript
// Theme-aware styling
const useStyles = makeStyles((theme) => ({
  root: {
    // Use theme values
    color: theme.palette.primary.main,
    padding: theme.spacing(2),
    
    // Hover states
    '&:hover': {
      backgroundColor: 'rgba(139, 92, 246, 0.1)',
    },
    
    // Focus states
    '&:focus-visible': {
      outline: `2px solid ${theme.palette.primary.main}`,
      outlineOffset: 2,
    },
  },
}));
```

## File References

### Detailed Guidelines
- [Color Palette](./color-palette.md) - Complete color system
- [Typography](./typography.md) - Type scales and usage
- [Spacing](./spacing.md) - Layout and spacing system
- [Components](./components.md) - Component patterns
- [UX Rules](./ux-rules.md) - Interaction patterns
- [AI Agent Guide](./ai-agent-guide.md) - AI assembly rules

## Usage for AI Agents

When assembling pages, AI agents should:

1. **Start with layout** - Use Container and Grid components
2. **Apply consistent spacing** - Use theme.spacing() values
3. **Maintain hierarchy** - Use proper heading levels and contrast
4. **Include feedback** - Add loading and error states
5. **Ensure accessibility** - Include ARIA labels and keyboard support

## Version History

- **v1.0** (2024-01-27) - Initial style guide creation
- Based on Material UI v5 principles
- Incorporates Coder1 brand identity