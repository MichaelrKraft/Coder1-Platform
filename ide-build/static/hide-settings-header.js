// Hide Settings Header - Remove duplicate SETTINGS text from Explorer
(function() {
    console.log('🎯 Hide Settings Header: Starting...');
    
    function hideDuplicateSettings() {
        // Find all elements that might contain the duplicate SETTINGS header
        const allElements = document.querySelectorAll('*');
        
        allElements.forEach(element => {
            // Skip our custom settings section
            if (element.classList.contains('settings-section') || 
                element.closest('.settings-section')) {
                return;
            }
            
            // Check if element contains only "SETTINGS" text
            const text = element.textContent.trim();
            const hasOnlySettingsText = text === 'SETTINGS';
            const hasSettingsWithIcon = text.includes('SETTINGS') && 
                                       (element.querySelector('svg') || 
                                        element.querySelector('.gear-icon') ||
                                        element.querySelector('[class*="gear"]') ||
                                        element.innerHTML.includes('⚙'));
            
            // Check if it's in the Explorer area
            const isInExplorer = element.closest('.Explorer') || 
                               element.closest('[class*="explorer"]') ||
                               element.closest('[class*="sidebar"]');
            
            // Hide if it matches our criteria
            if (isInExplorer && (hasOnlySettingsText || hasSettingsWithIcon)) {
                // Additional check: make sure it's styled like a header
                const computedStyle = window.getComputedStyle(element);
                const fontSize = parseInt(computedStyle.fontSize);
                const fontWeight = computedStyle.fontWeight;
                
                // Headers typically have larger font size or bold weight
                if (fontSize > 14 || fontWeight === 'bold' || fontWeight > 400) {
                    console.log('🗑️ Hiding duplicate SETTINGS header:', element);
                    element.style.display = 'none';
                    
                    // Also hide adjacent gear icon if present
                    const prevSibling = element.previousElementSibling;
                    if (prevSibling && (prevSibling.querySelector('svg') || 
                                      prevSibling.innerHTML.includes('⚙'))) {
                        prevSibling.style.display = 'none';
                    }
                }
            }
        });
        
        // Also look for specific patterns
        const explorer = document.querySelector('.Explorer, [class*="explorer"], [class*="sidebar"]');
        if (explorer) {
            // Find divs that contain gear icon + SETTINGS text
            const gearElements = explorer.querySelectorAll('[class*="gear"], svg, .fa-cog, .fa-gear');
            gearElements.forEach(gear => {
                const parent = gear.parentElement;
                const nextElement = parent.nextElementSibling;
                
                if (nextElement && nextElement.textContent.trim() === 'SETTINGS') {
                    console.log('🗑️ Hiding gear icon and SETTINGS pair');
                    parent.style.display = 'none';
                    nextElement.style.display = 'none';
                }
            });
        }
    }
    
    // Run multiple times to catch React renders
    hideDuplicateSettings();
    setTimeout(hideDuplicateSettings, 100);
    setTimeout(hideDuplicateSettings, 500);
    setTimeout(hideDuplicateSettings, 1000);
    setTimeout(hideDuplicateSettings, 2000);
    
    // Monitor for changes
    const observer = new MutationObserver(() => {
        hideDuplicateSettings();
    });
    
    if (document.body) {
        observer.observe(document.body, {
            childList: true,
            subtree: true
        });
    }
    
    console.log('✅ Hide Settings Header: Monitoring for duplicates');
})();