// Settings Mutation Override - Nuclear approach to prevent SETTINGS duplicate
(function() {
    console.log('☢️ NUCLEAR: Settings Mutation Override starting...');
    
    let removedCount = 0;
    
    function nuclearRemoveSettings(element) {
        const text = element.textContent ? element.textContent.trim() : '';
        const innerHTML = element.innerHTML || '';
        
        // Check if this element contains SETTINGS text but is not a functional button
        const containsSettings = text.includes('SETTINGS') || innerHTML.includes('SETTINGS');
        const isFunctionalElement = element.classList.contains('settings-btn') || 
                                   element.tagName === 'BUTTON' ||
                                   element.querySelector('button') ||
                                   element.closest('.settings-section');
        
        if (containsSettings && !isFunctionalElement) {
            // Additional check: is it positioned like a header?
            const rect = element.getBoundingClientRect();
            const isInLeftArea = rect.left < 400;
            const isSmallElement = rect.width < 300 && rect.height < 100;
            const hasNoInteractiveContent = !element.querySelector('input, button, select, textarea');
            
            if (isInLeftArea && isSmallElement && hasNoInteractiveContent) {
                // This looks like a duplicate header - REMOVE IT
                console.log('☢️ NUCLEAR REMOVAL:', {
                    tag: element.tagName,
                    class: element.className,
                    text: text,
                    position: `${rect.left},${rect.top}`,
                    size: `${rect.width}x${rect.height}`
                });
                
                // Multiple removal methods
                element.classList.add('nuclear-hide-settings');
                element.style.cssText = 'display: none !important; visibility: hidden !important; opacity: 0 !important; height: 0 !important; position: absolute !important; left: -9999px !important;';
                
                // Try to remove from DOM
                try {
                    element.remove();
                    removedCount++;
                } catch (e) {
                    // If removal fails, at least hide it
                    element.style.display = 'none';
                }
                
                return true;
            }
        }
        
        return false;
    }
    
    // Scan existing elements immediately
    function nuclearScanExisting() {
        const allElements = document.querySelectorAll('*');
        let scanned = 0;
        
        allElements.forEach(element => {
            nuclearRemoveSettings(element);
            scanned++;
        });
        
        console.log(`☢️ NUCLEAR SCAN: Checked ${scanned} elements, removed ${removedCount} duplicates`);
    }
    
    // Set up aggressive MutationObserver
    const nuclearObserver = new MutationObserver((mutations) => {
        mutations.forEach((mutation) => {
            // Check added nodes
            mutation.addedNodes.forEach((node) => {
                if (node.nodeType === Node.ELEMENT_NODE) {
                    // Check the node itself
                    nuclearRemoveSettings(node);
                    
                    // Check all children
                    const children = node.querySelectorAll('*');
                    children.forEach(child => {
                        nuclearRemoveSettings(child);
                    });
                }
            });
            
            // Check modified nodes
            if (mutation.type === 'characterData' || mutation.type === 'attributes') {
                const target = mutation.target;
                if (target.nodeType === Node.ELEMENT_NODE) {
                    nuclearRemoveSettings(target);
                }
            }
        });
    });
    
    // Start observing with maximum sensitivity
    if (document.body) {
        nuclearObserver.observe(document.body, {
            childList: true,
            subtree: true,
            attributes: true,
            attributeOldValue: true,
            characterData: true,
            characterDataOldValue: true
        });
        console.log('☢️ NUCLEAR OBSERVER: Active with maximum sensitivity');
    }
    
    // Run initial scan immediately and repeatedly
    nuclearScanExisting();
    setTimeout(nuclearScanExisting, 100);
    setTimeout(nuclearScanExisting, 500);
    setTimeout(nuclearScanExisting, 1000);
    setTimeout(nuclearScanExisting, 2000);
    setTimeout(nuclearScanExisting, 3000);
    
    // Continuous monitoring every 2 seconds
    setInterval(() => {
        nuclearScanExisting();
    }, 2000);
    
    // Emergency interval - scan every 500ms for the first 30 seconds
    let emergencyScans = 0;
    const emergencyInterval = setInterval(() => {
        nuclearScanExisting();
        emergencyScans++;
        
        if (emergencyScans >= 60) { // 30 seconds worth
            clearInterval(emergencyInterval);
            console.log('☢️ NUCLEAR: Emergency scanning complete');
        }
    }, 500);
    
    console.log('☢️ NUCLEAR: Settings Mutation Override fully armed and operational');
})();