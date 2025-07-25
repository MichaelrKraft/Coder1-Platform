// Header Logo Injection - Add logo to the actual header
(function() {
    'use strict';
    
    console.log('🎯 Header Logo Injection - Adding logo to header area');
    
    function injectHeaderLogo() {
        // Check if we already added the header logo
        if (document.querySelector('.header-coder1-logo')) {
            return;
        }
        
        // Find the header element - try multiple selectors
        const headerSelectors = [
            '.header',
            '[class*="header"]',
            '[class*="Header"]',
            '.top-bar',
            '.navbar',
            '[class*="navbar"]',
            '.toolbar',
            '[class*="toolbar"]'
        ];
        
        let header = null;
        for (const selector of headerSelectors) {
            const elements = document.querySelectorAll(selector);
            // Find the topmost header element
            for (const el of elements) {
                const rect = el.getBoundingClientRect();
                // Check if it's at the top of the page and spans the width
                if (rect.top >= 0 && rect.top < 100 && rect.width > window.innerWidth * 0.8) {
                    header = el;
                    console.log('Found header element:', selector, el);
                    break;
                }
            }
            if (header) break;
        }
        
        if (!header) {
            console.log('Header not found yet, will retry...');
            return;
        }
        
        // Create logo element
        const logoContainer = document.createElement('div');
        logoContainer.className = 'header-coder1-logo';
        logoContainer.style.cssText = `
            position: absolute;
            left: 20px;
            top: 50%;
            transform: translateY(-50%);
            z-index: 9999;
            cursor: pointer;
            width: 140px;
            height: 140px;
        `;
        
        const logoImg = document.createElement('img');
        logoImg.src = './static/coder1-logo.svg';
        logoImg.alt = 'Coder1';
        logoImg.style.cssText = `
            width: 100%;
            height: 100%;
            object-fit: contain;
        `;
        
        logoContainer.appendChild(logoImg);
        
        // Add click handler
        logoContainer.addEventListener('click', () => {
            if (window.location.hostname.includes('github.io')) {
                window.location.href = '../smart-prd-generator.html';
            } else {
                window.location.href = '/';
            }
        });
        
        // Make header relative if it's not already
        const headerStyle = window.getComputedStyle(header);
        if (headerStyle.position === 'static') {
            header.style.position = 'relative';
        }
        
        // Add logo to header
        header.appendChild(logoContainer);
        console.log('✅ Logo added to header');
        
        // Optionally hide the Explorer logo
        const explorerLogos = document.querySelectorAll('.sidebar img[src*="logo"], .explorer img[src*="logo"]');
        explorerLogos.forEach(logo => {
            console.log('Hiding Explorer logo:', logo);
            logo.style.display = 'none';
        });
    }
    
    // Try to inject logo multiple times
    injectHeaderLogo();
    setTimeout(injectHeaderLogo, 500);
    setTimeout(injectHeaderLogo, 1000);
    setTimeout(injectHeaderLogo, 2000);
    
    // Watch for DOM changes
    const observer = new MutationObserver(() => {
        if (!document.querySelector('.header-coder1-logo')) {
            injectHeaderLogo();
        }
    });
    
    if (document.body) {
        observer.observe(document.body, { childList: true, subtree: true });
    }
    
    console.log('✅ Header Logo Injection initialized');
})();