// Ultimate Settings Remover - Complete solution including Shadow DOM detection
(function() {
    'use strict';
    console.log('🚀 ULTIMATE SETTINGS REMOVER: Starting comprehensive removal...');
    
    let removedCount = 0;
    const processedElements = new WeakSet();
    
    // Function to check if element contains SETTINGS text
    function hasSettingsText(element) {
        // Skip our custom settings elements
        if (element.classList && (
            element.classList.contains('settings-btn') ||
            element.classList.contains('settings-section') ||
            element.closest('.settings-section'))) {
            return false;
        }
        
        // Get direct text content (not from children)
        const directText = Array.from(element.childNodes)
            .filter(node => node.nodeType === Node.TEXT_NODE)
            .map(node => node.textContent.trim())
            .join('');
        
        // Check for SETTINGS patterns
        return directText === 'SETTINGS' || 
               directText === '⚙ SETTINGS' || 
               directText === '⚙️ SETTINGS' ||
               directText === '⚙️SETTINGS' ||
               directText === '⚙SETTINGS' ||
               (directText.includes('SETTINGS') && directText.length < 20);
    }
    
    // Function to remove SETTINGS element
    function removeSettingsElement(element) {
        if (processedElements.has(element)) return;
        
        const rect = element.getBoundingClientRect();
        
        // Only remove if it's in the Explorer/sidebar area
        if (rect.left < 400) {
            console.log('🎯 REMOVING SETTINGS:', {
                text: element.textContent.trim(),
                tag: element.tagName,
                class: element.className,
                position: `${rect.left}, ${rect.top}`
            });
            
            // Multiple removal strategies
            element.style.display = 'none !important';
            element.style.visibility = 'hidden !important';
            element.style.position = 'absolute !important';
            element.style.left = '-9999px !important';
            element.style.opacity = '0 !important';
            element.style.height = '0 !important';
            element.style.overflow = 'hidden !important';
            
            // Mark as processed
            processedElements.add(element);
            
            // Try to remove from DOM
            try {
                element.remove();
                removedCount++;
                console.log(`✅ Successfully removed SETTINGS element #${removedCount}`);
            } catch (e) {
                console.log('⚠️ Could not remove from DOM, but it is hidden');
            }
            
            return true;
        }
        return false;
    }
    
    // Function to check Shadow DOM
    function checkShadowDOM(root) {
        const elements = root.querySelectorAll('*');
        elements.forEach(element => {
            // Check if element has shadow root
            if (element.shadowRoot) {
                console.log('🔍 Found Shadow DOM in:', element);
                // Recursively check shadow DOM
                scanForSettings(element.shadowRoot);
                checkShadowDOM(element.shadowRoot);
            }
        });
    }
    
    // Function to check CSS pseudo-elements
    function checkPseudoElements() {
        const allElements = document.querySelectorAll('*');
        allElements.forEach(element => {
            const computed = window.getComputedStyle(element);
            const before = window.getComputedStyle(element, '::before');
            const after = window.getComputedStyle(element, '::after');
            
            // Check ::before content
            if (before.content && before.content !== 'none') {
                const content = before.content.replace(/['"]/g, '');
                if (content.includes('SETTINGS') || content === '⚙') {
                    console.log('🎯 Found SETTINGS in ::before pseudo-element:', element);
                    element.style.setProperty('display', 'none', 'important');
                    removedCount++;
                }
            }
            
            // Check ::after content
            if (after.content && after.content !== 'none') {
                const content = after.content.replace(/['"]/g, '');
                if (content.includes('SETTINGS') || content === '⚙') {
                    console.log('🎯 Found SETTINGS in ::after pseudo-element:', element);
                    element.style.setProperty('display', 'none', 'important');
                    removedCount++;
                }
            }
        });
    }
    
    // Main scanning function
    function scanForSettings(root = document) {
        // Method 1: Query all elements
        const allElements = root.querySelectorAll('*');
        allElements.forEach(element => {
            if (hasSettingsText(element)) {
                removeSettingsElement(element);
            }
        });
        
        // Method 2: TreeWalker for text nodes
        const walker = document.createTreeWalker(
            root,
            NodeFilter.SHOW_ALL,
            {
                acceptNode: function(node) {
                    if (node.nodeType === Node.TEXT_NODE) {
                        const text = node.textContent.trim();
                        if (text === 'SETTINGS' || text.includes('SETTINGS')) {
                            return NodeFilter.FILTER_ACCEPT;
                        }
                    } else if (node.nodeType === Node.ELEMENT_NODE && hasSettingsText(node)) {
                        return NodeFilter.FILTER_ACCEPT;
                    }
                    return NodeFilter.FILTER_SKIP;
                }
            }
        );
        
        let node;
        while (node = walker.nextNode()) {
            if (node.nodeType === Node.TEXT_NODE) {
                const parent = node.parentElement;
                if (parent && !parent.querySelector('button') && !parent.classList.contains('settings-btn')) {
                    console.log('🎯 Found SETTINGS text node:', node);
                    removeSettingsElement(parent);
                }
            } else if (node.nodeType === Node.ELEMENT_NODE) {
                removeSettingsElement(node);
            }
        }
        
        // Method 3: Check specific areas
        const explorerAreas = root.querySelectorAll('.Explorer, [class*="explorer"], [class*="sidebar"], [class*="left-panel"]');
        explorerAreas.forEach(area => {
            const elements = area.querySelectorAll('*');
            elements.forEach(element => {
                if (hasSettingsText(element)) {
                    removeSettingsElement(element);
                }
            });
        });
    }
    
    // React-specific removal
    function reactAwareRemoval() {
        // Try to hook into React's render cycle
        const reactRoot = document.getElementById('root');
        if (reactRoot && reactRoot._reactRootContainer) {
            console.log('🔍 Found React root, attempting React-aware removal...');
            
            // Override React's createElement temporarily
            const originalCreateElement = React.createElement;
            React.createElement = function(...args) {
                const element = originalCreateElement.apply(this, args);
                
                // Check if this is creating a SETTINGS element
                if (element && element.props && element.props.children) {
                    const children = Array.isArray(element.props.children) ? element.props.children : [element.props.children];
                    children.forEach(child => {
                        if (typeof child === 'string' && child.includes('SETTINGS')) {
                            console.log('🎯 Intercepted React SETTINGS creation, nullifying...');
                            return null;
                        }
                    });
                }
                
                return element;
            };
        }
    }
    
    // Mutation observer for continuous monitoring
    const observer = new MutationObserver((mutations) => {
        mutations.forEach(mutation => {
            mutation.addedNodes.forEach(node => {
                if (node.nodeType === Node.ELEMENT_NODE) {
                    if (hasSettingsText(node)) {
                        removeSettingsElement(node);
                    }
                    // Check children
                    const children = node.querySelectorAll ? node.querySelectorAll('*') : [];
                    children.forEach(child => {
                        if (hasSettingsText(child)) {
                            removeSettingsElement(child);
                        }
                    });
                }
            });
        });
    });
    
    // CSS injection to hide any remaining SETTINGS
    function injectCSS() {
        const style = document.createElement('style');
        style.textContent = `
            /* Hide any element containing only SETTINGS text */
            *:not(.settings-btn):not(.settings-section):not(button) {
                visibility: var(--settings-visibility, visible);
            }
            
            /* Target specific patterns that might be SETTINGS headers */
            div:not(.settings-section) > :first-child:not(button),
            [class*="explorer"] > div:first-child:not(.settings-section),
            [class*="sidebar"] > div:first-child:not(.settings-section) {
                display: var(--settings-header-display, initial) !important;
            }
            
            /* Hide elements marked for removal */
            .settings-to-remove {
                display: none !important;
                visibility: hidden !important;
                height: 0 !important;
                overflow: hidden !important;
                position: absolute !important;
                left: -9999px !important;
            }
        `;
        document.head.appendChild(style);
        
        // Apply CSS variables to matching elements
        const allElements = document.querySelectorAll('*');
        allElements.forEach(element => {
            if (hasSettingsText(element)) {
                element.style.setProperty('--settings-visibility', 'hidden');
                element.style.setProperty('--settings-header-display', 'none');
                element.classList.add('settings-to-remove');
            }
        });
    }
    
    // Main execution
    function executeRemoval() {
        console.log('🔄 Executing comprehensive SETTINGS removal...');
        
        // 1. Initial scan
        scanForSettings();
        
        // 2. Check Shadow DOM
        checkShadowDOM(document);
        
        // 3. Check pseudo-elements
        checkPseudoElements();
        
        // 4. Inject CSS
        injectCSS();
        
        // 5. Try React-aware removal
        if (typeof React !== 'undefined') {
            reactAwareRemoval();
        }
        
        // 6. Start mutation observer
        observer.observe(document.body, {
            childList: true,
            subtree: true,
            characterData: true
        });
        
        console.log(`✅ ULTIMATE SETTINGS REMOVER: Completed initial scan. Removed ${removedCount} elements.`);
    }
    
    // Execute immediately and after delays
    executeRemoval();
    setTimeout(executeRemoval, 100);
    setTimeout(executeRemoval, 500);
    setTimeout(executeRemoval, 1000);
    setTimeout(executeRemoval, 2000);
    setTimeout(executeRemoval, 3000);
    
    // Continuous monitoring (less aggressive)
    setInterval(() => {
        scanForSettings();
    }, 5000);
    
    console.log('🚀 ULTIMATE SETTINGS REMOVER: Loaded and monitoring...');
})();