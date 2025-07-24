// Remove Blue "Coder1 IDE" Text
(function() {
    'use strict';
    
    function removeBlueText() {
        // Find all elements
        const allElements = document.querySelectorAll('*');
        
        allElements.forEach(el => {
            // Check if element contains "Coder1 IDE" text
            if (el.textContent && el.textContent.trim() === 'Coder1 IDE' && el.children.length === 0) {
                const computedStyle = window.getComputedStyle(el);
                
                // Check if it has blue color
                if (computedStyle.color === 'rgb(0, 123, 255)' || 
                    computedStyle.color === 'rgb(0, 0, 255)' ||
                    computedStyle.color === 'blue' ||
                    computedStyle.color.includes('rgb(') && computedStyle.color.includes('123')) {
                    
                    console.log('🎯 Found blue "Coder1 IDE" text, removing:', el);
                    el.style.display = 'none !important';
                    el.style.visibility = 'hidden !important';
                    
                    // Also hide parent if it only contains this text
                    if (el.parentElement && el.parentElement.children.length === 1) {
                        el.parentElement.style.display = 'none !important';
                    }
                }
            }
            
            // Also check for any blue text in header area
            if (el.style.color && (el.style.color.includes('blue') || el.style.color.includes('007bff'))) {
                const rect = el.getBoundingClientRect();
                if (rect.top < 100 && el.textContent && el.textContent.includes('Coder')) {
                    el.style.display = 'none !important';
                }
            }
        });
    }
    
    // Run multiple times to catch dynamically added elements
    setTimeout(removeBlueText, 100);
    setTimeout(removeBlueText, 500);
    setTimeout(removeBlueText, 1000);
    setTimeout(removeBlueText, 2000);
    
    // Watch for changes
    const observer = new MutationObserver(() => {
        removeBlueText();
    });
    
    if (document.body) {
        observer.observe(document.body, { childList: true, subtree: true });
    }
})();