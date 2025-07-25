// React Logo Override - Target actual React elements
(function() {
    'use strict';
    
    console.log('🎯 React Logo Override Loading...');
    
    function overrideLogo() {
        // Track if we found any logos
        let foundExistingLogo = false;
        
        // Target all potential logo elements in React
        const logoSelectors = [
            '.logo-image',
            'img[src*="logo"]',
            '[class*="logo"]',
            'img[alt*="logo"]',
            '.header img',
            '.logo img',
            'img'
        ];
        
        logoSelectors.forEach(selector => {
            const elements = document.querySelectorAll(selector);
            elements.forEach(el => {
                // Skip our own brand mark
                if (el.id === 'coder1-brand-mark' || el.closest('#coder1-brand-mark')) {
                    return;
                }
                
                // Override with maximum specificity
                el.style.setProperty('width', '140px', 'important');
                el.style.setProperty('height', '140px', 'important');
                el.style.setProperty('min-width', '140px', 'important');
                el.style.setProperty('min-height', '140px', 'important');
                el.style.setProperty('max-width', '140px', 'important');
                el.style.setProperty('max-height', '140px', 'important');
                el.style.setProperty('object-fit', 'contain', 'important');
                
                // Move the logo up
                el.style.setProperty('position', 'relative', 'important');
                el.style.setProperty('top', '-50px', 'important');
                
                // If it's not our custom logo, replace the src
                if (el.tagName === 'IMG' && !el.src.includes('coder1-logo.svg')) {
                    el.src = './static/coder1-logo.svg';
                    el.alt = 'Coder1 Logo';
                    foundExistingLogo = true;
                    
                    // Add click handler to existing logo
                    el.style.cursor = 'pointer';
                    el.onclick = () => {
                        // Check if we're on GitHub Pages
                        if (window.location.hostname.includes('github.io')) {
                            window.location.href = '../smart-prd-generator.html';
                        } else {
                            // For Render or local development
                            window.location.href = '../';
                        }
                    };
                    el.title = 'Back to Coder1 Home';
                }
                
                console.log('✅ Overrode logo element:', el);
            });
        });
        
        // Also inject aggressive CSS
        if (!document.getElementById('react-logo-override')) {
            const style = document.createElement('style');
            style.id = 'react-logo-override';
            style.textContent = `
                /* Override React's compiled CSS with maximum specificity */
                .logo-image,
                img[class*="logo"],
                .header img,
                .logo img,
                [class*="Logo"] img,
                [class*="logo"] img {
                    width: 140px !important;
                    height: 140px !important;
                    min-width: 140px !important;
                    min-height: 140px !important;
                    max-width: 140px !important;
                    max-height: 140px !important;
                    object-fit: contain !important;
                    position: relative !important;
                    top: -50px !important;
                }
                
                /* Style the parent containers too */
                .logo,
                [class*="logo"],
                [class*="Logo"] {
                    width: auto !important;
                    height: auto !important;
                    min-width: 140px !important;
                    min-height: 140px !important;
                }
                
                /* Ensure hover effects work */
                .logo-image:hover,
                img[class*="logo"]:hover {
                    transform: scale(1.05) !important;
                    transition: transform 0.2s ease !important;
                }
            `;
            
            document.head.appendChild(style);
        }
        
        // Only create our custom logo if no existing logo was found
        if (!foundExistingLogo) {
            let brandMark = document.getElementById('coder1-brand-mark');
            if (!brandMark) {
                brandMark = document.createElement('div');
                brandMark.id = 'coder1-brand-mark';
                document.body.appendChild(brandMark);
            }
            
            // Always update the styles to ensure they're applied
            brandMark.style.cssText = `
                position: fixed !important;
                top: 15px !important;
                left: 15px !important;
                width: 140px !important;
                height: 140px !important;
                z-index: 2147483647 !important;
                pointer-events: auto !important;
                cursor: pointer !important;
                background-image: url('./static/coder1-logo.svg') !important;
                background-size: contain !important;
                background-repeat: no-repeat !important;
                background-position: center !important;
                display: block !important;
                visibility: visible !important;
                opacity: 1 !important;
            `;
            
            brandMark.onclick = () => {
                // Check if we're on GitHub Pages
                if (window.location.hostname.includes('github.io')) {
                    window.location.href = '../smart-prd-generator.html';
                } else {
                    // For Render or local development
                    window.location.href = '../';
                }
            };
            brandMark.title = 'Back to Coder1 Home';
            
            // Ensure it's always in the body, not inside any other container
            if (brandMark.parentNode !== document.body) {
                document.body.appendChild(brandMark);
            }
        } else {
            // If we found an existing logo, remove any custom brand mark
            const existingBrandMark = document.getElementById('coder1-brand-mark');
            if (existingBrandMark) {
                existingBrandMark.remove();
            }
        }
        
        return foundExistingLogo;
    }
    
    // Run immediately and repeatedly
    overrideLogo();
    
    // Run on DOM changes
    const observer = new MutationObserver(overrideLogo);
    
    const startObserving = () => {
        if (document.body) {
            observer.observe(document.body, {
                childList: true,
                subtree: true,
                attributes: true,
                attributeFilter: ['class', 'src']
            });
            return true;
        }
        return false;
    };
    
    // Start observing when ready
    if (!startObserving()) {
        const interval = setInterval(() => {
            if (startObserving()) {
                clearInterval(interval);
            }
        }, 100);
    }
    
    // Also run periodically as backup
    setInterval(overrideLogo, 1000);
    
    // Run on various events
    document.addEventListener('DOMContentLoaded', overrideLogo);
    window.addEventListener('load', overrideLogo);
    
    console.log('✅ React Logo Override initialized');
    
})();