// Direct Blue Text Removal - Specific to header
(function() {
    'use strict';
    
    console.log('🎯 Direct Blue Text Removal - Targeting header blue text');
    
    function removeBlueText() {
        // Find all elements in the page
        const allElements = document.querySelectorAll('*');
        
        allElements.forEach(el => {
            // Skip our logo
            if (el.classList.contains('header-coder1-logo') || el.closest('.header-coder1-logo')) {
                return;
            }
            
            // Get the computed style
            const style = window.getComputedStyle(el);
            const rect = el.getBoundingClientRect();
            
            // Check if it's in the header area (top part of page)
            if (rect.top < 100) {
                const text = el.textContent?.trim();
                
                // Check if it contains our target text
                if (text && (text === 'Coder1 IDE' || text === 'Coder1' || text === 'IDE')) {
                    // Check the actual computed color
                    const color = style.color;
                    console.log('Found text:', text, 'Color:', color, 'Position:', rect);
                    
                    // Check for any shade of blue
                    if (color.includes('rgb(') || color.includes('rgba(')) {
                        // Parse RGB values
                        const matches = color.match(/\d+/g);
                        if (matches && matches.length >= 3) {
                            const r = parseInt(matches[0]);
                            const g = parseInt(matches[1]);
                            const b = parseInt(matches[2]);
                            
                            // If blue is dominant and it's not white/gray
                            if (b > r && b > g && b > 100) {
                                console.log('Removing blue text:', text);
                                el.style.cssText += 'color: transparent !important; visibility: hidden !important; font-size: 0 !important;';
                                
                                // Also try to empty the text
                                if (el.childNodes.length === 1 && el.childNodes[0].nodeType === 3) {
                                    el.childNodes[0].textContent = '';
                                }
                            }
                        }
                    }
                }
            }
        });
    }
    
    // Run multiple times
    removeBlueText();
    setTimeout(removeBlueText, 100);
    setTimeout(removeBlueText, 500);
    setTimeout(removeBlueText, 1000);
    setTimeout(removeBlueText, 2000);
    
    // Keep checking
    setInterval(removeBlueText, 3000);
    
    console.log('✅ Direct Blue Text Removal initialized');
})();