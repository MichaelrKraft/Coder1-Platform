// Fix All UI Issues - Comprehensive Solution
(function() {
    'use strict';
    
    function fixAllUIIssues() {
        // 1. Remove ALL "Coder1 IDE" text anywhere on the page
        const allElements = document.querySelectorAll('*');
        allElements.forEach(el => {
            if (el.textContent && el.textContent.trim() === 'Coder1 IDE' && el.children.length === 0) {
                console.log('🗑️ Removing "Coder1 IDE" text:', el);
                el.style.display = 'none !important';
                el.remove();
            }
        });
        
        // 2. Clean up terminal header completely
        const terminalHeader = document.querySelector('.terminal-header');
        if (terminalHeader) {
            // Remove all child elements that aren't button containers
            const children = Array.from(terminalHeader.children);
            children.forEach(child => {
                if (!child.classList.contains('terminal-header-right') && 
                    !child.classList.contains('special-view-buttons') &&
                    !child.querySelector('button')) {
                    child.remove();
                }
            });
            
            // Remove all text nodes
            const textNodes = Array.from(terminalHeader.childNodes).filter(node => node.nodeType === Node.TEXT_NODE);
            textNodes.forEach(node => node.remove());
            
            // Style the header properly
            terminalHeader.style.cssText = `
                background: #1a1b26 !important;
                border-bottom: 1px solid #414868 !important;
                padding: 8px 16px !important;
                display: flex !important;
                align-items: center !important;
                justify-content: flex-end !important;
                min-height: 40px !important;
                color: transparent !important;
            `;
        }
        
        // 3. Fix any elements with "SuperClaude Terminal" text
        allElements.forEach(el => {
            if (el.textContent && el.textContent.includes('SuperClaude Terminal') && el.children.length === 0) {
                el.remove();
            }
        });
        
        // 4. Remove any blue text in the top area
        allElements.forEach(el => {
            const style = window.getComputedStyle(el);
            const rect = el.getBoundingClientRect();
            
            if (rect.top < 150) { // Top area of page
                // Check for blue color
                if (style.color.includes('rgb(0') || 
                    style.color.includes('blue') ||
                    style.color.includes('#007bff') ||
                    style.color.includes('#0000ff')) {
                    
                    if (el.textContent && (el.textContent.includes('Coder') || el.textContent.includes('IDE'))) {
                        console.log('🗑️ Removing blue text:', el.textContent);
                        el.style.display = 'none !important';
                        el.remove();
                    }
                }
            }
        });
        
        // 5. Force hide specific selectors
        const selectorsToHide = [
            '[title*="Coder1 IDE"]',
            '[aria-label*="Coder1 IDE"]',
            'span:contains("Coder1 IDE")',
            'div:contains("Coder1 IDE"):not(:has(*))',
            '.terminal-header > span',
            '.terminal-header > div:first-child:not(.terminal-header-right)',
            '[class*="logo-text"]',
            '[class*="brand-text"]'
        ];
        
        selectorsToHide.forEach(selector => {
            try {
                const elements = document.querySelectorAll(selector);
                elements.forEach(el => {
                    if (!el.querySelector('.special-view-buttons') && !el.querySelector('button')) {
                        el.style.display = 'none !important';
                    }
                });
            } catch (e) {
                // Some selectors might not be valid, ignore errors
            }
        });
    }
    
    // Run immediately and with delays
    fixAllUIIssues();
    setTimeout(fixAllUIIssues, 100);
    setTimeout(fixAllUIIssues, 500);
    setTimeout(fixAllUIIssues, 1000);
    setTimeout(fixAllUIIssues, 2000);
    
    // Watch for changes
    const observer = new MutationObserver(() => {
        fixAllUIIssues();
    });
    
    if (document.body) {
        observer.observe(document.body, { 
            childList: true, 
            subtree: true,
            attributes: true,
            attributeFilter: ['style', 'class']
        });
    }
    
    // Also intercept any attempts to add text
    const originalAppendChild = Node.prototype.appendChild;
    Node.prototype.appendChild = function(child) {
        if (child.textContent && child.textContent.includes('Coder1 IDE')) {
            console.log('🚫 Blocked attempt to add "Coder1 IDE" text');
            return child;
        }
        return originalAppendChild.call(this, child);
    };
})();