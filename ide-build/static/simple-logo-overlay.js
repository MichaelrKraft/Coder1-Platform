// Simple Logo Overlay - Minimal approach that won't break layout
(function() {
    'use strict';
    
    console.log('🎯 Simple Logo Overlay Loading...');
    
    function addSimpleLogo() {
        // Check if logo already exists
        if (document.querySelector('.simple-coder1-logo')) {
            return;
        }
        
        console.log('Adding simple logo overlay...');
        
        // Create simple overlay logo
        const logo = document.createElement('div');
        logo.className = 'simple-coder1-logo';
        logo.style.cssText = `
            position: fixed !important;
            top: 5px !important;
            left: 15px !important;
            width: 140px !important;
            height: 140px !important;
            z-index: 9999 !important;
            cursor: pointer !important;
            background-image: url('./static/coder1-logo.svg') !important;
            background-size: contain !important;
            background-repeat: no-repeat !important;
            background-position: center !important;
            opacity: 0.95 !important;
            transition: all 0.2s ease !important;
        `;
        
        // Add hover effect
        logo.addEventListener('mouseenter', () => {
            logo.style.opacity = '1';
            logo.style.transform = 'scale(1.05)';
        });
        
        logo.addEventListener('mouseleave', () => {
            logo.style.opacity = '0.95';
            logo.style.transform = 'scale(1)';
        });
        
        // Add click handler for navigation
        logo.addEventListener('click', () => {
            console.log('🔄 Logo clicked - navigating back...');
            
            if (window.electronNavigate) {
                window.electronNavigate('/');
            } else {
                const currentUrl = window.location.href;
                const baseDir = currentUrl.substring(0, currentUrl.lastIndexOf('/'));
                window.location.href = baseDir + '/../smart-prd-generator.html';
            }
        });
        
        logo.title = 'Back to Coder1 Home';
        
        // Add to body
        document.body.appendChild(logo);
        console.log('✅ Simple logo added');
    }
    
    // Add logo after short delay
    setTimeout(addSimpleLogo, 500);
    setTimeout(addSimpleLogo, 1500);
    
    console.log('✅ Simple Logo Overlay initialized');
})();