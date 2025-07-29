// Explorer Scrollable - Add scrollbar to Explorer panel
(function() {
    console.log('📜 Explorer Scrollable: Initializing...');
    
    function makeExplorerScrollable() {
        // Find the Explorer container - try multiple methods
        let explorerContainer = null;
        
        // Method 1: Look for element containing PROJECT FILES
        const allElements = document.querySelectorAll('*');
        for (const el of allElements) {
            if (el.textContent.includes('PROJECT FILES') && 
                el.textContent.includes('SETTINGS') &&
                el.offsetWidth < 400 && // Sidebar width
                el.offsetWidth > 200) {
                
                // Check if this is the container, not a child
                const parent = el.parentElement;
                if (!parent || parent.offsetWidth > 400) {
                    explorerContainer = el;
                    break;
                }
            }
        }
        
        // Method 2: Look for Explorer class
        if (!explorerContainer) {
            const candidates = [
                document.querySelector('.Explorer'),
                document.querySelector('[class*="Explorer"]'),
                document.querySelector('[class*="explorer"]'),
                document.querySelector('.sidebar'),
                document.querySelector('[class*="sidebar"]')
            ].filter(Boolean);
            
            for (const candidate of candidates) {
                if (candidate.textContent.includes('PROJECT FILES')) {
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
            
            // Find and move settings buttons into Explorer if needed
            const settingsSection = document.querySelector('.settings-section');
            if (settingsSection) {
                // Move settings into Explorer container if it's outside
                if (!explorerContainer.contains(settingsSection)) {
                    explorerContainer.appendChild(settingsSection);
                }
                settingsSection.style.position = 'relative';
                settingsSection.style.bottom = 'auto';
                settingsSection.style.left = 'auto';
                settingsSection.style.marginTop = '40px';
                settingsSection.style.marginBottom = '20px';
            }
            
            // Find and move React Bits button into Explorer if needed
            const reactBitsButton = document.getElementById('react-bits-button');
            if (reactBitsButton) {
                // Move button into Explorer container if it's outside
                if (!explorerContainer.contains(reactBitsButton)) {
                    explorerContainer.appendChild(reactBitsButton);
                }
                reactBitsButton.style.position = 'relative';
                reactBitsButton.style.bottom = 'auto';
                reactBitsButton.style.left = 'auto';
                reactBitsButton.style.marginTop = '20px';
                reactBitsButton.style.marginBottom = '20px';
                reactBitsButton.style.marginLeft = '20px';
                reactBitsButton.style.display = 'block';
                reactBitsButton.style.visibility = 'visible';
            }
            
            console.log('✅ Explorer is now scrollable with all buttons in natural flow');
        } else {
            console.log('⚠️ Could not find Explorer container, will retry...');
        }
    }
    
    // Try multiple times
    setTimeout(makeExplorerScrollable, 100);
    setTimeout(makeExplorerScrollable, 500);
    setTimeout(makeExplorerScrollable, 1000);
    setTimeout(makeExplorerScrollable, 2000);
    
    // Also run on DOM ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', makeExplorerScrollable);
    } else {
        makeExplorerScrollable();
    }
    
    // Debug function to check button status
    function debugButtons() {
        const settingsSection = document.querySelector('.settings-section');
        const reactBitsButton = document.getElementById('react-bits-button');
        
        console.log('🔍 Debug - Settings section:', settingsSection);
        console.log('🔍 Debug - React Bits button:', reactBitsButton);
        
        if (settingsSection) {
            console.log('Settings section parent:', settingsSection.parentElement);
            console.log('Settings section styles:', {
                position: settingsSection.style.position,
                display: window.getComputedStyle(settingsSection).display,
                visibility: window.getComputedStyle(settingsSection).visibility
            });
        }
        
        if (reactBitsButton) {
            console.log('React Bits button parent:', reactBitsButton.parentElement);
            console.log('React Bits button styles:', {
                position: reactBitsButton.style.position,
                display: window.getComputedStyle(reactBitsButton).display,
                visibility: window.getComputedStyle(reactBitsButton).visibility
            });
        }
    }
    
    // Run debug after a delay
    setTimeout(debugButtons, 3000);
    
    console.log('📜 Explorer Scrollable: Script loaded');
})();