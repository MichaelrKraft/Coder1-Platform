// Hide Terminal Title Text - More Aggressive Version
(function() {
    'use strict';
    
    function hideTerminalTitle() {
        // Target terminal header elements
        const selectors = [
            '.terminal-header > span',
            '.terminal-header > div:not(.terminal-header-right):not(.special-view-buttons)',
            '.terminal-header-title',
            '.terminal-title',
            '[class*="terminal-header"] > span',
            '[class*="terminal-header"] > div:first-child'
        ];
        
        selectors.forEach(selector => {
            const elements = document.querySelectorAll(selector);
            elements.forEach(el => {
                // Skip if it contains buttons
                if (!el.querySelector('button') && 
                    !el.classList.contains('terminal-header-right') &&
                    !el.classList.contains('special-view-buttons')) {
                    el.style.display = 'none !important';
                    el.style.visibility = 'hidden !important';
                    el.style.opacity = '0 !important';
                    el.style.position = 'absolute !important';
                    el.style.left = '-9999px !important';
                }
            });
        });
        
        // Hide any element that contains "SuperClaude Terminal" text
        const allElements = document.querySelectorAll('*');
        allElements.forEach(el => {
            if (el.textContent && 
                (el.textContent.includes('SuperClaude Terminal') || 
                 el.textContent.includes('Terminal') && el.closest('.terminal-header')) &&
                !el.querySelector('button') &&
                el.children.length === 0) {
                el.style.display = 'none !important';
                el.style.visibility = 'hidden !important';
            }
        });
        
        // Remove text nodes directly in terminal header
        const terminalHeader = document.querySelector('.terminal-header');
        if (terminalHeader) {
            const childNodes = Array.from(terminalHeader.childNodes);
            childNodes.forEach(node => {
                if (node.nodeType === Node.TEXT_NODE) {
                    node.textContent = '';
                }
            });
        }
    }
    
    // Run immediately and after a delay
    setTimeout(hideTerminalTitle, 100);
    setTimeout(hideTerminalTitle, 500);
    setTimeout(hideTerminalTitle, 1000);
    
    // Watch for changes
    const observer = new MutationObserver(() => {
        hideTerminalTitle();
    });
    
    const checkInterval = setInterval(() => {
        const terminalHeader = document.querySelector('.terminal-header');
        if (terminalHeader) {
            observer.observe(terminalHeader, { childList: true, subtree: true });
            clearInterval(checkInterval);
            hideTerminalTitle();
        }
    }, 100);
    
    // Stop checking after 10 seconds
    setTimeout(() => clearInterval(checkInterval), 10000);
})();