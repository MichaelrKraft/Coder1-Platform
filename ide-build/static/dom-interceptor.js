// DOM Interceptor - Detect and replace React overlays with custom views
(function() {
    console.log('🎯 DOM Interceptor Loading...');
    
    // Global flag to track if we're showing a custom view
    window.CUSTOM_VIEW_ACTIVE = false;
    
    // Function to check if an element is a React overlay
    function isReactOverlay(element) {
        if (!element) return false;
        
        // Check for React overlay characteristics
        const hasOverlayClass = element.className && element.className.includes('special-view-overlay');
        const hasReactProps = Object.keys(element).some(key => key.startsWith('__react'));
        const isPositionedOverlay = element.style && (
            element.style.position === 'fixed' || 
            element.style.position === 'absolute'
        ) && element.style.zIndex > 100;
        
        // Check content for React components
        const innerHTML = element.innerHTML || '';
        const hasParallelAgentsContent = innerHTML.includes('Parallel Agents') || 
                                        innerHTML.includes('Agent Alpha') ||
                                        innerHTML.includes('Agent Beta');
        
        return (hasOverlayClass || hasReactProps || isPositionedOverlay) && hasParallelAgentsContent;
    }
    
    // Function to replace React overlay with custom view
    function replaceWithCustomView(reactOverlay) {
        console.log('🔄 Replacing React overlay with custom view');
        
        // Hide the React overlay immediately
        reactOverlay.style.display = 'none';
        reactOverlay.style.visibility = 'hidden';
        
        // Remove it from DOM
        setTimeout(() => {
            if (reactOverlay.parentNode) {
                reactOverlay.parentNode.removeChild(reactOverlay);
            }
        }, 10);
        
        // Show our custom view
        if (window.showSpecialView && typeof window.showSpecialView === 'function') {
            console.log('✅ Showing custom special view');
            window.CUSTOM_VIEW_ACTIVE = true;
            window.showSpecialView('parallel-agents');
        } else {
            console.log('⚠️ showSpecialView not available, using simple overlay');
            showSimpleOverlay();
        }
        
        // Hide settings
        const settings = document.querySelector('.settings-section');
        if (settings) {
            settings.style.display = 'none';
        }
    }
    
    // Simple overlay fallback
    function showSimpleOverlay() {
        const existing = document.getElementById('custom-overlay');
        if (existing) existing.remove();
        
        const overlay = document.createElement('div');
        overlay.id = 'custom-overlay';
        overlay.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background: rgba(26, 27, 38, 0.95);
            backdrop-filter: blur(20px);
            z-index: 999999;
            display: flex;
            align-items: center;
            justify-content: center;
            color: white;
            font-family: Inter, sans-serif;
        `;
        
        overlay.innerHTML = `
            <div style="text-align: center; padding: 40px;">
                <h1 style="font-size: 48px; margin-bottom: 20px; color: #8b5cf6;">
                    🤖 Parallel Agents
                </h1>
                <p style="font-size: 18px; margin-bottom: 30px; color: #a78bfa;">
                    Custom view loaded successfully!<br>
                    Settings panel has been hidden.
                </p>
                <button onclick="
                    document.getElementById('custom-overlay').remove(); 
                    window.CUSTOM_VIEW_ACTIVE = false;
                    const s = document.querySelector('.settings-section'); 
                    if(s) s.style.display = '';"
                    style="padding: 12px 24px; background: #8b5cf6; color: white; 
                           border: none; border-radius: 8px; cursor: pointer; 
                           font-size: 16px; font-weight: 500; transition: all 0.3s;">
                    Close View
                </button>
            </div>
        `;
        
        document.body.appendChild(overlay);
    }
    
    // Create MutationObserver to watch for React overlays
    const observer = new MutationObserver((mutations) => {
        for (const mutation of mutations) {
            // Check added nodes
            for (const node of mutation.addedNodes) {
                if (node.nodeType === 1) { // Element node
                    // Check if this is a React overlay
                    if (isReactOverlay(node)) {
                        console.log('🎯 Detected React overlay:', node);
                        replaceWithCustomView(node);
                        return;
                    }
                    
                    // Also check children
                    const overlays = node.querySelectorAll('.special-view-overlay');
                    overlays.forEach(overlay => {
                        if (isReactOverlay(overlay)) {
                            console.log('🎯 Detected React overlay in children');
                            replaceWithCustomView(overlay);
                        }
                    });
                }
            }
        }
        
        // Also continuously hide settings when custom view is active
        if (window.CUSTOM_VIEW_ACTIVE) {
            const settings = document.querySelector('.settings-section');
            if (settings && settings.style.display !== 'none') {
                settings.style.display = 'none';
            }
        }
    });
    
    // Start observing when DOM is ready
    function startObserving() {
        observer.observe(document.body, {
            childList: true,
            subtree: true,
            attributes: false,
            characterData: false
        });
        console.log('✅ DOM Interceptor active - monitoring for React overlays');
    }
    
    // Override React component rendering
    function interceptReactRendering() {
        // Try to intercept React's render methods
        if (window.React && window.React.createElement) {
            const originalCreateElement = window.React.createElement;
            window.React.createElement = function(...args) {
                // Check if this is a ParallelAgentsView component
                if (args[0] && args[0].name === 'ParallelAgentsView') {
                    console.log('🚫 Blocking ParallelAgentsView render');
                    // Return empty element
                    return originalCreateElement('div', { style: { display: 'none' } });
                }
                return originalCreateElement.apply(this, args);
            };
        }
    }
    
    // Intercept button clicks before React can handle them
    document.addEventListener('click', function(e) {
        const target = e.target;
        
        if (target.tagName === 'BUTTON' && target.textContent.includes('Parallel Agents')) {
            console.log('🎯 Intercepted Parallel Agents button click');
            e.stopImmediatePropagation();
            e.preventDefault();
            
            // Hide settings immediately
            const settings = document.querySelector('.settings-section');
            if (settings) {
                settings.style.display = 'none';
            }
            
            // Show our view
            if (window.showSpecialView && typeof window.showSpecialView === 'function') {
                window.CUSTOM_VIEW_ACTIVE = true;
                window.showSpecialView('parallel-agents');
            } else {
                showSimpleOverlay();
            }
            
            return false;
        }
    }, true); // Capture phase
    
    // Initialize
    if (document.body) {
        startObserving();
    } else {
        document.addEventListener('DOMContentLoaded', startObserving);
    }
    
    // Try to intercept React
    setTimeout(interceptReactRendering, 100);
    
    // Keep settings hidden when custom view is active
    setInterval(() => {
        if (window.CUSTOM_VIEW_ACTIVE) {
            const settings = document.querySelector('.settings-section');
            if (settings && settings.style.display !== 'none') {
                settings.style.display = 'none';
            }
        }
    }, 100);
    
    console.log('✅ DOM Interceptor Ready');
})();