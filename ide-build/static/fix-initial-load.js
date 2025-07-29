// Fix Initial Load Issues - Logo visibility and layout
(function() {
    'use strict';
    console.log('🚀 Fix Initial Load: Starting fixes...');
    
    // Function to inject critical styles immediately
    function injectCriticalStyles() {
        const style = document.createElement('style');
        style.textContent = `
            /* Force sidebar to correct width immediately */
            .sidebar {
                width: 60px !important;
                max-width: 60px !important;
                flex: 0 0 60px !important;
            }
            
            /* Ensure logo is visible from the start */
            .header-coder1-logo {
                display: block !important;
                visibility: visible !important;
                opacity: 1 !important;
                position: absolute !important;
                left: 20px !important;
                top: 50% !important;
                transform: translateY(-50%) !important;
                z-index: 10000 !important;
                width: 140px !important;
                height: 140px !important;
            }
            
            .header-coder1-logo img {
                display: block !important;
                visibility: visible !important;
                opacity: 1 !important;
                width: 100% !important;
                height: 100% !important;
                object-fit: contain !important;
            }
            
            /* Ensure header has proper height */
            .header, .terminal-header {
                position: relative !important;
                min-height: 60px !important;
            }
            
            /* Hide any loading states */
            body {
                opacity: 1 !important;
            }
        `;
        document.head.insertBefore(style, document.head.firstChild);
        console.log('✅ Critical styles injected');
    }
    
    // Function to ensure logo exists
    function ensureLogoExists() {
        // Check if logo already exists
        if (document.querySelector('.header-coder1-logo')) {
            console.log('✅ Logo already exists');
            return;
        }
        
        // Find header element
        const headers = document.querySelectorAll('.header, [class*="header"]:not(.terminal-header)');
        let header = null;
        
        for (const h of headers) {
            const rect = h.getBoundingClientRect();
            if (rect.top >= 0 && rect.top < 100 && rect.width > window.innerWidth * 0.8) {
                header = h;
                break;
            }
        }
        
        if (header) {
            // Create logo immediately
            const logoContainer = document.createElement('div');
            logoContainer.className = 'header-coder1-logo';
            
            const logoImg = document.createElement('img');
            logoImg.src = './static/coder1-logo.svg';
            logoImg.alt = 'Coder1';
            
            logoContainer.appendChild(logoImg);
            
            // Add click handler
            logoContainer.addEventListener('click', () => {
                if (window.location.hostname.includes('github.io')) {
                    window.location.href = '../smart-prd-generator.html';
                } else {
                    window.location.href = '/';
                }
            });
            
            // Make header relative if needed
            const headerStyle = window.getComputedStyle(header);
            if (headerStyle.position === 'static') {
                header.style.position = 'relative';
            }
            
            header.appendChild(logoContainer);
            console.log('✅ Logo created and added');
        }
    }
    
    // Inject critical styles immediately
    injectCriticalStyles();
    
    // Ensure logo exists as soon as DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', ensureLogoExists);
    } else {
        ensureLogoExists();
    }
    
    // Also check after a short delay
    setTimeout(ensureLogoExists, 100);
    setTimeout(ensureLogoExists, 500);
    
    console.log('✅ Fix Initial Load: Script loaded');
})();