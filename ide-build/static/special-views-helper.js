// Helper script to ensure special views work correctly
console.log('🎯 Special Views Helper loading...');

(function() {
    'use strict';
    
    // Monitor for special view states
    function checkSpecialViews() {
        // Check if any special view is active based on React component state
        const root = document.getElementById('root');
        if (!root) return;
        
        // Look for special view components
        const specialViewClasses = ['special-view', 'special-view-container'];
        const hasSpecialView = specialViewClasses.some(className => 
            document.querySelector(`.${className}`)
        );
        
        if (hasSpecialView) {
            console.log('🌟 Special view detected - hiding normal UI elements');
            
            // Hide settings buttons
            const settingsButtons = document.querySelectorAll('.settings-section, .settings-btn, [class*="settings-"]');
            settingsButtons.forEach(el => {
                if (!el.closest('.special-view')) {
                    el.style.display = 'none';
                }
            });
            
            // Hide header bars
            const headerElements = document.querySelectorAll('.header-bar, .menu-bar, [class*="header-"], [class*="toolbar"]');
            headerElements.forEach(el => {
                if (!el.closest('.special-view')) {
                    el.style.display = 'none';
                }
            });
            
            // Hide sidebar
            const sidebar = document.querySelector('.sidebar, [class*="sidebar"]');
            if (sidebar && !sidebar.closest('.special-view')) {
                sidebar.style.display = 'none';
            }
            
            // Ensure special view takes full screen
            const specialView = document.querySelector('.special-view');
            if (specialView) {
                specialView.style.position = 'fixed';
                specialView.style.top = '0';
                specialView.style.left = '0';
                specialView.style.width = '100vw';
                specialView.style.height = '100vh';
                specialView.style.zIndex = '9999';
            }
        } else {
            // Restore normal UI if no special view is active
            const hiddenElements = document.querySelectorAll('[style*="display: none"]');
            hiddenElements.forEach(el => {
                if (el.style.display === 'none' && !el.classList.contains('special-view-hidden')) {
                    el.style.display = '';
                }
            });
        }
    }
    
    // Run check periodically
    setInterval(checkSpecialViews, 500);
    
    // Also run on DOM changes
    const observer = new MutationObserver(checkSpecialViews);
    
    const startObserving = setInterval(() => {
        if (document.body) {
            clearInterval(startObserving);
            observer.observe(document.body, {
                childList: true,
                subtree: true,
                attributes: true,
                attributeFilter: ['class', 'style']
            });
            checkSpecialViews();
        }
    }, 100);
    
    console.log('✅ Special Views Helper ready');
})();