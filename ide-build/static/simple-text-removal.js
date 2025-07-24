// Simple Text Removal - Last Resort
(function() {
    'use strict';
    
    function removeBlueTextSimple() {
        // Find any element in the top-left area that says "Coder1 IDE"
        const elements = document.querySelectorAll('*');
        
        for (let el of elements) {
            const rect = el.getBoundingClientRect();
            
            // If it's in the top area where our logo is
            if (rect.top < 150 && rect.left > 50 && rect.left < 300) {
                // Check if it contains the text we don't want
                if (el.textContent === 'Coder1 IDE' || el.innerText === 'Coder1 IDE') {
                    // Check if it's not our image logo
                    if (el.tagName !== 'IMG' && !el.querySelector('img')) {
                        console.log('Found and removing blue text element:', el);
                        el.style.display = 'none';
                        el.innerHTML = '';
                        el.textContent = '';
                    }
                }
            }
        }
        
        // Also remove any standalone text that says "IDE" near our logo
        const walker = document.createTreeWalker(
            document.body,
            NodeFilter.SHOW_TEXT,
            null,
            false
        );
        
        const textNodes = [];
        let node;
        while (node = walker.nextNode()) {
            if (node.textContent.includes('Coder1 IDE') || 
                (node.textContent.trim() === 'IDE' && node.parentElement)) {
                const rect = node.parentElement.getBoundingClientRect();
                if (rect.left > 50 && rect.left < 300 && rect.top < 150) {
                    textNodes.push(node);
                }
            }
        }
        
        textNodes.forEach(node => {
            console.log('Removing text node:', node.textContent);
            node.textContent = '';
        });
    }
    
    // Run it multiple times
    setTimeout(removeBlueTextSimple, 100);
    setTimeout(removeBlueTextSimple, 500);
    setTimeout(removeBlueTextSimple, 1000);
    setTimeout(removeBlueTextSimple, 2000);
    
    // Set up interval to keep removing it
    setInterval(removeBlueTextSimple, 1000);
})();