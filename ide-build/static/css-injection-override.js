// CSS Injection Override - Direct style injection to remove SETTINGS
(function() {
    console.log('💉 CSS INJECTION: Dynamic style override starting...');
    
    function injectNuclearCSS() {
        // Create dynamic CSS that targets specific patterns
        const nuclearCSS = `
            /* Direct targeting of elements that could contain duplicate SETTINGS */
            *:not(button):not(.settings-btn):not(.settings-section):not(.settings-section *) {
                /* Will be checked by companion JS */
            }
            
            /* Hide elements marked by our detection script */
            .nuclear-settings-target {
                display: none !important;
                visibility: hidden !important;
                opacity: 0 !important;
                height: 0 !important;
                width: 0 !important;
                margin: 0 !important;
                padding: 0 !important;
                overflow: hidden !important;
                position: absolute !important;
                left: -99999px !important;
                top: -99999px !important;
                z-index: -999999 !important;
                pointer-events: none !important;
                user-select: none !important;
                transform: scale(0) !important;
            }
            
            /* Specific React patterns that might generate duplicate headers */
            div[class*="header"]:not(.settings-section):not(.settings-section *),
            div[class*="title"]:not(.settings-section):not(.settings-section *),
            div[class*="label"]:not(.settings-section):not(.settings-section *),
            span[class*="header"]:not(.settings-section):not(.settings-section *),
            span[class*="title"]:not(.settings-section):not(.settings-section *),
            span[class*="label"]:not(.settings-section):not(.settings-section *) {
                /* These will be checked for SETTINGS content by JS */
            }
            
            /* Nuclear option for very specific positioning */
            *[style*="position: absolute"]:not(.settings-btn):not(.settings-section):not(.settings-section *),
            *[style*="position: fixed"]:not(.settings-btn):not(.settings-section):not(.settings-section *) {
                /* Checked by JS for SETTINGS content in specific positions */
            }
            
            /* Ensure our functional elements always show */
            .settings-btn,
            .settings-section,
            .settings-section *,
            button[id*="react-bits"],
            #react-bits-button {
                display: flex !important;
                visibility: visible !important;
                opacity: 1 !important;
                height: auto !important;
                width: auto !important;
                position: fixed !important;
                transform: none !important;
                z-index: 9999 !important;
                pointer-events: auto !important;
            }
        `;
        
        // Inject CSS into document head
        const styleElement = document.createElement('style');
        styleElement.id = 'nuclear-settings-override';
        styleElement.type = 'text/css';
        styleElement.appendChild(document.createTextNode(nuclearCSS));
        document.head.appendChild(styleElement);
        
        console.log('💉 CSS INJECTION: Nuclear CSS injected');
        return styleElement;
    }
    
    function markSettingsTargets() {
        const allElements = document.querySelectorAll('*');
        let marked = 0;
        
        allElements.forEach(element => {
            // Skip our functional elements
            if (element.classList.contains('settings-btn') ||
                element.classList.contains('settings-section') ||
                element.closest('.settings-section') ||
                element.tagName === 'BUTTON' ||
                element.id === 'react-bits-button') {
                return;
            }
            
            const text = element.textContent ? element.textContent.trim() : '';
            const innerHTML = element.innerHTML || '';
            
            // Check for SETTINGS content
            if (text.includes('SETTINGS') || innerHTML.includes('SETTINGS')) {
                const rect = element.getBoundingClientRect();
                
                // Check if it's positioned like a duplicate header
                const isInLeftArea = rect.left < 400;
                const isSmallHeight = rect.height < 100;
                const hasNoButtons = !element.querySelector('button');
                
                if (isInLeftArea && isSmallHeight && hasNoButtons) {
                    console.log('💉 MARKING SETTINGS TARGET:', {
                        tag: element.tagName,
                        class: element.className,
                        text: text.substring(0, 50),
                        position: `${rect.left},${rect.top}`,
                        size: `${rect.width}x${rect.height}`
                    });
                    
                    element.classList.add('nuclear-settings-target');
                    marked++;
                }
            }
        });
        
        console.log(`💉 CSS INJECTION: Marked ${marked} elements for nuclear removal`);
    }
    
    // Inject CSS immediately
    const styleElement = injectNuclearCSS();
    
    // Mark targets immediately and repeatedly
    markSettingsTargets();
    setTimeout(markSettingsTargets, 100);
    setTimeout(markSettingsTargets, 300);
    setTimeout(markSettingsTargets, 600);
    setTimeout(markSettingsTargets, 1000);
    setTimeout(markSettingsTargets, 2000);
    
    // Continuous monitoring
    setInterval(markSettingsTargets, 3000);
    
    // Monitor for style element removal and re-inject if needed
    const styleObserver = new MutationObserver(() => {
        if (!document.getElementById('nuclear-settings-override')) {
            console.log('💉 CSS INJECTION: Style element removed, re-injecting...');
            injectNuclearCSS();
        }
    });
    
    if (document.head) {
        styleObserver.observe(document.head, {
            childList: true,
            subtree: true
        });
    }
    
    console.log('💉 CSS INJECTION: Override system fully operational');
})();