# Typography System

## Font Stack

### Primary Font Family
```css
font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
```

### Monospace Font Family
```css
font-family: 'SF Mono', Monaco, 'Cascadia Code', 'Roboto Mono', Consolas, 'Courier New', monospace;
```

## Type Scale

### Base Configuration
- **Base Size**: 16px (1rem)
- **Scale Ratio**: 1.25 (Major Third)
- **Line Height Base**: 1.5

### Heading Sizes

```javascript
const typography = {
  h1: {
    fontSize: '3.052rem',    // 48.83px
    lineHeight: 1.2,
    fontWeight: 700,
    letterSpacing: '-0.02em',
  },
  h2: {
    fontSize: '2.441rem',    // 39.06px
    lineHeight: 1.3,
    fontWeight: 600,
    letterSpacing: '-0.01em',
  },
  h3: {
    fontSize: '1.953rem',    // 31.25px
    lineHeight: 1.4,
    fontWeight: 600,
    letterSpacing: '0',
  },
  h4: {
    fontSize: '1.563rem',    // 25px
    lineHeight: 1.4,
    fontWeight: 500,
    letterSpacing: '0',
  },
  h5: {
    fontSize: '1.25rem',     // 20px
    lineHeight: 1.5,
    fontWeight: 500,
    letterSpacing: '0',
  },
  h6: {
    fontSize: '1rem',        // 16px
    lineHeight: 1.5,
    fontWeight: 600,
    letterSpacing: '0.01em',
  },
};
```

### Body Text

```javascript
const bodyText = {
  body1: {
    fontSize: '1rem',        // 16px
    lineHeight: 1.6,
    fontWeight: 400,
    letterSpacing: '0',
  },
  body2: {
    fontSize: '0.875rem',    // 14px
    lineHeight: 1.57,
    fontWeight: 400,
    letterSpacing: '0',
  },
  subtitle1: {
    fontSize: '1.125rem',    // 18px
    lineHeight: 1.5,
    fontWeight: 500,
    letterSpacing: '0',
  },
  subtitle2: {
    fontSize: '0.875rem',    // 14px
    lineHeight: 1.5,
    fontWeight: 600,
    letterSpacing: '0.01em',
  },
  caption: {
    fontSize: '0.75rem',     // 12px
    lineHeight: 1.5,
    fontWeight: 400,
    letterSpacing: '0.02em',
  },
  overline: {
    fontSize: '0.75rem',     // 12px
    lineHeight: 2,
    fontWeight: 600,
    letterSpacing: '0.08em',
    textTransform: 'uppercase',
  },
};
```

## Font Weights

```javascript
const fontWeights = {
  thin: 100,
  light: 300,
  regular: 400,
  medium: 500,
  semibold: 600,
  bold: 700,
  black: 900,
};
```

## Responsive Typography

### Fluid Typography Scale

```css
/* Base formula: calc([min]rem + ([max] - [min]) * ((100vw - [minWidth]px) / ([maxWidth] - [minWidth]))) */

h1 {
  font-size: clamp(2rem, 5vw, 3.052rem);
}

h2 {
  font-size: clamp(1.5rem, 4vw, 2.441rem);
}

h3 {
  font-size: clamp(1.25rem, 3vw, 1.953rem);
}

body {
  font-size: clamp(0.875rem, 2vw, 1rem);
}
```

### Breakpoint Adjustments

```javascript
const responsiveTypography = {
  h1: {
    '@media (max-width: 600px)': {
      fontSize: '2rem',
      lineHeight: 1.3,
    },
  },
  h2: {
    '@media (max-width: 600px)': {
      fontSize: '1.5rem',
      lineHeight: 1.35,
    },
  },
  body1: {
    '@media (max-width: 600px)': {
      fontSize: '0.875rem',
      lineHeight: 1.65,
    },
  },
};
```

## Text Styling

### Text Colors

```javascript
const textColors = {
  // Dark theme (default)
  dark: {
    primary: 'rgba(255, 255, 255, 0.95)',
    secondary: 'rgba(255, 255, 255, 0.7)',
    disabled: 'rgba(255, 255, 255, 0.5)',
    hint: 'rgba(255, 255, 255, 0.5)',
  },
  // Light theme
  light: {
    primary: 'rgba(0, 0, 0, 0.87)',
    secondary: 'rgba(0, 0, 0, 0.6)',
    disabled: 'rgba(0, 0, 0, 0.38)',
    hint: 'rgba(0, 0, 0, 0.38)',
  },
};
```

### Text Decoration

```css
/* Links */
a {
  color: var(--color-primary);
  text-decoration: none;
  transition: color 0.2s ease;
}

a:hover {
  color: var(--color-primary-light);
  text-decoration: underline;
}

/* Emphasis */
.text-emphasis {
  font-weight: 600;
  color: var(--text-primary);
}

/* Muted */
.text-muted {
  color: var(--text-secondary);
  font-size: 0.875em;
}
```

## Usage Guidelines

### Hierarchy Rules

1. **Only one H1 per page**
   ```jsx
   <h1>Page Title</h1>
   ```

2. **Maintain logical order**
   ```jsx
   <h1>Main Title</h1>
     <h2>Section Title</h2>
       <h3>Subsection Title</h3>
   ```

3. **Use semantic HTML**
   ```jsx
   // Good
   <h2>Features</h2>
   
   // Bad
   <div className="big-text">Features</div>
   ```

### Line Length

- **Optimal**: 45-75 characters
- **Maximum**: 80 characters
- **Code blocks**: 80-120 characters

```css
.content {
  max-width: 65ch; /* ~65 characters */
}
```

### Line Height Guidelines

| Font Size | Line Height | Use Case |
|-----------|-------------|----------|
| < 16px | 1.6-1.8 | Body text |
| 16-24px | 1.5-1.6 | Large body |
| 24-32px | 1.3-1.4 | Small headings |
| > 32px | 1.1-1.3 | Large headings |

## Code Typography

### Inline Code
```css
code {
  font-family: var(--font-mono);
  font-size: 0.875em;
  padding: 0.125em 0.25em;
  background: rgba(139, 92, 246, 0.1);
  border-radius: 4px;
  color: var(--color-primary-light);
}
```

### Code Blocks
```css
pre {
  font-family: var(--font-mono);
  font-size: 0.875rem;
  line-height: 1.6;
  padding: 1rem;
  background: var(--bg-elevated);
  border-radius: 8px;
  overflow-x: auto;
}
```

## Implementation Examples

### React Component

```jsx
import { Typography } from '@mui/material';

// Heading usage
<Typography variant="h1" component="h1" gutterBottom>
  Welcome to Coder1
</Typography>

// Body text with custom styling
<Typography
  variant="body1"
  sx={{
    maxWidth: '65ch',
    mx: 'auto',
    color: 'text.secondary',
  }}
>
  Build amazing applications with our platform.
</Typography>

// Custom variant
<Typography
  sx={{
    fontSize: { xs: '1rem', md: '1.125rem' },
    fontWeight: 500,
    lineHeight: 1.5,
  }}
>
  Custom styled text
</Typography>
```

### CSS Implementation

```css
/* Typography utilities */
.text-xs { font-size: 0.75rem; }
.text-sm { font-size: 0.875rem; }
.text-base { font-size: 1rem; }
.text-lg { font-size: 1.125rem; }
.text-xl { font-size: 1.25rem; }
.text-2xl { font-size: 1.5rem; }
.text-3xl { font-size: 1.875rem; }
.text-4xl { font-size: 2.25rem; }
.text-5xl { font-size: 3rem; }

.font-light { font-weight: 300; }
.font-normal { font-weight: 400; }
.font-medium { font-weight: 500; }
.font-semibold { font-weight: 600; }
.font-bold { font-weight: 700; }

.leading-none { line-height: 1; }
.leading-tight { line-height: 1.25; }
.leading-snug { line-height: 1.375; }
.leading-normal { line-height: 1.5; }
.leading-relaxed { line-height: 1.625; }
.leading-loose { line-height: 2; }
```

## Best Practices

### 1. **Contrast & Readability**
- Ensure sufficient contrast (WCAG AA)
- Use appropriate line height
- Limit line length for readability

### 2. **Consistency**
- Use the type scale consistently
- Maintain weight patterns
- Keep spacing uniform

### 3. **Performance**
- Load only needed font weights
- Use font-display: swap
- Subset fonts when possible

### 4. **Accessibility**
- Use rem units for scalability
- Maintain semantic hierarchy
- Support user font size preferences