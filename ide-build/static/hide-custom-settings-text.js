// Hide Custom Settings Text - Remove our smaller SETTINGS header
(function() {
    console.log('🎯 Hide Custom Settings Text: Starting...');
    
    function hideCustomSettingsText() {
        // Find our custom settings section
        const settingsSection = document.querySelector('.settings-section');
        if (!settingsSection) {
            console.log('No settings section found');
            return;
        }
        
        // Look for any SETTINGS text within our custom section
        const settingsElements = settingsSection.querySelectorAll('*');
        let removed = 0;
        
        settingsElements.forEach(element => {
            const text = element.textContent ? element.textContent.trim() : '';
            
            // Check if this element contains only "SETTINGS" text
            if (text === 'SETTINGS' || text === '⚙ SETTINGS' || text === '⚙️ SETTINGS') {
                // Make sure it's not a button we want to keep
                if (!element.classList.contains('settings-btn') && 
                    element.tagName !== 'BUTTON' &&
                    !element.querySelector('button')) {
                    
                    console.log('🗑️ Removing custom SETTINGS text:', element);
                    element.style.display = 'none';
                    element.remove();
                    removed++;
                }
            }
            
            // Also check for gear icons that might be headers
            if (element.innerHTML && 
                (element.innerHTML.includes('⚙') || element.innerHTML.includes('🔧')) &&
                text.includes('SETTINGS') &&
                !element.querySelector('button')) {
                
                console.log('🗑️ Removing gear icon SETTINGS header:', element);
                element.style.display = 'none';
                element.remove();
                removed++;
            }
        });
        
        // Also check for any header-like elements we might have added
        const headers = settingsSection.querySelectorAll('h1, h2, h3, h4, h5, h6');
        headers.forEach(header => {
            const text = header.textContent.trim();
            if (text === 'SETTINGS' || text.includes('SETTINGS')) {
                console.log('🗑️ Removing header element:', header);
                header.remove();
                removed++;
            }
        });
        
        // Look for any divs that just contain SETTINGS text and a gear icon
        const allDivs = settingsSection.querySelectorAll('div');
        allDivs.forEach(div => {
            const text = div.textContent.trim();
            const hasOnlySettings = text === 'SETTINGS' || text === '⚙ SETTINGS';
            const hasNoButtons = !div.querySelector('button') && !div.classList.contains('settings-btn');
            
            if (hasOnlySettings && hasNoButtons) {
                console.log('🗑️ Removing SETTINGS div:', div);
                div.remove();
                removed++;
            }
        });
        
        console.log(`✅ Removed ${removed} custom SETTINGS text elements`);
    }
    
    // Run multiple times to catch dynamic content
    hideCustomSettingsText();
    setTimeout(hideCustomSettingsText, 500);
    setTimeout(hideCustomSettingsText, 1000);
    setTimeout(hideCustomSettingsText, 2000);
    
    // Monitor for changes to our settings section
    const observer = new MutationObserver(() => {
        hideCustomSettingsText();
    });
    
    // Watch for settings section changes
    setTimeout(() => {
        const settingsSection = document.querySelector('.settings-section');
        if (settingsSection) {
            observer.observe(settingsSection, {
                childList: true,
                subtree: true
            });
        }
    }, 1000);
    
    console.log('🎯 Hide Custom Settings Text: Monitoring for custom SETTINGS headers');
})();