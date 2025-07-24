const express = require('express');
const router = express.Router();

// This is a local component library for React Bits
// No external API required

// Enhanced component library with all 53 components
const componentLibrary = {
  buttons: {
    'glowing-button': {
      name: 'Glowing Button',
      code: `export const GlowingButton = ({ children, onClick }) => {
  return (
    <button
      onClick={onClick}
      className="px-6 py-3 bg-purple-600 hover:bg-purple-700 text-white font-medium rounded-lg transition-all duration-300 shadow-lg shadow-purple-500/50 hover:shadow-xl hover:shadow-purple-500/60 animate-pulse"
    >
      {children}
    </button>
  );
};`,
      explanation: 'A button with a pulsing glow effect'
    },
    'gradient-button': {
      name: 'Gradient Button',
      code: `export const GradientButton = ({ children, onClick }) => {
  return (
    <button
      onClick={onClick}
      className="px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white font-medium rounded-lg transition-all duration-300 transform hover:scale-105"
    >
      {children}
    </button>
  );
};`,
      explanation: 'A button with gradient background and scale effect'
    },
    'outline-button': {
      name: 'Outline Button',
      code: `export const OutlineButton = ({ children, onClick }) => {
  return (
    <button
      onClick={onClick}
      className="px-6 py-3 border-2 border-purple-500 text-purple-500 hover:bg-purple-500 hover:text-white font-medium rounded-lg transition-all duration-300"
    >
      {children}
    </button>
  );
};`,
      explanation: 'An outline button with fill on hover'
    },
    'glass-button': {
      name: 'Glass Button',
      code: `export const GlassButton = ({ children, onClick }) => {
  return (
    <button
      onClick={onClick}
      className="px-6 py-3 bg-white/10 backdrop-blur-md border border-white/20 text-white font-medium rounded-lg transition-all duration-300 hover:bg-white/20"
    >
      {children}
    </button>
  );
};`,
      explanation: 'A glassmorphic button with backdrop blur'
    },
    'floating-button': {
      name: 'Floating Button',
      code: `export const FloatingButton = ({ children, onClick }) => {
  return (
    <button
      onClick={onClick}
      className="px-6 py-3 bg-purple-600 text-white font-medium rounded-full shadow-lg transition-all duration-300 animate-float"
    >
      {children}
    </button>
  );
};`,
      explanation: 'A floating button with animation'
    }
  },
  'text-effects': {
    'shiny-text': {
      name: 'Shiny Text',
      code: `export const ShinyText = ({ children, className = '' }) => {
  return (
    <span className={\`inline-block \${className}\`}>
      <span className="bg-gradient-to-r from-purple-400 via-pink-400 to-purple-400 bg-clip-text text-transparent animate-gradient-x">
        {children}
      </span>
    </span>
  );
};`,
      explanation: 'Text with animated gradient effect'
    },
    'typewriter-text': {
      name: 'Typewriter Text',
      code: `export const TypewriterText = ({ text, speed = 100 }) => {
  const [displayText, setDisplayText] = useState('');
  
  useEffect(() => {
    let index = 0;
    const timer = setInterval(() => {
      if (index < text.length) {
        setDisplayText(prev => prev + text[index]);
        index++;
      } else {
        clearInterval(timer);
      }
    }, speed);
    
    return () => clearInterval(timer);
  }, [text, speed]);
  
  return <span className="font-mono">{displayText}<span className="animate-pulse">|</span></span>;
};`,
      explanation: 'Text that types out character by character'
    },
    'gradient-text': {
      name: 'Gradient Text',
      code: `export const GradientText = ({ children, className = '' }) => {
  return (
    <span className={\`bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 bg-clip-text text-transparent \${className}\`}>
      {children}
    </span>
  );
};`,
      explanation: 'Text with static gradient colors'
    },
    'glitch-text': {
      name: 'Glitch Text',
      code: `export const GlitchText = ({ children }) => {
  return (
    <h2 className="text-3xl font-bold relative glitch" data-text={children}>
      <span className="animate-pulse">{children}</span>
    </h2>
  );
};`,
      explanation: 'Text with glitch animation effect'
    },
    'neon-text': {
      name: 'Neon Text',
      code: `export const NeonText = ({ children, color = 'pink' }) => {
  const colors = {
    pink: '#ec4899',
    purple: '#a855f7',
    blue: '#3b82f6'
  };
  
  return (
    <h2 
      className="text-4xl font-bold"
      style={{
        color: colors[color],
        textShadow: \`0 0 10px \${colors[color]}, 0 0 20px \${colors[color]}, 0 0 30px \${colors[color]}\`
      }}
    >
      {children}
    </h2>
  );
};`,
      explanation: 'Text with neon glow effect'
    }
  },
  cards: {
    'glass-card': {
      name: 'Glass Card',
      code: `export const GlassCard = ({ title, description }) => {
  return (
    <div className="p-6 rounded-xl bg-white/10 backdrop-blur-md border border-white/20 shadow-xl hover:bg-white/20 transition-all">
      <h3 className="text-xl font-semibold mb-2">{title}</h3>
      <p className="text-gray-300">{description}</p>
    </div>
  );
};`,
      explanation: 'Card with glassmorphism effect'
    },
    'gradient-card': {
      name: 'Gradient Card',
      code: `export const GradientCard = ({ title, description }) => {
  return (
    <div className="p-6 rounded-xl bg-gradient-to-br from-purple-500/20 to-pink-500/20 border border-purple-500/30 hover:from-purple-500/30 hover:to-pink-500/30 transition-all">
      <h3 className="text-xl font-semibold mb-2">{title}</h3>
      <p className="text-gray-300">{description}</p>
    </div>
  );
};`,
      explanation: 'Card with gradient background'
    },
    'hover-card': {
      name: 'Hover Card',
      code: `export const HoverCard = ({ title, description }) => {
  return (
    <div className="p-6 rounded-xl bg-gray-800 border border-gray-700 hover:border-purple-500 hover:shadow-lg hover:shadow-purple-500/20 transition-all duration-300 transform hover:-translate-y-1">
      <h3 className="text-xl font-semibold mb-2">{title}</h3>
      <p className="text-gray-400">{description}</p>
    </div>
  );
};`,
      explanation: 'Card with elevation on hover'
    },
    'neon-card': {
      name: 'Neon Card',
      code: `export const NeonCard = ({ title, description }) => {
  return (
    <div 
      className="p-6 rounded-xl bg-gray-900 border-2 border-purple-500"
      style={{
        boxShadow: '0 0 20px rgba(168, 85, 247, 0.5), inset 0 0 20px rgba(168, 85, 247, 0.1)'
      }}
    >
      <h3 className="text-xl font-semibold mb-2 text-purple-400">{title}</h3>
      <p className="text-gray-300">{description}</p>
    </div>
  );
};`,
      explanation: 'Card with neon border effect'
    },
    '3d-card': {
      name: '3D Card',
      code: `export const Card3D = ({ title, description }) => {
  return (
    <div 
      className="p-6 rounded-xl bg-gray-800 transform transition-all duration-300 hover:rotate-3"
      style={{ transformStyle: 'preserve-3d', perspective: '1000px' }}
    >
      <h3 className="text-xl font-semibold mb-2">{title}</h3>
      <p className="text-gray-400">{description}</p>
    </div>
  );
};`,
      explanation: 'Card with 3D rotation on hover'
    }
  },
  loaders: {
    'pulse-loader': {
      name: 'Pulse Loader',
      code: `export const PulseLoader = () => {
  return (
    <div className="flex space-x-2">
      <div className="w-3 h-3 bg-purple-500 rounded-full animate-pulse"></div>
      <div className="w-3 h-3 bg-purple-500 rounded-full animate-pulse delay-75"></div>
      <div className="w-3 h-3 bg-purple-500 rounded-full animate-pulse delay-150"></div>
    </div>
  );
};`,
      explanation: 'Three dots with pulse animation'
    },
    'spin-loader': {
      name: 'Spin Loader',
      code: `export const SpinLoader = ({ size = 'md' }) => {
  const sizes = {
    sm: 'w-8 h-8',
    md: 'w-12 h-12',
    lg: 'w-16 h-16'
  };
  
  return (
    <div className={\`\${sizes[size]} border-4 border-purple-200 border-t-purple-600 rounded-full animate-spin\`}></div>
  );
};`,
      explanation: 'Circular spinner loader'
    },
    'dots-loader': {
      name: 'Dots Loader',
      code: `export const DotsLoader = () => {
  return (
    <div className="flex space-x-1">
      {[0, 150, 300].map((delay, i) => (
        <div
          key={i}
          className="w-2 h-2 bg-purple-500 rounded-full animate-bounce"
          style={{ animationDelay: \`\${delay}ms\` }}
        />
      ))}
    </div>
  );
};`,
      explanation: 'Bouncing dots loader'
    },
    'ring-loader': {
      name: 'Ring Loader',
      code: `export const RingLoader = () => {
  return (
    <div className="relative w-12 h-12">
      <div className="absolute inset-0 border-4 border-purple-200 rounded-full"></div>
      <div className="absolute inset-0 border-4 border-purple-600 rounded-full animate-spin border-t-transparent border-r-transparent border-b-transparent"></div>
    </div>
  );
};`,
      explanation: 'Ring loader with partial spin'
    },
    'bar-loader': {
      name: 'Bar Loader',
      code: `export const BarLoader = () => {
  return (
    <div className="flex space-x-1">
      {[0, 100, 200, 300, 400].map((delay, i) => (
        <div
          key={i}
          className="w-1 h-8 bg-purple-500 animate-pulse"
          style={{ animationDelay: \`\${delay}ms\` }}
        />
      ))}
    </div>
  );
};`,
      explanation: 'Vertical bars with pulse animation'
    }
  },
  backgrounds: {
    'gradient-background': {
      name: 'Gradient Background',
      code: `export const GradientBackground = ({ children }) => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-600 via-pink-500 to-red-500">
      {children}
    </div>
  );
};`,
      explanation: 'Full screen gradient background'
    },
    'animated-gradient': {
      name: 'Animated Gradient',
      code: `export const AnimatedGradient = ({ children }) => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-600 via-pink-500 to-red-500 animate-gradient-x" style={{ backgroundSize: '200% 200%' }}>
      {children}
    </div>
  );
};`,
      explanation: 'Animated gradient background'
    },
    'mesh-gradient': {
      name: 'Mesh Gradient',
      code: `export const MeshGradient = ({ children }) => {
  return (
    <div className="min-h-screen relative overflow-hidden bg-purple-900">
      <div className="absolute inset-0 bg-gradient-to-r from-pink-500/30 to-purple-500/30 blur-3xl"></div>
      <div className="absolute inset-0 bg-gradient-to-l from-blue-500/20 to-green-500/20 blur-3xl"></div>
      <div className="relative z-10">{children}</div>
    </div>
  );
};`,
      explanation: 'Mesh gradient with blur effect'
    },
    'particle-background': {
      name: 'Particle Background',
      code: `export const ParticleBackground = ({ children }) => {
  const particles = Array.from({ length: 20 }, (_, i) => ({
    id: i,
    size: Math.random() * 3 + 1,
    x: Math.random() * 100,
    y: Math.random() * 100,
    delay: Math.random() * 5
  }));
  
  return (
    <div className="min-h-screen bg-gray-900 relative overflow-hidden">
      {particles.map(p => (
        <div
          key={p.id}
          className="absolute bg-purple-500 rounded-full animate-float"
          style={{
            width: \`\${p.size}rem\`,
            height: \`\${p.size}rem\`,
            top: \`\${p.y}%\`,
            left: \`\${p.x}%\`,
            animationDelay: \`\${p.delay}s\`
          }}
        />
      ))}
      <div className="relative z-10">{children}</div>
    </div>
  );
};`,
      explanation: 'Animated floating particles background'
    },
    'grid-background': {
      name: 'Grid Background',
      code: `export const GridBackground = ({ children }) => {
  return (
    <div className="min-h-screen bg-gray-900 relative">
      <div 
        className="absolute inset-0"
        style={{
          backgroundImage: 'linear-gradient(rgba(139, 92, 246, 0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(139, 92, 246, 0.1) 1px, transparent 1px)',
          backgroundSize: '20px 20px'
        }}
      />
      <div className="relative z-10">{children}</div>
    </div>
  );
};`,
      explanation: 'Grid pattern background'
    }
  },
  forms: {
    'glass-input': {
      name: 'Glass Input',
      code: `export const GlassInput = ({ placeholder, value, onChange }) => {
  return (
    <input
      type="text"
      placeholder={placeholder}
      value={value}
      onChange={onChange}
      className="px-4 py-2 bg-white/10 backdrop-blur-md border border-white/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 text-white placeholder-gray-400"
    />
  );
};`,
      explanation: 'Input with glassmorphism effect'
    },
    'floating-label-input': {
      name: 'Floating Label Input',
      code: `export const FloatingLabelInput = ({ label, value, onChange }) => {
  return (
    <div className="relative">
      <input
        type="text"
        placeholder=" "
        value={value}
        onChange={onChange}
        className="peer px-4 py-2 bg-gray-800 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 text-white"
      />
      <label className="absolute left-4 top-2 text-gray-400 transition-all peer-placeholder-shown:top-2 peer-focus:-top-6 peer-focus:text-purple-500 peer-focus:text-sm">
        {label}
      </label>
    </div>
  );
};`,
      explanation: 'Input with floating label animation'
    },
    'toggle-switch': {
      name: 'Toggle Switch',
      code: `export const ToggleSwitch = ({ checked, onChange }) => {
  return (
    <label className="relative inline-flex items-center cursor-pointer">
      <input 
        type="checkbox" 
        className="sr-only peer"
        checked={checked}
        onChange={onChange}
      />
      <div className="w-11 h-6 bg-gray-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-purple-600"></div>
    </label>
  );
};`,
      explanation: 'Toggle switch with smooth animation'
    },
    'select-dropdown': {
      name: 'Select Dropdown',
      code: `export const SelectDropdown = ({ options, value, onChange }) => {
  return (
    <select
      value={value}
      onChange={onChange}
      className="px-4 py-2 bg-gray-800 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 text-white"
    >
      {options.map(opt => (
        <option key={opt.value} value={opt.value}>{opt.label}</option>
      ))}
    </select>
  );
};`,
      explanation: 'Styled select dropdown'
    },
    checkbox: {
      name: 'Checkbox',
      code: `export const Checkbox = ({ label, checked, onChange }) => {
  return (
    <label className="flex items-center space-x-2 cursor-pointer">
      <input
        type="checkbox"
        checked={checked}
        onChange={onChange}
        className="w-5 h-5 text-purple-600 bg-gray-800 border-gray-600 rounded focus:ring-purple-500 focus:ring-2"
      />
      <span className="text-gray-300">{label}</span>
    </label>
  );
};`,
      explanation: 'Styled checkbox with label'
    }
  },
  navigation: {
    'tab-navigation': {
      name: 'Tab Navigation',
      code: `export const TabNavigation = ({ tabs, activeTab, onTabChange }) => {
  return (
    <div className="flex space-x-1 bg-gray-800 p-1 rounded-lg">
      {tabs.map(tab => (
        <button
          key={tab.id}
          onClick={() => onTabChange(tab.id)}
          className={\`px-4 py-2 rounded-md transition-all \${
            activeTab === tab.id 
              ? 'bg-purple-600 text-white' 
              : 'text-gray-400 hover:text-white'
          }\`}
        >
          {tab.label}
        </button>
      ))}
    </div>
  );
};`,
      explanation: 'Tab navigation component'
    },
    breadcrumb: {
      name: 'Breadcrumb',
      code: `export const Breadcrumb = ({ items }) => {
  return (
    <nav className="flex items-center space-x-2 text-sm">
      {items.map((item, index) => (
        <React.Fragment key={index}>
          {index > 0 && <span className="text-gray-600">/</span>}
          {item.active ? (
            <span className="text-purple-400">{item.label}</span>
          ) : (
            <a href={item.href} className="text-gray-400 hover:text-white">
              {item.label}
            </a>
          )}
        </React.Fragment>
      ))}
    </nav>
  );
};`,
      explanation: 'Breadcrumb navigation'
    },
    pagination: {
      name: 'Pagination',
      code: `export const Pagination = ({ currentPage, totalPages, onPageChange }) => {
  return (
    <div className="flex items-center space-x-2">
      <button 
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className="px-3 py-1 bg-gray-800 text-gray-400 rounded hover:bg-gray-700 disabled:opacity-50"
      >
        ←
      </button>
      {Array.from({ length: totalPages }, (_, i) => (
        <button
          key={i + 1}
          onClick={() => onPageChange(i + 1)}
          className={\`px-3 py-1 rounded \${
            currentPage === i + 1
              ? 'bg-purple-600 text-white'
              : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
          }\`}
        >
          {i + 1}
        </button>
      ))}
      <button 
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className="px-3 py-1 bg-gray-800 text-gray-400 rounded hover:bg-gray-700 disabled:opacity-50"
      >
        →
      </button>
    </div>
  );
};`,
      explanation: 'Pagination component'
    },
    'side-navigation': {
      name: 'Side Navigation',
      code: `export const SideNavigation = ({ items, activeItem }) => {
  return (
    <div className="w-64 bg-gray-800 p-4 rounded-lg">
      {items.map(item => (
        <a
          key={item.id}
          href={item.href}
          className={\`block px-4 py-2 rounded mt-1 transition-all \${
            activeItem === item.id
              ? 'text-purple-400 bg-purple-900/30'
              : 'text-gray-400 hover:text-white hover:bg-gray-700'
          }\`}
        >
          {item.label}
        </a>
      ))}
    </div>
  );
};`,
      explanation: 'Vertical navigation menu'
    },
    'menu-button': {
      name: 'Menu Button',
      code: `export const MenuButton = ({ onClick, isOpen }) => {
  return (
    <button 
      onClick={onClick}
      className="p-2 hover:bg-gray-800 rounded-lg transition-colors"
    >
      <div className={\`w-6 h-0.5 bg-gray-400 mb-1.5 transition-all \${isOpen ? 'rotate-45 translate-y-2' : ''}\`}></div>
      <div className={\`w-6 h-0.5 bg-gray-400 mb-1.5 transition-all \${isOpen ? 'opacity-0' : ''}\`}></div>
      <div className={\`w-6 h-0.5 bg-gray-400 transition-all \${isOpen ? '-rotate-45 -translate-y-2' : ''}\`}></div>
    </button>
  );
};`,
      explanation: 'Hamburger menu button'
    }
  },
  layout: {
    'section-container': {
      name: 'Section Container',
      code: `export const SectionContainer = ({ title, children }) => {
  return (
    <div className="max-w-6xl mx-auto px-4 py-16">
      <h2 className="text-3xl font-bold mb-4">{title}</h2>
      {children}
    </div>
  );
};`,
      explanation: 'Centered section container'
    },
    'grid-layout': {
      name: 'Grid Layout',
      code: `export const GridLayout = ({ columns = 3, gap = 4, children }) => {
  return (
    <div className={\`grid grid-cols-\${columns} gap-\${gap}\`}>
      {children}
    </div>
  );
};`,
      explanation: 'Flexible grid layout'
    },
    'flex-container': {
      name: 'Flex Container',
      code: `export const FlexContainer = ({ justify = 'between', align = 'center', children }) => {
  return (
    <div className={\`flex items-\${align} justify-\${justify} p-4 bg-gray-800 rounded-lg\`}>
      {children}
    </div>
  );
};`,
      explanation: 'Flexible container with alignment'
    },
    'split-layout': {
      name: 'Split Layout',
      code: `export const SplitLayout = ({ left, right }) => {
  return (
    <div className="grid grid-cols-2 gap-8 h-full">
      <div className="bg-purple-900/20 rounded-lg p-4">{left}</div>
      <div className="bg-pink-900/20 rounded-lg p-4">{right}</div>
    </div>
  );
};`,
      explanation: 'Two column split layout'
    },
    'stack-layout': {
      name: 'Stack Layout',
      code: `export const StackLayout = ({ spacing = 4, children }) => {
  return (
    <div className={\`space-y-\${spacing}\`}>
      {React.Children.map(children, child => (
        <div className="bg-gray-800 p-4 rounded">{child}</div>
      ))}
    </div>
  );
};`,
      explanation: 'Vertical stack layout'
    }
  },
  interactive: {
    tooltip: {
      name: 'Tooltip',
      code: `export const Tooltip = ({ children, text }) => {
  return (
    <div className="relative inline-block group">
      {children}
      <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-1 bg-gray-800 text-white text-sm rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap">
        {text}
      </div>
    </div>
  );
};`,
      explanation: 'Hover tooltip component'
    },
    modal: {
      name: 'Modal',
      code: `export const Modal = ({ isOpen, onClose, title, children }) => {
  if (!isOpen) return null;
  
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <div className="bg-gray-800 rounded-lg p-6 max-w-md w-full">
        <h3 className="text-xl font-bold mb-4">{title}</h3>
        {children}
        <button 
          onClick={onClose}
          className="px-4 py-2 bg-purple-600 rounded mt-4"
        >
          Close
        </button>
      </div>
    </div>
  );
};`,
      explanation: 'Modal dialog component'
    },
    accordion: {
      name: 'Accordion',
      code: `export const Accordion = ({ items }) => {
  const [openIndex, setOpenIndex] = useState(0);
  
  return (
    <div className="space-y-2">
      {items.map((item, index) => (
        <div key={index} className="bg-gray-800 rounded-lg">
          <button 
            onClick={() => setOpenIndex(openIndex === index ? -1 : index)}
            className="w-full px-4 py-3 text-left flex items-center justify-between"
          >
            <span>{item.title}</span>
            <span>{openIndex === index ? '▼' : '►'}</span>
          </button>
          {openIndex === index && (
            <div className="px-4 pb-3 text-gray-400">{item.content}</div>
          )}
        </div>
      ))}
    </div>
  );
};`,
      explanation: 'Expandable accordion component'
    },
    'dropdown-menu': {
      name: 'Dropdown Menu',
      code: `export const DropdownMenu = ({ label, items }) => {
  const [isOpen, setIsOpen] = useState(false);
  
  return (
    <div className="relative">
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="px-4 py-2 bg-gray-800 rounded flex items-center space-x-2"
      >
        <span>{label}</span>
        <span>{isOpen ? '▼' : '►'}</span>
      </button>
      {isOpen && (
        <div className="absolute top-full mt-2 w-48 bg-gray-800 rounded-lg shadow-xl">
          {items.map((item, index) => (
            <a 
              key={index}
              href={item.href}
              className="block px-4 py-2 hover:bg-gray-700 first:rounded-t-lg last:rounded-b-lg"
            >
              {item.label}
            </a>
          ))}
        </div>
      )}
    </div>
  );
};`,
      explanation: 'Dropdown menu component'
    },
    'copy-button': {
      name: 'Copy Button',
      code: `export const CopyButton = ({ text, onCopy }) => {
  const [copied, setCopied] = useState(false);
  
  const handleCopy = () => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    onCopy?.();
    setTimeout(() => setCopied(false), 2000);
  };
  
  return (
    <button 
      onClick={handleCopy}
      className="px-4 py-2 bg-gray-800 hover:bg-gray-700 rounded flex items-center space-x-2"
    >
      <span>{copied ? 'Copied!' : 'Copy to clipboard'}</span>
      <svg width="16" height="16" fill="currentColor">
        <path d="M13 0H6a2 2 0 0 0-2 2v2H2a2 2 0 0 0-2 2v8a2 2 0 0 0 2 2h7a2 2 0 0 0 2-2v-2h2a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2z"/>
      </svg>
    </button>
  );
};`,
      explanation: 'Copy to clipboard button'
    }
  },
  data: {
    'progress-bar': {
      name: 'Progress Bar',
      code: `export const ProgressBar = ({ value, max = 100 }) => {
  const percentage = (value / max) * 100;
  
  return (
    <div className="w-full bg-gray-700 rounded-full h-2.5">
      <div 
        className="bg-purple-600 h-2.5 rounded-full transition-all duration-300"
        style={{ width: \`\${percentage}%\` }}
      />
    </div>
  );
};`,
      explanation: 'Progress bar component'
    },
    'stats-card': {
      name: 'Stats Card',
      code: `export const StatsCard = ({ label, value, change, positive = true }) => {
  return (
    <div className="bg-gray-800 rounded-lg p-6">
      <div className="text-gray-400 text-sm">{label}</div>
      <div className="text-3xl font-bold mt-1">{value}</div>
      <div className={\`text-sm mt-2 \${positive ? 'text-green-400' : 'text-red-400'}\`}>
        {positive ? '↑' : '↓'} {change}
      </div>
    </div>
  );
};`,
      explanation: 'Statistics display card'
    },
    badge: {
      name: 'Badge',
      code: `export const Badge = ({ children, variant = 'default' }) => {
  const variants = {
    default: 'bg-purple-900 text-purple-200',
    success: 'bg-green-900 text-green-200',
    warning: 'bg-yellow-900 text-yellow-200',
    error: 'bg-red-900 text-red-200'
  };
  
  return (
    <span className={\`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium \${variants[variant]}\`}>
      {children}
    </span>
  );
};`,
      explanation: 'Status badge component'
    },
    table: {
      name: 'Table',
      code: `export const Table = ({ columns, data }) => {
  return (
    <div className="overflow-hidden rounded-lg border border-gray-700">
      <table className="min-w-full divide-y divide-gray-700">
        <thead className="bg-gray-800">
          <tr>
            {columns.map(col => (
              <th key={col.key} className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase">
                {col.label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="bg-gray-900 divide-y divide-gray-800">
          {data.map((row, i) => (
            <tr key={i}>
              {columns.map(col => (
                <td key={col.key} className="px-6 py-4 text-sm">
                  {row[col.key]}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};`,
      explanation: 'Data table component'
    },
    'chart-placeholder': {
      name: 'Chart Placeholder',
      code: `export const ChartPlaceholder = ({ title, height = '16rem' }) => {
  return (
    <div 
      className="bg-gray-800 rounded-lg p-6 flex items-center justify-center"
      style={{ height }}
    >
      <div className="text-center">
        <div className="text-4xl mb-2">📊</div>
        <p className="text-gray-400">{title || 'Chart goes here'}</p>
      </div>
    </div>
  );
};`,
      explanation: 'Placeholder for chart components'
    }
  },
  media: {
    'image-card': {
      name: 'Image Card',
      code: `export const ImageCard = ({ imageUrl, title, description }) => {
  return (
    <div className="bg-gray-800 rounded-lg overflow-hidden">
      <div className="h-48 bg-gradient-to-br from-purple-500 to-pink-500">
        {imageUrl && <img src={imageUrl} alt={title} className="w-full h-full object-cover" />}
      </div>
      <div className="p-4">
        <h3 className="font-semibold">{title}</h3>
        <p className="text-gray-400 text-sm mt-1">{description}</p>
      </div>
    </div>
  );
};`,
      explanation: 'Card with image header'
    },
    avatar: {
      name: 'Avatar',
      code: `export const Avatar = ({ src, name, email, size = 'md' }) => {
  const sizes = {
    sm: 'w-8 h-8',
    md: 'w-12 h-12',
    lg: 'w-16 h-16'
  };
  
  return (
    <div className="flex items-center space-x-3">
      <div className={\`\${sizes[size]} rounded-full bg-gradient-to-br from-purple-500 to-pink-500 overflow-hidden\`}>
        {src && <img src={src} alt={name} className="w-full h-full object-cover" />}
      </div>
      {name && (
        <div>
          <div className="font-semibold">{name}</div>
          {email && <div className="text-sm text-gray-400">{email}</div>}
        </div>
      )}
    </div>
  );
};`,
      explanation: 'User avatar component'
    },
    'video-player': {
      name: 'Video Player',
      code: `export const VideoPlayer = ({ videoUrl, thumbnail }) => {
  const [playing, setPlaying] = useState(false);
  
  return (
    <div className="bg-gray-900 rounded-lg overflow-hidden">
      <div className="aspect-video bg-gray-800 flex items-center justify-center relative">
        {!playing ? (
          <>
            {thumbnail && <img src={thumbnail} alt="Video thumbnail" className="absolute inset-0 w-full h-full object-cover" />}
            <button 
              onClick={() => setPlaying(true)}
              className="w-16 h-16 bg-purple-600 rounded-full flex items-center justify-center hover:bg-purple-700 relative z-10"
            >
              <svg className="w-6 h-6 text-white ml-1" fill="currentColor" viewBox="0 0 20 20">
                <path d="M6.3 2.841A1.5 1.5 0 004 4.11V15.89a1.5 1.5 0 002.3 1.269l9.344-5.89a1.5 1.5 0 000-2.538L6.3 2.84z"/>
              </svg>
            </button>
          </>
        ) : (
          <video src={videoUrl} controls autoPlay className="w-full h-full" />
        )}
      </div>
    </div>
  );
};`,
      explanation: 'Video player with play button'
    },
    gallery: {
      name: 'Gallery',
      code: `export const Gallery = ({ images, columns = 3 }) => {
  return (
    <div className={\`grid grid-cols-\${columns} gap-2\`}>
      {images.map((image, index) => (
        <div key={index} className="aspect-square rounded overflow-hidden">
          <img 
            src={image.url} 
            alt={image.alt || \`Image \${index + 1}\`}
            className="w-full h-full object-cover hover:scale-110 transition-transform duration-300"
          />
        </div>
      ))}
    </div>
  );
};`,
      explanation: 'Image gallery grid'
    },
    'icon-box': {
      name: 'Icon Box',
      code: `export const IconBox = ({ icon, title, description }) => {
  return (
    <div className="p-6 bg-gray-800 rounded-lg text-center hover:bg-gray-750 transition-colors">
      <div className="w-16 h-16 bg-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
        <span className="text-2xl">{icon}</span>
      </div>
      <h3 className="font-semibold">{title}</h3>
      <p className="text-gray-400 text-sm mt-2">{description}</p>
    </div>
  );
};`,
      explanation: 'Feature box with icon'
    }
  }
};

// Health check endpoint
router.get('/health', (req, res) => {
  res.json({
    status: 'healthy',
    reactBits: {
      version: '1.0.0',
      features: ['ui-generation', 'component-library', 'natural-language'],
      components: {
        total: 53,
        categories: Object.keys(componentLibrary).length
      }
    }
  });
});

// Get available capabilities
router.get('/capabilities', (req, res) => {
  const categories = Object.keys(componentLibrary);
  const allComponents = [];
  
  categories.forEach(category => {
    Object.values(componentLibrary[category]).forEach(comp => {
      allComponents.push({
        category,
        name: comp.name,
        type: comp.name.toLowerCase().replace(/\s+/g, '-')
      });
    });
  });
  
  res.json({
    success: true,
    capabilities: {
      categories,
      totalComponents: allComponents.length,
      components: allComponents,
      animations: ['pulse', 'glow', 'shimmer', 'fade', 'slide', 'float', 'gradient-x', 'typewriter'],
      customizations: ['color', 'size', 'spacing', 'animation', 'variant']
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
    // Parse the message to find matching component
    const { component, category } = findBestMatchingComponent(message);
    const customizations = extractCustomizations(message);


    // Apply customizations to the component
    let customizedCode = component.code;
    if (customizations.color) {
      customizedCode = customizedCode.replace(/purple/g, customizations.color);
    }
    
    res.json({
      success: true,
      component: {
        code: customizedCode,
        explanation: component.explanation,
        metadata: {
          componentType: component.name,
          category: category,
          source: 'react-bits-library',
          timestamp: new Date().toISOString()
        }
      },
      customizations: {
        detected: component.name,
        category: category,
        applied: customizations
      },
      variants: generateVariants(component)
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

// Helper function to find best matching component
function findBestMatchingComponent(message) {
  const msg = message.toLowerCase();
  let bestMatch = null;
  let bestScore = 0;
  let bestCategory = null;
  
  // Search through all categories and components
  Object.entries(componentLibrary).forEach(([category, components]) => {
    Object.entries(components).forEach(([key, component]) => {
      let score = 0;
      
      // Check component name match
      const componentWords = component.name.toLowerCase().split(' ');
      componentWords.forEach(word => {
        if (msg.includes(word)) score += 2;
      });
      
      // Check category match
      if (msg.includes(category.replace('-', ' '))) score += 1;
      
      // Check key match
      if (msg.includes(key.replace('-', ' '))) score += 1;
      
      // Special keywords
      if (msg.includes('glow') && component.name.includes('Glow')) score += 3;
      if (msg.includes('glass') && component.name.includes('Glass')) score += 3;
      if (msg.includes('gradient') && component.name.includes('Gradient')) score += 3;
      if (msg.includes('animate') && (component.name.includes('Animate') || component.name.includes('Typewriter'))) score += 2;
      
      if (score > bestScore) {
        bestScore = score;
        bestMatch = component;
        bestCategory = category;
      }
    });
  });
  
  // Default to glowing button if no match
  if (!bestMatch) {
    bestMatch = componentLibrary.buttons['glowing-button'];
    bestCategory = 'buttons';
  }
  
  return { component: bestMatch, category: bestCategory };
}

// Helper function to extract customizations from message
function extractCustomizations(message) {
  const msg = message.toLowerCase();
  const customizations = {};

  // Colors
  const colors = ['purple', 'blue', 'green', 'red', 'pink', 'yellow', 'orange', 'gray'];
  colors.forEach(color => {
    if (msg.includes(color)) customizations.color = color;
  });

  // Sizes
  if (msg.includes('large') || msg.includes('big')) customizations.size = 'large';
  else if (msg.includes('small') || msg.includes('tiny')) customizations.size = 'small';
  else if (msg.includes('medium')) customizations.size = 'medium';

  // Effects
  if (msg.includes('glow')) customizations.effect = 'glow';
  else if (msg.includes('pulse')) customizations.effect = 'pulse';
  else if (msg.includes('shimmer') || msg.includes('shiny')) customizations.effect = 'shimmer';
  else if (msg.includes('float')) customizations.effect = 'float';

  // Animation
  if (msg.includes('animate') || msg.includes('animation')) customizations.animated = true;

  return customizations;
}

// Generate variants (TypeScript, JavaScript, with/without Tailwind)
function generateVariants(component) {
  const tsCode = component.code;
  
  // Convert TypeScript to JavaScript
  const jsCode = tsCode
    .replace(/: React\.FC<\w+>/g, '')
    .replace(/: React\.ReactNode/g, '')
    .replace(/: string/g, '')
    .replace(/: number/g, '')
    .replace(/: boolean/g, '')
    .replace(/: any/g, '')
    .replace(/interface \w+ {[^}]*}/g, '')
    .replace(/export const (\w+): React\.FC = /g, 'export const $1 = ')
    .replace(/useState<[^>]+>/g, 'useState')
    .replace(/React\.Fragment/g, 'Fragment');

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
    }
  ];
}

// Search components endpoint
router.get('/search', (req, res) => {
  const { query } = req.query;
  const results = [];
  
  if (query) {
    const searchTerm = query.toLowerCase();
    
    Object.entries(componentLibrary).forEach(([category, components]) => {
      Object.entries(components).forEach(([key, component]) => {
        if (component.name.toLowerCase().includes(searchTerm) ||
            category.includes(searchTerm) ||
            key.includes(searchTerm)) {
          results.push({
            name: component.name,
            category: category,
            type: key,
            explanation: component.explanation
          });
        }
      });
    });
  }
  
  res.json({
    success: true,
    query: query,
    count: results.length,
    results: results
  });
});

module.exports = router;