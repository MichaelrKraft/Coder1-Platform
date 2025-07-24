// Remove Coder1 IDE Text - Super Aggressive
(function() {
    'use strict';
    
    console.log('🔍 Starting aggressive Coder1 IDE text removal...');
    
    function removeText() {
        // Method 1: Find by text content
        document.querySelectorAll('*').forEach(el => {
            if (el.childNodes.length === 1 && el.childNodes[0].nodeType === 3) {
                const text = el.textContent.trim();
                if (text === 'Coder1 IDE' || text === 'Coder1' || text === 'IDE') {
                    console.log('Found text element:', el, 'Parent:', el.parentElement);
                    el.style.cssText = 'display: none !important; visibility: hidden !important; font-size: 0 !important;';
                    el.textContent = '';
                    el.remove();
                }
            }
        });
        
        // Method 2: Find text nodes directly
        function walkTextNodes(node) {
            if (node.nodeType === 3) { // Text node
                if (node.textContent.includes('Coder1 IDE')) {
                    console.log('Found text node with Coder1 IDE:', node);
                    node.textContent = node.textContent.replace('Coder1 IDE', '');
                }
            } else {
                for (let child of node.childNodes) {
                    if (!child.classList || !child.classList.contains('coder1-logo')) {
                        walkTextNodes(child);
                    }
                }
            }
        }
        
        walkTextNodes(document.body);
        
        // Method 3: Target by color and position
        document.querySelectorAll('*').forEach(el => {
            const rect = el.getBoundingClientRect();
            const style = window.getComputedStyle(el);
            
            // If it's in the top area and not our logo
            if (rect.top < 100 && rect.left > 100 && !el.closest('.coder1-logo')) {
                if (el.textContent && (el.textContent.includes('Coder1') || el.textContent.includes('IDE'))) {
                    // Log what we found
                    console.log('Element in header area:', {
                        text: el.textContent,
                        color: style.color,
                        position: `${rect.left}, ${rect.top}`,
                        element: el
                    });
                    
                    // Remove if it's blue-ish
                    if (style.color.includes('0') && style.color.includes('123')) {
                        el.style.display = 'none !important';
                        el.remove();
                    }
                }
            }
        });
        
        // Method 4: Replace innerHTML of suspicious parents
        document.querySelectorAll('a, span, div, h1, h2, h3, h4, h5, h6').forEach(el => {
            if (!el.querySelector('img') && !el.closest('.coder1-logo') && 
                el.innerHTML && el.innerHTML.includes('Coder1 IDE')) {
                console.log('Found in innerHTML:', el);
                el.innerHTML = el.innerHTML.replace(/Coder1 IDE/g, '');
            }
        });
    }
    
    // Run immediately
    removeText();
    
    // Run multiple times
    for (let i = 100; i <= 3000; i += 100) {
        setTimeout(removeText, i);
    }
    
    // Mutation observer
    const observer = new MutationObserver((mutations) => {
        mutations.forEach(mutation => {
            if (mutation.type === 'childList') {
                removeText();
            }
        });
    });
    
    observer.observe(document.body, {
        childList: true,
        subtree: true,
        characterData: true
    });
})();