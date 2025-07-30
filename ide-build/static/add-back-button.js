// Add Back Button to IDE
(function() {
    'use strict';
    
    console.log('🔙 Adding back button to IDE...');
    
    function addBackButton() {
        // Check if back button already exists
        if (document.querySelector('.ide-back-button')) {
            return;
        }
        
        // Create back button
        const backButton = document.createElement('button');
        backButton.className = 'ide-back-button';
        backButton.innerHTML = '← Back to PRD Generator';
        backButton.style.cssText = `
            position: fixed !important;
            top: 20px !important;
            right: 20px !important;
            z-index: 10000 !important;
            background: #8b5cf6 !important;
            color: white !important;
            border: none !important;
            padding: 12px 20px !important;
            border-radius: 8px !important;
            cursor: pointer !important;
            font-size: 14px !important;
            font-weight: 500 !important;
            box-shadow: 0 4px 12px rgba(139, 92, 246, 0.3) !important;
            transition: all 0.2s ease !important;
            font-family: Inter, -apple-system, BlinkMacSystemFont, sans-serif !important;
        `;
        
        // Add hover effect
        backButton.addEventListener('mouseenter', () => {
            backButton.style.transform = 'translateY(-2px)';
            backButton.style.boxShadow = '0 6px 20px rgba(139, 92, 246, 0.4)';
        });
        
        backButton.addEventListener('mouseleave', () => {
            backButton.style.transform = 'translateY(0)';
            backButton.style.boxShadow = '0 4px 12px rgba(139, 92, 246, 0.3)';
        });
        
        // Add click handler
        backButton.addEventListener('click', () => {
            console.log('🔄 Navigating back to PRD Generator...');
            
            // Try multiple navigation methods
            if (window.electronNavigate) {
                window.electronNavigate('/');
            } else if (window.location.href.includes('github.io')) {
                window.location.href = '../smart-prd-generator.html';
            } else {
                // Get current directory and navigate to parent
                const currentUrl = window.location.href;
                const baseDir = currentUrl.substring(0, currentUrl.lastIndexOf('/'));
                window.location.href = baseDir + '/../smart-prd-generator.html';
            }
        });
        
        // Add to body
        document.body.appendChild(backButton);
        console.log('✅ Back button added to IDE');
    }
    
    // Add button on load
    addBackButton();
    
    // Also add when DOM changes (in case React re-renders)
    setTimeout(addBackButton, 1000);
    setTimeout(addBackButton, 2000);
    
    // Watch for DOM changes
    const observer = new MutationObserver(() => {
        if (!document.querySelector('.ide-back-button')) {
            addBackButton();
        }
    });
    
    if (document.body) {
        observer.observe(document.body, { childList: true, subtree: true });
    }
    
    console.log('✅ Back button script initialized');
})();