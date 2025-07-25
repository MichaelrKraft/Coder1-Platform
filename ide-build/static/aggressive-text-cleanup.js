// Aggressive Text Cleanup - Final Solution
(function() {
    'use strict';
    
    function aggressiveTextCleanup() {
        // Method 1: Remove all text nodes containing "Coder1 IDE"
        const walker = document.createTreeWalker(
            document.body,
            NodeFilter.SHOW_TEXT,
            {
                acceptNode: function(node) {
                    if (node.nodeValue && 
                        (node.nodeValue.includes('Coder1 IDE') || 
                         node.nodeValue.includes('Coder1') ||
                         node.nodeValue.trim() === 'IDE')) {
                        return NodeFilter.FILTER_ACCEPT;
                    }
                    return NodeFilter.FILTER_REJECT;
                }
            }
        );
        
        const textNodesToRemove = [];
        let node;
        while (node = walker.nextNode()) {
            textNodesToRemove.push(node);
        }
        
        textNodesToRemove.forEach(node => {
            if (node.parentElement) {
                // Don't remove if it's part of our logo
                if (!node.parentElement.closest('.coder1-logo-forced')) {
                    node.nodeValue = '';
                }
            }
        });
        
        // Method 2: Hide any element with these texts
        const elementsToHide = document.querySelectorAll('*');
        elementsToHide.forEach(el => {
            // Skip our logo
            if (el.classList.contains('coder1-logo-forced') || el.closest('.coder1-logo-forced')) {
                return;
            }
            
            const text = el.textContent?.trim();
            if (text === 'Coder1 IDE' || text === 'Coder1' || text === 'IDE') {
                // Only hide if it's a leaf node (no children except text)
                if (el.children.length === 0) {
                    el.style.cssText = 'display: none !important; visibility: hidden !important; opacity: 0 !important; width: 0 !important; height: 0 !important; font-size: 0 !important;';
                    el.textContent = '';
                }
            }
        });
        
        // Method 3: Target specific areas where the text might appear
        const headerElements = Array.from(document.querySelectorAll('*')).filter(el => {
            const rect = el.getBoundingClientRect();
            return rect.top >= 0 && rect.top < 150 && rect.left >= 0;
        });
        
        headerElements.forEach(el => {
            if (el.textContent?.includes('Coder1') || el.textContent?.includes('IDE')) {
                if (!el.querySelector('img') && !el.closest('.coder1-logo-forced')) {
                    const children = Array.from(el.childNodes);
                    children.forEach(child => {
                        if (child.nodeType === Node.TEXT_NODE && 
                            (child.nodeValue.includes('Coder1') || child.nodeValue.includes('IDE'))) {
                            child.nodeValue = '';
                        }
                    });
                }
            }
        });
    }
    
    // Run aggressively
    aggressiveTextCleanup();
    
    // Run multiple times to catch any dynamic content
    const timings = [50, 100, 200, 500, 1000, 1500, 2000, 3000];
    timings.forEach(timing => {
        setTimeout(aggressiveTextCleanup, timing);
    });
    
    // Keep monitoring
    setInterval(aggressiveTextCleanup, 2000);
    
    // Watch for changes
    const observer = new MutationObserver(() => {
        aggressiveTextCleanup();
    });
    
    if (document.body) {
        observer.observe(document.body, { 
            childList: true, 
            subtree: true,
            characterData: true,
            characterDataOldValue: true
        });
    }
})();