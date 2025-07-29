# Website Customization Studio 2.0

Transform any website with your voice - The revolutionary AI-powered CSS customization platform.

## 🚀 Features

### Core Features ✅ Completed

- **🎤 Voice Recognition**: Speak your design changes naturally using Web Speech API
- **🤖 AI-Powered CSS Generation**: Claude API integration for intelligent CSS generation
- **✨ Modern UI**: Glassmorphism design with dark theme and purple accents
- **📱 Responsive Design**: Mobile-first approach with Tailwind CSS
- **🔔 Toast Notifications**: Real-time feedback for all user actions
- **📋 Copy & Download**: Easy CSS export with clipboard and file download

### Upcoming Features 🚧 In Progress

- **🖥️ Live Website Preview**: Real-time preview of changes before and after
- **🎬 Framer Motion Animations**: Smooth transitions and micro-interactions
- **👤 User Authentication**: Supabase integration for user accounts
- **📚 Component Documentation**: Storybook for development

## 🛠️ Tech Stack

- **Framework**: Next.js 14 with TypeScript and App Router
- **Styling**: Tailwind CSS with custom design system
- **UI Components**: Radix UI for accessibility
- **AI Integration**: Anthropic Claude API
- **Voice Recognition**: Web Speech API
- **State Management**: React hooks with custom toast system

## 🎨 Design System

### Colors

- **Primary**: #8b5cf6 (Purple gradient)
- **Background**: #0a0a0a (Deep black)
- **Surface**: #1a1a1a (Dark gray)
- **Glass**: Translucent overlays with backdrop blur

### Typography

- **Font**: Inter with major third scale
- **Weights**: 300 (light), 400 (regular), 600 (semibold), 700 (bold)

### Spacing

- **Base Unit**: 8px with consistent scale
- **Component Padding**: 24px (3 units)
- **Section Margins**: 32px (4 units)

## 🚀 Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn
- Anthropic API key

### Installation

1. **Clone and Install**

   ```bash
   cd website-studio-v2
   npm install
   ```

2. **Environment Setup**

   ```bash
   cp .env.local.example .env.local
   # Add your Anthropic API key to .env.local
   ```

3. **Development Server**

   ```bash
   npm run dev
   ```

4. **Open Browser**
   Navigate to [http://localhost:3005](http://localhost:3005)

## 🎯 Usage

### Voice-to-CSS Workflow

1. **Enter Website URL**: Add the target website URL
2. **Voice Input**: Click the microphone and speak your design changes
   - "Make the header purple with a gradient"
   - "Add rounded corners to all buttons"
   - "Make the background dark with animation"
3. **AI Generation**: Claude processes your natural language
4. **CSS Output**: Receive production-ready CSS code
5. **Copy/Download**: Use the generated CSS on your website

### Supported Design Changes

- **Colors**: Primary, secondary, gradients, transparency
- **Layout**: Headers, navigation, cards, sections
- **Typography**: Font sizes, weights, colors, spacing
- **Interactive**: Buttons, forms, hover states
- **Effects**: Shadows, rounded corners, animations
- **Advanced**: Glass morphism, responsive design

## 🔧 Development

### Project Structure

```
src/
├── app/                    # Next.js app router
│   ├── api/generate-css/   # Claude API endpoint
│   ├── globals.css         # Global styles
│   ├── layout.tsx          # Root layout
│   └── page.tsx            # Main interface
├── components/ui/          # Reusable UI components
│   ├── button.tsx          # Button variants
│   ├── card.tsx            # Glass morphism cards
│   ├── toast.tsx           # Toast notifications
│   └── toaster.tsx         # Toast provider
├── hooks/                  # Custom React hooks
│   └── use-toast.ts        # Toast management
└── lib/                    # Utilities
    └── utils.ts            # Helper functions
```

### Key Components

#### Voice Interface (`src/app/page.tsx`)

- Web Speech API integration
- Real-time transcript display
- Claude API communication
- Toast notifications for feedback

#### CSS Generation API (`src/app/api/generate-css/route.ts`)

- Anthropic Claude integration
- Advanced prompt engineering
- Fallback system for reliability
- Error handling and logging

#### UI Components (`src/components/ui/`)

- Radix UI primitives with custom styling
- Glassmorphism design system
- Accessibility-first approach
- TypeScript definitions

### Scripts

```bash
npm run dev          # Development server with Turbopack
npm run build        # Production build
npm run start        # Production server
npm run lint         # ESLint with Prettier
```

## 🔐 Environment Variables

```bash
# Required
ANTHROPIC_API_KEY=your_claude_api_key_here

# Future Features
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=
```

## 🚀 Deployment

### Quick Deploy to Vercel

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/yourusername/website-customization-studio&env=ANTHROPIC_API_KEY&envDescription=Your%20Anthropic%20API%20Key&envLink=https://console.anthropic.com/)

See [DEPLOYMENT.md](./DEPLOYMENT.md) for detailed deployment instructions.

## 🎯 Roadmap

### Phase 1: Core Platform ✅ Complete

- [x] Voice recognition system
- [x] Claude API integration
- [x] Modern UI with glassmorphism
- [x] Toast notification system
- [x] CSS copy/download functionality

### Phase 2: Live Preview 🚧 In Progress

- [ ] Website iframe preview
- [ ] Before/after comparison
- [ ] Real-time CSS injection
- [ ] Responsive preview modes

### Phase 3: Enhanced Experience

- [ ] Framer Motion animations
- [ ] Advanced voice commands
- [ ] CSS history and versioning
- [ ] Collaborative features

### Phase 4: Commercial Platform

- [ ] User authentication (Supabase)
- [ ] Subscription tiers
- [ ] Project management
- [ ] Team collaboration
- [ ] API access for developers

## 🏗️ Architecture Decisions

### AI Integration Strategy

- **Primary**: Claude API for natural language processing
- **Fallback**: Advanced mock system for reliability
- **Prompt Engineering**: Optimized for CSS generation
- **Error Handling**: Graceful degradation with user feedback

### State Management

- **Local State**: React hooks for UI interactions
- **Global State**: Custom toast system with Radix UI
- **Session Persistence**: Browser storage for voice transcripts
- **API Communication**: Fetch with proper error boundaries

### Performance Optimizations

- **Next.js 14**: App router with Turbopack
- **Code Splitting**: Automatic with dynamic imports
- **Image Optimization**: Next.js built-in optimization
- **CSS**: Tailwind with JIT compilation

## 🤝 Contributing

1. Follow the existing code style
2. Use TypeScript for all new features
3. Test voice recognition in Chrome/Edge
4. Ensure mobile responsiveness
5. Add proper error handling
6. Update documentation

## 📝 License

MIT License - Feel free to use this project as a foundation for your own voice-powered design tools.

---

**Built with ❤️ using Next.js, Claude AI, and modern web technologies.**
