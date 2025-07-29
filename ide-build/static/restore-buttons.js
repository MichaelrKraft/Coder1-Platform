// Restore Buttons - Simple solution to show buttons with proper spacing
(function() {
    console.log('🔧 Restore Buttons: Starting...');
    
    function restoreButtons() {
        // Ensure settings section is visible and positioned
        const settingsSection = document.querySelector('.settings-section');
        if (settingsSection) {
            settingsSection.style.position = 'fixed';
            settingsSection.style.bottom = '100px';
            settingsSection.style.left = '20px';
            settingsSection.style.zIndex = '9999';
            settingsSection.style.display = 'flex';
            settingsSection.style.flexDirection = 'column';
            settingsSection.style.alignItems = 'flex-start';
            settingsSection.style.visibility = 'visible';
            settingsSection.style.opacity = '1';
            console.log('✅ Settings section restored');
        } else {
            console.log('❌ Settings section not found');
        }
        
        // Ensure React Bits button is visible
        const reactBitsButton = document.getElementById('react-bits-button');
        if (reactBitsButton) {
            reactBitsButton.style.position = 'fixed';
            reactBitsButton.style.bottom = '20px';
            reactBitsButton.style.left = '20px';
            reactBitsButton.style.zIndex = '9999';
            reactBitsButton.style.display = 'block';
            reactBitsButton.style.visibility = 'visible';
            reactBitsButton.style.opacity = '1';
            reactBitsButton.style.padding = '8px 16px';
            reactBitsButton.style.background = 'linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%)';
            reactBitsButton.style.color = 'white';
            reactBitsButton.style.border = 'none';
            reactBitsButton.style.borderRadius = '6px';
            reactBitsButton.style.fontSize = '14px';
            reactBitsButton.style.fontWeight = '500';
            reactBitsButton.style.cursor = 'pointer';
            console.log('✅ React Bits button restored');
        } else {
            console.log('❌ React Bits button not found - creating it');
            
            // Create the button if it doesn't exist
            const button = document.createElement('button');
            button.id = 'react-bits-button';
            button.innerHTML = '🎨 React Bits';
            button.style.cssText = `
                position: fixed;
                bottom: 20px;
                left: 20px;
                padding: 8px 16px;
                background: linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%);
                color: white;
                border: none;
                border-radius: 6px;
                font-size: 14px;
                font-weight: 500;
                cursor: pointer;
                z-index: 9999;
                display: block;
                visibility: visible;
                opacity: 1;
            `;
            button.onclick = function(e) {
                e.preventDefault();
                window.location.href = './react-bits-simple.html';
            };
            document.body.appendChild(button);
            console.log('✅ React Bits button created');
        }
        
        // Remove any Explorer modifications that might hide content
        const explorerContainers = document.querySelectorAll('[class*="Explorer"], [class*="explorer"], .sidebar');
        explorerContainers.forEach(container => {
            if (container.style.overflow === 'auto' || container.style.overflowY === 'auto') {
                container.style.overflow = 'visible';
                container.style.overflowY = 'visible';
                console.log('✅ Removed scrolling from:', container);
            }
        });
    }
    
    // Run immediately and after delays
    restoreButtons();
    setTimeout(restoreButtons, 500);
    setTimeout(restoreButtons, 1000);
    setTimeout(restoreButtons, 2000);
    
    console.log('🔧 Restore Buttons: Script loaded');
})();