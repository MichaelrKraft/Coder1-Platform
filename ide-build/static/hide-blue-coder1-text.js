// Hide Blue Coder1 IDE Text Only
(function() {
    'use strict';
    
    function hideBlueText() {
        // Find all elements on the page
        const allElements = document.querySelectorAll('*');
        
        allElements.forEach(el => {
            // Skip image elements
            if (el.tagName === 'IMG' || el.closest('.coder1-logo')) {
                return;
            }
            
            // Check if element has "Coder1 IDE" text and is blue
            if (el.textContent && el.textContent.trim() === 'Coder1 IDE' && el.children.length === 0) {
                const style = window.getComputedStyle(el);
                
                // Check for blue color in various formats
                if (style.color.includes('rgb(0') || 
                    style.color.includes('123') ||
                    style.color.includes('blue') ||
                    style.color === '#007bff' ||
                    el.style.color && (el.style.color.includes('blue') || el.style.color.includes('007bff'))) {
                    
                    console.log('🎯 Found blue Coder1 IDE text, hiding it');
                    el.style.display = 'none !important';
                    el.style.visibility = 'hidden !important';
                    el.style.opacity = '0 !important';
                    el.style.fontSize = '0 !important';
                    
                    // Also hide the parent if it only contains this element
                    if (el.parentElement && el.parentElement.children.length === 1 && 
                        !el.parentElement.classList.contains('coder1-logo')) {
                        el.parentElement.style.display = 'none !important';
                    }
                }
            }
            
            // Also check for elements in header area with Coder text
            const rect = el.getBoundingClientRect();
            if (rect.top < 100 && rect.left > 150) { // Not the logo area
                if (el.textContent === 'Coder1 IDE' || el.textContent === 'Coder1' || el.textContent === 'IDE') {
                    const style = window.getComputedStyle(el);
                    if (style.color.includes('rgb(0') || style.color.includes('blue')) {
                        el.style.display = 'none !important';
                    }
                }
            }
        });
    }
    
    // Run multiple times to catch dynamically added elements
    hideBlueText();
    setTimeout(hideBlueText, 100);
    setTimeout(hideBlueText, 500);
    setTimeout(hideBlueText, 1000);
    setTimeout(hideBlueText, 2000);
    
    // Watch for new elements
    const observer = new MutationObserver(() => {
        hideBlueText();
    });
    
    if (document.body) {
        observer.observe(document.body, { childList: true, subtree: true });
    }
})();