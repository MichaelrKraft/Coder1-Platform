// Targeted Blue Text Removal - Safe Approach
(function() {
    'use strict';
    
    function removeSpecificBlueText() {
        // Only target text nodes and specific elements
        const walker = document.createTreeWalker(
            document.body,
            NodeFilter.SHOW_TEXT,
            null,
            false
        );
        
        const textNodesToClean = [];
        let node;
        
        // Find text nodes containing "Coder1 IDE"
        while (node = walker.nextNode()) {
            if (node.nodeValue && node.nodeValue.includes('Coder1 IDE')) {
                const parent = node.parentElement;
                if (parent) {
                    const rect = parent.getBoundingClientRect();
                    // Only target text in header area (top 150px)
                    if (rect.top < 150 && rect.top >= 0) {
                        textNodesToClean.push({node, parent});
                    }
                }
            }
        }
        
        // Clean the text nodes
        textNodesToClean.forEach(({node, parent}) => {
            // Make sure we're not removing essential elements
            if (parent.tagName !== 'SCRIPT' && 
                parent.tagName !== 'STYLE' &&
                !parent.classList.contains('coder1-logo')) {
                
                const style = window.getComputedStyle(parent);
                
                // Check if it's blue text
                if (style.color.includes('rgb(0, 123, 255)') || 
                    style.color.includes('#007bff') ||
                    style.color.includes('rgb(0') && style.color.includes('123')) {
                    
                    console.log('Removing blue Coder1 IDE text:', node.nodeValue);
                    node.nodeValue = '';
                    
                    // If parent only had this text, hide it
                    if (parent.childNodes.length === 1) {
                        parent.style.display = 'none';
                    }
                }
            }
        });
        
        // Also target specific blue text elements
        const elements = document.querySelectorAll('span, div, p, h1, h2, h3, h4, h5, h6');
        elements.forEach(el => {
            if (el.textContent === 'Coder1 IDE' && el.children.length === 0) {
                const rect = el.getBoundingClientRect();
                const style = window.getComputedStyle(el);
                
                // In header area and blue
                if (rect.top < 150 && rect.top >= 0 &&
                    (style.color.includes('rgb(0, 123, 255)') || 
                     style.color.includes('#007bff'))) {
                    
                    console.log('Hiding blue element:', el);
                    el.style.display = 'none';
                    el.textContent = '';
                }
            }
        });
    }
    
    // Run with delays to catch dynamic content
    removeSpecificBlueText();
    setTimeout(removeSpecificBlueText, 100);
    setTimeout(removeSpecificBlueText, 500);
    setTimeout(removeSpecificBlueText, 1000);
    setTimeout(removeSpecificBlueText, 2000);
    
    // Monitor for changes but less aggressively
    let debounceTimer;
    const observer = new MutationObserver(() => {
        clearTimeout(debounceTimer);
        debounceTimer = setTimeout(removeSpecificBlueText, 100);
    });
    
    if (document.body) {
        observer.observe(document.body, { 
            childList: true, 
            subtree: true,
            characterData: true 
        });
    }
})();