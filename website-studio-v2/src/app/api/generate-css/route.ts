import { NextRequest, NextResponse } from 'next/server';
import Anthropic from '@anthropic-ai/sdk';

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

export async function POST(request: NextRequest) {
  try {
    const { description, websiteUrl } = await request.json();

    if (!description || !websiteUrl) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    // Generate CSS using Claude API
    const css = await generateAICSS(description, websiteUrl);

    return NextResponse.json({
      success: true,
      css,
      metadata: {
        timestamp: new Date().toISOString(),
        description,
        websiteUrl,
        aiGenerated: true,
      },
    });
  } catch (error) {
    console.error('CSS generation error:', error);

    // Get request data for fallback
    const { description, websiteUrl } = await request.json();

    // Fallback to advanced mock if AI fails
    const fallbackCSS = generateAdvancedCSS(description);

    return NextResponse.json({
      success: true,
      css: fallbackCSS,
      metadata: {
        timestamp: new Date().toISOString(),
        description,
        websiteUrl,
        aiGenerated: false,
        fallback: true,
      },
    });
  }
}

async function generateAICSS(description: string, websiteUrl: string): Promise<string> {
  const prompt = `You are an expert CSS developer. Generate modern, production-ready CSS based on the user's natural language description.

User wants to modify: ${websiteUrl}
User's request: "${description}"

Guidelines:
1. Generate clean, modern CSS that addresses the user's specific request
2. Use CSS3 features like flexbox, grid, transforms, animations where appropriate
3. Include hover states and transitions for interactive elements
4. Use proper CSS selectors (classes, elements, IDs as needed)
5. Add helpful comments to explain complex styles
6. Make styles responsive when relevant
7. Use modern color schemes and typography
8. Include fallbacks for older browsers when using advanced features

Return ONLY the CSS code with no explanations or markdown formatting.`;

  const message = await anthropic.messages.create({
    model: 'claude-3-5-sonnet-20241022',
    max_tokens: 2000,
    temperature: 0.7,
    messages: [
      {
        role: 'user',
        content: prompt,
      },
    ],
  });

  const cssContent = message.content[0].type === 'text' ? message.content[0].text : '';

  // Clean up the response to ensure it's valid CSS
  const cleanCSS = cssContent
    .replace(/```css/g, '')
    .replace(/```/g, '')
    .trim();

  return cleanCSS || generateAdvancedCSS(description);
}

function generateAdvancedCSS(description: string): string {
  const desc = description.toLowerCase();
  let css = '/* AI-Generated CSS */\n\n';

  // Analyze for colors
  const colors = {
    purple: '#8b5cf6',
    blue: '#3b82f6',
    green: '#10b981',
    red: '#ef4444',
    orange: '#f59e0b',
    pink: '#ec4899',
    yellow: '#eab308',
    indigo: '#6366f1',
    teal: '#14b8a6',
    gray: '#6b7280',
    dark: '#1a1a1a',
    light: '#f3f4f6',
  };

  let primaryColor = '#8b5cf6';
  for (const [name, hex] of Object.entries(colors)) {
    if (desc.includes(name)) {
      primaryColor = hex;
      break;
    }
  }

  // Header/Navigation
  if (desc.includes('header') || desc.includes('nav') || desc.includes('navigation')) {
    css += `/* Header/Navigation Styles */
header, nav, .header, .navbar, .navigation {
  background: ${
    desc.includes('gradient')
      ? `linear-gradient(135deg, ${primaryColor} 0%, ${adjustColor(primaryColor, -20)} 100%)`
      : primaryColor
  } !important;
  ${
    desc.includes('transparent') || desc.includes('glass')
      ? `backdrop-filter: blur(12px);
  background: rgba(${hexToRgb(primaryColor)}, 0.8) !important;`
      : ''
  }
  ${
    desc.includes('sticky') || desc.includes('fixed')
      ? `position: sticky;
  top: 0;
  z-index: 1000;`
      : ''
  }
  ${desc.includes('shadow') ? 'box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);' : ''}
  ${desc.includes('rounded') ? 'border-radius: 0 0 20px 20px;' : ''}
  padding: 1rem 2rem;
  transition: all 0.3s ease;
}

header a, nav a {
  color: white !important;
  text-decoration: none;
  transition: opacity 0.2s ease;
}

header a:hover, nav a:hover {
  opacity: 0.8;
}\n\n`;
  }

  // Buttons
  if (desc.includes('button') || desc.includes('btn') || desc.includes('cta')) {
    const buttonRadius = desc.includes('round') ? '50px' : desc.includes('square') ? '0' : '12px';
    css += `/* Button Styles */
button, .button, .btn, input[type="submit"], input[type="button"], a.button {
  background: ${
    desc.includes('gradient')
      ? `linear-gradient(135deg, ${primaryColor} 0%, ${adjustColor(primaryColor, -20)} 100%)`
      : primaryColor
  } !important;
  color: white !important;
  border: none;
  border-radius: ${buttonRadius};
  padding: ${desc.includes('large') ? '16px 32px' : desc.includes('small') ? '8px 16px' : '12px 24px'};
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  ${desc.includes('shadow') ? `box-shadow: 0 4px 15px rgba(${hexToRgb(primaryColor)}, 0.3);` : ''}
  ${desc.includes('uppercase') ? 'text-transform: uppercase;' : ''}
  ${desc.includes('wide') ? 'letter-spacing: 0.05em;' : ''}
}

button:hover, .button:hover, .btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 25px rgba(${hexToRgb(primaryColor)}, 0.4);
  filter: brightness(1.1);
}

button:active, .button:active, .btn:active {
  transform: translateY(0);
}\n\n`;
  }

  // Background
  if (desc.includes('background') || desc.includes('bg')) {
    css += `/* Background Styles */
body, .main, main, .content {
  ${
    desc.includes('gradient')
      ? `background: linear-gradient(${desc.includes('radial') ? 'circle' : '135deg'}, ${primaryColor} 0%, ${adjustColor(primaryColor, desc.includes('dark') ? -40 : -20)} 100%) !important;`
      : `background: ${primaryColor} !important;`
  }
  ${
    desc.includes('animated')
      ? `background-size: 400% 400%;
  animation: gradientShift 15s ease infinite;`
      : ''
  }
  min-height: 100vh;
}

@keyframes gradientShift {
  0%, 100% { background-position: 0% 50%; }
  50% { background-position: 100% 50%; }
}\n\n`;
  }

  // Cards/Sections
  if (desc.includes('card') || desc.includes('section') || desc.includes('container')) {
    css += `/* Card/Section Styles */
.card, .section, .container, article, section {
  ${
    desc.includes('glass') || desc.includes('transparent')
      ? `background: rgba(255, 255, 255, 0.1) !important;
  backdrop-filter: blur(12px);
  border: 1px solid rgba(255, 255, 255, 0.2);`
      : `background: ${desc.includes('dark') ? '#1a1a1a' : '#ffffff'} !important;`
  }
  ${desc.includes('rounded') ? 'border-radius: 16px;' : 'border-radius: 8px;'}
  ${
    desc.includes('shadow')
      ? `box-shadow: 0 10px 40px rgba(0, 0, 0, ${desc.includes('dark') ? '0.3' : '0.1'});`
      : ''
  }
  padding: 2rem;
  margin: 1rem 0;
  transition: all 0.3s ease;
}

.card:hover, section:hover {
  ${
    desc.includes('hover') || desc.includes('interactive')
      ? `transform: translateY(-5px);
  box-shadow: 0 15px 50px rgba(0, 0, 0, ${desc.includes('dark') ? '0.4' : '0.15'});`
      : ''
  }
}\n\n`;
  }

  // Typography
  if (desc.includes('text') || desc.includes('font') || desc.includes('typography')) {
    css += `/* Typography Styles */
body, p, span {
  ${desc.includes('large') ? 'font-size: 1.125rem;' : desc.includes('small') ? 'font-size: 0.875rem;' : ''}
  ${desc.includes('bold') ? 'font-weight: 600;' : desc.includes('light') ? 'font-weight: 300;' : ''}
  ${desc.includes('spacing') ? 'letter-spacing: 0.025em;' : ''}
  ${desc.includes('height') ? 'line-height: 1.8;' : ''}
  color: ${desc.includes('white') ? '#ffffff' : desc.includes('dark') ? '#1a1a1a' : 'inherit'} !important;
}

h1, h2, h3, h4, h5, h6 {
  ${
    desc.includes('gradient')
      ? `background: linear-gradient(135deg, ${primaryColor} 0%, ${adjustColor(primaryColor, 20)} 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;`
      : `color: ${primaryColor} !important;`
  }
  font-weight: 700;
  margin-bottom: 1rem;
}\n\n`;
  }

  // Forms
  if (desc.includes('form') || desc.includes('input') || desc.includes('field')) {
    css += `/* Form Styles */
input, textarea, select {
  background: ${desc.includes('dark') ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0, 0, 0, 0.05)'} !important;
  border: 2px solid ${desc.includes('dark') ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)'};
  border-radius: ${desc.includes('rounded') ? '12px' : '8px'};
  padding: 12px 16px;
  color: ${desc.includes('dark') ? '#ffffff' : '#000000'} !important;
  transition: all 0.3s ease;
}

input:focus, textarea:focus, select:focus {
  outline: none;
  border-color: ${primaryColor} !important;
  box-shadow: 0 0 0 3px rgba(${hexToRgb(primaryColor)}, 0.1);
  background: ${desc.includes('dark') ? 'rgba(255, 255, 255, 0.08)' : 'rgba(0, 0, 0, 0.03)'} !important;
}\n\n`;
  }

  // Animations
  if (desc.includes('animate') || desc.includes('motion')) {
    css += `/* Animation Styles */
* {
  transition: all 0.3s ease;
}

.animate-in, [data-animate] {
  animation: fadeIn 0.5s ease-out;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.hover-grow:hover {
  transform: scale(1.05);
}

.hover-shadow:hover {
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.2);
}\n\n`;
  }

  return css || '/* No specific styles could be generated. Try being more specific! */';
}

function hexToRgb(hex: string): string {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result
    ? `${parseInt(result[1], 16)}, ${parseInt(result[2], 16)}, ${parseInt(result[3], 16)}`
    : '0, 0, 0';
}

function adjustColor(hex: string, percent: number): string {
  const num = parseInt(hex.replace('#', ''), 16);
  const amt = Math.round(2.55 * percent);
  const R = Math.max(0, Math.min(255, (num >> 16) + amt));
  const G = Math.max(0, Math.min(255, ((num >> 8) & 0x00ff) + amt));
  const B = Math.max(0, Math.min(255, (num & 0x0000ff) + amt));
  return `#${(0x1000000 + R * 0x10000 + G * 0x100 + B).toString(16).slice(1)}`;
}
