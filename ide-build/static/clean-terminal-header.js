// Clean Terminal Header - Proper Special View Button Positioning
(function() {
    'use strict';
    
    function cleanTerminalHeader() {
        const terminalHeader = document.querySelector('.terminal-header');
        if (!terminalHeader) return;
        
        console.log('🧹 Cleaning terminal header...');
        
        // Ensure proper terminal header styling
        terminalHeader.style.cssText = `
            background: #1a1b26 !important;
            border-bottom: 1px solid #414868 !important;
            padding: 8px 16px !important;
            display: flex !important;
            align-items: center !important;
            justify-content: space-between !important;
            min-height: 40px !important;
        `;
        
        // Find the left side content (title)
        let leftContent = terminalHeader.querySelector('.terminal-title, .terminal-header-left');
        if (!leftContent) {
            // Create left content container
            leftContent = document.createElement('div');
            leftContent.className = 'terminal-header-left';
            leftContent.style.cssText = 'display: flex; align-items: center; color: #c0caf5;';
            leftContent.innerHTML = '🖥️ SuperClaude Terminal';
            terminalHeader.prepend(leftContent);
        }
        
        // Find or create right side container for buttons
        let rightContainer = terminalHeader.querySelector('.terminal-header-right');
        if (!rightContainer) {
            rightContainer = document.createElement('div');
            rightContainer.className = 'terminal-header-right';
            rightContainer.style.cssText = 'display: flex; gap: 12px; align-items: center;';
            terminalHeader.appendChild(rightContainer);
        }
        
        // Ensure special view buttons are in the right container
        const specialButtons = terminalHeader.querySelector('.special-view-buttons');
        if (specialButtons && !rightContainer.contains(specialButtons)) {
            rightContainer.prepend(specialButtons);
        }
        
        console.log('✅ Terminal header cleaned');
    }
    
    // Run after other scripts have loaded
    setTimeout(cleanTerminalHeader, 1000);
    setTimeout(cleanTerminalHeader, 2000);
    
    // Watch for changes
    const observer = new MutationObserver(() => {
        const terminalHeader = document.querySelector('.terminal-header');
        if (terminalHeader && !terminalHeader.querySelector('.terminal-header-left')) {
            cleanTerminalHeader();
        }
    });
    
    if (document.body) {
        observer.observe(document.body, { childList: true, subtree: true });
    }
})();