# Spacing System

## Base Unit

The spacing system is built on an **8px base unit**, providing consistent and harmonious spacing throughout the application.

```javascript
const baseUnit = 8; // pixels
```

## Spacing Scale

### Core Scale

```javascript
const spacing = {
  0: '0px',      // 0
  0.5: '4px',    // 0.5 * 8
  1: '8px',      // 1 * 8
  1.5: '12px',   // 1.5 * 8
  2: '16px',     // 2 * 8
  2.5: '20px',   // 2.5 * 8
  3: '24px',     // 3 * 8
  4: '32px',     // 4 * 8
  5: '40px',     // 5 * 8
  6: '48px',     // 6 * 8
  7: '56px',     // 7 * 8
  8: '64px',     // 8 * 8
  9: '72px',     // 9 * 8
  10: '80px',    // 10 * 8
  12: '96px',    // 12 * 8
  16: '128px',   // 16 * 8
  20: '160px',   // 20 * 8
  24: '192px',   // 24 * 8
  32: '256px',   // 32 * 8
};
```

### Material UI Integration

```javascript
// theme.spacing() usage
theme.spacing(1)   // 8px
theme.spacing(2)   // 16px
theme.spacing(3)   // 24px
theme.spacing(4)   // 32px

// Multiple values
theme.spacing(2, 3) // '16px 24px'
theme.spacing(1, 2, 3, 4) // '8px 16px 24px 32px'
```

## Component Spacing

### Container Padding

```javascript
const containerPadding = {
  mobile: spacing[2],    // 16px
  tablet: spacing[3],    // 24px
  desktop: spacing[4],   // 32px
  wide: spacing[6],      // 48px
};
```

### Card Spacing

```javascript
const cardSpacing = {
  padding: {
    compact: spacing[2],  // 16px
    default: spacing[3],  // 24px
    spacious: spacing[4], // 32px
  },
  gap: {
    small: spacing[1],    // 8px
    medium: spacing[2],   // 16px
    large: spacing[3],    // 24px
  },
};
```

### Form Spacing

```javascript
const formSpacing = {
  fieldGap: spacing[3],      // 24px between fields
  labelGap: spacing[1],      // 8px between label and input
  sectionGap: spacing[5],    // 40px between sections
  inlineGap: spacing[2],     // 16px between inline elements
};
```

## Layout Patterns

### Grid Gaps

```css
/* Standard grid gaps */
.grid-tight { gap: 8px; }
.grid-default { gap: 16px; }
.grid-loose { gap: 24px; }
.grid-spacious { gap: 32px; }

/* Responsive grid */
.responsive-grid {
  gap: 16px;
}

@media (min-width: 768px) {
  .responsive-grid {
    gap: 24px;
  }
}

@media (min-width: 1024px) {
  .responsive-grid {
    gap: 32px;
  }
}
```

### Stack Spacing

```jsx
// Vertical stack
<Stack spacing={2}> {/* 16px gap */}
  <Item />
  <Item />
  <Item />
</Stack>

// Horizontal stack
<Stack direction="row" spacing={3}> {/* 24px gap */}
  <Item />
  <Item />
</Stack>
```

## Margin & Padding Classes

### Margin Utilities

```css
/* All sides */
.m-0 { margin: 0; }
.m-1 { margin: 8px; }
.m-2 { margin: 16px; }
.m-3 { margin: 24px; }
.m-4 { margin: 32px; }

/* Single side */
.mt-2 { margin-top: 16px; }
.mr-2 { margin-right: 16px; }
.mb-2 { margin-bottom: 16px; }
.ml-2 { margin-left: 16px; }

/* Axis */
.mx-2 { margin-left: 16px; margin-right: 16px; }
.my-2 { margin-top: 16px; margin-bottom: 16px; }

/* Auto margins */
.mx-auto { margin-left: auto; margin-right: auto; }
```

### Padding Utilities

```css
/* All sides */
.p-0 { padding: 0; }
.p-1 { padding: 8px; }
.p-2 { padding: 16px; }
.p-3 { padding: 24px; }
.p-4 { padding: 32px; }

/* Single side */
.pt-2 { padding-top: 16px; }
.pr-2 { padding-right: 16px; }
.pb-2 { padding-bottom: 16px; }
.pl-2 { padding-left: 16px; }

/* Axis */
.px-2 { padding-left: 16px; padding-right: 16px; }
.py-2 { padding-top: 16px; padding-bottom: 16px; }
```

## Responsive Spacing

### Breakpoint-based Spacing

```javascript
const responsiveSpacing = {
  container: {
    px: { xs: 2, sm: 3, md: 4, lg: 6 }, // padding x-axis
    py: { xs: 3, sm: 4, md: 5, lg: 6 }, // padding y-axis
  },
  section: {
    my: { xs: 4, sm: 6, md: 8, lg: 10 }, // margin y-axis
  },
  grid: {
    gap: { xs: 2, sm: 3, md: 4 }, // grid gap
  },
};
```

### Implementation Example

```jsx
<Box
  sx={{
    px: { xs: 2, sm: 3, md: 4 },
    py: { xs: 3, sm: 4, md: 5 },
    my: { xs: 4, sm: 6, md: 8 },
  }}
>
  Responsive spacing content
</Box>
```

## Component-Specific Spacing

### Button Spacing

```javascript
const buttonSpacing = {
  padding: {
    small: '6px 12px',
    medium: '8px 16px',
    large: '12px 24px',
  },
  iconGap: '8px',
  groupGap: '8px',
};
```

### Modal Spacing

```javascript
const modalSpacing = {
  padding: {
    mobile: spacing[3],   // 24px
    desktop: spacing[4],  // 32px
  },
  headerPadding: '20px 24px',
  bodyPadding: '0 24px 24px',
  footerPadding: '16px 24px',
};
```

### List Spacing

```javascript
const listSpacing = {
  itemPadding: '12px 16px',
  itemGap: '0', // No gap, items touch
  sectionGap: spacing[3], // 24px between sections
  nestedIndent: spacing[4], // 32px for nested items
};
```

## Spacing Rules

### 1. **Consistency**
Always use values from the spacing scale. Avoid arbitrary values.

```jsx
// Good
<Box sx={{ p: 3, mb: 2 }} />

// Bad
<Box sx={{ p: '23px', mb: '17px' }} />
```

### 2. **Hierarchy**
Use spacing to establish visual hierarchy.

```javascript
const hierarchy = {
  section: spacing[8],    // 64px between major sections
  subsection: spacing[5], // 40px between subsections
  group: spacing[3],      // 24px between related groups
  item: spacing[2],       // 16px between items
};
```

### 3. **Density Options**
Provide spacing variants for different use cases.

```javascript
const density = {
  compact: {
    padding: spacing[1.5], // 12px
    gap: spacing[1],       // 8px
  },
  default: {
    padding: spacing[3],   // 24px
    gap: spacing[2],       // 16px
  },
  comfortable: {
    padding: spacing[4],   // 32px
    gap: spacing[3],       // 24px
  },
};
```

### 4. **Responsive Considerations**
Reduce spacing on smaller screens to maximize content area.

```jsx
// Desktop: spacious, Mobile: compact
<Container
  sx={{
    px: { xs: 2, md: 4 },
    py: { xs: 3, md: 5 },
  }}
/>
```

## White Space Guidelines

### Content Breathing Room

```css
/* Minimum spacing around content */
.content {
  padding: 24px;
  margin-bottom: 40px;
}

/* Text content spacing */
.prose > * + * {
  margin-top: 1.5em;
}

/* Section spacing */
section + section {
  margin-top: 64px;
}
```

### Empty Space Usage

```javascript
const emptySpace = {
  beforeHeading: spacing[5],    // 40px
  afterHeading: spacing[3],     // 24px
  betweenParagraphs: spacing[3], // 24px
  aroundDivider: spacing[4],    // 32px
};
```

## Implementation Examples

### CSS Variables

```css
:root {
  --spacing-0: 0;
  --spacing-1: 8px;
  --spacing-2: 16px;
  --spacing-3: 24px;
  --spacing-4: 32px;
  --spacing-5: 40px;
  --spacing-6: 48px;
  --spacing-8: 64px;
  
  /* Component specific */
  --container-padding: var(--spacing-4);
  --card-padding: var(--spacing-3);
  --form-gap: var(--spacing-3);
}
```

### Styled Components

```javascript
const Container = styled.div`
  padding: ${({ theme }) => theme.spacing(4)};
  margin-bottom: ${({ theme }) => theme.spacing(5)};
  
  @media (max-width: ${({ theme }) => theme.breakpoints.values.sm}px) {
    padding: ${({ theme }) => theme.spacing(2)};
    margin-bottom: ${({ theme }) => theme.spacing(3)};
  }
`;
```

## Grading Criteria

When evaluating spacing (0-2 points):
1. **Consistency** - Uses spacing scale values
2. **Hierarchy** - Spacing reinforces importance
3. **Responsiveness** - Adapts to screen size
4. **Purposeful** - No arbitrary gaps or crowding
5. **Balance** - Even distribution of white space