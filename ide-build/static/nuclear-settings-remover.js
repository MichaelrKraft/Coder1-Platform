// Nuclear Settings Remover - Most aggressive approach
(function() {
    console.log('☢️ Nuclear Settings Remover: ACTIVATED');
    
    function nuclearRemoval() {
        console.log('☢️ Starting nuclear removal of SETTINGS headers...');
        
        // Find ALL elements
        const walker = document.createTreeWalker(
            document.body,
            NodeFilter.SHOW_ELEMENT,
            null,
            false
        );
        
        const elementsToHide = [];
        let node;
        
        while (node = walker.nextNode()) {
            // Skip our custom elements
            if (node.classList.contains('settings-section') || 
                node.closest('.settings-section') ||
                node.classList.contains('settings-btn') ||
                node.id === 'react-bits-button') {
                continue;
            }
            
            // Get the text content
            const text = node.textContent ? node.textContent.trim() : '';
            const innerText = node.innerText ? node.innerText.trim() : '';
            
            // Check for SETTINGS text
            if (text === 'SETTINGS' || innerText === 'SETTINGS' || 
                text.includes('SETTINGS') || innerText.includes('SETTINGS')) {
                
                const rect = node.getBoundingClientRect();
                const style = window.getComputedStyle(node);
                
                // Log what we found
                console.log('☢️ Found SETTINGS element:', {
                    element: node,
                    tagName: node.tagName,
                    text: text,
                    innerText: innerText,
                    classList: Array.from(node.classList),
                    position: { left: rect.left, top: rect.top, width: rect.width, height: rect.height },
                    fontSize: style.fontSize,
                    display: style.display,
                    parent: node.parentElement ? node.parentElement.tagName : 'none'
                });
                
                // If it's in the left side (Explorer area) and visible
                if (rect.left < 500 && rect.width > 0 && rect.height > 0) {
                    elementsToHide.push(node);
                }
            }
        }
        
        // Hide all found elements
        elementsToHide.forEach((element, index) => {
            console.log(`☢️ HIDING element ${index + 1}:`, element);
            
            // Add our hide class
            element.classList.add('hide-duplicate-settings');
            
            // Force hide with inline styles
            element.style.cssText = `
                display: none !important;
                visibility: hidden !important;
                height: 0 !important;
                width: 0 !important;
                margin: 0 !important;
                padding: 0 !important;
                overflow: hidden !important;
                opacity: 0 !important;
                position: absolute !important;
                left: -9999px !important;
                z-index: -9999 !important;
            `;
            
            // Also try to hide the parent if it becomes empty
            const parent = element.parentElement;
            if (parent && parent.children.length === 1) {
                console.log('☢️ HIDING parent container too:', parent);
                parent.style.cssText = `
                    display: none !important;
                    height: 0 !important;
                    visibility: hidden !important;
                `;
            }
        });
        
        console.log(`☢️ Nuclear removal complete. Hidden ${elementsToHide.length} elements.`);
        
        // Also remove from DOM entirely
        elementsToHide.forEach(element => {
            if (element.parentElement) {
                element.parentElement.removeChild(element);
            }
        });
        
        console.log('☢️ Elements removed from DOM');
    }
    
    // Run immediately and repeatedly
    nuclearRemoval();
    setTimeout(nuclearRemoval, 100);
    setTimeout(nuclearRemoval, 300);
    setTimeout(nuclearRemoval, 500);
    setTimeout(nuclearRemoval, 1000);
    setTimeout(nuclearRemoval, 2000);
    setTimeout(nuclearRemoval, 3000);
    
    // Set up continuous monitoring
    const observer = new MutationObserver((mutations) => {
        let shouldRun = false;
        mutations.forEach(mutation => {
            if (mutation.addedNodes.length > 0) {
                mutation.addedNodes.forEach(node => {
                    if (node.nodeType === Node.ELEMENT_NODE) {
                        const text = node.textContent || '';
                        if (text.includes('SETTINGS')) {
                            shouldRun = true;
                        }
                    }
                });
            }
        });
        
        if (shouldRun) {
            console.log('☢️ New SETTINGS element detected, running nuclear removal...');
            setTimeout(nuclearRemoval, 50);
        }
    });
    
    if (document.body) {
        observer.observe(document.body, {
            childList: true,
            subtree: true,
            characterData: true
        });
    }
    
    // Run on various events
    ['load', 'DOMContentLoaded', 'resize', 'focus'].forEach(eventType => {
        window.addEventListener(eventType, () => {
            setTimeout(nuclearRemoval, 100);
        });
    });
    
    console.log('☢️ Nuclear Settings Remover: Armed and dangerous');
})();