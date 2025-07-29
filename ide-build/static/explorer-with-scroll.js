// Explorer with Scroll - Adds scrollbar AND keeps buttons visible
(function() {
    console.log('📜 Explorer with Scroll: Initializing...');
    
    function setupExplorerWithScroll() {
        // First, ensure buttons are visible with fixed positioning
        const settingsSection = document.querySelector('.settings-section');
        if (settingsSection) {
            settingsSection.style.position = 'fixed';
            settingsSection.style.bottom = '100px';
            settingsSection.style.left = '20px';
            settingsSection.style.zIndex = '9999';
            settingsSection.style.display = 'flex';
            settingsSection.style.visibility = 'visible';
            settingsSection.style.opacity = '1';
            console.log('✅ Settings section positioned');
        }
        
        // Ensure React Bits button exists and is visible
        let reactBitsButton = document.getElementById('react-bits-button');
        if (!reactBitsButton) {
            // Create it if missing
            reactBitsButton = document.createElement('button');
            reactBitsButton.id = 'react-bits-button';
            reactBitsButton.innerHTML = '🎨 React Bits';
            reactBitsButton.onclick = function(e) {
                e.preventDefault();
                window.location.href = './react-bits-simple.html';
            };
            document.body.appendChild(reactBitsButton);
        }
        
        // Style the React Bits button
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
        console.log('✅ React Bits button positioned');
        
        // Now find and make the Explorer scrollable
        let explorerContainer = null;
        
        // Try to find the Explorer container
        const allDivs = document.querySelectorAll('div');
        for (const div of allDivs) {
            // Look for the container with PROJECT FILES
            if (div.textContent.includes('PROJECT FILES') && 
                div.offsetWidth > 200 && 
                div.offsetWidth < 400) {
                
                // Check if this is the main container (not a child)
                const hasProjectFiles = Array.from(div.children).some(child => 
                    child.textContent.includes('PROJECT FILES')
                );
                
                if (hasProjectFiles || div.querySelector('[class*="project"]')) {
                    explorerContainer = div;
                    break;
                }
            }
        }
        
        // Alternative: Look by class
        if (!explorerContainer) {
            const candidates = [
                document.querySelector('.Explorer'),
                document.querySelector('[class*="Explorer"]'),
                document.querySelector('[class*="explorer"]'),
                document.querySelector('.sidebar'),
                document.querySelector('[class*="sidebar"]'),
                document.querySelector('#root > div > div:first-child')
            ].filter(Boolean);
            
            for (const candidate of candidates) {
                if (candidate.offsetWidth < 400 && candidate.textContent.includes('PROJECT FILES')) {
                    explorerContainer = candidate;
                    break;
                }
            }
        }
        
        if (explorerContainer) {
            console.log('✅ Found Explorer container:', explorerContainer);
            
            // Make it scrollable
            explorerContainer.style.overflowY = 'auto';
            explorerContainer.style.overflowX = 'hidden';
            explorerContainer.style.height = '100vh';
            explorerContainer.style.maxHeight = '100vh';
            explorerContainer.style.paddingBottom = '300px'; // Space for fixed buttons
            
            // Add nice scrollbar styling
            const styleId = 'explorer-scrollbar-inline-styles';
            if (!document.getElementById(styleId)) {
                const style = document.createElement('style');
                style.id = styleId;
                style.textContent = `
                    /* Scrollbar styles */
                    div::-webkit-scrollbar {
                        width: 8px;
                    }
                    div::-webkit-scrollbar-track {
                        background: rgba(255, 255, 255, 0.05);
                    }
                    div::-webkit-scrollbar-thumb {
                        background: rgba(255, 255, 255, 0.2);
                        border-radius: 4px;
                    }
                    div::-webkit-scrollbar-thumb:hover {
                        background: rgba(255, 255, 255, 0.3);
                    }
                `;
                document.head.appendChild(style);
            }
            
            console.log('✅ Explorer is now scrollable with buttons visible');
        } else {
            console.log('⚠️ Could not find Explorer container');
        }
    }
    
    // Run multiple times to ensure it works
    setupExplorerWithScroll();
    setTimeout(setupExplorerWithScroll, 500);
    setTimeout(setupExplorerWithScroll, 1000);
    setTimeout(setupExplorerWithScroll, 2000);
    
    // Also run on DOM ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', setupExplorerWithScroll);
    }
    
    console.log('📜 Explorer with Scroll: Script loaded');
})();