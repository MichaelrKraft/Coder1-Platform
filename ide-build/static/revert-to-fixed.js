// Revert to Fixed - Simple fixed positioning for buttons
(function() {
    console.log('🔄 Revert to Fixed: Restoring simple layout...');
    
    function revertToFixed() {
        // Remove any scrolling from Explorer
        const explorerContainers = document.querySelectorAll('div');
        explorerContainers.forEach(container => {
            if (container.style.overflowY === 'auto' || container.style.overflow === 'auto') {
                container.style.overflow = '';
                container.style.overflowY = '';
                container.style.overflowX = '';
                container.style.height = '';
                container.style.maxHeight = '';
                container.style.paddingBottom = '';
            }
        });
        
        // Fix settings section with fixed positioning
        const settingsSection = document.querySelector('.settings-section');
        if (settingsSection) {
            settingsSection.style.cssText = `
                position: fixed !important;
                bottom: 100px !important;
                left: 20px !important;
                z-index: 9999 !important;
                display: flex !important;
                flex-direction: column !important;
                align-items: flex-start !important;
                visibility: visible !important;
                opacity: 1 !important;
                margin: 0 !important;
            `;
            
            // Move it back to body if it was moved
            if (settingsSection.parentElement !== document.body) {
                document.body.appendChild(settingsSection);
            }
            
            console.log('✅ Settings section fixed positioning restored');
        }
        
        // Fix React Bits button with fixed positioning
        let reactBitsButton = document.getElementById('react-bits-button');
        if (!reactBitsButton) {
            // Create it if missing
            reactBitsButton = document.createElement('button');
            reactBitsButton.id = 'react-bits-button';
            reactBitsButton.innerHTML = '🎨 React Bits';
            reactBitsButton.onclick = function(e) {
                e.preventDefault();
                window.location.href = './react-bits-dual-preview.html';
            };
            document.body.appendChild(reactBitsButton);
        }
        
        // Apply fixed positioning
        reactBitsButton.style.cssText = `
            position: fixed !important;
            bottom: 20px !important;
            left: 20px !important;
            padding: 8px 16px !important;
            background: linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%) !important;
            color: white !important;
            border: none !important;
            border-radius: 6px !important;
            font-size: 14px !important;
            font-weight: 500 !important;
            cursor: pointer !important;
            z-index: 9999 !important;
            display: block !important;
            visibility: visible !important;
            opacity: 1 !important;
            margin: 0 !important;
        `;
        
        // Move it back to body if it was moved
        if (reactBitsButton.parentElement !== document.body) {
            document.body.appendChild(reactBitsButton);
        }
        
        console.log('✅ React Bits button fixed positioning restored');
        
        // Remove any custom scrollbar styles
        const customScrollStyles = document.querySelectorAll('style[id*="scroll"]');
        customScrollStyles.forEach(style => style.remove());
        
        console.log('✅ Layout reverted to simple fixed positioning');
    }
    
    // Run immediately and after delays
    revertToFixed();
    setTimeout(revertToFixed, 100);
    setTimeout(revertToFixed, 500);
    setTimeout(revertToFixed, 1000);
    setTimeout(revertToFixed, 2000);
    
    // Monitor for changes
    const observer = new MutationObserver(() => {
        const settingsSection = document.querySelector('.settings-section');
        const reactBitsButton = document.getElementById('react-bits-button');
        
        if (settingsSection && settingsSection.style.position !== 'fixed') {
            revertToFixed();
        }
        if (reactBitsButton && reactBitsButton.style.position !== 'fixed') {
            revertToFixed();
        }
    });
    
    if (document.body) {
        observer.observe(document.body, { 
            childList: true, 
            subtree: true,
            attributes: true,
            attributeFilter: ['style']
        });
    }
    
    console.log('🔄 Revert to Fixed: Script loaded');
})();