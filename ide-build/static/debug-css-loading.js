// Debug CSS loading for special views
(function() {
    console.log('🔍 Debugging CSS loading for special views...');
    
    // Check if special-views-unified.css is loaded
    function checkCSSLoaded() {
        const stylesheets = document.styleSheets;
        let cssFound = false;
        
        for (let i = 0; i < stylesheets.length; i++) {
            try {
                const href = stylesheets[i].href;
                if (href && href.includes('special-views-unified.css')) {
                    cssFound = true;
                    console.log('✅ special-views-unified.css found:', href);
                    
                    // Try to check if rules are accessible
                    try {
                        const rules = stylesheets[i].cssRules || stylesheets[i].rules;
                        console.log('   - Number of CSS rules:', rules.length);
                        
                        // Look for glassmorphism-specific rules
                        let glassmorphismFound = false;
                        for (let j = 0; j < rules.length; j++) {
                            const rule = rules[j];
                            if (rule.selectorText && rule.selectorText.includes('glass-panel')) {
                                glassmorphismFound = true;
                                console.log('   - Glassmorphism rule found:', rule.selectorText);
                                console.log('   - backdrop-filter:', rule.style.backdropFilter);
                                console.log('   - background:', rule.style.background);
                            }
                        }
                        
                        if (!glassmorphismFound) {
                            console.warn('⚠️ No glassmorphism rules found in CSS');
                        }
                    } catch (e) {
                        console.log('   - Cannot access CSS rules (CORS or other restriction)');
                    }
                }
            } catch (e) {
                // Ignore errors from inaccessible stylesheets
            }
        }
        
        if (!cssFound) {
            console.error('❌ special-views-unified.css NOT found in stylesheets!');
        }
        
        // Check computed styles on a test element
        setTimeout(() => {
            const testOverlay = document.querySelector('.coder1-special-view-overlay');
            if (testOverlay) {
                const panel = testOverlay.querySelector('.coder1-glass-panel');
                if (panel) {
                    const computed = window.getComputedStyle(panel);
                    console.log('🎨 Computed styles for glass panel:');
                    console.log('   - background:', computed.background);
                    console.log('   - backdrop-filter:', computed.backdropFilter);
                    console.log('   - -webkit-backdrop-filter:', computed.webkitBackdropFilter);
                    console.log('   - border:', computed.border);
                    console.log('   - box-shadow:', computed.boxShadow);
                }
            }
        }, 1000);
    }
    
    // Run check when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', checkCSSLoaded);
    } else {
        checkCSSLoaded();
    }
    
    // Also check after a delay
    setTimeout(checkCSSLoaded, 2000);
})();