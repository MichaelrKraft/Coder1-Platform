// Homepage Logo - Same 140px version as React IDE
(function() {
    'use strict';
    
    console.log('🎯 Homepage Logo Loading...');
    
    function addLogo() {
        // Remove existing
        const existing = document.getElementById('coder1-homepage-logo');
        if (existing) existing.remove();
        
        // Create logo
        const logo = document.createElement('div');
        logo.id = 'coder1-homepage-logo';
        logo.style.cssText = `
            position: fixed !important;
            top: 5px !important;
            left: 35px !important;
            width: 120px !important;
            height: 120px !important;
            z-index: 9999 !important;
            cursor: pointer !important;
            background-image: url('/static/coder1-logo.svg') !important;
            background-size: contain !important;
            background-repeat: no-repeat !important;
            background-position: center !important;
            filter: drop-shadow(0 0 15px rgba(139, 92, 246, 0.6)) !important;
            transition: all 0.3s ease !important;
            transform-origin: center center !important;
            transform: scale(1.2) !important;
        `;
        
        logo.onmouseover = () => {
            logo.style.transform = 'scale(1.3)';
            logo.style.filter = 'drop-shadow(0 0 25px rgba(139, 92, 246, 0.9))';
        };
        
        logo.onmouseout = () => {
            logo.style.transform = 'scale(1.2)';
            logo.style.filter = 'drop-shadow(0 0 15px rgba(139, 92, 246, 0.6))';
        };
        
        logo.onclick = () => window.location.href = '/';
        logo.title = 'Back to Coder1 Home';
        
        document.body.appendChild(logo);
        console.log('✅ Homepage logo added');
    }
    
    // Run immediately and with delays
    addLogo();
    setTimeout(addLogo, 100);
    setTimeout(addLogo, 500);
    
})();