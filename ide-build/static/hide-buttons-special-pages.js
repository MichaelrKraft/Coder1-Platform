// Hide Explorer, Terminal, and Preview buttons on special agent pages
console.log('🎭 Hide buttons for special pages loading...');

function hideButtonsOnSpecialPages() {
    // Check if we're on a special agent page
    const specialPages = ['supervision', 'sleep-mode', 'infinite-loop', 'parallel-agents', 'transfer'];
    const currentUrl = window.location.href.toLowerCase();
    const urlParams = new URLSearchParams(window.location.search);
    const projectParam = urlParams.get('project');
    
    // Check if we're on a special page
    const isSpecialPage = specialPages.some(page => 
        currentUrl.includes(page) || projectParam === page || projectParam === 'transfer'
    );
    
    if (isSpecialPage) {
        console.log('🎭 Special page detected, hiding buttons...');
        
        // Hide the buttons
        const hideButtons = () => {
            // Find buttons by their text content or icons
            const buttons = Array.from(document.querySelectorAll('button'));
            
            buttons.forEach(button => {
                const buttonText = button.textContent.trim();
                const buttonTitle = button.getAttribute('title') || '';
                
                // Check for Explorer, Terminal, or Preview buttons
                if (buttonText === 'Explorer' || 
                    buttonText === 'Terminal' || 
                    buttonText === 'Preview' ||
                    buttonTitle === 'Explorer' ||
                    buttonTitle === 'Terminal' ||
                    buttonTitle === 'Preview' ||
                    button.querySelector('[title="Explorer"]') ||
                    button.querySelector('[title="Terminal"]') ||
                    button.querySelector('[title="Preview"]')) {
                    
                    button.style.display = 'none';
                    console.log('🎭 Hidden button:', buttonText || buttonTitle);
                }
            });
            
            // Also hide by looking for the button container if it has specific classes
            const buttonContainers = document.querySelectorAll('[class*="toolbar"], [class*="button-group"], [class*="nav-buttons"]');
            buttonContainers.forEach(container => {
                const buttons = container.querySelectorAll('button');
                buttons.forEach(button => {
                    if (button.textContent.match(/Explorer|Terminal|Preview/)) {
                        button.style.display = 'none';
                    }
                });
            });
        };
        
        // Initial hide
        hideButtons();
        
        // Set up observer to hide buttons if they appear later
        const observer = new MutationObserver(() => {
            hideButtons();
        });
        
        observer.observe(document.body, {
            childList: true,
            subtree: true
        });
        
        // Also periodically check (backup)
        setInterval(hideButtons, 1000);
    }
}

// Run when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', hideButtonsOnSpecialPages);
} else {
    hideButtonsOnSpecialPages();
}

// Also run when URL changes (for single-page app navigation)
let lastUrl = location.href;
new MutationObserver(() => {
    const url = location.href;
    if (url !== lastUrl) {
        lastUrl = url;
        setTimeout(hideButtonsOnSpecialPages, 100);
    }
}).observe(document, { subtree: true, childList: true });

console.log('✅ Hide buttons script ready');