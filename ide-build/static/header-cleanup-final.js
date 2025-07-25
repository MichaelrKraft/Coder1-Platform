// Header Cleanup Final - Remove all text from header area
(function() {
    'use strict';
    
    console.log('🎯 Header Cleanup Final - Starting');
    
    function cleanupHeader() {
        // Find the header where our logo is
        const ourLogo = document.querySelector('.header-coder1-logo');
        if (!ourLogo) {
            console.log('Logo not found yet');
            return;
        }
        
        // Get the header element (parent of our logo)
        let header = ourLogo.parentElement;
        while (header && !header.className?.includes('header') && header !== document.body) {
            header = header.parentElement;
        }
        
        if (!header) {
            console.log('Header not found');
            return;
        }
        
        console.log('Found header:', header);
        
        // Method 1: Hide all text in header except our logo
        const allElements = header.querySelectorAll('*');
        allElements.forEach(el => {
            // Skip our logo
            if (el === ourLogo || el.contains(ourLogo) || el.closest('.header-coder1-logo')) {
                return;
            }
            
            // If element has text
            const text = el.textContent?.trim();
            if (text && (text.includes('Coder1') || text.includes('IDE'))) {
                console.log('Found text element:', el, 'Text:', text);
                
                // Hide it completely
                el.style.cssText += `
                    visibility: hidden !important;
                    opacity: 0 !important;
                    color: transparent !important;
                    font-size: 0 !important;
                    line-height: 0 !important;
                    letter-spacing: -999px !important;
                    text-indent: -999px !important;
                `;
                
                // If it's just a text container, hide the whole thing
                if (el.children.length === 0) {
                    el.style.display = 'none !important';
                }
            }
        });
        
        // Method 2: Target text nodes directly
        const walker = document.createTreeWalker(
            header,
            NodeFilter.SHOW_TEXT,
            null,
            false
        );
        
        let node;
        while (node = walker.nextNode()) {
            if (node.nodeValue && (node.nodeValue.includes('Coder1') || node.nodeValue.includes('IDE'))) {
                console.log('Found text node:', node.nodeValue);
                node.nodeValue = '';
            }
        }
        
        // Method 3: Add CSS to hide any remaining text
        if (!document.getElementById('header-text-hide-css')) {
            const style = document.createElement('style');
            style.id = 'header-text-hide-css';
            style.textContent = `
                .header *:not(.header-coder1-logo):not(.header-coder1-logo *) {
                    color: transparent !important;
                }
                
                .header span:not(.header-coder1-logo span),
                .header div:not(.header-coder1-logo):not(.header-coder1-logo div) {
                    color: transparent !important;
                    font-size: 0 !important;
                }
                
                /* Specifically target any element with Coder1 or IDE text */
                .header *:not(.header-coder1-logo) {
                    text-indent: -9999px !important;
                }
            `;
            document.head.appendChild(style);
        }
    }
    
    // Run aggressively
    setInterval(cleanupHeader, 500);
    
    // Also run on DOM changes
    const observer = new MutationObserver(cleanupHeader);
    if (document.body) {
        observer.observe(document.body, { childList: true, subtree: true });
    }
    
    console.log('✅ Header Cleanup Final initialized');
})();