# Website Customization Studio

An AI-powered platform for customizing websites using natural language. Transform any website's appearance with simple descriptions like "make the header purple" or "add rounded corners to buttons."

## Features

- 🎨 **Natural Language CSS Generation** - Describe changes in plain English
- 🔍 **Automatic Platform Detection** - Recognizes Shopify, WordPress, Squarespace, Wix
- 👀 **Live Before/After Preview** - See changes in real-time (Enhanced version)
- 🎯 **Smart Element Targeting** - Automatically identifies headers, buttons, forms, etc.
- 📱 **Responsive Design Support** - Generated CSS works across all devices
- 🌈 **Background Customization** - Change backgrounds with colors and gradients
- 📋 **One-Click Copy/Download** - Easy implementation of generated CSS

## Available Versions

### 1. Landing Page (`website-studio-landing.html`)
- Marketing page showcasing the platform
- Feature highlights and demo screenshots
- Call-to-action for getting started

### 2. Main Application (`website-studio-app.html`)
- Full-featured version with backend API integration
- Platform detection API
- CSS generation API
- Implementation guides

### 3. Standalone Demo (`website-studio-standalone.html`)
- Works entirely in browser (no backend required)
- Perfect for testing and demonstrations
- Includes all CSS generation logic client-side

### 4. Enhanced Preview (`website-studio-enhanced.html`) ✨ NEW
- **Live before/after preview toggle**
- **Background customization support**
- **Demo website mockup** showing real-time changes
- **Syntax-highlighted CSS output**
- Perfect for visualizing changes before implementation

## Quick Start

### Using the Launch Script (Recommended)
```bash
./launch-website-studio.sh
```

This will:
- Start Node.js backend on port 8080
- Start Python static server on port 8892
- Provide URLs for all versions

### Manual Start
```bash
# Backend API (if Node.js networking works)
node src/app-simple.js

# Static file server
python3 -m http.server 8892 --bind 127.0.0.1
```

## How It Works

### CSS Generation
The system analyzes your natural language description and:
1. Detects target elements (header, buttons, forms, etc.)
2. Extracts style preferences (colors, shapes, effects)
3. Generates platform-optimized CSS
4. Provides implementation instructions

### Supported Customizations

#### Headers
- Background colors and gradients
- Rounded corners
- Shadows and effects
- Sticky positioning

#### Buttons
- Colors and gradients
- Border radius
- Hover effects
- Shadows

#### Forms
- Background and borders
- Focus states
- Layout positioning
- Input styling

#### Backgrounds
- Solid colors
- Gradients
- Full-page backgrounds
- Section backgrounds

#### Typography
- Font families
- Sizes and spacing
- Colors
- Weights

### Example Descriptions
- "Make the header purple with rounded corners"
- "Change all buttons to have a gradient background"
- "Add a contact form on the right side"
- "Make the background a purple gradient"
- "Modernize the typography with better spacing"

## Platform-Specific Implementation

### Shopify
1. Admin → Online Store → Themes
2. Actions → Edit code
3. Add to theme.scss.liquid
4. Save and preview

### WordPress
1. Appearance → Customize
2. Additional CSS
3. Paste generated CSS
4. Publish changes

### Squarespace
1. Design → Custom CSS
2. Paste CSS code
3. Save and preview

### Custom Sites
1. Add to main CSS file
2. Or include in <style> tags
3. Test across devices

## Technical Details

### Frontend
- Vanilla JavaScript (no framework dependencies)
- Glassmorphism UI design
- Responsive layout
- CSS-in-JS generation

### Backend (Optional)
- Express.js server
- Platform detection API
- CSS generation service
- Mock data for demos

### Known Issues
- Node.js servers may not work on macOS due to networking issues
- Use Python static server as workaround
- Standalone versions work without any backend

## Development

### Project Structure
```
website-studio-landing.html     # Marketing page
website-studio-app.html         # Main application
website-studio-standalone.html  # Browser-only demo
website-studio-enhanced.html    # Enhanced with preview
src/routes/website-*.js        # Backend APIs
static/website-studio.css      # Shared styles
launch-website-studio.sh       # Launch script
```

### Adding New Features
1. Update CSS generation templates in frontend
2. Add new element detection patterns
3. Extend platform-specific instructions
4. Test with various website mockups

## Future Enhancements
- [ ] Authentication system
- [ ] Payment integration
- [ ] Version control for customizations
- [ ] Team collaboration features
- [ ] A/B testing support
- [ ] Analytics integration
- [ ] Browser extension
- [ ] API for developers

## Support

For issues or questions:
- Check the console for error messages
- Ensure servers are running on correct ports
- Try the standalone version if backend fails
- Use enhanced version for visual testing