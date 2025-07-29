// Computed Style Remover - Find SETTINGS by computed styles and structure
(function() {
    console.log('🔍 COMPUTED STYLE REMOVER: Starting analysis...');
    
    function findAndRemoveSettings() {
        // Strategy: Find all elements, check their computed text and position
        const allElements = document.querySelectorAll('*');
        let found = [];
        
        allElements.forEach(element => {
            // Skip our custom elements
            if (element.classList.contains('settings-btn') ||
                element.classList.contains('settings-section') ||
                element.closest('.settings-section') ||
                element.tagName === 'BUTTON' ||
                element.id === 'react-bits-button') {
                return;
            }
            
            // Get only direct text content (not from children)
            const directText = Array.from(element.childNodes)
                .filter(node => node.nodeType === Node.TEXT_NODE)
                .map(node => node.textContent.trim())
                .join('');
            
            // Check if this element has SETTINGS text
            if (directText === 'SETTINGS' || 
                directText === '⚙ SETTINGS' || 
                directText === '⚙️ SETTINGS' ||
                directText === '⚙️SETTINGS' ||
                directText === '⚙SETTINGS') {
                
                const computed = window.getComputedStyle(element);
                const rect = element.getBoundingClientRect();
                
                // Log what we found
                console.log('🔍 Found potential SETTINGS element:', {
                    element: element,
                    tag: element.tagName,
                    class: element.className || 'no-class',
                    id: element.id || 'no-id',
                    text: directText,
                    display: computed.display,
                    position: computed.position,
                    fontSize: computed.fontSize,
                    color: computed.color,
                    rect: {
                        top: rect.top,
                        left: rect.left,
                        width: rect.width,
                        height: rect.height
                    },
                    parent: element.parentElement ? {
                        tag: element.parentElement.tagName,
                        class: element.parentElement.className
                    } : 'no-parent'
                });
                
                // If it's in the Explorer area and not a functional element
                if (rect.left < 400 && rect.top > 100 && rect.top < 800) {
                    element.classList.add('duplicate-settings-header');
                    element.style.cssText = `
                        display: none !important;
                        visibility: hidden !important;
                        height: 0 !important;
                        margin: 0 !important;
                        padding: 0 !important;
                        overflow: hidden !important;
                        opacity: 0 !important;
                        position: absolute !important;
                        left: -9999px !important;
                    `;
                    
                    // Also try removing it
                    setTimeout(() => {
                        try {
                            element.remove();
                            console.log('🔍 Successfully removed SETTINGS element');
                        } catch (e) {
                            console.log('🔍 Could not remove, but it is hidden');
                        }
                    }, 10);
                    
                    found.push(element);
                }
            }
        });
        
        console.log(`🔍 COMPUTED STYLE REMOVER: Found and processed ${found.length} SETTINGS elements`);
        
        // Also try to find by visual hierarchy
        const explorer = document.querySelector('.Explorer, [class*="explorer"], [class*="sidebar"]');
        if (explorer) {
            console.log('🔍 Found Explorer container:', explorer);
            
            // Look for any text nodes or elements with SETTINGS
            const walker = document.createTreeWalker(
                explorer,
                NodeFilter.SHOW_ALL,
                {
                    acceptNode: function(node) {
                        if (node.nodeType === Node.TEXT_NODE) {
                            const text = node.textContent.trim();
                            if (text === 'SETTINGS' || text.includes('SETTINGS')) {
                                return NodeFilter.FILTER_ACCEPT;
                            }
                        } else if (node.nodeType === Node.ELEMENT_NODE) {
                            const text = node.textContent ? node.textContent.trim() : '';
                            if (text === 'SETTINGS' || text === '⚙ SETTINGS') {
                                return NodeFilter.FILTER_ACCEPT;
                            }
                        }
                        return NodeFilter.FILTER_SKIP;
                    }
                }
            );
            
            let node;
            while (node = walker.nextNode()) {
                if (node.nodeType === Node.TEXT_NODE) {
                    // Found a text node with SETTINGS
                    const parent = node.parentElement;
                    if (parent && !parent.querySelector('button') && !parent.classList.contains('settings-btn')) {
                        console.log('🔍 Found SETTINGS text node, hiding parent:', parent);
                        parent.style.display = 'none';
                        parent.remove();
                    }
                } else if (node.nodeType === Node.ELEMENT_NODE) {
                    // Found an element with SETTINGS
                    if (!node.querySelector('button') && !node.classList.contains('settings-btn')) {
                        console.log('🔍 Found SETTINGS element in Explorer:', node);
                        node.style.display = 'none';
                        node.remove();
                    }
                }
            }
        }
    }
    
    // Run multiple times
    findAndRemoveSettings();
    setTimeout(findAndRemoveSettings, 500);
    setTimeout(findAndRemoveSettings, 1000);
    setTimeout(findAndRemoveSettings, 2000);
    setTimeout(findAndRemoveSettings, 3000);
    
    // Monitor for changes
    const observer = new MutationObserver(() => {
        findAndRemoveSettings();
    });
    
    if (document.body) {
        observer.observe(document.body, {
            childList: true,
            subtree: true
        });
    }
    
    console.log('🔍 COMPUTED STYLE REMOVER: Active and monitoring');
})();