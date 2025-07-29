# Fix IDE Issues

Invoking the **React IDE Specialist** to diagnose and fix IDE-related problems.

## Common IDE Issues & Solutions:

### 🔴 Terminal Not Working
- Check special views version (should be v4)
- Verify terminal-voice.js is loaded
- Ensure WebSocket connection is active
- Check for JavaScript errors in console

### 🔴 Buttons Missing
- Verify button-hijacker.js is included
- Check CSS for display issues
- Ensure special-views-unified.css is loaded
- Look for DOM manipulation conflicts

### 🔴 Settings Not Accessible
- Check settings-controller.js
- Verify hide-settings-aggressive.js isn't blocking
- Ensure proper event listeners are attached

### 🔴 IDE Not Loading
- Check if using correct build files:
  - main.5c128812.css
  - main.a1cfdcd5.js
- Verify ide-build/index.html hasn't been replaced
- Check for network/CORS issues

## Critical Reminders:

⚠️ **NEVER** directly modify files in `ide-build/`
- Work in `coder1-ide-source/` and build properly
- The production IDE was restored from commit `f4bd7dd`

✅ **Working IDE URL**: https://michaelrkraft.github.io/Coder1-Platform/ide-build/

## Diagnostic Steps:

1. **Check Git History**
   ```bash
   git log --oneline ide-build/
   ```

2. **Verify Special Views Version**
   - Should be using v4 (coder1-special-views-v4.js)

3. **Inspect Custom Scripts**
   - All files in `ide-build/static/` should be intact

4. **Test Locally**
   ```bash
   npm start  # Electron wrapper
   # OR
   python3 -m http.server 8892 --bind 127.0.0.1
   ```

## Quick Fixes:

- **Restore from working commit**: `git checkout f4bd7dd -- ide-build/`
- **Clear cache**: Hard refresh (Cmd+Shift+R on Mac)
- **Check console**: Look for JavaScript errors

*The React IDE Specialist will now diagnose and fix the IDE issue...*