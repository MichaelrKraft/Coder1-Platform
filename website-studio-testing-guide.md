# Website Customization Studio - Manual Testing Guide

## 🚀 Quick Start

1. **Start the Python Server** (for static files):
   ```bash
   python3 -m http.server 8892 --bind 127.0.0.1
   ```

2. **Start the Node.js Backend** (for API):
   ```bash
   node src/app-simple.js
   ```

3. **Access the Application**:
   - Landing Page: http://127.0.0.1:8892/website-studio-landing.html
   - Main App: http://127.0.0.1:8892/website-studio-app.html

## ✅ Testing Checklist

### Landing Page Tests

- [ ] **Visual Design**
  - [ ] Glassmorphism effects are visible
  - [ ] Purple gradient hero section displays correctly
  - [ ] Navigation links work
  - [ ] "Try 3 Free" button is prominent

- [ ] **Content Sections**
  - [ ] Hero section with clear value proposition
  - [ ] Before/After examples are displayed
  - [ ] How it works section (3 steps)
  - [ ] Pricing tiers (Free, Basic $29/mo, Pro $79/mo)
  - [ ] Features comparison table
  - [ ] Testimonials section
  - [ ] Footer with links

- [ ] **Responsive Design**
  - [ ] Test on desktop (1440px)
  - [ ] Test on tablet (768px)
  - [ ] Test on mobile (375px)

### Main Application Tests

#### 1. Platform Detection
- [ ] Enter `https://shopify.com` → Should detect "shopify" with confidence %
- [ ] Enter `https://wordpress.com` → Should detect "wordpress" with confidence %
- [ ] Enter `https://example.com` → Should detect "custom" platform
- [ ] Platform badge appears with correct styling

#### 2. CSS Generation
- [ ] **Test Descriptions**:
  - [ ] "Make the header purple with rounded corners"
  - [ ] "Change all buttons to modern style with hover effects"
  - [ ] "Add a contact form on the right side"
  
- [ ] **Verify Output**:
  - [ ] CSS is generated and displayed
  - [ ] Syntax highlighting works
  - [ ] Copy button works
  - [ ] Download button creates `.css` file
  - [ ] Platform-specific implementation steps shown

#### 3. Preview System
- [ ] Before/After toggle buttons work
- [ ] Preview shows "Changes Applied" message
- [ ] Changes list displays detected modifications
- [ ] Demo mode notice appears
- [ ] Device selector (Desktop/Tablet/Mobile) changes view

#### 4. Usage Tracking
- [ ] Initial count shows "3 remaining"
- [ ] Count decreases after generation
- [ ] Upgrade prompt appears at 0
- [ ] Upgrade button links to pricing

### API Endpoint Tests (using curl or Postman)

#### Platform Detection API
```bash
curl -X POST http://localhost:3000/api/website/detect-platform \
  -H "Content-Type: application/json" \
  -d '{"url": "https://shopify.com"}'
```
Expected: Platform detection with confidence score

#### CSS Generation API
```bash
curl -X POST http://localhost:3000/api/website/generate-css \
  -H "Content-Type: application/json" \
  -d '{
    "description": "Make buttons purple",
    "platform": "shopify",
    "website_url": "https://example.com"
  }'
```
Expected: Generated CSS with keywords and suggestions

#### Mockup Creation API
```bash
curl -X POST http://localhost:3000/api/website/create-mockup \
  -H "Content-Type: application/json" \
  -d '{
    "website_url": "https://example.com",
    "generated_css": ".btn { background: purple; }",
    "description": "Purple buttons",
    "platform": "custom"
  }'
```
Expected: Mockup data with changes highlighted

#### Authentication API
```bash
# Get demo account
curl http://localhost:3000/api/website/auth/demo

# Use credit (with token from above)
curl -X POST http://localhost:3000/api/website/auth/use-credit \
  -H "Authorization: Bearer [TOKEN]"
```

## 🐛 Common Issues & Solutions

### Issue: "Cannot connect to server"
**Solution**: The Node.js networking issue on macOS is known. Use Python server for static files and ensure Node.js is running for API.

### Issue: "Platform not detected"
**Solution**: Check if URL is valid and includes protocol (https://). API will fallback to pattern matching if detection fails.

### Issue: "CSS not generating"
**Solution**: Verify description is at least 10 characters. Check browser console for API errors.

### Issue: "Preview not updating"
**Solution**: Ensure both Before/After states are toggled. Check if mockup API response includes changes.

## 📊 Performance Benchmarks

- Platform Detection: < 2 seconds
- CSS Generation: < 3 seconds
- Mockup Creation: 2-3 seconds (simulated)
- Page Load: < 1 second

## 🎯 User Flow Validation

1. **New User Journey**:
   - Land on homepage → Click "Try 3 Free"
   - Enter website URL → See platform detected
   - Describe changes → Generate CSS
   - View preview → Copy CSS
   - See usage count decrease
   - Hit limit → See upgrade prompt

2. **Power User Journey**:
   - Direct to app → Paste URL
   - Type description → Generate
   - Toggle preview → Download CSS
   - Check implementation steps
   - Apply to website

## 📈 Success Metrics

- [ ] All API endpoints return valid JSON
- [ ] Frontend gracefully handles API failures
- [ ] Demo mode works when APIs unavailable
- [ ] No JavaScript errors in console
- [ ] All UI interactions feel responsive
- [ ] CSS output is valid and formatted
- [ ] Platform detection accuracy > 80%

## 🚀 Next Steps After Testing

1. **If all tests pass**: Ready for authentication and payment integration
2. **If issues found**: Document in GitHub issues with reproduction steps
3. **Performance concerns**: Profile and optimize specific endpoints
4. **UI/UX feedback**: Iterate on design and user flow

---

**Testing Complete**: ✅ / ❌
**Date**: _______________
**Tested By**: _______________
**Notes**: _________________________________