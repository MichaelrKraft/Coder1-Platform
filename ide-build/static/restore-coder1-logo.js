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
            top: -35px;
            left: 20px;
            z-index: 10000;
            cursor: pointer;
            display: flex;
            align-items: center;
        `;
        
        // Create the actual logo content with click handler
        const logoLink = document.createElement('a');
        logoLink.style.cssText = `
            display: flex;
            align-items: center;
            text-decoration: none;
            cursor: pointer;
        `;
        
        const logoImg = document.createElement('img');
        logoImg.src = './static/coder1-logo.svg';
        logoImg.alt = 'Coder1';
        logoImg.style.cssText = `
            height: 140px;
            width: 140px;
            object-fit: contain;
        `;
        
        logoLink.appendChild(logoImg);
        logoContainer.appendChild(logoLink);
        
        // Add click handler with environment detection
        logoLink.addEventListener('click', (e) => {
            e.preventDefault();
            if (window.location.hostname.includes('github.io')) {
                window.location.href = '../smart-prd-generator.html';
            } else {
                window.location.href = '/';
            }
        });
        
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