// Force Display Coder1 Logo
(function() {
    'use strict';
    
    function forceLogo() {
        // Remove any existing logos first - more aggressive
        const logoSelectors = [
            '.coder1-logo',
            '#coder1-brand-mark',
            '[class*="logo"]',
            '[id*="logo"]',
            'img[src*="logo"]',
            'img[alt*="Coder"]',
            'div[style*="logo"]'
        ];
        
        logoSelectors.forEach(selector => {
            const elements = document.querySelectorAll(selector);
            elements.forEach(el => {
                // Don't remove our forced logo
                if (!el.classList.contains('coder1-logo-forced')) {
                    // Check if it's in the header area (not sidebar buttons)
                    const rect = el.getBoundingClientRect();
                    if (rect.top < 200 && rect.left < 300) {
                        el.remove();
                    }
                }
            });
        });
        
        // Also remove any blue colored elements that might be logos
        const allElements = document.querySelectorAll('*');
        allElements.forEach(el => {
            const style = window.getComputedStyle(el);
            const rect = el.getBoundingClientRect();
            
            // If it's in the logo area and has blue color
            if (rect.top < 200 && rect.left < 300 && 
                (style.backgroundColor.includes('rgb(0') || 
                 style.backgroundColor.includes('blue') ||
                 style.color.includes('rgb(0') ||
                 style.color.includes('blue'))) {
                
                // Don't remove our forced logo
                if (!el.classList.contains('coder1-logo-forced')) {
                    el.style.display = 'none';
                }
            }
        });
        
        // Create new logo
        const logo = document.createElement('div');
        logo.className = 'coder1-logo-forced';
        logo.style.cssText = `
            position: fixed !important;
            top: 15px !important;
            left: 15px !important;
            z-index: 999999 !important;
            width: 140px !important;
            height: 140px !important;
            background-image: url('./static/coder1-logo.svg') !important;
            background-size: contain !important;
            background-repeat: no-repeat !important;
            background-position: center !important;
            cursor: pointer !important;
            pointer-events: auto !important;
            display: block !important;
            visibility: visible !important;
            opacity: 1 !important;
        `;
        
        // Add click handler
        logo.addEventListener('click', () => {
            if (window.location.hostname.includes('github.io')) {
                window.location.href = '../smart-prd-generator.html';
            } else {
                window.location.href = '/';
            }
        });
        
        logo.title = 'Back to Coder1 Home';
        
        // Add to body
        document.body.appendChild(logo);
        console.log('✅ Logo forced into display');
    }
    
    // Try multiple times to ensure it works
    setTimeout(forceLogo, 100);
    setTimeout(forceLogo, 500);
    setTimeout(forceLogo, 1000);
    setTimeout(forceLogo, 2000);
    
    // Keep checking
    setInterval(() => {
        if (!document.querySelector('.coder1-logo-forced')) {
            forceLogo();
        }
    }, 5000);
})();