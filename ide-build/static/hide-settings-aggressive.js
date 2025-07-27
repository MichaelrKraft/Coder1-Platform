// Aggressive settings panel hiding for special views
(function() {
    'use strict';
    
    console.log('🚫 Loading aggressive settings panel hiding...');
    
    // Monitor for special views and hide settings
    function hideSettingsPanels() {
        // Check if special view is active
        const specialViewActive = document.querySelector('.coder1-special-view-overlay');
        if (!specialViewActive) return;
        
        // List of selectors to hide
        const selectorsToHide = [
            '.settings-section',
            '.settings-btn',
            '[class*="settings"]',
            '[class*="Settings"]',
            'button:contains("Context Priming")',
            'button:contains("Voice Settings")', 
            'button:contains("IDE Settings")',
            'button:contains("Documentation")'
        ];
        
        // Hide by class/attribute selectors
        selectorsToHide.forEach(selector => {
            try {
                document.querySelectorAll(selector).forEach(el => {
                    if (!el.closest('.coder1-special-view-overlay')) {
                        el.style.cssText = 'display: none !important; visibility: hidden !important; opacity: 0 !important;';
                    }
                });
            } catch(e) {
                // Some selectors might not be valid CSS, continue
            }
        });
        
        // Hide by text content
        const textsToHide = ['Context Priming', 'Voice Settings', 'IDE Settings', 'Documentation', 'SETTINGS'];
        document.querySelectorAll('button').forEach(btn => {
            const text = btn.textContent || '';
            if (textsToHide.some(hideText => text.includes(hideText))) {
                // Hide the button and its containers
                btn.style.cssText = 'display: none !important;';
                
                let parent = btn.parentElement;
                let levels = 3; // Go up 3 levels
                while (parent && levels > 0) {
                    if (!parent.closest('.coder1-special-view-overlay')) {
                        parent.style.cssText = 'display: none !important; visibility: hidden !important;';
                    }
                    parent = parent.parentElement;
                    levels--;
                }
            }
        });
        
        // Hide bottom-left positioned elements
        document.querySelectorAll('div').forEach(div => {
            const style = window.getComputedStyle(div);
            const rect = div.getBoundingClientRect();
            
            // Check if it's positioned in bottom-left
            if ((style.position === 'fixed' || style.position === 'absolute') &&
                rect.bottom > window.innerHeight - 400 && 
                rect.left < 300 &&
                !div.closest('.coder1-special-view-overlay')) {
                div.style.cssText = 'display: none !important; visibility: hidden !important;';
            }
        });
        
        // Hide gear/cog icons
        document.querySelectorAll('.fa-cog, .fa-gear, .fa-sliders, .fa-wrench').forEach(icon => {
            const container = icon.closest('div');
            if (container && !container.closest('.coder1-special-view-overlay')) {
                container.style.cssText = 'display: none !important;';
            }
        });
    }
    
    // Run immediately
    hideSettingsPanels();
    
    // Run periodically while special view is active
    setInterval(() => {
        if (document.querySelector('.coder1-special-view-overlay')) {
            hideSettingsPanels();
        }
    }, 100); // Check every 100ms
    
    // Also run on DOM changes
    const observer = new MutationObserver(() => {
        if (document.querySelector('.coder1-special-view-overlay')) {
            hideSettingsPanels();
        }
    });
    
    observer.observe(document.body, {
        childList: true,
        subtree: true,
        attributes: true,
        attributeFilter: ['style', 'class']
    });
    
    console.log('✅ Aggressive settings hiding activated');
})();