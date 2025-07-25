// Logo Absolute Positioning - Direct approach
(function() {
    'use strict';
    
    console.log('🎯 Logo Absolute Positioning v1 - Moving logo to header');
    
    function positionLogo() {
        // Find all potential logos
        const logos = document.querySelectorAll('img[src*="logo"], img[alt*="logo"], .logo-image, [class*="logo"] img');
        
        logos.forEach(logo => {
            if (logo.src && (logo.src.includes('logo') || logo.alt?.includes('logo'))) {
                console.log('Found logo:', logo, 'Current position:', logo.getBoundingClientRect());
                
                // Apply absolute positioning to move to header
                logo.style.cssText = `
                    position: fixed !important;
                    top: 10px !important;
                    left: 20px !important;
                    width: 140px !important;
                    height: 140px !important;
                    z-index: 99999 !important;
                    cursor: pointer !important;
                `;
                
                // Update src to our logo
                if (!logo.src.includes('coder1-logo.svg')) {
                    logo.src = './static/coder1-logo.svg';
                }
                
                // Add click handler
                logo.onclick = (e) => {
                    e.preventDefault();
                    if (window.location.hostname.includes('github.io')) {
                        window.location.href = '../smart-prd-generator.html';
                    } else {
                        window.location.href = '/';
                    }
                };
                
                console.log('Logo repositioned to:', logo.getBoundingClientRect());
            }
        });
    }
    
    // Run multiple times
    positionLogo();
    setTimeout(positionLogo, 500);
    setTimeout(positionLogo, 1000);
    setTimeout(positionLogo, 2000);
    
    // Watch for changes
    const observer = new MutationObserver(positionLogo);
    if (document.body) {
        observer.observe(document.body, { childList: true, subtree: true });
    }
})();