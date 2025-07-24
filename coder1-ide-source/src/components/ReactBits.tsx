import React, { useState, useEffect } from 'react';
import './ReactBits.css';

interface Component {
  id: string;
  name: string;
  type: string;
  icon: string;
  description: string;
  tags: string[];
  code: string;
  preview: string;
}

interface ComponentCategory {
  name: string;
  icon: string;
  components: Component[];
}

const ReactBits: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedComponent, setSelectedComponent] = useState<Component | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showCode, setShowCode] = useState(false);
  const [magicEnabled, setMagicEnabled] = useState(false);

  // Comprehensive component library with 53 components across 11 categories
  const componentLibrary: ComponentCategory[] = [
    {
      name: 'Buttons',
      icon: '🔘',
      components: [
        {
          id: 'btn-glow',
          name: 'Glowing Button',
          type: 'button',
          icon: '✨',
          description: 'Button with animated glow effect',
          tags: ['interactive', 'glow', 'animated'],
          preview: '<button class="px-6 py-3 bg-purple-600 text-white rounded-lg shadow-lg shadow-purple-500/50 hover:shadow-xl hover:shadow-purple-500/60 transition-all duration-300">Click Me</button>',
          code: `export const GlowingButton = ({ children, onClick }) => {
  return (
    <button
      onClick={onClick}
      className="px-6 py-3 bg-purple-600 text-white rounded-lg 
                 shadow-lg shadow-purple-500/50 hover:shadow-xl 
                 hover:shadow-purple-500/60 transition-all duration-300"
    >
      {children}
    </button>
  );
};`
        },
        {
          id: 'btn-pulse',
          name: 'Pulse Button',
          type: 'button',
          icon: '💫',
          description: 'Button with pulsing animation',
          tags: ['animated', 'pulse', 'attention'],
          preview: '<button class="px-6 py-3 bg-blue-600 text-white rounded-lg animate-pulse">Pulse Button</button>',
          code: `export const PulseButton = ({ children, onClick }) => {
  return (
    <button
      onClick={onClick}
      className="px-6 py-3 bg-blue-600 text-white rounded-lg animate-pulse"
    >
      {children}
    </button>
  );
};`
        },
        {
          id: 'btn-gradient',
          name: 'Gradient Button',
          type: 'button',
          icon: '🌈',
          description: 'Modern gradient button',
          tags: ['gradient', 'modern', 'colorful'],
          preview: '<button class="px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg hover:from-purple-700 hover:to-pink-700 transition-all duration-300">Gradient</button>',
          code: `export const GradientButton = ({ children, onClick }) => {
  return (
    <button
      onClick={onClick}
      className="px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 
                 text-white rounded-lg hover:from-purple-700 
                 hover:to-pink-700 transition-all duration-300"
    >
      {children}
    </button>
  );
};`
        },
        {
          id: 'btn-neon',
          name: 'Neon Button',
          type: 'button',
          icon: '💡',
          description: 'Glowing neon-style button',
          tags: ['neon', 'glow', 'border'],
          preview: '<button class="px-6 py-3 bg-transparent border-2 border-cyan-400 text-cyan-400 rounded-lg hover:bg-cyan-400 hover:text-black hover:shadow-lg hover:shadow-cyan-400/50 transition-all duration-300">Neon Style</button>',
          code: `export const NeonButton = ({ children, onClick }) => {
  return (
    <button
      onClick={onClick}
      className="px-6 py-3 bg-transparent border-2 border-cyan-400 
                 text-cyan-400 rounded-lg hover:bg-cyan-400 
                 hover:text-black hover:shadow-lg hover:shadow-cyan-400/50 
                 transition-all duration-300"
    >
      {children}
    </button>
  );
};`
        },
        {
          id: 'btn-morphing',
          name: 'Morphing Button',
          type: 'button',
          icon: '🔄',
          description: 'Button that morphs on hover',
          tags: ['morph', 'transform', 'animated'],
          preview: '<button class="group px-8 py-3 bg-gray-800 text-white rounded-full hover:rounded-lg hover:bg-purple-600 transition-all duration-500 transform hover:scale-110">Morph Me</button>',
          code: `export const MorphingButton = ({ children, onClick }) => {
  return (
    <button
      onClick={onClick}
      className="group px-8 py-3 bg-gray-800 text-white rounded-full 
                 hover:rounded-lg hover:bg-purple-600 transition-all 
                 duration-500 transform hover:scale-110"
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
      icon: '📝',
      components: [
        {
          id: 'txt-shiny',
          name: 'Shiny Text',
          type: 'text',
          icon: '✨',
          description: 'Text with shimmering effect',
          tags: ['animated', 'shimmer', 'gradient'],
          preview: '<h2 class="text-3xl font-bold bg-gradient-to-r from-purple-400 via-pink-400 to-purple-400 bg-clip-text text-transparent animate-gradient-x">✨ Shiny Text ✨</h2>',
          code: `export const ShinyText = ({ children }) => {
  return (
    <span className="bg-gradient-to-r from-purple-400 via-pink-400 
                     to-purple-400 bg-clip-text text-transparent 
                     animate-gradient-x">
      {children}
    </span>
  );
};`
        },
        {
          id: 'txt-typewriter',
          name: 'Typewriter Text',
          type: 'text',
          icon: '⌨️',
          description: 'Typewriter animation effect',
          tags: ['animated', 'typewriter', 'text'],
          preview: '<h2 class="text-2xl font-mono text-green-400">Hello, World!</h2>',
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
          id: 'txt-glitch',
          name: 'Glitch Text',
          type: 'text',
          icon: '⚡',
          description: 'Cyberpunk glitch effect',
          tags: ['animated', 'glitch', 'cyberpunk'],
          preview: '<div class="relative inline-block"><h2 class="text-3xl font-bold text-white">GLITCH</h2></div>',
          code: `export const GlitchText = ({ children }) => {
  return (
    <div className="relative inline-block">
      <span className="relative z-10">{children}</span>
      <span className="absolute top-0 left-0 text-red-500 opacity-70 
                       animate-glitch-1">{children}</span>
      <span className="absolute top-0 left-0 text-blue-500 opacity-60 
                       animate-glitch-2">{children}</span>
    </div>
  );
};`
        },
        {
          id: 'txt-wave',
          name: 'Wave Text',
          type: 'text',
          icon: '🌊',
          description: 'Waving text animation',
          tags: ['animated', 'wave', 'fun'],
          preview: '<h2 class="text-3xl font-bold text-yellow-400">👋 Wave!</h2>',
          code: `export const WaveText = ({ children }) => {
  return (
    <span className="inline-block animate-wave origin-bottom-right">
      {children}
    </span>
  );
};`
        },
        {
          id: 'txt-neon',
          name: 'Neon Glow Text',
          type: 'text',
          icon: '💫',
          description: 'Bright neon glow effect',
          tags: ['neon', 'glow', 'bright'],
          preview: '<h2 class="text-3xl font-bold text-cyan-400" style="text-shadow: 0 0 10px currentColor;">NEON GLOW</h2>',
          code: `export const NeonGlowText = ({ children, color = 'cyan' }) => {
  return (
    <span 
      className={\`text-\${color}-400 font-bold\`}
      style={{
        textShadow: \`0 0 10px currentColor, 0 0 20px currentColor, 
                    0 0 30px currentColor, 0 0 40px currentColor\`
      }}
    >
      {children}
    </span>
  );
};`
        }
      ]
    },
    {
      name: 'Cards',
      icon: '🎨',
      components: [
        {
          id: 'card-glass',
          name: 'Glass Card',
          type: 'card',
          icon: '🪟',
          description: 'Glassmorphic card design',
          tags: ['glass', 'blur', 'modern'],
          preview: '<div class="p-6 bg-white/10 backdrop-blur-md border border-white/20 rounded-xl"><h3 class="text-lg font-semibold text-white">Glass Card</h3><p class="text-gray-300">Hover me!</p></div>',
          code: `export const GlassCard = ({ title, content }) => {
  return (
    <div className="p-6 bg-white/10 backdrop-blur-md border 
                    border-white/20 rounded-xl hover:bg-white/20 
                    transition-all duration-300">
      <h3 className="text-xl font-semibold text-white">{title}</h3>
      <p className="text-gray-300">{content}</p>
    </div>
  );
};`
        },
        {
          id: 'card-hover',
          name: 'Hover Card',
          type: 'card',
          icon: '🎯',
          description: '3D hover effect card',
          tags: ['hover', '3d', 'interactive'],
          preview: '<div class="p-6 bg-gray-800 rounded-lg transform hover:scale-105 transition-transform duration-300"><h3 class="text-white font-semibold">Hover Card</h3></div>',
          code: `export const HoverCard = ({ children }) => {
  return (
    <div className="p-6 bg-gray-800 rounded-lg transform 
                    hover:scale-105 hover:shadow-xl 
                    transition-all duration-300">
      {children}
    </div>
  );
};`
        },
        {
          id: 'card-product',
          name: 'Product Card',
          type: 'card',
          icon: '🛍️',
          description: 'E-commerce product card',
          tags: ['product', 'ecommerce', 'shop'],
          preview: '<div class="bg-gray-800 rounded-lg overflow-hidden"><div class="h-32 bg-gradient-to-br from-purple-600 to-pink-600"></div><div class="p-4"><h3 class="text-white font-semibold">Product</h3><p class="text-gray-400">$99.99</p></div></div>',
          code: `export const ProductCard = ({ image, title, price }) => {
  return (
    <div className="bg-gray-800 rounded-lg overflow-hidden 
                    hover:shadow-xl transition-shadow">
      <img src={image} alt={title} className="w-full h-48 object-cover" />
      <div className="p-4">
        <h3 className="text-white font-semibold">{title}</h3>
        <p className="text-gray-400">{price}</p>
      </div>
    </div>
  );
};`
        }
      ]
    },
    {
      name: 'Forms',
      icon: '📋',
      components: [
        {
          id: 'form-float',
          name: 'Floating Label',
          type: 'form',
          icon: '🏷️',
          description: 'Input with floating label',
          tags: ['input', 'floating', 'label'],
          preview: '<div class="relative"><input type="text" class="peer px-4 py-2 bg-gray-800 border border-gray-600 rounded-lg text-white" placeholder=" " /><label class="absolute left-4 -top-2.5 bg-gray-900 px-1 text-sm text-gray-400">Email</label></div>',
          code: `export const FloatingInput = ({ label, type = 'text' }) => {
  return (
    <div className="relative">
      <input
        type={type}
        className="peer px-4 py-2 bg-gray-800 border border-gray-600 
                   rounded-lg text-white placeholder-transparent 
                   focus:border-purple-500 transition-colors"
        placeholder=" "
      />
      <label className="absolute left-4 -top-2.5 bg-gray-900 px-1 
                        text-sm text-gray-400 transition-all 
                        peer-placeholder-shown:top-2 
                        peer-placeholder-shown:text-base 
                        peer-focus:-top-2.5 peer-focus:text-sm">
        {label}
      </label>
    </div>
  );
};`
        },
        {
          id: 'form-animated',
          name: 'Animated Input',
          type: 'form',
          icon: '✨',
          description: 'Input with animated border',
          tags: ['input', 'animated', 'border'],
          preview: '<input type="text" class="px-4 py-2 bg-transparent border-b-2 border-gray-600 text-white focus:border-purple-500 transition-colors outline-none" placeholder="Type here..." />',
          code: `export const AnimatedInput = ({ placeholder }) => {
  return (
    <input
      type="text"
      className="px-4 py-2 bg-transparent border-b-2 border-gray-600 
                 text-white focus:border-purple-500 transition-colors 
                 outline-none"
      placeholder={placeholder}
    />
  );
};`
        },
        {
          id: 'form-search',
          name: 'Search Box',
          type: 'form',
          icon: '🔍',
          description: 'Animated search input',
          tags: ['search', 'input', 'animated'],
          preview: '<div class="relative"><input type="text" class="pl-10 pr-4 py-2 bg-gray-800 rounded-full text-white" placeholder="Search..." /><svg class="absolute left-3 top-2.5 w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><circle cx="11" cy="11" r="8"></circle><path d="m21 21-4.35-4.35"></path></svg></div>',
          code: `export const SearchBox = ({ onSearch }) => {
  return (
    <div className="relative">
      <input
        type="text"
        className="pl-10 pr-4 py-2 bg-gray-800 rounded-full 
                   text-white placeholder-gray-400 
                   focus:outline-none focus:ring-2 focus:ring-purple-500"
        placeholder="Search..."
        onChange={(e) => onSearch(e.target.value)}
      />
      <svg className="absolute left-3 top-2.5 w-5 h-5 text-gray-400" 
           fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <circle cx="11" cy="11" r="8" />
        <path d="m21 21-4.35-4.35" />
      </svg>
    </div>
  );
};`
        },
        {
          id: 'form-checkbox',
          name: 'Animated Checkbox',
          type: 'form',
          icon: '☑️',
          description: 'Custom animated checkbox',
          tags: ['checkbox', 'animated', 'custom'],
          preview: '<label class="flex items-center space-x-3"><input type="checkbox" class="w-5 h-5 text-purple-600 bg-gray-800 border-gray-600 rounded focus:ring-purple-500" /><span class="text-white">Accept terms</span></label>',
          code: `export const AnimatedCheckbox = ({ label, checked, onChange }) => {
  return (
    <label className="flex items-center space-x-3 cursor-pointer">
      <input
        type="checkbox"
        checked={checked}
        onChange={onChange}
        className="w-5 h-5 text-purple-600 bg-gray-800 
                   border-gray-600 rounded focus:ring-purple-500 
                   transition-all duration-200"
      />
      <span className="text-white">{label}</span>
    </label>
  );
};`
        },
        {
          id: 'form-radio',
          name: 'Radio Group',
          type: 'form',
          icon: '⭕',
          description: 'Styled radio buttons',
          tags: ['radio', 'group', 'selection'],
          preview: '<div class="space-y-2"><label class="flex items-center space-x-3"><input type="radio" name="option" class="w-4 h-4 text-purple-600 bg-gray-800 border-gray-600" /><span class="text-white">Option 1</span></label></div>',
          code: `export const RadioGroup = ({ options, selected, onChange }) => {
  return (
    <div className="space-y-2">
      {options.map((option) => (
        <label key={option.value} 
               className="flex items-center space-x-3 cursor-pointer">
          <input
            type="radio"
            value={option.value}
            checked={selected === option.value}
            onChange={(e) => onChange(e.target.value)}
            className="w-4 h-4 text-purple-600 bg-gray-800 border-gray-600"
          />
          <span className="text-white">{option.label}</span>
        </label>
      ))}
    </div>
  );
};`
        }
      ]
    },
    {
      name: 'Backgrounds',
      icon: '🎨',
      components: [
        {
          id: 'bg-gradient',
          name: 'Gradient Mesh',
          type: 'background',
          icon: '🌈',
          description: 'Animated gradient mesh',
          tags: ['gradient', 'mesh', 'animated'],
          preview: '<div class="w-full h-32 bg-gradient-to-br from-purple-400 via-pink-400 to-indigo-400 rounded-lg animate-gradient-x"></div>',
          code: `export const GradientMesh = ({ className = '' }) => {
  return (
    <div className={\`bg-gradient-to-br from-purple-400 via-pink-400 
                    to-indigo-400 animate-gradient-x \${className}\`}>
      {/* Content */}
    </div>
  );
};`
        },
        {
          id: 'bg-shapes',
          name: 'Floating Shapes',
          type: 'background',
          icon: '🎈',
          description: 'Animated floating shapes',
          tags: ['shapes', 'floating', 'animated'],
          preview: '<div class="w-full h-32 bg-gray-900 rounded-lg relative overflow-hidden"><div class="absolute top-4 left-4 w-4 h-4 bg-purple-500 rounded-full animate-bounce"></div></div>',
          code: `export const FloatingShapes = ({ children }) => {
  return (
    <div className="relative overflow-hidden bg-gray-900">
      <div className="absolute top-10 left-10 w-20 h-20 bg-purple-500 
                      rounded-full animate-bounce opacity-20" />
      <div className="absolute bottom-10 right-10 w-32 h-32 bg-pink-500 
                      rounded-full animate-pulse opacity-20" />
      <div className="relative z-10">{children}</div>
    </div>
  );
};`
        },
        {
          id: 'bg-grid',
          name: 'Animated Grid',
          type: 'background',
          icon: '⚡',
          description: 'Moving grid pattern',
          tags: ['grid', 'pattern', 'animated'],
          preview: '<div class="w-full h-32 bg-black rounded-lg relative overflow-hidden"><div class="absolute inset-0 opacity-20" style="background-image: linear-gradient(rgba(139, 92, 246, 0.3) 1px, transparent 1px), linear-gradient(90deg, rgba(139, 92, 246, 0.3) 1px, transparent 1px); background-size: 20px 20px;"></div></div>',
          code: `export const AnimatedGrid = ({ children }) => {
  return (
    <div className="relative overflow-hidden bg-black">
      <div 
        className="absolute inset-0 opacity-20 animate-grid-move"
        style={{
          backgroundImage: \`linear-gradient(rgba(139, 92, 246, 0.3) 1px, transparent 1px),
                           linear-gradient(90deg, rgba(139, 92, 246, 0.3) 1px, transparent 1px)\`,
          backgroundSize: '20px 20px'
        }}
      />
      <div className="relative z-10">{children}</div>
    </div>
  );
};`
        },
        {
          id: 'bg-particles',
          name: 'Particle Field',
          type: 'background',
          icon: '✨',
          description: 'Animated particle background',
          tags: ['particles', 'stars', 'animated'],
          preview: '<div class="w-full h-32 bg-gradient-to-br from-indigo-900 to-purple-900 rounded-lg relative overflow-hidden"></div>',
          code: `export const ParticleField = ({ particleCount = 50 }) => {
  const particles = Array.from({ length: particleCount }, (_, i) => ({
    id: i,
    x: Math.random() * 100,
    y: Math.random() * 100,
    size: Math.random() * 4 + 1,
    delay: Math.random() * 5
  }));
  
  return (
    <div className="relative overflow-hidden bg-gradient-to-br 
                    from-indigo-900 to-purple-900">
      {particles.map((particle) => (
        <div
          key={particle.id}
          className="absolute w-1 h-1 bg-white rounded-full animate-ping"
          style={{
            left: \`\${particle.x}%\`,
            top: \`\${particle.y}%\`,
            width: \`\${particle.size}px\`,
            height: \`\${particle.size}px\`,
            animationDelay: \`\${particle.delay}s\`
          }}
        />
      ))}
    </div>
  );
};`
        },
        {
          id: 'bg-aurora',
          name: 'Aurora Background',
          type: 'background',
          icon: '🌌',
          description: 'Northern lights effect',
          tags: ['aurora', 'gradient', 'animated'],
          preview: '<div class="w-full h-32 bg-black rounded-lg relative overflow-hidden"><div class="absolute inset-0 bg-gradient-to-r from-purple-600/30 via-pink-600/20 to-blue-600/30 animate-pulse"></div></div>',
          code: `export const AuroraBackground = ({ children }) => {
  return (
    <div className="relative overflow-hidden bg-black">
      <div className="absolute inset-0 bg-gradient-to-r from-purple-600/30 
                      via-pink-600/20 to-blue-600/30 animate-pulse" />
      <div className="absolute inset-0 bg-gradient-to-br from-transparent 
                      via-cyan-400/10 to-transparent animate-aurora" />
      <div className="relative z-10">{children}</div>
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
          id: 'load-spinner',
          name: 'Spinner',
          type: 'loader',
          icon: '🌀',
          description: 'Classic spinning loader',
          tags: ['spinner', 'loading', 'rotate'],
          preview: '<div class="w-12 h-12 border-4 border-purple-600 border-t-transparent rounded-full animate-spin"></div>',
          code: `export const Spinner = ({ size = 'md' }) => {
  const sizes = {
    sm: 'w-8 h-8',
    md: 'w-12 h-12',
    lg: 'w-16 h-16'
  };
  
  return (
    <div className={\`\${sizes[size]} border-4 border-purple-600 
                     border-t-transparent rounded-full animate-spin\`} />
  );
};`
        },
        {
          id: 'load-dots',
          name: 'Bouncing Dots',
          type: 'loader',
          icon: '⚫',
          description: 'Three bouncing dots',
          tags: ['dots', 'bounce', 'loading'],
          preview: '<div class="flex space-x-2"><div class="w-3 h-3 bg-purple-600 rounded-full animate-bounce"></div><div class="w-3 h-3 bg-purple-600 rounded-full animate-bounce" style="animation-delay: 0.1s;"></div><div class="w-3 h-3 bg-purple-600 rounded-full animate-bounce" style="animation-delay: 0.2s;"></div></div>',
          code: `export const BouncingDots = () => {
  return (
    <div className="flex space-x-2">
      {[0, 0.1, 0.2].map((delay, i) => (
        <div
          key={i}
          className="w-3 h-3 bg-purple-600 rounded-full animate-bounce"
          style={{ animationDelay: \`\${delay}s\` }}
        />
      ))}
    </div>
  );
};`
        },
        {
          id: 'load-pulse',
          name: 'Pulse Loader',
          type: 'loader',
          icon: '💓',
          description: 'Pulsing circle loader',
          tags: ['pulse', 'circle', 'loading'],
          preview: '<div class="relative w-16 h-16"><div class="absolute w-16 h-16 bg-purple-600 rounded-full animate-ping opacity-20"></div><div class="w-16 h-16 bg-purple-600 rounded-full"></div></div>',
          code: `export const PulseLoader = () => {
  return (
    <div className="relative w-16 h-16">
      <div className="absolute w-16 h-16 bg-purple-600 rounded-full 
                      animate-ping opacity-20" />
      <div className="w-16 h-16 bg-purple-600 rounded-full" />
    </div>
  );
};`
        },
        {
          id: 'load-bars',
          name: 'Dancing Bars',
          type: 'loader',
          icon: '📊',
          description: 'Animated bar chart',
          tags: ['bars', 'dancing', 'loading'],
          preview: '<div class="flex items-end space-x-1 h-8"><div class="w-2 bg-purple-600 rounded-t animate-pulse" style="height: 20px;"></div><div class="w-2 bg-purple-600 rounded-t animate-pulse" style="height: 32px; animation-delay: 0.1s;"></div><div class="w-2 bg-purple-600 rounded-t animate-pulse" style="height: 16px; animation-delay: 0.2s;"></div></div>',
          code: `export const DancingBars = () => {
  const heights = [20, 32, 16, 24, 28];
  
  return (
    <div className="flex items-end space-x-1 h-8">
      {heights.map((height, i) => (
        <div
          key={i}
          className="w-2 bg-purple-600 rounded-t animate-pulse"
          style={{ 
            height: \`\${height}px\`,
            animationDelay: \`\${i * 0.1}s\`
          }}
        />
      ))}
    </div>
  );
};`
        },
        {
          id: 'load-skeleton',
          name: 'Skeleton Loader',
          type: 'loader',
          icon: '🦴',
          description: 'Content placeholder',
          tags: ['skeleton', 'placeholder', 'loading'],
          preview: '<div class="space-y-3 w-64"><div class="h-4 bg-gray-600 rounded animate-pulse"></div><div class="h-4 bg-gray-600 rounded animate-pulse w-3/4"></div><div class="h-4 bg-gray-600 rounded animate-pulse w-1/2"></div></div>',
          code: `export const SkeletonLoader = ({ lines = 3 }) => {
  return (
    <div className="space-y-3">
      {Array.from({ length: lines }).map((_, i) => (
        <div
          key={i}
          className={\`h-4 bg-gray-600 rounded animate-pulse 
                      \${i === lines - 1 ? 'w-1/2' : i === lines - 2 ? 'w-3/4' : 'w-full'}\`}
        />
      ))}
    </div>
  );
};`
        }
      ]
    },
    {
      name: 'Navigation',
      icon: '🧭',
      components: [
        {
          id: 'nav-breadcrumb',
          name: 'Breadcrumb',
          type: 'navigation',
          icon: '🍞',
          description: 'Navigation breadcrumb',
          tags: ['breadcrumb', 'navigation', 'path'],
          preview: '<nav class="flex space-x-2 text-sm"><a href="#" class="text-gray-400 hover:text-white">Home</a><span class="text-gray-500">/</span><a href="#" class="text-gray-400 hover:text-white">Products</a><span class="text-gray-500">/</span><span class="text-purple-400">Current</span></nav>',
          code: `export const Breadcrumb = ({ items }) => {
  return (
    <nav className="flex space-x-2 text-sm">
      {items.map((item, index) => (
        <React.Fragment key={index}>
          {index > 0 && <span className="text-gray-500">/</span>}
          {item.href ? (
            <a href={item.href} className="text-gray-400 hover:text-white">
              {item.label}
            </a>
          ) : (
            <span className="text-purple-400">{item.label}</span>
          )}
        </React.Fragment>
      ))}
    </nav>
  );
};`
        },
        {
          id: 'nav-sidebar',
          name: 'Sidebar Menu',
          type: 'navigation',
          icon: '📋',
          description: 'Collapsible sidebar',
          tags: ['sidebar', 'menu', 'navigation'],
          preview: '<div class="w-48 bg-gray-800 rounded-lg p-4"><div class="space-y-2"><div class="p-2 rounded hover:bg-gray-700">Dashboard</div><div class="p-2 rounded bg-purple-600">Settings</div></div></div>',
          code: `export const SidebarMenu = ({ items, activeItem }) => {
  return (
    <div className="w-64 bg-gray-800 p-4">
      <div className="space-y-2">
        {items.map((item) => (
          <div
            key={item.id}
            className={\`p-2 rounded cursor-pointer transition-colors
                        \${activeItem === item.id ? 'bg-purple-600' : 'hover:bg-gray-700'}\`}
          >
            {item.label}
          </div>
        ))}
      </div>
    </div>
  );
};`
        },
        {
          id: 'nav-tabs',
          name: 'Tab Navigation',
          type: 'navigation',
          icon: '📑',
          description: 'Horizontal tab navigation',
          tags: ['tabs', 'navigation', 'switch'],
          preview: '<div class="flex space-x-1 bg-gray-800 p-1 rounded-lg"><button class="px-4 py-2 rounded bg-purple-600 text-white">Tab 1</button><button class="px-4 py-2 rounded text-gray-400 hover:text-white">Tab 2</button></div>',
          code: `export const TabNavigation = ({ tabs, activeTab, onTabChange }) => {
  return (
    <div className="flex space-x-1 bg-gray-800 p-1 rounded-lg">
      {tabs.map((tab) => (
        <button
          key={tab.id}
          onClick={() => onTabChange(tab.id)}
          className={\`px-4 py-2 rounded transition-all
                      \${activeTab === tab.id 
                        ? 'bg-purple-600 text-white' 
                        : 'text-gray-400 hover:text-white'}\`}
        >
          {tab.label}
        </button>
      ))}
    </div>
  );
};`
        },
        {
          id: 'nav-dropdown',
          name: 'Dropdown Menu',
          type: 'navigation',
          icon: '📍',
          description: 'Dropdown navigation menu',
          tags: ['dropdown', 'menu', 'navigation'],
          preview: '<div class="relative"><button class="px-4 py-2 bg-gray-800 rounded-lg text-white">Menu ▼</button></div>',
          code: `export const DropdownMenu = ({ label, items }) => {
  const [isOpen, setIsOpen] = useState(false);
  
  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="px-4 py-2 bg-gray-800 rounded-lg text-white"
      >
        {label} ▼
      </button>
      {isOpen && (
        <div className="absolute top-full mt-2 w-48 bg-gray-800 
                        rounded-lg shadow-xl overflow-hidden">
          {items.map((item) => (
            <a
              key={item.id}
              href={item.href}
              className="block px-4 py-2 hover:bg-gray-700"
            >
              {item.label}
            </a>
          ))}
        </div>
      )}
    </div>
  );
};`
        },
        {
          id: 'nav-pills',
          name: 'Pill Navigation',
          type: 'navigation',
          icon: '💊',
          description: 'Pill-style navigation',
          tags: ['pills', 'navigation', 'rounded'],
          preview: '<div class="flex space-x-2"><button class="px-4 py-2 bg-purple-600 rounded-full text-white">Active</button><button class="px-4 py-2 bg-gray-700 rounded-full text-gray-300 hover:bg-gray-600">Inactive</button></div>',
          code: `export const PillNavigation = ({ items, activeItem, onItemClick }) => {
  return (
    <div className="flex space-x-2">
      {items.map((item) => (
        <button
          key={item.id}
          onClick={() => onItemClick(item.id)}
          className={\`px-4 py-2 rounded-full transition-all
                      \${activeItem === item.id
                        ? 'bg-purple-600 text-white'
                        : 'bg-gray-700 text-gray-300 hover:bg-gray-600'}\`}
        >
          {item.label}
        </button>
      ))}
    </div>
  );
};`
        }
      ]
    },
    {
      name: 'Layout',
      icon: '⚏',
      components: [
        {
          id: 'layout-grid',
          name: 'CSS Grid Layout',
          type: 'layout',
          icon: '⚏',
          description: 'Responsive grid container',
          tags: ['grid', 'layout', 'responsive'],
          preview: '<div class="grid grid-cols-3 gap-4"><div class="bg-purple-600 h-16 rounded"></div><div class="bg-pink-600 h-16 rounded"></div><div class="bg-blue-600 h-16 rounded"></div></div>',
          code: `export const GridLayout = ({ children, columns = 3, gap = 4 }) => {
  return (
    <div className={\`grid grid-cols-\${columns} gap-\${gap}\`}>
      {children}
    </div>
  );
};`
        },
        {
          id: 'layout-flex',
          name: 'Flexbox Container',
          type: 'layout',
          icon: '📦',
          description: 'Flexible box layout',
          tags: ['flex', 'layout', 'container'],
          preview: '<div class="flex space-x-4"><div class="flex-1 bg-purple-600 h-16 rounded"></div><div class="flex-1 bg-pink-600 h-16 rounded"></div></div>',
          code: `export const FlexContainer = ({ children, direction = 'row', gap = 4 }) => {
  return (
    <div className={\`flex flex-\${direction} gap-\${gap}\`}>
      {children}
    </div>
  );
};`
        },
        {
          id: 'layout-masonry',
          name: 'Masonry Grid',
          type: 'layout',
          icon: '🧱',
          description: 'Pinterest-style layout',
          tags: ['masonry', 'grid', 'pinterest'],
          preview: '<div class="columns-3 gap-4"><div class="bg-purple-600 h-20 rounded mb-4"></div><div class="bg-pink-600 h-32 rounded mb-4"></div><div class="bg-blue-600 h-16 rounded"></div></div>',
          code: `export const MasonryGrid = ({ children, columns = 3 }) => {
  return (
    <div className={\`columns-\${columns} gap-4\`}>
      {children}
    </div>
  );
};`
        },
        {
          id: 'layout-stack',
          name: 'Stack Layout',
          type: 'layout',
          icon: '📚',
          description: 'Vertical stack with spacing',
          tags: ['stack', 'vertical', 'spacing'],
          preview: '<div class="space-y-4"><div class="bg-purple-600 h-12 rounded"></div><div class="bg-pink-600 h-12 rounded"></div><div class="bg-blue-600 h-12 rounded"></div></div>',
          code: `export const StackLayout = ({ children, spacing = 4 }) => {
  return (
    <div className={\`space-y-\${spacing}\`}>
      {children}
    </div>
  );
};`
        },
        {
          id: 'layout-container',
          name: 'Container',
          type: 'layout',
          icon: '📐',
          description: 'Centered content container',
          tags: ['container', 'center', 'wrapper'],
          preview: '<div class="max-w-4xl mx-auto px-4"><div class="bg-gray-800 p-6 rounded-lg">Centered Content</div></div>',
          code: `export const Container = ({ children, maxWidth = '4xl' }) => {
  return (
    <div className={\`max-w-\${maxWidth} mx-auto px-4\`}>
      {children}
    </div>
  );
};`
        }
      ]
    },
    {
      name: 'Interactive',
      icon: '🎮',
      components: [
        {
          id: 'int-modal',
          name: 'Modal Dialog',
          type: 'interactive',
          icon: '🪟',
          description: 'Overlay modal window',
          tags: ['modal', 'dialog', 'overlay'],
          preview: '<div class="relative"><button class="px-4 py-2 bg-purple-600 rounded text-white">Open Modal</button></div>',
          code: `export const Modal = ({ isOpen, onClose, title, children }) => {
  if (!isOpen) return null;
  
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/50" onClick={onClose} />
      <div className="relative bg-gray-800 rounded-lg p-6 max-w-md w-full">
        <h2 className="text-xl font-semibold text-white mb-4">{title}</h2>
        {children}
        <button
          onClick={onClose}
          className="mt-4 px-4 py-2 bg-purple-600 rounded text-white"
        >
          Close
        </button>
      </div>
    </div>
  );
};`
        },
        {
          id: 'int-tooltip',
          name: 'Tooltip',
          type: 'interactive',
          icon: '💬',
          description: 'Hover tooltip',
          tags: ['tooltip', 'hover', 'popover'],
          preview: '<div class="relative inline-block"><button class="px-4 py-2 bg-gray-800 rounded text-white">Hover me</button></div>',
          code: `export const Tooltip = ({ children, content }) => {
  const [isVisible, setIsVisible] = useState(false);
  
  return (
    <div className="relative inline-block"
         onMouseEnter={() => setIsVisible(true)}
         onMouseLeave={() => setIsVisible(false)}>
      {children}
      {isVisible && (
        <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 
                        mb-2 px-3 py-1 bg-gray-900 text-white text-sm 
                        rounded whitespace-nowrap">
          {content}
        </div>
      )}
    </div>
  );
};`
        },
        {
          id: 'int-accordion',
          name: 'Accordion',
          type: 'interactive',
          icon: '📂',
          description: 'Collapsible accordion',
          tags: ['accordion', 'collapse', 'expand'],
          preview: '<div class="bg-gray-800 rounded-lg overflow-hidden"><div class="p-4 border-b border-gray-700 cursor-pointer">Click to expand</div></div>',
          code: `export const Accordion = ({ items }) => {
  const [openIndex, setOpenIndex] = useState(-1);
  
  return (
    <div className="bg-gray-800 rounded-lg overflow-hidden">
      {items.map((item, index) => (
        <div key={index}>
          <div
            className="p-4 border-b border-gray-700 cursor-pointer 
                       hover:bg-gray-700"
            onClick={() => setOpenIndex(openIndex === index ? -1 : index)}
          >
            {item.title}
          </div>
          {openIndex === index && (
            <div className="p-4 bg-gray-700">
              {item.content}
            </div>
          )}
        </div>
      ))}
    </div>
  );
};`
        },
        {
          id: 'int-tabs',
          name: 'Tab Content',
          type: 'interactive',
          icon: '📄',
          description: 'Tabbed content panels',
          tags: ['tabs', 'content', 'switch'],
          preview: '<div class="bg-gray-800 rounded-lg p-4"><div class="flex space-x-4 mb-4"><button class="text-purple-400 border-b-2 border-purple-400 pb-2">Tab 1</button><button class="text-gray-400 pb-2">Tab 2</button></div><div>Content 1</div></div>',
          code: `export const TabContent = ({ tabs }) => {
  const [activeTab, setActiveTab] = useState(0);
  
  return (
    <div className="bg-gray-800 rounded-lg p-4">
      <div className="flex space-x-4 mb-4">
        {tabs.map((tab, index) => (
          <button
            key={index}
            onClick={() => setActiveTab(index)}
            className={\`pb-2 transition-all \${
              activeTab === index
                ? 'text-purple-400 border-b-2 border-purple-400'
                : 'text-gray-400'
            }\`}
          >
            {tab.label}
          </button>
        ))}
      </div>
      <div>{tabs[activeTab].content}</div>
    </div>
  );
};`
        },
        {
          id: 'int-drawer',
          name: 'Slide Drawer',
          type: 'interactive',
          icon: '📤',
          description: 'Sliding drawer panel',
          tags: ['drawer', 'slide', 'panel'],
          preview: '<div class="relative"><button class="px-4 py-2 bg-purple-600 rounded text-white">Open Drawer</button></div>',
          code: `export const SlideDrawer = ({ isOpen, onClose, children }) => {
  return (
    <>
      {isOpen && (
        <div className="fixed inset-0 z-40 bg-black/50" onClick={onClose} />
      )}
      <div className={\`fixed right-0 top-0 h-full w-80 bg-gray-800 
                      transform transition-transform z-50 \${
                        isOpen ? 'translate-x-0' : 'translate-x-full'
                      }\`}>
        <div className="p-6">
          <button
            onClick={onClose}
            className="mb-4 text-gray-400 hover:text-white"
          >
            ✕ Close
          </button>
          {children}
        </div>
      </div>
    </>
  );
};`
        }
      ]
    },
    {
      name: 'Data Display',
      icon: '📊',
      components: [
        {
          id: 'data-table',
          name: 'Data Table',
          type: 'data',
          icon: '📋',
          description: 'Responsive data table',
          tags: ['table', 'data', 'grid'],
          preview: '<div class="bg-gray-800 rounded-lg overflow-hidden"><table class="w-full"><thead class="bg-gray-700"><tr><th class="px-4 py-2 text-left">Name</th><th class="px-4 py-2 text-left">Value</th></tr></thead><tbody><tr class="border-t border-gray-700"><td class="px-4 py-2">Item 1</td><td class="px-4 py-2">100</td></tr></tbody></table></div>',
          code: `export const DataTable = ({ columns, data }) => {
  return (
    <div className="bg-gray-800 rounded-lg overflow-hidden">
      <table className="w-full">
        <thead className="bg-gray-700">
          <tr>
            {columns.map((col) => (
              <th key={col.key} className="px-4 py-2 text-left">
                {col.label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.map((row, i) => (
            <tr key={i} className="border-t border-gray-700">
              {columns.map((col) => (
                <td key={col.key} className="px-4 py-2">
                  {row[col.key]}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};`
        },
        {
          id: 'data-list',
          name: 'List View',
          type: 'data',
          icon: '📜',
          description: 'Styled list component',
          tags: ['list', 'items', 'view'],
          preview: '<ul class="space-y-2"><li class="p-3 bg-gray-800 rounded-lg hover:bg-gray-700">List item 1</li><li class="p-3 bg-gray-800 rounded-lg hover:bg-gray-700">List item 2</li></ul>',
          code: `export const ListView = ({ items, onItemClick }) => {
  return (
    <ul className="space-y-2">
      {items.map((item) => (
        <li
          key={item.id}
          onClick={() => onItemClick(item)}
          className="p-3 bg-gray-800 rounded-lg hover:bg-gray-700 
                     cursor-pointer transition-colors"
        >
          {item.label}
        </li>
      ))}
    </ul>
  );
};`
        },
        {
          id: 'data-grid',
          name: 'Card Grid',
          type: 'data',
          icon: '🎲',
          description: 'Grid of data cards',
          tags: ['grid', 'cards', 'data'],
          preview: '<div class="grid grid-cols-2 gap-4"><div class="bg-gray-800 p-4 rounded-lg"><h4 class="font-semibold">Card 1</h4><p class="text-gray-400">Value: 100</p></div><div class="bg-gray-800 p-4 rounded-lg"><h4 class="font-semibold">Card 2</h4><p class="text-gray-400">Value: 200</p></div></div>',
          code: `export const CardGrid = ({ items }) => {
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
      {items.map((item) => (
        <div key={item.id} className="bg-gray-800 p-4 rounded-lg">
          <h4 className="font-semibold">{item.title}</h4>
          <p className="text-gray-400">{item.value}</p>
        </div>
      ))}
    </div>
  );
};`
        },
        {
          id: 'data-stats',
          name: 'Stats Card',
          type: 'data',
          icon: '📈',
          description: 'Statistics display card',
          tags: ['stats', 'metrics', 'data'],
          preview: '<div class="bg-gray-800 p-6 rounded-lg"><div class="text-gray-400 text-sm">Total Revenue</div><div class="text-3xl font-bold text-white">$12,345</div><div class="text-green-400 text-sm">+12.5%</div></div>',
          code: `export const StatsCard = ({ label, value, change }) => {
  return (
    <div className="bg-gray-800 p-6 rounded-lg">
      <div className="text-gray-400 text-sm">{label}</div>
      <div className="text-3xl font-bold text-white">{value}</div>
      <div className={\`text-sm \${
        change > 0 ? 'text-green-400' : 'text-red-400'
      }\`}>
        {change > 0 ? '+' : ''}{change}%
      </div>
    </div>
  );
};`
        },
        {
          id: 'data-progress',
          name: 'Progress Bar',
          type: 'data',
          icon: '📊',
          description: 'Animated progress bar',
          tags: ['progress', 'bar', 'loading'],
          preview: '<div class="w-full bg-gray-700 rounded-full h-3"><div class="bg-purple-600 h-3 rounded-full transition-all duration-500" style="width: 75%;"></div></div>',
          code: `export const ProgressBar = ({ value, max = 100 }) => {
  const percentage = (value / max) * 100;
  
  return (
    <div className="w-full bg-gray-700 rounded-full h-3">
      <div
        className="bg-purple-600 h-3 rounded-full transition-all duration-500"
        style={{ width: \`\${percentage}%\` }}
      />
    </div>
  );
};`
        }
      ]
    },
    {
      name: 'Media',
      icon: '🎬',
      components: [
        {
          id: 'media-avatar',
          name: 'Avatar',
          type: 'media',
          icon: '👤',
          description: 'User avatar component',
          tags: ['avatar', 'user', 'profile'],
          preview: '<div class="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center text-white font-bold">JD</div>',
          code: `export const Avatar = ({ name, src, size = 'md' }) => {
  const sizes = {
    sm: 'w-8 h-8 text-sm',
    md: 'w-12 h-12 text-base',
    lg: 'w-16 h-16 text-xl'
  };
  
  const initials = name.split(' ').map(n => n[0]).join('').toUpperCase();
  
  return src ? (
    <img src={src} alt={name} className={\`\${sizes[size]} rounded-full\`} />
  ) : (
    <div className={\`\${sizes[size]} bg-gradient-to-br from-purple-500 
                     to-pink-500 rounded-full flex items-center 
                     justify-center text-white font-bold\`}>
      {initials}
    </div>
  );
};`
        },
        {
          id: 'media-gallery',
          name: 'Image Gallery',
          type: 'media',
          icon: '🖼️',
          description: 'Grid image gallery',
          tags: ['gallery', 'images', 'grid'],
          preview: '<div class="grid grid-cols-3 gap-2"><div class="bg-gradient-to-br from-purple-600 to-pink-600 h-20 rounded"></div><div class="bg-gradient-to-br from-blue-600 to-purple-600 h-20 rounded"></div><div class="bg-gradient-to-br from-pink-600 to-orange-600 h-20 rounded"></div></div>',
          code: `export const ImageGallery = ({ images }) => {
  return (
    <div className="grid grid-cols-3 gap-2">
      {images.map((image, i) => (
        <img
          key={i}
          src={image.src}
          alt={image.alt}
          className="w-full h-full object-cover rounded hover:scale-105 
                     transition-transform cursor-pointer"
        />
      ))}
    </div>
  );
};`
        },
        {
          id: 'media-video',
          name: 'Video Player',
          type: 'media',
          icon: '▶️',
          description: 'Custom video player',
          tags: ['video', 'player', 'media'],
          preview: '<div class="relative bg-black rounded-lg overflow-hidden h-40"><div class="absolute inset-0 flex items-center justify-center"><div class="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center"><div class="w-0 h-0 border-l-[20px] border-l-white border-y-[12px] border-y-transparent ml-1"></div></div></div></div>',
          code: `export const VideoPlayer = ({ src, poster }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  
  return (
    <div className="relative bg-black rounded-lg overflow-hidden">
      <video
        src={src}
        poster={poster}
        className="w-full h-full"
        controls={isPlaying}
      />
      {!isPlaying && (
        <button
          onClick={() => setIsPlaying(true)}
          className="absolute inset-0 flex items-center justify-center"
        >
          <div className="w-16 h-16 bg-white/20 rounded-full 
                          flex items-center justify-center">
            <div className="w-0 h-0 border-l-[20px] border-l-white 
                            border-y-[12px] border-y-transparent ml-1" />
          </div>
        </button>
      )}
    </div>
  );
};`
        },
        {
          id: 'media-audio',
          name: 'Audio Player',
          type: 'media',
          icon: '🎵',
          description: 'Custom audio player',
          tags: ['audio', 'player', 'music'],
          preview: '<div class="bg-gray-800 rounded-lg p-4 flex items-center space-x-4"><button class="w-10 h-10 bg-purple-600 rounded-full flex items-center justify-center">▶</button><div class="flex-1"><div class="h-1 bg-gray-700 rounded-full"><div class="h-1 bg-purple-600 rounded-full w-1/3"></div></div></div><span class="text-sm text-gray-400">1:23</span></div>',
          code: `export const AudioPlayer = ({ src, title }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  
  return (
    <div className="bg-gray-800 rounded-lg p-4 flex items-center space-x-4">
      <button
        onClick={() => setIsPlaying(!isPlaying)}
        className="w-10 h-10 bg-purple-600 rounded-full 
                   flex items-center justify-center"
      >
        {isPlaying ? '⏸' : '▶'}
      </button>
      <div className="flex-1">
        <div className="text-white text-sm mb-1">{title}</div>
        <div className="h-1 bg-gray-700 rounded-full">
          <div
            className="h-1 bg-purple-600 rounded-full transition-all"
            style={{ width: \`\${progress}%\` }}
          />
        </div>
      </div>
      <span className="text-sm text-gray-400">0:00</span>
    </div>
  );
};`
        },
        {
          id: 'media-icon',
          name: 'Icon Button',
          type: 'media',
          icon: '🎯',
          description: 'Icon with hover effects',
          tags: ['icon', 'button', 'hover'],
          preview: '<button class="w-12 h-12 bg-gray-800 rounded-lg flex items-center justify-center hover:bg-purple-600 transition-colors"><svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"></path></svg></button>',
          code: `export const IconButton = ({ icon, onClick, size = 'md' }) => {
  const sizes = {
    sm: 'w-8 h-8',
    md: 'w-12 h-12',
    lg: 'w-16 h-16'
  };
  
  return (
    <button
      onClick={onClick}
      className={\`\${sizes[size]} bg-gray-800 rounded-lg 
                  flex items-center justify-center 
                  hover:bg-purple-600 transition-colors\`}
    >
      {icon}
    </button>
  );
};`
        }
      ]
    }
  ];

  const allComponents = componentLibrary.flatMap(cat => cat.components);
  const filteredComponents = searchQuery
    ? allComponents.filter(comp => 
        comp.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        comp.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        comp.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
      )
    : selectedCategory === 'all'
    ? allComponents
    : componentLibrary.find(cat => cat.name.toLowerCase() === selectedCategory)?.components || [];

  const handleComponentSelect = (component: Component) => {
    setSelectedComponent(component);
    setShowCode(false);
  };

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

  // Check for Magic API connection
  useEffect(() => {
    fetch('/api/magic/health')
      .then(res => res.json())
      .then(data => {
        if (data.magic21st?.connected) {
          setMagicEnabled(true);
        }
      })
      .catch(() => setMagicEnabled(false));
  }, []);

  return (
    <div className="react-bits">
      <div className="react-bits-header">
        <div className="header-top">
          <h3>React Bits</h3>
          {magicEnabled && <span className="magic-badge">✨ Magic</span>}
        </div>
        <input
          type="text"
          placeholder="Search components..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="search-input"
        />
      </div>

      <div className="category-tabs">
        <button
          className={`category-tab ${selectedCategory === 'all' ? 'active' : ''}`}
          onClick={() => setSelectedCategory('all')}
        >
          All
        </button>
        {componentLibrary.map((category) => (
          <button
            key={category.name}
            className={`category-tab ${selectedCategory === category.name.toLowerCase() ? 'active' : ''}`}
            onClick={() => setSelectedCategory(category.name.toLowerCase())}
          >
            <span className="category-icon">{category.icon}</span>
            {category.name}
          </button>
        ))}
      </div>

      <div className="components-grid">
        {isLoading ? (
          <div className="loading-state">
            <div className="spinner" />
            <p>Loading components...</p>
          </div>
        ) : filteredComponents.length > 0 ? (
          filteredComponents.map((component) => (
            <div
              key={component.id}
              className={`component-card ${selectedComponent?.id === component.id ? 'selected' : ''}`}
              onClick={() => handleComponentSelect(component)}
            >
              <div className="component-icon">{component.icon}</div>
              <div className="component-info">
                <h4>{component.name}</h4>
                <p>{component.description}</p>
                <div className="component-tags">
                  {component.tags.map((tag) => (
                    <span key={tag} className="tag">{tag}</span>
                  ))}
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="empty-state">
            <p>No components found</p>
          </div>
        )}
      </div>

      {selectedComponent && (
        <div className="component-preview">
          <div className="preview-header">
            <h4>{selectedComponent.name}</h4>
            <div className="preview-actions">
              <button
                className="action-btn"
                onClick={() => setShowCode(!showCode)}
              >
                {showCode ? 'Preview' : 'Code'}
              </button>
              <button
                className="action-btn"
                onClick={() => copyToClipboard(selectedComponent.code)}
              >
                Copy
              </button>
              <button
                className="action-btn primary"
                onClick={insertComponent}
              >
                Insert
              </button>
            </div>
          </div>
          <div className="preview-content">
            {showCode ? (
              <pre className="code-preview">
                <code>{selectedComponent.code}</code>
              </pre>
            ) : (
              <div 
                className="preview-display"
                dangerouslySetInnerHTML={{ __html: selectedComponent.preview }}
              />
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default ReactBits;