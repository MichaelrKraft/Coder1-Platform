/**
 * Clean Terminal Display - Remove weird blue bars and unwanted text elements
 * Conservative approach to avoid formatting issues
 */

(function() {
    'use strict';
    
    function cleanTerminalDisplay() {
        // Target specific weird symbols and artifacts
        const allElements = document.querySelectorAll('*');
        
        allElements.forEach(el => {
            const rect = el.getBoundingClientRect();
            const text = el.textContent?.trim() || '';
            
            // Skip if element is not visible or is too large (likely legitimate content)
            if (rect.width === 0 || rect.height === 0 || rect.width > 200) return;
            
            // Check for weird symbols specifically
            const hasWeirdSymbols = text.includes('ă') || 
                                   text.includes('„') ||
                                   text.includes('i̧') ||
                                   text.includes('ă,,') ||
                                   text.match(/^[ăîâțș„"]+[,\s]*$/);
            
            // Check if it's in the left terminal area where these artifacts appear
            const isInLeftTerminalArea = rect.left < 100 && 
                                       rect.top > window.innerHeight * 0.2 &&
                                       rect.top < window.innerHeight * 0.8;
            
            // Check for blue vertical bars (specific pattern)
            const style = window.getComputedStyle(el);
            const isBlueVerticalBar = (style.borderLeftColor.includes('blue') || 
                                     style.borderLeftColor.includes('rgb(0')) &&
                                     rect.width < 15 && rect.height > 30;
            
            // Remove only very specific artifacts
            if (isInLeftTerminalArea && (
                (hasWeirdSymbols && text.length < 10) ||
                isBlueVerticalBar
            )) {
                el.style.display = 'none !important';
                el.style.visibility = 'hidden !important';
                el.style.opacity = '0 !important';
            }
        });
        
        // Also target elements with specific weird text patterns
        const textElements = document.querySelectorAll('*');
        textElements.forEach(el => {
            const text = el.textContent?.trim() || '';
            const rect = el.getBoundingClientRect();
            
            // Very specific pattern matching for the weird symbols
            if (rect.left < 50 && rect.width < 50 && (
                text === 'ă„i̧' ||
                text === 'ă„' ||
                text.match(/^[ăîâțș„"]{1,5}$/) ||
                (text.length < 5 && text.includes('ă'))
            )) {
                el.style.display = 'none !important';
            }
        });
    }
    
    // Run immediately
    cleanTerminalDisplay();
    
    // Run periodically but not too frequently
    setInterval(cleanTerminalDisplay, 3000);
    
    // Run on DOM changes but with throttling
    let cleanTimeout;
    const observer = new MutationObserver(() => {
        clearTimeout(cleanTimeout);
        cleanTimeout = setTimeout(cleanTerminalDisplay, 500);
    });
    
    if (document.body) {
        observer.observe(document.body, {
            childList: true,
            subtree: true
        });
    }
    
})();