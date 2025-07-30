// Restore Coder1 Logo
(function() {
    'use strict';
    
    function addCoder1Logo() {
        console.log('🎨 Attempting to add Coder1 logo...');
        
        // Check if logo already exists
        if (document.querySelector('.coder1-logo')) {
            console.log('✅ Logo already exists');
            return;
        }
        
        // Try multiple selectors for sidebar
        const sidebarSelectors = [
            '.sidebar',
            '[class*="sidebar"]',
            '[class*="Sidebar"]',
            '.left-sidebar',
            '.navigation',
            '[class*="navigation"]'
        ];
        
        let sidebar = null;
        for (const selector of sidebarSelectors) {
            sidebar = document.querySelector(selector);
            if (sidebar) {
                console.log(`✅ Found sidebar with selector: ${selector}`);
                break;
            }
        }
        
        // If no sidebar found, use fixed positioning
        if (!sidebar) {
            console.log('⚠️ No sidebar found, using fixed positioning');
        }
        
        // Create logo container
        const logoContainer = document.createElement('div');
        logoContainer.className = 'coder1-logo';
        logoContainer.style.cssText = `
            position: fixed;
            top: -40px;
            left: 10px;
            z-index: 10000;
            cursor: pointer;
            display: flex;
            align-items: center;
        `;
        
        // Create the actual logo content
        logoContainer.innerHTML = `
            <a href="/" style="
                display: flex;
                align-items: center;
                text-decoration: none;
            ">
                <img src="./static/coder1-logo.svg" alt="Coder1" style="
                    height: 30px;
                    width: auto;
                    max-width: 80px;
                ">
            </a>
        `;
        
        document.body.appendChild(logoContainer);
        console.log('✅ Logo added successfully');
    }
    
    // Wait for page to load
    function init() {
        addCoder1Logo();
        
        // Re-add if removed
        const observer = new MutationObserver(() => {
            if (!document.querySelector('.coder1-logo')) {
                addCoder1Logo();
            }
        });
        
        if (document.body) {
            observer.observe(document.body, { childList: true, subtree: true });
        }
    }
    
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();