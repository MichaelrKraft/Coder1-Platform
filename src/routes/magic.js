const express = require('express');
const router = express.Router();

// Check if Magic API key is configured
const MAGIC_API_KEY = process.env.MAGIC_21ST_API_KEY;
const MAGIC_ENABLED = !!MAGIC_API_KEY;

// Component library fallback for when Magic API is unavailable
const fallbackComponents = {
  button: {
    typescript: {
      code: `import React from 'react';

interface ButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  variant?: 'primary' | 'secondary' | 'glow';
  size?: 'sm' | 'md' | 'lg';
}

export const Button: React.FC<ButtonProps> = ({ 
  children, 
  onClick, 
  variant = 'primary',
  size = 'md' 
}) => {
  const baseClasses = 'inline-flex items-center justify-center font-medium rounded-lg transition-all duration-300';
  
  const variantClasses = {
    primary: 'bg-purple-600 hover:bg-purple-700 text-white shadow-lg hover:shadow-xl',
    secondary: 'bg-gray-600 hover:bg-gray-700 text-white',
    glow: 'bg-purple-600 hover:bg-purple-700 text-white shadow-lg shadow-purple-500/50 hover:shadow-xl hover:shadow-purple-500/60 animate-pulse'
  };
  
  const sizeClasses = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-6 py-3 text-base',
    lg: 'px-8 py-4 text-lg'
  };
  
  return (
    <button
      onClick={onClick}
      className={\`\${baseClasses} \${variantClasses[variant]} \${sizeClasses[size]}\`}
    >
      {children}
    </button>
  );
};`,
      explanation: 'A customizable button component with multiple variants and sizes'
    }
  },
  'shiny-text': {
    typescript: {
      code: `import React from 'react';

interface ShinyTextProps {
  children: React.ReactNode;
  className?: string;
}

export const ShinyText: React.FC<ShinyTextProps> = ({ children, className = '' }) => {
  return (
    <span className={\`relative inline-block \${className}\`}>
      <span className="relative z-10 bg-gradient-to-r from-purple-400 via-pink-400 to-purple-400 bg-clip-text text-transparent animate-gradient-x">
        {children}
      </span>
      <span className="absolute inset-0 bg-gradient-to-r from-purple-400/0 via-white/30 to-purple-400/0 blur-xl animate-shimmer" />
    </span>
  );
};

// Add to your CSS:
// @keyframes gradient-x {
//   0%, 100% { background-position: 0% 50%; }
//   50% { background-position: 100% 50%; }
// }
// @keyframes shimmer {
//   0% { transform: translateX(-100%); }
//   100% { transform: translateX(100%); }
// }`,
      explanation: 'An animated text component with a shiny gradient effect'
    }
  },
  card: {
    typescript: {
      code: `import React from 'react';

interface CardProps {
  title: string;
  description: string;
  imageUrl?: string;
  onClick?: () => void;
}

export const Card: React.FC<CardProps> = ({ title, description, imageUrl, onClick }) => {
  return (
    <div 
      className="group relative overflow-hidden rounded-xl bg-white/10 backdrop-blur-lg border border-white/20 p-6 transition-all duration-300 hover:scale-105 hover:bg-white/20 cursor-pointer"
      onClick={onClick}
    >
      {imageUrl && (
        <img 
          src={imageUrl} 
          alt={title}
          className="w-full h-48 object-cover rounded-lg mb-4"
        />
      )}
      <h3 className="text-xl font-semibold text-white mb-2">{title}</h3>
      <p className="text-gray-300">{description}</p>
      <div className="absolute inset-0 bg-gradient-to-r from-purple-500/0 via-purple-500/20 to-purple-500/0 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
    </div>
  );
};`,
      explanation: 'A glassmorphic card component with hover effects'
    }
  }
};

// Health check endpoint
router.get('/health', (req, res) => {
  res.json({
    status: 'healthy',
    magic21st: {
      connected: MAGIC_ENABLED,
      version: '0.1.0',
      features: ['ui-generation', 'component-library', 'fallback-mode']
    }
  });
});

// Get available capabilities
router.get('/capabilities', (req, res) => {
  res.json({
    success: true,
    capabilities: {
      componentTypes: ['button', 'text', 'card', 'form', 'navigation', 'layout'],
      variants: ['typescript', 'javascript', 'tailwind', 'css'],
      animations: ['pulse', 'glow', 'shimmer', 'fade', 'slide'],
      customizations: ['color', 'size', 'spacing', 'animation']
    }
  });
});

// Generate UI component
router.post('/ui', async (req, res) => {
  const { message } = req.body;
  
  if (!message) {
    return res.json({
      success: false,
      error: 'No message provided'
    });
  }

  try {
    // Parse the message to determine component type
    const componentType = detectComponentType(message);
    const customizations = extractCustomizations(message);

    // If Magic API is enabled, try to use it
    if (MAGIC_ENABLED) {
      // TODO: Implement actual 21st.dev Magic API call
      // For now, we'll use the fallback
    }

    // Use fallback component library
    const component = generateFallbackComponent(componentType, customizations);
    
    res.json({
      success: true,
      component: {
        code: component.code,
        explanation: component.explanation,
        metadata: {
          componentType,
          source: MAGIC_ENABLED ? 'magic-fallback' : 'local-fallback',
          timestamp: new Date().toISOString()
        }
      },
      customizations: {
        detected: componentType,
        applied: customizations
      },
      variants: generateVariants(component, componentType)
    });

  } catch (error) {
    console.error('Error generating component:', error);
    res.json({
      success: false,
      error: 'Failed to generate component',
      details: error.message
    });
  }
});

// Helper function to detect component type from message
function detectComponentType(message) {
  const msg = message.toLowerCase();
  
  if (msg.includes('button')) return 'button';
  if (msg.includes('text') || msg.includes('heading') || msg.includes('title')) return 'shiny-text';
  if (msg.includes('card')) return 'card';
  if (msg.includes('form') || msg.includes('input')) return 'form';
  if (msg.includes('nav') || msg.includes('menu')) return 'navigation';
  if (msg.includes('loader') || msg.includes('spinner')) return 'loader';
  
  return 'button'; // Default
}

// Helper function to extract customizations from message
function extractCustomizations(message) {
  const msg = message.toLowerCase();
  const customizations = {};

  // Colors
  if (msg.includes('purple')) customizations.color = 'purple';
  else if (msg.includes('blue')) customizations.color = 'blue';
  else if (msg.includes('green')) customizations.color = 'green';
  else if (msg.includes('red')) customizations.color = 'red';

  // Sizes
  if (msg.includes('large') || msg.includes('big')) customizations.size = 'large';
  else if (msg.includes('small') || msg.includes('tiny')) customizations.size = 'small';

  // Effects
  if (msg.includes('glow')) customizations.effect = 'glow';
  else if (msg.includes('pulse')) customizations.effect = 'pulse';
  else if (msg.includes('shimmer') || msg.includes('shiny')) customizations.effect = 'shimmer';

  // Animation
  if (msg.includes('animate') || msg.includes('animation')) customizations.animated = true;

  return customizations;
}

// Generate component from fallback library
function generateFallbackComponent(componentType, customizations) {
  const component = fallbackComponents[componentType] || fallbackComponents.button;
  let code = component.typescript.code;
  
  // Apply customizations to the code
  if (customizations.color) {
    code = code.replace(/purple/g, customizations.color);
  }
  
  if (customizations.effect === 'glow' && componentType === 'button') {
    code = code.replace("variant = 'primary'", "variant = 'glow'");
  }
  
  return {
    code,
    explanation: component.typescript.explanation
  };
}

// Generate variants (TypeScript, JavaScript, with/without Tailwind)
function generateVariants(component, componentType) {
  const tsCode = component.code;
  
  // Convert TypeScript to JavaScript
  const jsCode = tsCode
    .replace(/interface \w+Props {[\s\S]*?}/gm, '')
    .replace(/: React\.FC<\w+Props>/g, '')
    .replace(/: React\.ReactNode/g, '')
    .replace(/: \(\) => void/g, '')
    .replace(/: string/g, '')
    .replace(/: 'primary' \| 'secondary' \| 'glow'/g, '')
    .replace(/: 'sm' \| 'md' \| 'lg'/g, '')
    .replace(/export const (\w+): React\.FC<\w+Props> = /g, 'export const $1 = ');

  return [
    {
      name: 'TypeScript + Tailwind',
      language: 'typescript',
      styling: 'tailwind',
      code: tsCode
    },
    {
      name: 'JavaScript + Tailwind',
      language: 'javascript',
      styling: 'tailwind',
      code: jsCode
    },
    {
      name: 'TypeScript + CSS Modules',
      language: 'typescript',
      styling: 'css',
      code: tsCode.replace(/className=\{[^}]+\}/g, 'className={styles.component}')
    },
    {
      name: 'JavaScript + CSS Modules',
      language: 'javascript',
      styling: 'css',
      code: jsCode.replace(/className=\{[^}]+\}/g, 'className={styles.component}')
    }
  ];
}

// Search components endpoint (for future use)
router.get('/search', (req, res) => {
  const { query } = req.query;
  
  res.json({
    success: true,
    results: [
      {
        name: 'Glowing Button',
        type: 'button',
        tags: ['interactive', 'animated', 'modern']
      },
      {
        name: 'Shiny Text',
        type: 'text',
        tags: ['animated', 'gradient', 'eye-catching']
      },
      {
        name: 'Glass Card',
        type: 'card',
        tags: ['glassmorphic', 'modern', 'hover']
      }
    ]
  });
});

module.exports = router;