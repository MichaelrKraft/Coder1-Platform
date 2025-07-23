// Cleanup Header Buttons - Remove extra text to allow spreading
console.log('🧹 Cleaning up header buttons...');

(function() {
    'use strict';
    
    function cleanupButtons() {
        // Find all elements that might contain the SuperClaude Terminal text
        const allElements = document.querySelectorAll('*');
        
        allElements.forEach(element => {
            const elementText = element.textContent || '';
            const elementTitle = element.getAttribute('title') || '';
            
            // Target the header title text specifically
            if (elementText.trim() === 'SuperClaude Terminal' || 
                elementTitle.trim() === 'SuperClaude Terminal') {
                console.log('Found SuperClaude Terminal element to hide:', element.tagName, elementText, elementTitle);
                
                // Completely hide the SuperClaude Terminal element
                element.style.setProperty('display', 'none', 'important');
                element.style.setProperty('visibility', 'hidden', 'important');
                element.style.setProperty('opacity', '0', 'important');
                element.style.setProperty('height', '0', 'important');
                element.style.setProperty('width', '0', 'important');
                element.style.setProperty('margin', '0', 'important');
                element.style.setProperty('padding', '0', 'important');
                element.setAttribute('aria-hidden', 'true');
                element.remove(); // Also try to remove it completely
                
                // Also hide parent elements if they only contain this element
                const parent = element.parentElement;
                if (parent && parent.children.length <= 1) {
                    parent.style.setProperty('display', 'none', 'important');
                }
            }
            
            // Also check for any button with long text that might need shortening
            if (buttonText.length > 15) {
                console.log('Found long button text:', buttonText);
                
                // Look for text nodes and shorten them
                const walker = document.createTreeWalker(
                    button,
                    NodeFilter.SHOW_TEXT,
                    null,
                    false
                );
                
                let node;
                while (node = walker.nextNode()) {
                    const text = node.textContent.trim();
                    if (text.length > 15) {
                        // Shorten the text
                        if (text.includes('SuperClaude')) {
                            node.textContent = 'SC';
                        } else if (text.includes('Terminal')) {
                            node.textContent = '';
                        }
                    }
                }
            }
        });
        
        // Also look for specific control buttons with labels
        const controlButtons = document.querySelectorAll('.control-btn, [class*="control-btn"]');
        controlButtons.forEach(btn => {
            const labels = btn.querySelectorAll('.control-label, [class*="label"]');
            labels.forEach(label => {
                const text = label.textContent || '';
                // Remove or shorten long labels
                if (text.includes('SuperClaude') && text.includes('Terminal')) {
                    label.textContent = 'Terminal';
                } else if (text.includes('SuperClaude')) {
                    label.textContent = 'SC';
                }
            });
        });
        
        // Apply custom CSS to ensure buttons can spread out
        if (!document.getElementById('button-spacing-styles')) {
            const style = document.createElement('style');
            style.id = 'button-spacing-styles';
            style.textContent = `
                /* Allow buttons to spread out more */
                .header-actions,
                .header-controls,
                .view-controls,
                [class*="controls"] {
                    gap: 12px !important;
                }
                
                /* Make control buttons more compact if needed */
                .control-btn {
                    min-width: auto !important;
                    padding: 6px 10px !important;
                }
                
                /* Hide text on small screens, show only icons */
                @media (max-width: 1200px) {
                    .control-label {
                        display: none !important;
                    }
                    
                    .control-btn {
                        min-width: 36px !important;
                        padding: 6px !important;
                    }
                }
            `;
            document.head.appendChild(style);
        }
    }
    
    // Run cleanup multiple times
    cleanupButtons();
    
    // Run on DOM changes
    const observer = new MutationObserver(() => {
        cleanupButtons();
    });
    
    // Start observing when ready
    const startObserving = setInterval(() => {
        if (document.body) {
            clearInterval(startObserving);
            observer.observe(document.body, {
                childList: true,
                subtree: true,
                characterData: true
            });
        }
    }, 100);
    
    // Also run periodically as backup
    setInterval(cleanupButtons, 2000);
    
})();