// Fix Blue Logo Background - Simple targeted removal of blue React logo
(function() {
    'use strict';
    console.log('🎯 Fix Blue Logo Background: Starting simple targeted removal...');
    
    function removeBlueLogos() {
        // Target React logos specifically
        const reactLogos = document.querySelectorAll('img[src*="logo.svg"]:not(.header-coder1-logo img)');
        reactLogos.forEach(logo => {
            logo.style.display = 'none';
            logo.remove();
        });
        
        // Target blue SVG elements (React logo color)
        const blueSvgs = document.querySelectorAll('svg[fill*="00d8ff"], svg[fill*="61dafb"]');
        blueSvgs.forEach(svg => {
            svg.style.display = 'none';
            svg.remove();
        });
        
        // Also check for blue backgrounds in header area only
        const headerElements = document.querySelectorAll('.header, [class*="header"]:not(.terminal-header)');
        headerElements.forEach(header => {
            const style = window.getComputedStyle(header);
            if (style.backgroundColor.includes('rgb(0, 123, 255)') || 
                style.backgroundColor.includes('#007bff')) {
                header.style.backgroundColor = 'transparent';
            }
        });
    }
    
    // Run the removal
    removeBlueLogos();
    setTimeout(removeBlueLogos, 100);
    setTimeout(removeBlueLogos, 500);
    setTimeout(removeBlueLogos, 1000);
    
    // Monitor for changes
    const observer = new MutationObserver(removeBlueLogos);
    if (document.body) {
        observer.observe(document.body, {
            childList: true,
            subtree: true
        });
    }
    
    console.log('✅ Fix Blue Logo Background: Simple script loaded');
})();