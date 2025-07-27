# Component Patterns

## Component Structure

### Base Component Template

```jsx
import React from 'react';
import { styled } from '@mui/material/styles';
import { Box, Typography } from '@mui/material';

// Styled component with theme access
const StyledComponent = styled(Box)(({ theme }) => ({
  // Base styles
  padding: theme.spacing(3),
  borderRadius: theme.shape.borderRadius,
  
  // Glassmorphism
  background: 'rgba(255, 255, 255, 0.05)',
  backdropFilter: 'blur(10px)',
  border: '1px solid rgba(255, 255, 255, 0.1)',
  
  // Transitions
  transition: theme.transitions.create(['box-shadow', 'transform'], {
    duration: theme.transitions.duration.short,
  }),
  
  // Hover state
  '&:hover': {
    boxShadow: theme.shadows[4],
    transform: 'translateY(-2px)',
  },
}));

// Component with props interface
interface ComponentProps {
  title?: string;
  children: React.ReactNode;
  variant?: 'default' | 'outlined' | 'elevated';
  onClick?: () => void;
}

export const Component: React.FC<ComponentProps> = ({ 
  title,
  children,
  variant = 'default',
  onClick,
  ...props 
}) => {
  return (
    <StyledComponent
      onClick={onClick}
      className={`component-${variant}`}
      {...props}
    >
      {title && (
        <Typography variant="h6" gutterBottom>
          {title}
        </Typography>
      )}
      {children}
    </StyledComponent>
  );
};
```

## Core Components

### 1. Button

```jsx
// Button variants
const Button = styled(MuiButton)(({ theme }) => ({
  textTransform: 'none',
  fontWeight: 500,
  borderRadius: '8px',
  padding: '8px 16px',
  
  // Primary variant
  '&.MuiButton-containedPrimary': {
    background: theme.palette.primary.main,
    '&:hover': {
      background: theme.palette.primary.dark,
    },
  },
  
  // Outlined variant
  '&.MuiButton-outlined': {
    borderColor: 'rgba(255, 255, 255, 0.2)',
    color: theme.palette.text.primary,
    '&:hover': {
      borderColor: theme.palette.primary.main,
      background: 'rgba(139, 92, 246, 0.1)',
    },
  },
  
  // Glass variant (custom)
  '&.glass': {
    background: 'rgba(255, 255, 255, 0.05)',
    backdropFilter: 'blur(10px)',
    border: '1px solid rgba(255, 255, 255, 0.1)',
    '&:hover': {
      background: 'rgba(255, 255, 255, 0.1)',
    },
  },
}));

// Usage
<Button variant="contained" color="primary" startIcon={<SaveIcon />}>
  Save Changes
</Button>

<Button variant="outlined" size="large">
  Cancel
</Button>

<Button className="glass" endIcon={<ArrowForwardIcon />}>
  Continue
</Button>
```

### 2. Card

```jsx
const Card = styled(MuiCard)(({ theme }) => ({
  background: 'rgba(255, 255, 255, 0.05)',
  backdropFilter: 'blur(10px)',
  border: '1px solid rgba(255, 255, 255, 0.1)',
  borderRadius: '16px',
  overflow: 'hidden',
  transition: 'all 0.3s ease',
  
  '&:hover': {
    transform: 'translateY(-4px)',
    boxShadow: '0 12px 24px rgba(0, 0, 0, 0.2)',
  },
}));

// Card with sections
<Card>
  <CardHeader
    avatar={<Avatar src={user.avatar} />}
    title={user.name}
    subheader={user.role}
    action={
      <IconButton>
        <MoreVertIcon />
      </IconButton>
    }
  />
  <CardContent>
    <Typography variant="body2">
      {content}
    </Typography>
  </CardContent>
  <CardActions>
    <Button size="small">Share</Button>
    <Button size="small">Learn More</Button>
  </CardActions>
</Card>
```

### 3. Input Fields

```jsx
const TextField = styled(MuiTextField)(({ theme }) => ({
  '& .MuiOutlinedInput-root': {
    background: 'rgba(0, 0, 0, 0.3)',
    borderRadius: '12px',
    
    '& fieldset': {
      borderColor: 'rgba(255, 255, 255, 0.1)',
    },
    
    '&:hover fieldset': {
      borderColor: 'rgba(255, 255, 255, 0.2)',
    },
    
    '&.Mui-focused fieldset': {
      borderColor: theme.palette.primary.main,
      borderWidth: '2px',
    },
  },
  
  '& .MuiInputLabel-root': {
    color: 'rgba(255, 255, 255, 0.7)',
  },
  
  '& .MuiInputBase-input': {
    color: theme.palette.text.primary,
  },
}));

// Input with validation
<TextField
  label="Email Address"
  type="email"
  required
  error={!!errors.email}
  helperText={errors.email || 'We\'ll never share your email'}
  InputProps={{
    startAdornment: <EmailIcon />,
  }}
/>
```

### 4. Modal/Dialog

```jsx
const Dialog = styled(MuiDialog)(({ theme }) => ({
  '& .MuiDialog-paper': {
    background: 'rgba(26, 27, 38, 0.95)',
    backdropFilter: 'blur(20px)',
    border: '1px solid rgba(255, 255, 255, 0.1)',
    borderRadius: '16px',
    padding: theme.spacing(2),
  },
}));

// Modal structure
<Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
  <DialogTitle>
    <Typography variant="h5" component="div">
      Confirm Action
    </Typography>
    <IconButton
      onClick={handleClose}
      sx={{ position: 'absolute', right: 8, top: 8 }}
    >
      <CloseIcon />
    </IconButton>
  </DialogTitle>
  
  <DialogContent>
    <Typography variant="body1">
      Are you sure you want to proceed with this action?
    </Typography>
  </DialogContent>
  
  <DialogActions>
    <Button onClick={handleClose} variant="outlined">
      Cancel
    </Button>
    <Button onClick={handleConfirm} variant="contained" color="primary">
      Confirm
    </Button>
  </DialogActions>
</Dialog>
```

### 5. Navigation

```jsx
// App Bar
const AppBar = styled(MuiAppBar)(({ theme }) => ({
  background: 'rgba(26, 27, 38, 0.95)',
  backdropFilter: 'blur(20px)',
  borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
  boxShadow: 'none',
}));

// Tabs
const Tabs = styled(MuiTabs)(({ theme }) => ({
  '& .MuiTab-root': {
    textTransform: 'none',
    minWidth: 0,
    marginRight: theme.spacing(3),
    color: 'rgba(255, 255, 255, 0.7)',
    
    '&.Mui-selected': {
      color: theme.palette.primary.main,
    },
  },
  
  '& .MuiTabs-indicator': {
    backgroundColor: theme.palette.primary.main,
    height: 3,
    borderRadius: '3px 3px 0 0',
  },
}));

// Usage
<AppBar position="sticky">
  <Toolbar>
    <Typography variant="h6" sx={{ flexGrow: 1 }}>
      Coder1 Platform
    </Typography>
    <Tabs value={activeTab} onChange={handleTabChange}>
      <Tab label="Dashboard" />
      <Tab label="Projects" />
      <Tab label="Settings" />
    </Tabs>
  </Toolbar>
</AppBar>
```

### 6. List Components

```jsx
const List = styled(MuiList)(({ theme }) => ({
  padding: 0,
  
  '& .MuiListItem-root': {
    borderRadius: '8px',
    marginBottom: theme.spacing(1),
    transition: 'all 0.2s ease',
    
    '&:hover': {
      background: 'rgba(139, 92, 246, 0.1)',
    },
    
    '&.Mui-selected': {
      background: 'rgba(139, 92, 246, 0.2)',
      borderLeft: `4px solid ${theme.palette.primary.main}`,
    },
  },
}));

// List with actions
<List>
  <ListItem
    button
    selected={selected === 0}
    onClick={() => handleSelect(0)}
  >
    <ListItemIcon>
      <DashboardIcon />
    </ListItemIcon>
    <ListItemText 
      primary="Dashboard"
      secondary="View your overview"
    />
    <ListItemSecondaryAction>
      <IconButton edge="end">
        <MoreVertIcon />
      </IconButton>
    </ListItemSecondaryAction>
  </ListItem>
</List>
```

### 7. Data Display

```jsx
// Table
const Table = styled(MuiTable)(({ theme }) => ({
  '& .MuiTableHead-root': {
    background: 'rgba(255, 255, 255, 0.05)',
    
    '& .MuiTableCell-head': {
      color: theme.palette.text.secondary,
      fontWeight: 600,
      borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
    },
  },
  
  '& .MuiTableBody-root': {
    '& .MuiTableRow-root': {
      transition: 'background 0.2s ease',
      
      '&:hover': {
        background: 'rgba(255, 255, 255, 0.02)',
      },
    },
    
    '& .MuiTableCell-root': {
      borderBottom: '1px solid rgba(255, 255, 255, 0.05)',
    },
  },
}));

// Chip
const Chip = styled(MuiChip)(({ theme }) => ({
  background: 'rgba(139, 92, 246, 0.2)',
  color: theme.palette.primary.light,
  border: '1px solid rgba(139, 92, 246, 0.3)',
  
  '&:hover': {
    background: 'rgba(139, 92, 246, 0.3)',
  },
  
  '& .MuiChip-deleteIcon': {
    color: 'rgba(255, 255, 255, 0.5)',
    '&:hover': {
      color: 'rgba(255, 255, 255, 0.8)',
    },
  },
}));
```

## Composite Components

### Form Component

```jsx
const Form = ({ onSubmit }) => {
  const [values, setValues] = useState({});
  const [errors, setErrors] = useState({});
  
  return (
    <Box component="form" onSubmit={handleSubmit} sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
      <TextField
        label="Project Name"
        name="name"
        value={values.name}
        onChange={handleChange}
        error={!!errors.name}
        helperText={errors.name}
        required
        fullWidth
      />
      
      <TextField
        label="Description"
        name="description"
        value={values.description}
        onChange={handleChange}
        multiline
        rows={4}
        fullWidth
      />
      
      <Box sx={{ display: 'flex', gap: 2, justifyContent: 'flex-end' }}>
        <Button variant="outlined" onClick={handleCancel}>
          Cancel
        </Button>
        <Button variant="contained" type="submit" disabled={!isValid}>
          Create Project
        </Button>
      </Box>
    </Box>
  );
};
```

### Empty State

```jsx
const EmptyState = ({ icon, title, description, action }) => (
  <Box
    sx={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      minHeight: 400,
      textAlign: 'center',
      p: 4,
    }}
  >
    <Box
      sx={{
        fontSize: 64,
        color: 'text.secondary',
        mb: 3,
      }}
    >
      {icon}
    </Box>
    
    <Typography variant="h5" gutterBottom>
      {title}
    </Typography>
    
    <Typography variant="body1" color="text.secondary" sx={{ mb: 4, maxWidth: 400 }}>
      {description}
    </Typography>
    
    {action}
  </Box>
);
```

## Component States

### Loading States

```jsx
// Skeleton loader
<Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
  <Skeleton variant="text" width="60%" height={32} />
  <Skeleton variant="rectangular" height={200} />
  <Box sx={{ display: 'flex', gap: 2 }}>
    <Skeleton variant="circular" width={40} height={40} />
    <Skeleton variant="text" width="40%" />
  </Box>
</Box>

// Loading button
<Button disabled>
  <CircularProgress size={20} sx={{ mr: 1 }} />
  Loading...
</Button>
```

### Error States

```jsx
const ErrorBoundary = ({ error, resetError }) => (
  <Alert 
    severity="error"
    action={
      <Button color="inherit" size="small" onClick={resetError}>
        Try Again
      </Button>
    }
  >
    <AlertTitle>Something went wrong</AlertTitle>
    {error.message}
  </Alert>
);
```

## Accessibility Patterns

```jsx
// Accessible icon button
<IconButton
  aria-label="delete item"
  onClick={handleDelete}
  size="small"
>
  <DeleteIcon />
</IconButton>

// Accessible form
<FormControl fullWidth error={!!error}>
  <InputLabel id="category-label">Category</InputLabel>
  <Select
    labelId="category-label"
    value={category}
    onChange={handleChange}
    label="Category"
  >
    <MenuItem value="tech">Technology</MenuItem>
    <MenuItem value="design">Design</MenuItem>
  </Select>
  {error && <FormHelperText>{error}</FormHelperText>}
</FormControl>

// Skip navigation
<Button
  sx={{ position: 'absolute', left: -9999, '&:focus': { left: 10 } }}
  onClick={() => document.getElementById('main-content').focus()}
>
  Skip to main content
</Button>
```

## Component Composition Rules

1. **Single Responsibility** - Each component does one thing well
2. **Composable** - Components can be combined to create complex UIs
3. **Predictable Props** - Consistent prop naming across components
4. **Accessible by Default** - All components meet WCAG standards
5. **Theme-aware** - Components adapt to theme changes
6. **Responsive** - Components work across all screen sizes