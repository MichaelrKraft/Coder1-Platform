// Remove Settings Label - Target the specific "⚙ SETTINGS" text above Context Priming
(function() {
    console.log('🎯 Remove Settings Label: Starting...');
    
    function removeSettingsLabel() {
        // Look for all text nodes and elements that contain "SETTINGS"
        const walker = document.createTreeWalker(
            document.body,
            NodeFilter.SHOW_ALL,
            null,
            false
        );
        
        let removed = 0;
        let node;
        
        while (node = walker.nextNode()) {
            // Check text nodes
            if (node.nodeType === Node.TEXT_NODE) {
                const text = node.textContent.trim();
                if (text === 'SETTINGS' || text === '⚙ SETTINGS' || text === '⚙️ SETTINGS') {
                    // Make sure this isn't inside a button we want to keep
                    const parent = node.parentElement;
                    if (parent && 
                        !parent.classList.contains('settings-btn') &&
                        parent.tagName !== 'BUTTON' &&
                        !parent.querySelector('button')) {
                        
                        console.log('🗑️ Removing SETTINGS text node:', parent);
                        parent.style.display = 'none';
                        parent.remove();
                        removed++;
                    }
                }
            }
            
            // Check element nodes
            if (node.nodeType === Node.ELEMENT_NODE) {
                const text = node.textContent ? node.textContent.trim() : '';
                
                // Look for elements that ONLY contain SETTINGS text
                if ((text === 'SETTINGS' || text === '⚙ SETTINGS' || text === '⚙️ SETTINGS') &&
                    !node.classList.contains('settings-btn') &&
                    node.tagName !== 'BUTTON' &&
                    !node.querySelector('button') &&
                    !node.querySelector('.settings-btn')) {
                    
                    // Additional check: make sure it's above the Context Priming button
                    const contextButton = document.querySelector('button, .settings-btn');
                    if (contextButton) {
                        const nodeRect = node.getBoundingClientRect();
                        const buttonRect = contextButton.getBoundingClientRect();
                        
                        // Only remove if it's positioned above the first button
                        if (nodeRect.top < buttonRect.top && nodeRect.left < 400) {
                            console.log('🗑️ Removing SETTINGS label above buttons:', node);
                            node.style.display = 'none';
                            node.remove();
                            removed++;
                        }
                    }
                }
            }
        }
        
        // More direct approach: find elements by specific patterns
        // Look for gear emoji or icon followed by SETTINGS text
        const allElements = document.querySelectorAll('*');
        allElements.forEach(element => {
            const text = element.textContent ? element.textContent.trim() : '';
            const innerHTML = element.innerHTML || '';
            
            // Check for gear + SETTINGS pattern
            if ((innerHTML.includes('⚙') || innerHTML.includes('🔧')) && 
                text.includes('SETTINGS') &&
                !element.querySelector('button') &&
                !element.classList.contains('settings-btn')) {
                
                const rect = element.getBoundingClientRect();
                // Only target elements in the left sidebar area
                if (rect.left < 400 && rect.width < 300) {
                    console.log('🗑️ Removing gear + SETTINGS element:', element);
                    element.style.display = 'none';
                    element.remove();
                    removed++;
                }
            }
        });
        
        console.log(`✅ Removed ${removed} SETTINGS label elements`);
    }
    
    // Run immediately and multiple times
    removeSettingsLabel();
    setTimeout(removeSettingsLabel, 200);
    setTimeout(removeSettingsLabel, 500);
    setTimeout(removeSettingsLabel, 1000);
    setTimeout(removeSettingsLabel, 2000);
    
    // Monitor for DOM changes
    const observer = new MutationObserver(() => {
        removeSettingsLabel();
    });
    
    if (document.body) {
        observer.observe(document.body, {
            childList: true,
            subtree: true
        });
    }
    
    console.log('🎯 Remove Settings Label: Active and monitoring');
})();