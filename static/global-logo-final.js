// Coder1 Logo for Homepage/PRD Generator - 140px version
(function() {
    'use strict';
    
    console.log('🎯 Coder1 Logo Loading for Homepage...');
    
    function addLogo() {
        // Remove any existing logos first
        const existingLogos = document.querySelectorAll('#coder1-brand-mark, #coder1-homepage-logo');
        existingLogos.forEach(el => el.remove());
        
        // Create the logo container
        const logoContainer = document.createElement('div');
        logoContainer.id = 'coder1-homepage-logo';
        logoContainer.style.cssText = `
            position: fixed !important;
            top: 20px !important;
            left: 20px !important;
            width: 140px !important;
            height: 140px !important;
            z-index: 9999 !important;
            cursor: pointer !important;
            background-image: url('/static/coder1-logo.svg') !important;
            background-size: contain !important;
            background-repeat: no-repeat !important;
            background-position: center !important;
            filter: drop-shadow(0 0 15px rgba(139, 92, 246, 0.6)) !important;
            transition: all 0.3s ease !important;
            border-radius: 8px !important;
        `;
        
        // Add hover effect
        logoContainer.onmouseover = function() {
            this.style.transform = 'scale(1.05)';
            this.style.filter = 'drop-shadow(0 0 25px rgba(139, 92, 246, 0.9))';
        };
        
        logoContainer.onmouseout = function() {
            this.style.transform = 'scale(1)';
            this.style.filter = 'drop-shadow(0 0 15px rgba(139, 92, 246, 0.6))';
        };
        
        // Make it clickable to go to homepage
        logoContainer.onclick = function() {
            window.location.href = '/';
        };
        
        logoContainer.title = 'Back to Coder1 Home';
        
        // Add to page
        document.body.appendChild(logoContainer);
        
        // Also inject CSS to style any existing logo elements
        if (!document.getElementById('homepage-logo-styles')) {
            const style = document.createElement('style');
            style.id = 'homepage-logo-styles';
            style.textContent = `
                /* Style existing logos if any */
                .logo img,
                .logo-image,
                img[src*="logo"] {
                    max-height: 60px !important;
                }
                
                /* Ensure our custom logo stays on top */
                #coder1-homepage-logo {
                    z-index: 9999 !important;
                }
                
                /* Add some breathing room around the logo area */
                .header {
                    padding-left: 180px !important;
                }
                
                @media (max-width: 768px) {
                    #coder1-homepage-logo {
                        width: 100px !important;
                        height: 100px !important;
                        top: 15px !important;
                        left: 15px !important;
                    }
                    
                    .header {
                        padding-left: 130px !important;
                    }
                }
            `;
            
            document.head.appendChild(style);
        }
        
        console.log('✅ Coder1 logo added to homepage');
    }
    
    // Run immediately if DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', addLogo);
    } else {
        addLogo();
    }
    
    // Also run on load
    window.addEventListener('load', addLogo);
    
    // Run with delay to ensure everything is loaded
    setTimeout(addLogo, 500);
    
})();