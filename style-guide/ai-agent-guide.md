# AI Agent Guide

## Overview

This guide provides rules and patterns for AI agents to assemble pages and handle user flows in the Coder1 Platform. It ensures consistent, accessible, and well-structured implementations.

## Page Assembly Process

### 1. Analyze Requirements

```javascript
const analyzeRequirements = (userRequest) => {
  return {
    pageType: detectPageType(userRequest),        // dashboard, form, list, detail
    features: extractFeatures(userRequest),        // CRUD, search, filters
    dataNeeds: identifyDataNeeds(userRequest),    // APIs, state management
    userFlow: determineUserFlow(userRequest),      // linear, branching, circular
  };
};
```

### 2. Select Layout Pattern

```javascript
const layoutPatterns = {
  dashboard: {
    structure: 'HeaderNavigation → Sidebar → MainContent → Widgets',
    components: ['AppBar', 'Drawer', 'Grid', 'Card', 'Chart'],
    gridColumns: { xs: 1, sm: 2, md: 3, lg: 4 },
  },
  
  form: {
    structure: 'Header → FormContainer → Actions',
    components: ['Paper', 'TextField', 'Select', 'Button', 'Stepper'],
    maxWidth: '600px',
  },
  
  list: {
    structure: 'Header → Filters → Table/Grid → Pagination',
    components: ['Toolbar', 'Table', 'Card', 'Pagination', 'Chip'],
    itemsPerPage: [10, 25, 50, 100],
  },
  
  detail: {
    structure: 'Header → HeroSection → ContentTabs → Actions',
    components: ['Breadcrumbs', 'Typography', 'Tabs', 'Divider'],
    sections: ['overview', 'details', 'activity', 'settings'],
  },
};
```

### 3. Component Selection Rules

```javascript
const componentSelectionRules = {
  // Navigation
  navigation: {
    topLevel: items => items.length <= 5 ? 'Tabs' : 'Drawer',
    secondary: items => items.length <= 3 ? 'ButtonGroup' : 'Menu',
    breadcrumbs: depth => depth > 2,
  },
  
  // Data Display
  dataDisplay: {
    items: count => {
      if (count < 10) return 'List';
      if (count < 50) return 'Table';
      return 'VirtualizedList';
    },
    preview: hasImage => hasImage ? 'Card' : 'ListItem',
  },
  
  // Input Selection
  inputType: {
    options: count => {
      if (count <= 3) return 'RadioGroup';
      if (count <= 10) return 'Select';
      return 'Autocomplete';
    },
    text: {
      short: 'TextField',
      long: 'TextField multiline',
      rich: 'RichTextEditor',
    },
  },
  
  // Actions
  actions: {
    primary: count => count === 1 ? 'single' : 'grouped',
    danger: 'confirmation-required',
    bulk: 'toolbar-actions',
  },
};
```

## Page Assembly Templates

### Dashboard Page

```jsx
const assembleDashboard = ({ metrics, charts, recentItems }) => {
  return (
    <Box sx={{ display: 'flex', height: '100vh' }}>
      {/* Navigation */}
      <Drawer variant="permanent" sx={{ width: 240 }}>
        <NavigationList items={navItems} />
      </Drawer>
      
      {/* Main Content */}
      <Box sx={{ flexGrow: 1, overflow: 'auto' }}>
        {/* Header */}
        <AppBar position="sticky">
          <Toolbar>
            <Typography variant="h6">Dashboard</Typography>
            <Box sx={{ flexGrow: 1 }} />
            <IconButton><NotificationsIcon /></IconButton>
            <IconButton><AccountCircleIcon /></IconButton>
          </Toolbar>
        </AppBar>
        
        {/* Content */}
        <Container maxWidth="xl" sx={{ mt: 4, mb: 4 }}>
          {/* Metrics Row */}
          <Grid container spacing={3}>
            {metrics.map(metric => (
              <Grid item xs={12} sm={6} md={3} key={metric.id}>
                <MetricCard {...metric} />
              </Grid>
            ))}
          </Grid>
          
          {/* Charts Row */}
          <Grid container spacing={3} sx={{ mt: 0 }}>
            {charts.map(chart => (
              <Grid item xs={12} md={chart.size || 6} key={chart.id}>
                <ChartCard {...chart} />
              </Grid>
            ))}
          </Grid>
          
          {/* Recent Activity */}
          <Paper sx={{ mt: 3, p: 2 }}>
            <Typography variant="h6" gutterBottom>
              Recent Activity
            </Typography>
            <List>
              {recentItems.map(item => (
                <ActivityItem key={item.id} {...item} />
              ))}
            </List>
          </Paper>
        </Container>
      </Box>
    </Box>
  );
};
```

### Form Page

```jsx
const assembleForm = ({ fields, validation, onSubmit }) => {
  const steps = groupFieldsIntoSteps(fields);
  const [activeStep, setActiveStep] = useState(0);
  
  return (
    <Container maxWidth="md" sx={{ mt: 4 }}>
      {/* Progress */}
      {steps.length > 1 && (
        <Stepper activeStep={activeStep} sx={{ mb: 4 }}>
          {steps.map(step => (
            <Step key={step.label}>
              <StepLabel>{step.label}</StepLabel>
            </Step>
          ))}
        </Stepper>
      )}
      
      {/* Form */}
      <Paper sx={{ p: 4 }}>
        <form onSubmit={handleSubmit}>
          {/* Current Step Fields */}
          <Grid container spacing={3}>
            {steps[activeStep].fields.map(field => (
              <Grid item xs={12} sm={field.width || 12} key={field.name}>
                {renderField(field)}
              </Grid>
            ))}
          </Grid>
          
          {/* Actions */}
          <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 4 }}>
            <Button
              disabled={activeStep === 0}
              onClick={() => setActiveStep(prev => prev - 1)}
            >
              Back
            </Button>
            
            {activeStep === steps.length - 1 ? (
              <Button type="submit" variant="contained">
                Submit
              </Button>
            ) : (
              <Button
                variant="contained"
                onClick={() => setActiveStep(prev => prev + 1)}
              >
                Next
              </Button>
            )}
          </Box>
        </form>
      </Paper>
    </Container>
  );
};
```

## User Flow Patterns

### Linear Flow

```javascript
const linearFlow = {
  pattern: 'Start → Step 1 → Step 2 → ... → Complete',
  components: ['Stepper', 'ProgressBar'],
  navigation: {
    forward: 'Next button',
    backward: 'Back button',
    skip: 'Optional skip link',
  },
  example: 'Onboarding, Checkout, Multi-step form',
};
```

### Branching Flow

```javascript
const branchingFlow = {
  pattern: 'Start → Decision → Path A or Path B → Converge → Complete',
  components: ['RadioGroup', 'Select', 'ConditionalRenderer'],
  rules: {
    showPath: (condition) => condition ? 'PathA' : 'PathB',
    validation: 'Validate each path independently',
  },
  example: 'User type selection, Feature configuration',
};
```

### Hub & Spoke

```javascript
const hubSpokeFlow = {
  pattern: 'Central Hub ↔ Multiple Features',
  components: ['Dashboard', 'NavigationMenu', 'Breadcrumbs'],
  navigation: {
    toFeature: 'Direct link or card',
    toHub: 'Logo, Home button, Breadcrumb',
  },
  example: 'Admin panel, Settings page',
};
```

## State Management Rules

### Form State

```javascript
const formStateRules = {
  // Initial state
  initialize: (fields) => {
    return fields.reduce((acc, field) => ({
      ...acc,
      [field.name]: field.defaultValue || '',
    }), {});
  },
  
  // Validation
  validate: (values, rules) => {
    const errors = {};
    Object.entries(rules).forEach(([field, rule]) => {
      const error = rule(values[field], values);
      if (error) errors[field] = error;
    });
    return errors;
  },
  
  // Submission
  submit: async (values) => {
    // 1. Client validation
    // 2. Show loading
    // 3. API call
    // 4. Handle response
    // 5. Show feedback
  },
};
```

### List State

```javascript
const listStateRules = {
  // Pagination
  pagination: {
    page: 0,
    rowsPerPage: 25,
    total: 0,
  },
  
  // Filtering
  filters: {
    search: '',
    status: 'all',
    dateRange: null,
  },
  
  // Sorting
  sort: {
    field: 'createdAt',
    direction: 'desc',
  },
  
  // Selection
  selection: {
    mode: 'multiple', // single, multiple, none
    selected: [],
  },
};
```

## Error Handling Patterns

### Field Validation

```javascript
const fieldValidation = {
  realTime: {
    trigger: 'onBlur',
    debounce: 300,
    showSuccess: true,
  },
  
  messages: {
    required: field => `${field} is required`,
    email: 'Please enter a valid email address',
    min: (field, min) => `${field} must be at least ${min} characters`,
    max: (field, max) => `${field} must be no more than ${max} characters`,
  },
};
```

### API Errors

```javascript
const apiErrorHandling = {
  // Network errors
  network: {
    component: 'Alert',
    message: 'Unable to connect. Please check your internet connection.',
    action: 'Retry',
  },
  
  // Validation errors
  validation: {
    component: 'FieldError',
    map: errors => errors.reduce((acc, err) => ({
      ...acc,
      [err.field]: err.message,
    }), {}),
  },
  
  // Server errors
  server: {
    component: 'ErrorBoundary',
    message: 'Something went wrong. Please try again later.',
    showDetails: process.env.NODE_ENV === 'development',
  },
};
```

## Accessibility Rules

### Navigation

```javascript
const navigationA11y = {
  keyboard: {
    Tab: 'Navigate forward',
    'Shift+Tab': 'Navigate backward',
    Enter: 'Activate element',
    Space: 'Activate button/checkbox',
    Arrow: 'Navigate within component',
  },
  
  landmarks: {
    nav: 'Navigation region',
    main: 'Main content',
    aside: 'Complementary content',
    footer: 'Footer information',
  },
  
  announcements: {
    pageChange: 'Announce new page title',
    errorOccurred: 'Announce error immediately',
    actionComplete: 'Announce success after action',
  },
};
```

### Focus Management

```javascript
const focusManagement = {
  // Page load
  onPageLoad: () => {
    document.querySelector('h1')?.focus();
  },
  
  // Modal open
  onModalOpen: (modalRef) => {
    const firstInput = modalRef.querySelector('input, button');
    firstInput?.focus();
  },
  
  // Modal close
  onModalClose: (triggerRef) => {
    triggerRef?.focus();
  },
  
  // Error state
  onError: (errorField) => {
    errorField?.focus();
    announceError(errorField.getAttribute('aria-label'));
  },
};
```

## Performance Optimization

### Component Loading

```javascript
const loadingStrategies = {
  // Lazy load heavy components
  lazy: {
    Chart: React.lazy(() => import('./Chart')),
    RichTextEditor: React.lazy(() => import('./RichTextEditor')),
    DataTable: React.lazy(() => import('./DataTable')),
  },
  
  // Virtualization for lists
  virtualize: {
    threshold: 50, // items
    overscan: 5,   // items to render outside viewport
  },
  
  // Code splitting
  routes: {
    dashboard: () => import('./pages/Dashboard'),
    settings: () => import('./pages/Settings'),
    reports: () => import('./pages/Reports'),
  },
};
```

### Data Fetching

```javascript
const dataFetchingRules = {
  // Pagination
  pagination: {
    pageSize: 25,
    prefetch: 'next page on current page load',
  },
  
  // Caching
  cache: {
    strategy: 'stale-while-revalidate',
    duration: 5 * 60 * 1000, // 5 minutes
  },
  
  // Optimistic updates
  optimistic: {
    apply: 'immediate UI update',
    rollback: 'on server rejection',
  },
};
```

## Decision Tree

```javascript
const aiDecisionTree = {
  // Start
  analyzeRequest: (request) => {
    const intent = detectIntent(request);
    const complexity = assessComplexity(request);
    return { intent, complexity };
  },
  
  // Route to pattern
  selectPattern: ({ intent, complexity }) => {
    if (intent === 'display' && complexity === 'simple') return 'list';
    if (intent === 'display' && complexity === 'complex') return 'dashboard';
    if (intent === 'collect' && complexity === 'simple') return 'form';
    if (intent === 'collect' && complexity === 'complex') return 'wizard';
    if (intent === 'analyze') return 'report';
    return 'custom';
  },
  
  // Apply pattern
  implement: (pattern, requirements) => {
    const template = templates[pattern];
    const customized = applyRequirements(template, requirements);
    const optimized = optimizeForContext(customized);
    return optimized;
  },
};
```

## Grading Compliance

When evaluating AI-assembled pages (0-10 points):

1. **Structure** (0-2): Logical component hierarchy
2. **Consistency** (0-2): Follows established patterns
3. **Accessibility** (0-2): Keyboard navigation, ARIA labels
4. **Performance** (0-2): Lazy loading, virtualization
5. **Error Handling** (0-2): Graceful degradation, clear feedback

Total possible score: 10 points