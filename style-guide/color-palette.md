# Color Palette

## Core Brand Colors

### Primary Colors

```javascript
const primary = {
  main: '#8b5cf6',     // Purple 500
  light: '#a78bfa',    // Purple 400
  dark: '#7c3aed',     // Purple 600
  contrast: '#ffffff',
};
```

**Usage:**
- Primary buttons
- Active states
- Key interactive elements
- Brand identity

### Secondary Colors

```javascript
const secondary = {
  main: '#06b6d4',     // Cyan 500
  light: '#22d3ee',    // Cyan 400
  dark: '#0891b2',     // Cyan 600
  contrast: '#ffffff',
};
```

**Usage:**
- Secondary actions
- Complementary accents
- Information highlights

## Semantic Colors

### Status Colors

```javascript
const status = {
  success: {
    main: '#10b981',   // Emerald 500
    light: '#34d399',  // Emerald 400
    dark: '#059669',   // Emerald 600
    bg: 'rgba(16, 185, 129, 0.1)',
  },
  warning: {
    main: '#f59e0b',   // Amber 500
    light: '#fbbf24',  // Amber 400
    dark: '#d97706',   // Amber 600
    bg: 'rgba(245, 158, 11, 0.1)',
  },
  error: {
    main: '#ef4444',   // Red 500
    light: '#f87171',  // Red 400
    dark: '#dc2626',   // Red 600
    bg: 'rgba(239, 68, 68, 0.1)',
  },
  info: {
    main: '#3b82f6',   // Blue 500
    light: '#60a5fa',  // Blue 400
    dark: '#2563eb',   // Blue 600
    bg: 'rgba(59, 130, 246, 0.1)',
  },
};
```

## Background Colors

### Dark Theme (Default)

```javascript
const darkTheme = {
  background: {
    default: '#0a0a0a',      // Near black
    paper: '#1a1a1a',        // Elevated surface
    elevated: '#2a2a2a',     // Cards, modals
    glass: 'rgba(255, 255, 255, 0.05)', // Glassmorphism
  },
  divider: 'rgba(255, 255, 255, 0.1)',
};
```

### Light Theme

```javascript
const lightTheme = {
  background: {
    default: '#ffffff',      // Pure white
    paper: '#f8fafc',        // Slight gray
    elevated: '#f1f5f9',     // Cards, modals
    glass: 'rgba(255, 255, 255, 0.8)',
  },
  divider: 'rgba(0, 0, 0, 0.1)',
};
```

## Text Colors

### Dark Theme Text

```javascript
const darkText = {
  primary: 'rgba(255, 255, 255, 0.95)',
  secondary: 'rgba(255, 255, 255, 0.7)',
  disabled: 'rgba(255, 255, 255, 0.5)',
  hint: 'rgba(255, 255, 255, 0.5)',
};
```

### Light Theme Text

```javascript
const lightText = {
  primary: 'rgba(0, 0, 0, 0.87)',
  secondary: 'rgba(0, 0, 0, 0.6)',
  disabled: 'rgba(0, 0, 0, 0.38)',
  hint: 'rgba(0, 0, 0, 0.38)',
};
```

## Gradient Colors

### Background Gradients

```css
/* Animated background gradient */
.gradient-background {
  background: linear-gradient(135deg, #0f0f14 0%, #1a1b26 50%, #0f0f14 100%);
}

/* Purple accent gradient */
.gradient-purple {
  background: linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%);
}

/* Cyan accent gradient */
.gradient-cyan {
  background: linear-gradient(135deg, #06b6d4 0%, #0891b2 100%);
}

/* Mixed brand gradient */
.gradient-brand {
  background: linear-gradient(135deg, #8b5cf6 0%, #06b6d4 100%);
}
```

### Glassmorphism Effects

```css
/* Glass surface - dark theme */
.glass-dark {
  background: rgba(255, 255, 255, 0.05);
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.1);
}

/* Glass surface - light theme */
.glass-light {
  background: rgba(255, 255, 255, 0.8);
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
  border: 1px solid rgba(0, 0, 0, 0.1);
}
```

## Color Usage Guidelines

### Contrast Requirements

| Element Type | Minimum Contrast | Recommended |
|--------------|------------------|-------------|
| Normal Text | 4.5:1 | 7:1 |
| Large Text | 3:1 | 4.5:1 |
| UI Components | 3:1 | 4.5:1 |

### Color Combinations

**High Contrast Pairs:**
- Purple on dark: `#a78bfa` on `#0a0a0a` (10.2:1) ✅
- Cyan on dark: `#22d3ee` on `#0a0a0a` (13.8:1) ✅
- White on purple: `#ffffff` on `#8b5cf6` (4.5:1) ✅

**Avoid These Combinations:**
- Purple on cyan ❌
- Yellow on white ❌
- Dark gray on black ❌

## Implementation Examples

### React Component

```jsx
import { useTheme } from '@mui/material/styles';

const MyComponent = () => {
  const theme = useTheme();
  
  return (
    <Box
      sx={{
        bgcolor: theme.palette.background.paper,
        color: theme.palette.text.primary,
        borderColor: theme.palette.divider,
        '&:hover': {
          bgcolor: theme.palette.action.hover,
        },
      }}
    >
      Content
    </Box>
  );
};
```

### CSS Variables

```css
:root {
  /* Primary */
  --color-primary: #8b5cf6;
  --color-primary-light: #a78bfa;
  --color-primary-dark: #7c3aed;
  
  /* Secondary */
  --color-secondary: #06b6d4;
  --color-secondary-light: #22d3ee;
  --color-secondary-dark: #0891b2;
  
  /* Semantic */
  --color-success: #10b981;
  --color-warning: #f59e0b;
  --color-error: #ef4444;
  --color-info: #3b82f6;
  
  /* Backgrounds */
  --bg-default: #0a0a0a;
  --bg-paper: #1a1a1a;
  --bg-elevated: #2a2a2a;
  
  /* Text */
  --text-primary: rgba(255, 255, 255, 0.95);
  --text-secondary: rgba(255, 255, 255, 0.7);
}
```

## Color Application Rules

### 1. **Primary Actions**
- Use primary color for main CTAs
- Ensure sufficient contrast
- Add hover/focus states

### 2. **Feedback States**
- Green for success
- Yellow for warnings
- Red for errors
- Blue for information

### 3. **Hierarchy**
- Brightest colors for primary actions
- Muted colors for secondary elements
- Neutral colors for backgrounds

### 4. **Accessibility**
- Always test color contrast
- Provide non-color indicators
- Support high contrast mode

## Dynamic Color Generation

```javascript
// Generate color variations
const generateColorScale = (baseColor) => {
  return {
    50: lighten(baseColor, 0.8),
    100: lighten(baseColor, 0.6),
    200: lighten(baseColor, 0.4),
    300: lighten(baseColor, 0.2),
    400: lighten(baseColor, 0.1),
    500: baseColor,
    600: darken(baseColor, 0.1),
    700: darken(baseColor, 0.2),
    800: darken(baseColor, 0.3),
    900: darken(baseColor, 0.4),
  };
};
```