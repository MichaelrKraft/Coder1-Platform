import React, { useState, useEffect, useRef } from 'react';
import './ReactBits.css';

interface ComponentLibraryItem {
  name: string;
  icon: string;
  components: ComponentItem[];
}

interface ComponentItem {
  name: string;
  component: React.ComponentType<any>;
  props?: { [key: string]: { type: string; default: any } };
  needsBackground?: boolean;
  code: string;
}

const ReactBits: React.FC = () => {
  const [selectedComponent, setSelectedComponent] = useState<ComponentItem | null>(null);
  const [componentProps, setComponentProps] = useState<{ [key: string]: any }>({});
  const [background, setBackground] = useState<string>('dark');
  const [searchQuery, setSearchQuery] = useState('');

  // Listen for terminal UI commands
  useEffect(() => {
    const handleTerminalUISelect = (event: CustomEvent) => {
      const { componentName, category } = event.detail;
      
      // Find matching component
      const categoryIndex = componentLibrary.findIndex(cat => 
        cat.name.toLowerCase().includes(category.toLowerCase())
      );
      
      if (categoryIndex !== -1) {
        const componentIndex = componentLibrary[categoryIndex].components.findIndex(comp =>
          comp.name.toLowerCase().includes(componentName.toLowerCase()) ||
          componentName.toLowerCase().includes(comp.name.toLowerCase())
        );
        
        if (componentIndex !== -1) {
          selectComponent(categoryIndex, componentIndex);
          // Clear search to show all components
          setSearchQuery('');
        }
      }
    };

    window.addEventListener('terminal-ui-select', handleTerminalUISelect as EventListener);
    return () => {
      window.removeEventListener('terminal-ui-select', handleTerminalUISelect as EventListener);
    };
  }, []);

  // Enhanced component library with React components and interactivity
  const componentLibrary: ComponentLibraryItem[] = [
    {
      name: 'Buttons',
      icon: '🔘',
      components: [
        {
          name: 'Glowing Button',
          component: ({ text = 'Click Me', onClick }: any) => (
            <button
              onClick={onClick || (() => alert('Button clicked!'))}
              className="px-6 py-3 bg-purple-600 hover:bg-purple-700 text-white font-medium rounded-lg transition-all duration-300 shadow-lg shadow-purple-500/50 hover:shadow-xl hover:shadow-purple-500/60 animate-pulse-glow"
            >
              {text}
            </button>
          ),
          props: {
            text: { type: 'text', default: 'Click Me' }
          },
          code: `export const GlowingButton = ({ children, onClick }) => {
  return (
    <button
      onClick={onClick}
      className="px-6 py-3 bg-purple-600 hover:bg-purple-700 text-white font-medium rounded-lg transition-all duration-300 shadow-lg shadow-purple-500/50 hover:shadow-xl hover:shadow-purple-500/60 animate-pulse"
    >
      {children}
    </button>
  );
};`
        },
        {
          name: 'Gradient Button',
          component: ({ text = 'Gradient Magic', onClick }: any) => (
            <button
              onClick={onClick || (() => alert('Gradient button clicked!'))}
              className="px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white font-medium rounded-lg transition-all duration-300 transform hover:scale-105"
            >
              {text}
            </button>
          ),
          props: {
            text: { type: 'text', default: 'Gradient Magic' }
          },
          code: `export const GradientButton = ({ children, onClick }) => {
  return (
    <button
      onClick={onClick}
      className="px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white font-medium rounded-lg transition-all duration-300 transform hover:scale-105"
    >
      {children}
    </button>
  );
};`
        },
        {
          name: 'Outline Button',
          component: ({ text = 'Outline Style', onClick }: any) => (
            <button
              onClick={onClick || (() => alert('Outline button clicked!'))}
              className="px-6 py-3 border-2 border-purple-500 text-purple-400 hover:bg-purple-500 hover:text-white font-medium rounded-lg transition-all duration-300 shadow-lg"
            >
              {text}
            </button>
          ),
          props: {
            text: { type: 'text', default: 'Outline Style' }
          },
          code: `export const OutlineButton = ({ children, onClick }) => {
  return (
    <button
      onClick={onClick}
      className="px-6 py-3 border-2 border-purple-500 text-purple-400 hover:bg-purple-500 hover:text-white font-medium rounded-lg transition-all duration-300"
    >
      {children}
    </button>
  );
};`
        },
        {
          name: 'Glass Button',
          component: ({ text = 'Glass Effect', onClick }: any) => (
            <button
              onClick={onClick || (() => alert('Glass button clicked!'))}
              className="px-6 py-3 bg-white/10 backdrop-blur-md border border-white/30 text-white font-medium rounded-lg transition-all duration-300 hover:bg-white/20 shadow-lg"
              style={{ backgroundColor: 'rgba(139, 92, 246, 0.1)' }}
            >
              {text}
            </button>
          ),
          props: {
            text: { type: 'text', default: 'Glass Effect' }
          },
          needsBackground: true,
          code: `export const GlassButton = ({ children, onClick }) => {
  return (
    <button
      onClick={onClick}
      className="px-6 py-3 bg-white/10 backdrop-blur-md border border-white/30 text-white font-medium rounded-lg transition-all duration-300 hover:bg-white/20 shadow-lg"
      style={{ backgroundColor: 'rgba(139, 92, 246, 0.1)' }}
    >
      {children}
    </button>
  );
};`
        },
        {
          name: 'Floating Button',
          component: ({ text = 'Floating', onClick }: any) => (
            <button
              onClick={onClick || (() => alert('Floating button clicked!'))}
              className="px-6 py-3 bg-purple-600 text-white font-medium rounded-full shadow-lg transition-all duration-300 animate-float"
            >
              {text}
            </button>
          ),
          props: {
            text: { type: 'text', default: 'Floating' }
          },
          code: `export const FloatingButton = ({ children, onClick }) => {
  return (
    <button
      onClick={onClick}
      className="px-6 py-3 bg-purple-600 text-white font-medium rounded-full shadow-lg transition-all duration-300 animate-bounce"
    >
      {children}
    </button>
  );
};`
        }
      ]
    },
    {
      name: 'Text Effects',
      icon: '✨',
      components: [
        {
          name: 'Shiny Text',
          component: ({ text = 'Shiny Text Effect' }: any) => (
            <h2 className="text-4xl font-bold">
              <span className="bg-gradient-to-r from-purple-400 via-pink-400 to-purple-400 bg-clip-text text-transparent animate-gradient-x inline-block">
                {text}
              </span>
            </h2>
          ),
          props: {
            text: { type: 'text', default: 'Shiny Text Effect' }
          },
          code: `export const ShinyText = ({ children, className = '' }) => {
  return (
    <span className={\`inline-block \${className}\`}>
      <span className="bg-gradient-to-r from-purple-400 via-pink-400 to-purple-400 bg-clip-text text-transparent animate-gradient-x">
        {children}
      </span>
    </span>
  );
};`
        },
        {
          name: 'Typewriter Text',
          component: React.memo(({ text = 'Hello, World!', speed = 100 }: any) => {
            const [displayText, setDisplayText] = useState('');
            const [currentIndex, setCurrentIndex] = useState(0);

            useEffect(() => {
              if (currentIndex < text.length) {
                const timer = setTimeout(() => {
                  setDisplayText(prev => prev + text[currentIndex]);
                  setCurrentIndex(prev => prev + 1);
                }, speed);
                return () => clearTimeout(timer);
              }
            }, [currentIndex, text, speed]);

            useEffect(() => {
              setDisplayText('');
              setCurrentIndex(0);
            }, [text]);

            return (
              <h2 className="text-2xl font-mono text-green-400">
                {displayText}
                <span className="animate-pulse">|</span>
              </h2>
            );
          }),
          props: {
            text: { type: 'text', default: 'Hello, World!' },
            speed: { type: 'number', default: 100 }
          },
          code: `export const TypewriterText = ({ text, speed = 100 }) => {
  const [displayText, setDisplayText] = useState('');
  const [currentIndex, setCurrentIndex] = useState(0);
  
  useEffect(() => {
    if (currentIndex < text.length) {
      const timer = setTimeout(() => {
        setDisplayText(prev => prev + text[currentIndex]);
        setCurrentIndex(prev => prev + 1);
      }, speed);
      return () => clearTimeout(timer);
    }
  }, [currentIndex, text, speed]);
  
  return (
    <span className="font-mono">
      {displayText}
      <span className="animate-pulse">|</span>
    </span>
  );
};`
        },
        {
          name: 'Glitch Text',
          component: ({ text = 'Glitch Effect' }: any) => (
            <h2 className="text-3xl font-bold relative glitch" data-text={text}>
              <span className="animate-pulse text-purple-400">{text}</span>
            </h2>
          ),
          props: {
            text: { type: 'text', default: 'Glitch Effect' }
          },
          code: `export const GlitchText = ({ children }) => {
  return (
    <div className="relative inline-block">
      <span className="relative z-10">{children}</span>
      <span className="absolute top-0 left-0 text-red-500 opacity-70 animate-glitch-1">{children}</span>
      <span className="absolute top-0 left-0 text-blue-500 opacity-60 animate-glitch-2">{children}</span>
    </div>
  );
};`
        },
        {
          name: 'Rainbow Text',
          component: ({ text = 'Rainbow Colors' }: any) => (
            <h2 className="text-4xl font-bold bg-gradient-to-r from-red-500 via-yellow-500 via-green-500 via-blue-500 via-indigo-500 to-purple-500 bg-clip-text text-transparent animate-gradient-x">
              {text}
            </h2>
          ),
          props: {
            text: { type: 'text', default: 'Rainbow Colors' }
          },
          code: `export const RainbowText = ({ children, className = '' }) => {
  return (
    <span className={\`bg-gradient-to-r from-red-500 via-yellow-500 via-green-500 via-blue-500 via-indigo-500 to-purple-500 bg-clip-text text-transparent animate-gradient-x \${className}\`}>
      {children}
    </span>
  );
};`
        },
        {
          name: 'Gradient Text',
          component: ({ text = 'Gradient Text' }: any) => (
            <h2 className="text-4xl font-bold bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 bg-clip-text text-transparent">
              {text}
            </h2>
          ),
          props: {
            text: { type: 'text', default: 'Gradient Text' }
          },
          code: `export const GradientText = ({ children, className = '' }) => {
  return (
    <span className={\`bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 bg-clip-text text-transparent \${className}\`}>
      {children}
    </span>
  );
};`
        }
      ]
    },
    {
      name: 'Cards',
      icon: '🃏',
      components: [
        {
          name: 'Glass Card',
          component: ({ title = 'Glass Card', description = 'Beautiful glassmorphism effect with backdrop blur' }: any) => (
            <div className="p-6 rounded-xl bg-white/10 backdrop-blur-md border border-white/20 shadow-xl hover:bg-white/20 transition-all">
              <h3 className="text-xl font-semibold mb-2">{title}</h3>
              <p className="text-gray-300">{description}</p>
            </div>
          ),
          props: {
            title: { type: 'text', default: 'Glass Card' },
            description: { type: 'text', default: 'Beautiful glassmorphism effect with backdrop blur' }
          },
          needsBackground: true,
          code: `export const GlassCard = ({ title, description }) => {
  return (
    <div className="p-6 rounded-xl bg-white/10 backdrop-blur-md border border-white/20 shadow-xl hover:bg-white/20 transition-all">
      <h3 className="text-xl font-semibold mb-2">{title}</h3>
      <p className="text-gray-300">{description}</p>
    </div>
  );
};`
        },
        {
          name: 'Gradient Card',
          component: ({ title = 'Gradient Card', description = 'Subtle gradient background with border' }: any) => (
            <div className="p-6 rounded-xl bg-gradient-to-br from-purple-500/20 to-pink-500/20 border border-purple-500/30 hover:from-purple-500/30 hover:to-pink-500/30 transition-all">
              <h3 className="text-xl font-semibold mb-2">{title}</h3>
              <p className="text-gray-300">{description}</p>
            </div>
          ),
          props: {
            title: { type: 'text', default: 'Gradient Card' },
            description: { type: 'text', default: 'Subtle gradient background with border' }
          },
          code: `export const GradientCard = ({ title, description }) => {
  return (
    <div className="p-6 rounded-xl bg-gradient-to-br from-purple-500/20 to-pink-500/20 border border-purple-500/30 hover:from-purple-500/30 hover:to-pink-500/30 transition-all">
      <h3 className="text-xl font-semibold mb-2">{title}</h3>
      <p className="text-gray-300">{description}</p>
    </div>
  );
};`
        },
        {
          name: 'Hover Card',
          component: ({ title = 'Hover Card', description = 'Hover for elevation effect' }: any) => (
            <div className="p-6 rounded-xl bg-gray-800 border border-gray-700 hover:border-purple-500 hover:shadow-lg hover:shadow-purple-500/20 transition-all duration-300 transform hover:-translate-y-1">
              <h3 className="text-xl font-semibold mb-2">{title}</h3>
              <p className="text-gray-400">{description}</p>
            </div>
          ),
          props: {
            title: { type: 'text', default: 'Hover Card' },
            description: { type: 'text', default: 'Hover for elevation effect' }
          },
          code: `export const HoverCard = ({ title, description }) => {
  return (
    <div className="p-6 rounded-xl bg-gray-800 border border-gray-700 hover:border-purple-500 hover:shadow-lg hover:shadow-purple-500/20 transition-all duration-300 transform hover:-translate-y-1">
      <h3 className="text-xl font-semibold mb-2">{title}</h3>
      <p className="text-gray-400">{description}</p>
    </div>
  );
};`
        }
      ]
    },
    {
      name: 'Inputs',
      icon: '📝',
      components: [
        {
          name: 'Glowing Input',
          component: ({ placeholder = 'Enter text...', value = '', onChange }: any) => (
            <input
              type="text"
              placeholder={placeholder}
              value={value}
              onChange={onChange || (() => {})}
              className="px-4 py-2 bg-gray-800 border border-purple-500 rounded-lg text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all shadow-lg shadow-purple-500/20"
            />
          ),
          props: {
            placeholder: { type: 'text', default: 'Enter text...' },
            value: { type: 'text', default: '' }
          },
          code: `export const GlowingInput = ({ placeholder, value, onChange }) => {
  return (
    <input
      type="text"
      placeholder={placeholder}
      value={value}
      onChange={onChange}
      className="px-4 py-2 bg-gray-800 border border-purple-500 rounded-lg text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all shadow-lg shadow-purple-500/20"
    />
  );
};`
        },
        {
          name: 'Glass Input',
          component: ({ placeholder = 'Glass input...', value = '', onChange }: any) => (
            <input
              type="text"
              placeholder={placeholder}
              value={value}
              onChange={onChange || (() => {})}
              className="px-4 py-2 bg-white/10 backdrop-blur-md border border-white/30 rounded-lg text-white placeholder-gray-300 focus:bg-white/20 transition-all"
            />
          ),
          props: {
            placeholder: { type: 'text', default: 'Glass input...' },
            value: { type: 'text', default: '' }
          },
          needsBackground: true,
          code: `export const GlassInput = ({ placeholder, value, onChange }) => {
  return (
    <input
      type="text"
      placeholder={placeholder}
      value={value}
      onChange={onChange}
      className="px-4 py-2 bg-white/10 backdrop-blur-md border border-white/30 rounded-lg text-white placeholder-gray-300 focus:bg-white/20 transition-all"
    />
  );
};`
        },
        {
          name: 'Animated Input',
          component: ({ placeholder = 'Animated focus...', value = '', onChange }: any) => (
            <div className="relative">
              <input
                type="text"
                placeholder={placeholder}
                value={value}
                onChange={onChange || (() => {})}
                className="px-4 py-2 w-full bg-gray-800 border-2 border-gray-600 rounded-lg text-white focus:border-purple-500 transition-all duration-300 transform focus:scale-105"
              />
            </div>
          ),
          props: {
            placeholder: { type: 'text', default: 'Animated focus...' },
            value: { type: 'text', default: '' }
          },
          code: `export const AnimatedInput = ({ placeholder, value, onChange }) => {
  return (
    <div className="relative">
      <input
        type="text"
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        className="px-4 py-2 w-full bg-gray-800 border-2 border-gray-600 rounded-lg text-white focus:border-purple-500 transition-all duration-300 transform focus:scale-105"
      />
    </div>
  );
};`
        }
      ]
    },
    {
      name: 'Loaders',
      icon: '⏳',
      components: [
        {
          name: 'Spinning Loader',
          component: ({ size = '8', color = 'purple' }: any) => (
            <div className={`w-${size} h-${size} border-4 border-gray-600 border-t-${color}-500 rounded-full animate-spin`}></div>
          ),
          props: {
            size: { type: 'text', default: '8' },
            color: { type: 'text', default: 'purple' }
          },
          code: `export const SpinningLoader = ({ size = '8', color = 'purple' }) => {
  return (
    <div className={\`w-\${size} h-\${size} border-4 border-gray-600 border-t-\${color}-500 rounded-full animate-spin\`}></div>
  );
};`
        },
        {
          name: 'Pulse Loader',
          component: ({ text = 'Loading...' }: any) => (
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-purple-500 rounded-full animate-pulse"></div>
              <div className="w-2 h-2 bg-purple-500 rounded-full animate-pulse" style={{ animationDelay: '0.2s' }}></div>
              <div className="w-2 h-2 bg-purple-500 rounded-full animate-pulse" style={{ animationDelay: '0.4s' }}></div>
              <span className="ml-2 text-gray-300">{text}</span>
            </div>
          ),
          props: {
            text: { type: 'text', default: 'Loading...' }
          },
          code: `export const PulseLoader = ({ text = 'Loading...' }) => {
  return (
    <div className="flex items-center space-x-2">
      <div className="w-2 h-2 bg-purple-500 rounded-full animate-pulse"></div>
      <div className="w-2 h-2 bg-purple-500 rounded-full animate-pulse" style={{ animationDelay: '0.2s' }}></div>
      <div className="w-2 h-2 bg-purple-500 rounded-full animate-pulse" style={{ animationDelay: '0.4s' }}></div>
      <span className="ml-2 text-gray-300">{text}</span>
    </div>
  );
};`
        },
        {
          name: 'Bar Loader',
          component: ({ progress = 60 }: any) => (
            <div className="w-full bg-gray-700 rounded-full h-2">
              <div 
                className="bg-gradient-to-r from-purple-500 to-pink-500 h-2 rounded-full transition-all duration-300"
                style={{ width: `${progress}%` }}
              ></div>
            </div>
          ),
          props: {
            progress: { type: 'number', default: 60 }
          },
          code: `export const BarLoader = ({ progress = 60 }) => {
  return (
    <div className="w-full bg-gray-700 rounded-full h-2">
      <div 
        className="bg-gradient-to-r from-purple-500 to-pink-500 h-2 rounded-full transition-all duration-300"
        style={{ width: \`\${progress}%\` }}
      ></div>
    </div>
  );
};`
        }
      ]
    },
    {
      name: 'Badges',
      icon: '🏷️',
      components: [
        {
          name: 'Pulse Badge',
          component: ({ text = 'New', color = 'purple' }: any) => (
            <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-${color}-100 text-${color}-800 animate-pulse`}>
              {text}
            </span>
          ),
          props: {
            text: { type: 'text', default: 'New' },
            color: { type: 'text', default: 'purple' }
          },
          code: `export const PulseBadge = ({ text = 'New', color = 'purple' }) => {
  return (
    <span className={\`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-\${color}-100 text-\${color}-800 animate-pulse\`}>
      {text}
    </span>
  );
};`
        },
        {
          name: 'Gradient Badge',
          component: ({ text = 'Pro', onClick }: any) => (
            <span 
              onClick={onClick || (() => {})}
              className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-gradient-to-r from-purple-500 to-pink-500 text-white cursor-pointer hover:from-purple-600 hover:to-pink-600 transition-all"
            >
              {text}
            </span>
          ),
          props: {
            text: { type: 'text', default: 'Pro' }
          },
          code: `export const GradientBadge = ({ text = 'Pro', onClick }) => {
  return (
    <span 
      onClick={onClick}
      className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-gradient-to-r from-purple-500 to-pink-500 text-white cursor-pointer hover:from-purple-600 hover:to-pink-600 transition-all"
    >
      {text}
    </span>
  );
};`
        }
      ]
    }
  ];

  // React Preview Component
  const PreviewComponent = ({ component, props }: { component: ComponentItem; props: any }) => {
    const Component = component.component;
    return <Component {...props} />;
  };

  // Props Editor Component
  const PropsEditor = ({ componentProps, currentProps, onChange }: any) => {
    if (!componentProps) return null;
    
    return (
      <div className="space-y-3">
        {Object.entries(componentProps).map(([key, config]: [string, any]) => (
          <div key={key}>
            <label className="text-xs font-medium text-gray-400 mb-1 block">
              {key}
            </label>
            {config.type === 'text' && (
              <input
                type="text"
                value={currentProps[key] || config.default}
                onChange={(e) => onChange(key, e.target.value)}
                className="w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded text-white text-sm focus:border-purple-500 focus:outline-none"
              />
            )}
            {config.type === 'number' && (
              <input
                type="number"
                value={currentProps[key] || config.default}
                onChange={(e) => onChange(key, parseInt(e.target.value))}
                className="w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded text-white text-sm focus:border-purple-500 focus:outline-none"
              />
            )}
            {config.type === 'boolean' && (
              <label className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={currentProps[key] !== undefined ? currentProps[key] : config.default}
                  onChange={(e) => onChange(key, e.target.checked)}
                  className="text-purple-600"
                />
                <span className="text-gray-300 text-sm">Enabled</span>
              </label>
            )}
          </div>
        ))}
      </div>
    );
  };

  // Main App Component
  const selectComponent = (catIndex: number, compIndex: number) => {
    const component = componentLibrary[catIndex].components[compIndex];
    setSelectedComponent({ ...component, catIndex, compIndex } as any);
    
    // Initialize props with defaults
    const defaultProps: any = {};
    if (component.props) {
      Object.entries(component.props).forEach(([key, config]: [string, any]) => {
        defaultProps[key] = config.default;
      });
    }
    setComponentProps(defaultProps);
    
    // Update background if needed
    if (component.needsBackground && background === 'dark') {
      setBackground('gradient');
    }
  };

  const updateProp = (key: string, value: any) => {
    setComponentProps((prev: any) => ({ ...prev, [key]: value }));
  };

  const getBackgroundClass = () => {
    switch (background) {
      case 'gradient': return 'bg-gradient-to-br from-purple-600/20 to-pink-600/20';
      case 'mesh': return 'bg-gradient-to-br from-indigo-900 to-purple-900';
      case 'grid': return 'bg-gray-900';
      case 'white': return 'bg-white text-gray-900';
      default: return 'bg-gray-950 text-white';
    }
  };

  const filteredComponents = searchQuery
    ? componentLibrary.map(cat => ({
        ...cat,
        components: cat.components.filter(comp => 
          comp.name.toLowerCase().includes(searchQuery.toLowerCase())
        )
      })).filter(cat => cat.components.length > 0)
    : componentLibrary;

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  const insertComponent = () => {
    if (selectedComponent && selectedComponent.code) {
      const event = new CustomEvent('reactbits-insert', {
        detail: { code: selectedComponent.code }
      });
      window.dispatchEvent(event);
    }
  };

  return (
    <div className="react-bits h-full flex flex-col bg-gray-900 text-white">
      {/* Header */}
      <div className="p-4 border-b border-gray-700">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-xl font-bold text-purple-400">🎨 React Bits</h2>
          <span className="text-sm text-gray-400">{componentLibrary.reduce((acc, cat) => acc + cat.components.length, 0)} Components</span>
        </div>
        
        {/* Search */}
        <div className="relative">
          <input 
            type="text" 
            placeholder="Search components..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full px-3 py-2 bg-gray-800 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
          />
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 flex min-h-0">
        {/* Component List */}
        <div className="w-64 flex-shrink-0 border-r border-gray-700 overflow-y-auto p-4">
          {filteredComponents.map((category, catIndex) => (
            <div key={category.name} className="mb-6">
              <h3 className="text-sm font-semibold text-gray-400 mb-2 flex items-center">
                <span className="mr-2">{category.icon}</span>
                {category.name}
                <span className="ml-auto text-xs">{category.components.length}</span>
              </h3>
              <div className="space-y-1">
                {category.components.map((component, compIndex) => (
                  <button
                    key={component.name}
                    onClick={() => selectComponent(catIndex, compIndex)}
                    className={`w-full text-left px-3 py-2 rounded text-sm transition-colors ${
                      selectedComponent?.name === component.name
                        ? 'bg-purple-600 text-white'
                        : 'text-gray-300 hover:bg-gray-800'
                    }`}
                  >
                    {component.name}
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Preview Panel */}
        <div className="flex-1 min-w-0 max-w-4xl flex flex-col">
          {/* Preview Controls */}
          <div className="px-4 py-2 border-b border-gray-700">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-semibold text-gray-300">Preview</h3>
              <div className="flex items-center space-x-2">
                <select 
                  value={background} 
                  onChange={(e) => setBackground(e.target.value)}
                  className="text-xs bg-gray-800 rounded px-2 py-1"
                >
                  <option value="dark">Dark</option>
                  <option value="gradient">Gradient</option>
                  <option value="mesh">Mesh</option>
                  <option value="grid">Grid</option>
                  <option value="white">Light</option>
                </select>
                {selectedComponent && (
                  <>
                    <button 
                      onClick={() => copyToClipboard(selectedComponent.code)}
                      className="text-xs bg-purple-600 hover:bg-purple-700 px-3 py-1 rounded"
                    >
                      Copy
                    </button>
                    <button 
                      onClick={insertComponent}
                      className="text-xs bg-green-600 hover:bg-green-700 px-3 py-1 rounded"
                    >
                      Insert
                    </button>
                  </>
                )}
              </div>
            </div>
          </div>

          {/* Props Editor */}
          {selectedComponent && selectedComponent.props && (
            <div className="px-4 py-3 border-b border-gray-700 bg-gray-800/50">
              <h4 className="text-xs font-semibold text-gray-400 mb-2">Component Props</h4>
              <PropsEditor
                componentProps={selectedComponent.props}
                currentProps={componentProps}
                onChange={updateProp}
              />
            </div>
          )}
          
          {/* Preview Area */}
          <div className={`flex-1 p-8 flex items-center justify-center ${getBackgroundClass()}`}>
            {selectedComponent ? (
              <PreviewComponent
                component={selectedComponent}
                props={componentProps}
              />
            ) : (
              <div className="text-center text-gray-500">
                <div className="text-4xl mb-2">👆</div>
                <p>Select a component to preview</p>
              </div>
            )}
          </div>
        </div>

        {/* Code Panel */}
        {selectedComponent && (
          <div className="w-80 flex-shrink-0 border-l border-gray-700 flex flex-col">
            <div className="px-4 py-2 border-b border-gray-700">
              <h3 className="text-sm font-semibold text-gray-300">Code</h3>
            </div>
            <div className="flex-1 overflow-x-auto overflow-y-auto p-4 bg-gray-950">
              <pre className="text-xs text-gray-300">
                <code>{selectedComponent.code}</code>
              </pre>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ReactBits;