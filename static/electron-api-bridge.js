/**
 * Electron API Bridge
 * Intercepts API calls and routes them through Electron's file protocol
 */

(function() {
  // Only run in Electron environment
  if (typeof window === 'undefined' || !window.location.protocol.startsWith('file:')) {
    return;
  }

  console.log('🔌 Electron API Bridge: Initializing...');

  // Store the original fetch function
  const originalFetch = window.fetch;

  // Override fetch to intercept API calls
  window.fetch = function(url, options = {}) {
    // Convert relative URLs to absolute
    let fetchUrl = url;
    
    if (typeof url === 'string') {
      // Handle relative API URLs
      if (url.startsWith('/api/')) {
        // For API calls, we need to use a special protocol
        // But for now, we'll use a data URL approach
        console.log('🔄 Intercepting API call:', url);
        
        // Create a mock response for testing
        if (url === '/api/health') {
          return Promise.resolve(new Response(JSON.stringify({
            status: 'healthy',
            message: 'Coder1 Platform is running in Electron!',
            timestamp: new Date().toISOString()
          }), {
            status: 200,
            headers: { 'Content-Type': 'application/json' }
          }));
        }
        
        // For other API calls, return a mock response
        return Promise.resolve(new Response(JSON.stringify({
          success: true,
          message: 'API bridge active - full implementation coming soon',
          endpoint: url
        }), {
          status: 200,
          headers: { 'Content-Type': 'application/json' }
        }));
      }
      
      // Handle static file requests
      if (url.startsWith('/')) {
        // Convert to file:// URL
        const baseUrl = window.location.href.substring(0, window.location.href.lastIndexOf('/'));
        fetchUrl = baseUrl + url;
      }
    }
    
    // Call the original fetch with modified URL
    return originalFetch.call(this, fetchUrl, options);
  };

  console.log('✅ Electron API Bridge: Ready');
  
  // Also override XMLHttpRequest if needed
  const originalXHROpen = XMLHttpRequest.prototype.open;
  XMLHttpRequest.prototype.open = function(method, url, ...args) {
    if (typeof url === 'string' && url.startsWith('/api/')) {
      console.log('🔄 Intercepting XHR API call:', url);
      // For now, we'll let it fail and rely on fetch
    }
    return originalXHROpen.call(this, method, url, ...args);
  };

  // Handle navigation within Electron
  window.electronNavigate = function(path) {
    console.log('🔗 Navigating to:', path);
    
    // Get the base directory from current location
    const currentUrl = window.location.href;
    const baseDir = currentUrl.substring(0, currentUrl.lastIndexOf('/'));
    
    if (path === '/ide' || path === 'ide-build/index.html') {
      // Navigate to the full IDE now that assets are confirmed working
      const ideUrl = baseDir + '/ide-build/index.html';
      console.log('🎯 IDE Navigation URL:', ideUrl);
      window.location.href = ideUrl;
    } else if (path === '/') {
      // Navigate to home
      const homeUrl = baseDir + '/smart-prd-generator.html';
      console.log('🏠 Home Navigation URL:', homeUrl);
      window.location.href = homeUrl;
    } else if (path === '/context-priming.html' || path === '/context-priming') {
      // Navigate to context priming
      const contextUrl = baseDir + '/context-priming.html';
      console.log('🧠 Context Navigation URL:', contextUrl);
      window.location.href = contextUrl;
    } else {
      console.warn('Unknown navigation path:', path);
    }
  };

  // Override click handlers for navigation links
  document.addEventListener('DOMContentLoaded', function() {
    console.log('📄 DOM loaded, setting up navigation handlers...');
    
    // Fix Enter Coder1 IDE buttons
    const ideButton = document.getElementById('enterIDE');
    if (ideButton) {
      console.log('🔧 Setting up IDE button handler');
      ideButton.onclick = function(e) {
        e.preventDefault();
        console.log('🖱️ IDE button clicked');
        window.electronNavigate('/ide');
      };
    } else {
      console.warn('⚠️ IDE button not found');
    }

    // Fix Context Priming button
    const contextButton = document.getElementById('contextPriming');
    if (contextButton) {
      console.log('🔧 Setting up context button handler');
      contextButton.onclick = function(e) {
        e.preventDefault();
        console.log('🖱️ Context button clicked');
        window.electronNavigate('/context-priming.html');
      };
    } else {
      console.warn('⚠️ Context button not found');
    }

    // Fix any navigation buttons with onclick
    const onclickButtons = document.querySelectorAll('button[onclick*="window.location.href"]');
    onclickButtons.forEach(button => {
      const onclick = button.getAttribute('onclick');
      const match = onclick.match(/window\.location\.href\s*=\s*['"]([^'"]+)['"]/);
      if (match) {
        button.onclick = function(e) {
          e.preventDefault();
          window.electronNavigate(match[1]);
        };
      }
    });

    // Fix any other navigation links
    const navLinks = document.querySelectorAll('a[href^="/"]');
    navLinks.forEach(link => {
      link.addEventListener('click', function(e) {
        e.preventDefault();
        const path = this.getAttribute('href');
        window.electronNavigate(path);
      });
    });
  });
})();