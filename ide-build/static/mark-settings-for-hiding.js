// Mark Settings for Hiding - Target the specific SETTINGS text for CSS hiding
(function() {
    console.log('🎯 Mark Settings for Hiding: Starting...');
    
    function markSettingsForHiding() {
        let marked = 0;
        
        // Find all elements that contain SETTINGS text
        const walker = document.createTreeWalker(
            document.body,
            NodeFilter.SHOW_ELEMENT,
            {
                acceptNode: function(node) {
                    const text = node.textContent ? node.textContent.trim() : '';
                    
                    // Look for elements with SETTINGS text but not buttons
                    if ((text === 'SETTINGS' || text === '⚙ SETTINGS' || text === '⚙️ SETTINGS') &&
                        !node.classList.contains('settings-btn') &&
                        node.tagName !== 'BUTTON' &&
                        !node.querySelector('button')) {
                        return NodeFilter.FILTER_ACCEPT;
                    }
                    
                    return NodeFilter.FILTER_SKIP;
                }
            },
            false
        );
        
        let node;
        while (node = walker.nextNode()) {
            // Additional check: make sure it's in the left area (not in main content)
            const rect = node.getBoundingClientRect();
            if (rect.left < 400 && rect.width < 300) {
                console.log('🏷️ Marking SETTINGS element for hiding:', node);
                node.classList.add('hide-settings-label');
                marked++;
            }
        }
        
        // Also look for elements that have gear icons with SETTINGS
        const allElements = document.querySelectorAll('*:not(.settings-btn):not(button)');
        allElements.forEach(element => {
            const text = element.textContent ? element.textContent.trim() : '';
            const innerHTML = element.innerHTML || '';
            
            // Check for gear + SETTINGS pattern
            if ((innerHTML.includes('⚙') || innerHTML.includes('🔧')) && 
                text.includes('SETTINGS') &&
                !element.querySelector('button')) {
                
                const rect = element.getBoundingClientRect();
                // Only target elements in the left sidebar area
                if (rect.left < 400 && rect.width < 300) {
                    console.log('🏷️ Marking gear + SETTINGS element for hiding:', element);
                    element.classList.add('hide-settings-label');
                    marked++;
                }
            }
        });
        
        // Special targeting: Look specifically above Context Priming button
        const contextButton = document.querySelector('button[onclick*="context"], .settings-btn');
        if (contextButton) {
            const buttonRect = contextButton.getBoundingClientRect();
            
            // Find elements above the button
            const allDivs = document.querySelectorAll('div, span, p, h1, h2, h3, h4, h5, h6');
            allDivs.forEach(div => {
                const text = div.textContent ? div.textContent.trim() : '';
                if ((text === 'SETTINGS' || text === '⚙ SETTINGS') &&
                    !div.querySelector('button')) {
                    
                    const divRect = div.getBoundingClientRect();
                    // Check if it's above the Context Priming button
                    if (divRect.top < buttonRect.top && 
                        Math.abs(divRect.left - buttonRect.left) < 50) {
                        console.log('🏷️ Marking SETTINGS above Context Priming:', div);
                        div.classList.add('hide-settings-label');
                        marked++;
                    }
                }
            });
        }
        
        console.log(`✅ Marked ${marked} SETTINGS elements for CSS hiding`);
    }
    
    // Run multiple times to catch dynamic content
    markSettingsForHiding();
    setTimeout(markSettingsForHiding, 200);
    setTimeout(markSettingsForHiding, 500);
    setTimeout(markSettingsForHiding, 1000);
    setTimeout(markSettingsForHiding, 2000);
    setTimeout(markSettingsForHiding, 3000);
    
    // Monitor for DOM changes
    const observer = new MutationObserver(() => {
        markSettingsForHiding();
    });
    
    if (document.body) {
        observer.observe(document.body, {
            childList: true,
            subtree: true
        });
    }
    
    console.log('🎯 Mark Settings for Hiding: Active and monitoring');
})();