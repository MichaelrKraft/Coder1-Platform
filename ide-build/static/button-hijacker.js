// Button Hijacker - Directly modify button behavior
(function() {
    console.log('🎯 Button Hijacker Loading...');
    
    // Function to hijack a button
    function hijackButton(button, viewType) {
        // Remove all existing event listeners by cloning
        const newButton = button.cloneNode(true);
        button.parentNode.replaceChild(newButton, button);
        
        // Add our own handler
        newButton.addEventListener('click', function(e) {
            console.log(`✅ Hijacked ${viewType} button clicked`);
            e.preventDefault();
            e.stopPropagation();
            e.stopImmediatePropagation();
            
            // Hide settings
            const settings = document.querySelector('.settings-section');
            if (settings) {
                settings.style.display = 'none';
                console.log('✅ Settings hidden');
            }
            
            // Show our view
            if (window.showSpecialView && typeof window.showSpecialView === 'function') {
                window.showSpecialView(viewType);
            } else {
                // Simple fallback
                alert(`${viewType} view activated - Settings are now hidden!`);
            }
            
            return false;
        }, true);
        
        // Mark as hijacked
        newButton.dataset.hijacked = 'true';
        
        console.log(`✅ Button hijacked: ${viewType}`);
    }
    
    // Function to find and hijack buttons
    function hijackAllButtons() {
        const buttonMappings = {
            'Parallel Agents': 'parallel-agents',
            'Sleep Mode': 'sleep-mode',
            'Supervision': 'supervision',
            'Infinite Loop': 'infinite-loop',
            'Stop Loop': 'infinite-loop'
        };
        
        // Find all buttons
        const buttons = document.querySelectorAll('button');
        let hijackCount = 0;
        
        buttons.forEach(button => {
            // Skip if already hijacked
            if (button.dataset.hijacked) return;
            
            const buttonText = button.textContent.trim();
            
            // Check each mapping
            for (const [text, viewType] of Object.entries(buttonMappings)) {
                if (buttonText.includes(text)) {
                    hijackButton(button, viewType);
                    hijackCount++;
                    break;
                }
            }
        });
        
        if (hijackCount > 0) {
            console.log(`✅ Hijacked ${hijackCount} buttons`);
        }
    }
    
    // Function to remove React handlers from element
    function removeReactHandlers(element) {
        if (!element) return;
        
        // Get all property names
        const props = Object.getOwnPropertyNames(element);
        
        // Remove React internal properties
        props.forEach(prop => {
            if (prop.startsWith('__react') || prop.startsWith('_react')) {
                try {
                    delete element[prop];
                } catch (e) {
                    // Some properties might be non-configurable
                }
            }
        });
        
        // Remove onClick and other event handlers
        element.onclick = null;
        element.onmousedown = null;
        element.onmouseup = null;
    }
    
    // Aggressive approach - intercept React's setState
    function interceptReactState() {
        // Find React components in the DOM
        function findReactComponent(element) {
            const keys = Object.keys(element);
            const reactKey = keys.find(key => key.startsWith('__reactInternalInstance'));
            if (reactKey) {
                return element[reactKey];
            }
            return null;
        }
        
        // Override setState for Terminal components
        const buttons = document.querySelectorAll('button');
        buttons.forEach(button => {
            const instance = findReactComponent(button);
            if (instance && instance.return && instance.return.elementType && 
                instance.return.elementType.name === 'Terminal') {
                console.log('Found Terminal component instance');
                
                // Try to modify the component's methods
                const component = instance.return.stateNode;
                if (component && component.handleParallelAgentsToggle) {
                    const original = component.handleParallelAgentsToggle;
                    component.handleParallelAgentsToggle = async function() {
                        console.log('🚫 Intercepted handleParallelAgentsToggle');
                        // Hide settings
                        const settings = document.querySelector('.settings-section');
                        if (settings) settings.style.display = 'none';
                        // Show our view
                        if (window.showSpecialView) {
                            window.showSpecialView('parallel-agents');
                        }
                        // Don't call original
                        return;
                    };
                }
            }
        });
    }
    
    // Run hijacking
    function initialize() {
        hijackAllButtons();
        
        // Try React interception
        setTimeout(interceptReactState, 500);
        
        // Monitor for new buttons
        const observer = new MutationObserver(() => {
            hijackAllButtons();
        });
        
        if (document.body) {
            observer.observe(document.body, {
                childList: true,
                subtree: true
            });
        }
    }
    
    // Start when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initialize);
    } else {
        initialize();
    }
    
    // Also run periodically to catch any new buttons
    setInterval(hijackAllButtons, 1000);
    
    console.log('✅ Button Hijacker Ready');
})();