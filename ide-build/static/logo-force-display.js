// Force Display Coder1 Logo
(function() {
    'use strict';
    
    function forceLogo() {
        // Remove any existing logos first
        const existingLogos = document.querySelectorAll('.coder1-logo, #coder1-brand-mark');
        existingLogos.forEach(el => el.remove());
        
        // Create new logo
        const logo = document.createElement('div');
        logo.className = 'coder1-logo-forced';
        logo.style.cssText = `
            position: fixed !important;
            top: 8px !important;
            left: 12px !important;
            z-index: 999999 !important;
            width: 48px !important;
            height: 48px !important;
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