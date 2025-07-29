// Aggressive Hide Settings - More forceful approach to remove duplicate SETTINGS
(function() {
    console.log('💪 Aggressive Hide Settings: Starting...');
    
    function aggressiveHideSettings() {
        // Method 1: Find by exact text match
        const allElements = document.querySelectorAll('*');
        let hiddenCount = 0;
        
        allElements.forEach(element => {
            // Skip our buttons
            if (element.classList.contains('settings-section') || 
                element.closest('.settings-section') ||
                element.id === 'react-bits-button') {
                return;
            }
            
            // Get direct text content (not from children)
            const directText = Array.from(element.childNodes)
                .filter(node => node.nodeType === Node.TEXT_NODE)
                .map(node => node.textContent.trim())
                .join('');
            
            // Check various conditions
            const hasSettingsText = directText === 'SETTINGS' || 
                                  directText === 'Settings' ||
                                  element.textContent.trim() === 'SETTINGS';
            
            if (hasSettingsText) {
                const rect = element.getBoundingClientRect();
                const style = window.getComputedStyle(element);
                
                // Check if it's in the Explorer area (left side)
                if (rect.left < 400 && rect.top < window.innerHeight * 0.8) {
                    console.log('Found SETTINGS element:', {
                        element,
                        text: directText,
                        position: { left: rect.left, top: rect.top },
                        fontSize: style.fontSize,
                        display: style.display
                    });
                    
                    // Hide it
                    element.style.display = 'none !important';
                    element.style.visibility = 'hidden !important';
                    element.style.opacity = '0 !important';
                    element.style.height = '0 !important';
                    element.style.overflow = 'hidden !important';
                    hiddenCount++;
                    
                    // Also hide parent if it only contains this
                    const parent = element.parentElement;
                    if (parent && parent.children.length === 1) {
                        parent.style.display = 'none !important';
                    }
                }
            }
        });
        
        // Method 2: Target specific patterns
        // Look for gear icon + SETTINGS combinations
        const gearIcons = document.querySelectorAll('svg, .gear-icon, [class*="gear"], [class*="cog"]');
        gearIcons.forEach(icon => {
            const parent = icon.parentElement;
            const grandParent = parent ? parent.parentElement : null;
            
            // Check siblings and nearby elements
            [parent, grandParent].forEach(container => {
                if (container) {
                    const children = Array.from(container.children);
                    children.forEach((child, index) => {
                        if (child.textContent.trim() === 'SETTINGS') {
                            // Hide both icon and text
                            if (index > 0 && children[index - 1].contains(icon)) {
                                children[index - 1].style.display = 'none !important';
                            }
                            child.style.display = 'none !important';
                            hiddenCount++;
                        }
                    });
                }
            });
        });
        
        // Method 3: CSS injection for persistent hiding
        const styleId = 'aggressive-hide-settings-styles';
        if (!document.getElementById(styleId)) {
            const style = document.createElement('style');
            style.id = styleId;
            style.textContent = `
                /* Hide elements containing SETTINGS text */
                .Explorer *:not(.settings-section) {
                    display: var(--settings-display, initial);
                }
                
                /* Force hide specific patterns */
                .Explorer h1:has-text("SETTINGS"),
                .Explorer h2:has-text("SETTINGS"),
                .Explorer h3:has-text("SETTINGS"),
                .Explorer div:has-text("SETTINGS"):not(.settings-section) {
                    display: none !important;
                    visibility: hidden !important;
                    height: 0 !important;
                    overflow: hidden !important;
                }
                
                /* Hide by position and content */
                div:first-child > div > div:has(> h2:contains("SETTINGS")) {
                    display: none !important;
                }
            `;
            document.head.appendChild(style);
        }
        
        console.log(`✅ Hidden ${hiddenCount} SETTINGS elements`);
    }
    
    // Run aggressively
    function runMultipleTimes() {
        for (let i = 0; i < 10; i++) {
            setTimeout(aggressiveHideSettings, i * 200);
        }
    }
    
    // Initial runs
    runMultipleTimes();
    
    // Monitor for new elements
    const observer = new MutationObserver((mutations) => {
        let hasNewNodes = false;
        mutations.forEach(mutation => {
            if (mutation.addedNodes.length > 0) {
                hasNewNodes = true;
            }
        });
        
        if (hasNewNodes) {
            aggressiveHideSettings();
        }
    });
    
    if (document.body) {
        observer.observe(document.body, {
            childList: true,
            subtree: true,
            characterData: true
        });
    }
    
    // Also run on various events
    ['DOMContentLoaded', 'load', 'resize'].forEach(event => {
        window.addEventListener(event, runMultipleTimes);
    });
    
    console.log('💪 Aggressive Hide Settings: Armed and ready');
})();