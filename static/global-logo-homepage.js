// Homepage Logo - Same 140px version as React IDE
(function() {
    'use strict';
    
    console.log('🎯 Homepage Logo Loading...');
    
    function addLogo() {
        // Remove any existing logo or wrapper
        const existingWrapper = document.getElementById('coder1-logo-wrapper');
        if (existingWrapper) existingWrapper.remove();
        
        const existingLogo = document.getElementById('coder1-homepage-logo');
        if (existingLogo) existingLogo.remove();
        
        // Create logo directly as a child of body
        const logo = document.createElement('div');
        logo.id = 'coder1-homepage-logo';
        
        // Use inline styles with maximum specificity
        logo.style.cssText = `
            position: fixed !important;
            top: 5px !important;
            left: 35px !important;
            width: 120px !important;
            height: 120px !important;
            z-index: 2147483647 !important;
            cursor: pointer !important;
            background-image: url('/static/coder1-logo.svg') !important;
            background-size: contain !important;
            background-repeat: no-repeat !important;
            background-position: center !important;
            filter: drop-shadow(0 0 15px rgba(139, 92, 246, 0.6)) !important;
            transition: filter 0.3s ease, transform 0.3s ease !important;
            transform-origin: center center !important;
            transform: scale(1.2) translateZ(0) !important;
            display: block !important;
            visibility: visible !important;
            opacity: 1 !important;
            pointer-events: auto !important;
            will-change: transform !important;
            backface-visibility: hidden !important;
            -webkit-font-smoothing: subpixel-antialiased !important;
        `;
        
        logo.onmouseover = () => {
            logo.style.transform = 'scale(1.3) translateZ(0)';
            logo.style.filter = 'drop-shadow(0 0 25px rgba(139, 92, 246, 0.9))';
        };
        
        logo.onmouseout = () => {
            logo.style.transform = 'scale(1.2) translateZ(0)';
            logo.style.filter = 'drop-shadow(0 0 15px rgba(139, 92, 246, 0.6))';
        };
        
        logo.onclick = () => window.location.href = '/';
        logo.title = 'Back to Coder1 Home';
        
        // Append directly to body, not inside any container
        document.body.appendChild(logo);
        
        // Force it to be the last child to ensure highest stacking
        setTimeout(() => {
            if (logo.parentNode === document.body && logo !== document.body.lastElementChild) {
                document.body.appendChild(logo);
            }
        }, 10);
        
        console.log('✅ Homepage logo added directly to body');
    }
    
    // Run immediately and with delays
    addLogo();
    setTimeout(addLogo, 100);
    setTimeout(addLogo, 500);
    setTimeout(addLogo, 1000);
    setTimeout(addLogo, 2000);
    
    // Run periodically to ensure logo stays
    setInterval(addLogo, 3000);
    
    // Run on DOM changes
    const observer = new MutationObserver(() => {
        const logo = document.getElementById('coder1-homepage-logo');
        if (!logo || logo.style.position !== 'fixed') {
            addLogo();
        }
    });
    
    if (document.body) {
        observer.observe(document.body, {
            childList: true,
            subtree: true
        });
    }
    
    // Run on scroll to ensure visibility
    let scrollTimeout;
    window.addEventListener('scroll', () => {
        clearTimeout(scrollTimeout);
        scrollTimeout = setTimeout(() => {
            const logo = document.getElementById('coder1-homepage-logo');
            if (!logo || !logo.parentNode) {
                addLogo();
            }
        }, 100);
    });
    
})();