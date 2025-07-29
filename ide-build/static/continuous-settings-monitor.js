// Continuous Settings Monitor - Remove SETTINGS whenever it appears
(function() {
    console.log('🔵 CONTINUOUS SETTINGS MONITOR: Starting...');
    
    let removeCount = 0;
    
    function removeSettingsElements() {
        const elements = document.querySelectorAll('*');
        
        elements.forEach(el => {
            // Skip buttons and our custom settings
            if (el.tagName === 'BUTTON' || 
                el.classList.contains('settings-btn') ||
                el.classList.contains('settings-section') ||
                el.closest('.settings-section')) {
                return;
            }
            
            // Check if element contains ONLY settings text (no child elements except text)
            const hasOnlyText = Array.from(el.childNodes).every(node => 
                node.nodeType === Node.TEXT_NODE || 
                (node.nodeType === Node.ELEMENT_NODE && node.tagName === 'I')
            );
            
            if (hasOnlyText) {
                const text = el.textContent.trim();
                
                // Check for various SETTINGS patterns
                if (text === 'SETTINGS' || 
                    text === '⚙ SETTINGS' || 
                    text === '⚙️ SETTINGS' ||
                    text === 'IDE Settings' ||
                    text === '⚙ IDE Settings' ||
                    (text.includes('SETTINGS') && text.length < 20)) {
                    
                    const rect = el.getBoundingClientRect();
                    
                    // Only target elements in the explorer/sidebar area
                    if (rect.left < 400) {
                        console.log('🔵 REMOVING SETTINGS:', {
                            text: text,
                            element: el.tagName + '.' + el.className,
                            position: `${rect.left}, ${rect.top}`
                        });
                        
                        el.style.display = 'none !important';
                        el.style.visibility = 'hidden !important';
                        el.style.height = '0 !important';
                        el.style.overflow = 'hidden !important';
                        
                        // Try to remove from DOM
                        try {
                            el.remove();
                            removeCount++;
                            console.log(`🔵 Successfully removed SETTINGS element #${removeCount}`);
                        } catch (e) {
                            // If can't remove, at least it's hidden
                        }
                    }
                }
            }
        });
    }
    
    // Run immediately
    removeSettingsElements();
    
    // Run every 500ms for aggressive monitoring
    setInterval(removeSettingsElements, 500);
    
    // Also monitor DOM mutations
    const observer = new MutationObserver(() => {
        removeSettingsElements();
    });
    
    observer.observe(document.body, {
        childList: true,
        subtree: true,
        characterData: true
    });
    
    console.log('🔵 CONTINUOUS SETTINGS MONITOR: Active and watching...');
})();