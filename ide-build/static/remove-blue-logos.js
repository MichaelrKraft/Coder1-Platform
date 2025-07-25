// Remove Blue Logos
(function() {
    'use strict';
    
    function removeBlueLogos() {
        // Target any logo-like elements
        const logoPatterns = [
            'img[src*="logo"]',
            'img[alt*="logo"]',
            'img[alt*="Coder"]',
            '[class*="logo"]',
            '[id*="logo"]',
            'svg',
            '[style*="background-image"]'
        ];
        
        logoPatterns.forEach(pattern => {
            const elements = document.querySelectorAll(pattern);
            elements.forEach(el => {
                // Skip our forced logo
                if (el.classList.contains('coder1-logo-forced')) {
                    return;
                }
                
                const rect = el.getBoundingClientRect();
                const style = window.getComputedStyle(el);
                
                // Check if it's in the header area
                if (rect.top < 200 && rect.left < 400) {
                    // Check for blue color
                    const hasBlue = 
                        style.color.includes('rgb(0') ||
                        style.color.includes('blue') ||
                        style.backgroundColor.includes('rgb(0') ||
                        style.backgroundColor.includes('blue') ||
                        style.fill?.includes('rgb(0') ||
                        style.fill?.includes('blue') ||
                        el.style.cssText?.includes('blue') ||
                        el.style.cssText?.includes('rgb(0');
                    
                    // Check if it looks like a logo (square-ish dimensions)
                    const width = rect.width;
                    const height = rect.height;
                    const isSquarish = width > 20 && height > 20 && 
                                      Math.abs(width - height) < width * 0.5;
                    
                    if (hasBlue || isSquarish) {
                        console.log('Removing potential blue logo:', el);
                        el.style.display = 'none !important';
                        el.style.visibility = 'hidden !important';
                        
                        // If it's an img, also clear the src
                        if (el.tagName === 'IMG') {
                            el.src = '';
                        }
                    }
                }
            });
        });
        
        // Also target any element that might be a React-rendered logo
        const allDivs = document.querySelectorAll('div, span, a');
        allDivs.forEach(el => {
            if (el.classList.contains('coder1-logo-forced')) {
                return;
            }
            
            const rect = el.getBoundingClientRect();
            if (rect.top < 200 && rect.left < 300 && rect.width > 20 && rect.height > 20) {
                const style = window.getComputedStyle(el);
                
                // Check for logo-like styling
                if (style.backgroundImage && style.backgroundImage !== 'none' &&
                    !style.backgroundImage.includes('coder1-logo.svg')) {
                    el.style.backgroundImage = 'none !important';
                }
                
                // Hide if it has blue color
                if (style.backgroundColor.includes('rgb(0, 123, 255)') ||
                    style.backgroundColor.includes('#007bff')) {
                    el.style.display = 'none !important';
                }
            }
        });
    }
    
    // Run aggressively
    removeBlueLogos();
    setTimeout(removeBlueLogos, 100);
    setTimeout(removeBlueLogos, 500);
    setTimeout(removeBlueLogos, 1000);
    setTimeout(removeBlueLogos, 2000);
    
    // Keep checking
    setInterval(removeBlueLogos, 1000);
    
    // Watch for changes
    const observer = new MutationObserver(removeBlueLogos);
    if (document.body) {
        observer.observe(document.body, { childList: true, subtree: true });
    }
})();