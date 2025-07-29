// Explorer Scroll Final - Proper scrollbar implementation
(function() {
    console.log('📜 Explorer Scroll Final: Starting...');
    
    function setupExplorerScroll() {
        // Find the Explorer container more accurately
        let explorerContainer = null;
        
        // Method 1: Look for the sidebar that contains PROJECT FILES
        const allElements = document.querySelectorAll('*');
        for (const el of allElements) {
            // Check if this is the sidebar containing our content
            if (el.offsetWidth > 200 && el.offsetWidth < 400 && // Sidebar width
                el.offsetHeight > 500 && // Should be tall
                el.textContent.includes('PROJECT FILES') &&
                el.textContent.includes('SETTINGS')) {
                
                // Verify this is the outermost container
                const parent = el.parentElement;
                const hasWiderParent = parent && parent.offsetWidth > 500;
                
                if (!hasWiderParent) {
                    explorerContainer = el;
                    console.log('✅ Found Explorer by content and dimensions');
                    break;
                }
            }
        }
        
        // Method 2: Class-based search
        if (!explorerContainer) {
            const candidates = [
                document.querySelector('.Explorer'),
                document.querySelector('.explorer'),
                document.querySelector('[class*="Explorer"]'),
                document.querySelector('[class*="explorer"]'),
                document.querySelector('.sidebar'),
                document.querySelector('[class*="sidebar"]')
            ].filter(Boolean);
            
            for (const candidate of candidates) {
                if (candidate.textContent.includes('PROJECT FILES')) {
                    explorerContainer = candidate;
                    console.log('✅ Found Explorer by class');
                    break;
                }
            }
        }
        
        if (explorerContainer) {
            console.log('📐 Explorer dimensions:', {
                width: explorerContainer.offsetWidth,
                height: explorerContainer.offsetHeight,
                top: explorerContainer.offsetTop
            });
            
            // Calculate proper height
            const topOffset = explorerContainer.offsetTop || 0;
            const properHeight = `calc(100vh - ${topOffset}px)`;
            
            // Apply scrollable styles
            explorerContainer.style.height = properHeight;
            explorerContainer.style.maxHeight = properHeight;
            explorerContainer.style.overflowY = 'auto';
            explorerContainer.style.overflowX = 'hidden';
            explorerContainer.style.position = 'relative';
            
            // Ensure buttons are inside the Explorer
            const settingsSection = document.querySelector('.settings-section');
            const reactBitsButton = document.getElementById('react-bits-button');
            
            if (settingsSection) {
                // Remove fixed positioning
                settingsSection.style.position = 'relative';
                settingsSection.style.bottom = 'auto';
                settingsSection.style.left = 'auto';
                settingsSection.style.marginTop = '40px';
                settingsSection.style.marginBottom = '20px';
                settingsSection.style.marginLeft = '20px';
                settingsSection.style.zIndex = 'auto';
                
                // Move into Explorer if not already there
                if (!explorerContainer.contains(settingsSection)) {
                    explorerContainer.appendChild(settingsSection);
                    console.log('✅ Moved settings into Explorer');
                }
            }
            
            if (reactBitsButton) {
                // Remove fixed positioning
                reactBitsButton.style.position = 'relative';
                reactBitsButton.style.bottom = 'auto';
                reactBitsButton.style.left = 'auto';
                reactBitsButton.style.margin = '20px';
                reactBitsButton.style.zIndex = 'auto';
                reactBitsButton.style.display = 'block';
                
                // Move into Explorer if not already there
                if (!explorerContainer.contains(reactBitsButton)) {
                    explorerContainer.appendChild(reactBitsButton);
                    console.log('✅ Moved React Bits button into Explorer');
                }
            } else {
                // Create React Bits button if missing
                const button = document.createElement('button');
                button.id = 'react-bits-button';
                button.innerHTML = '🎨 React Bits';
                button.style.cssText = `
                    position: relative;
                    margin: 20px;
                    padding: 8px 16px;
                    background: linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%);
                    color: white;
                    border: none;
                    border-radius: 6px;
                    font-size: 14px;
                    font-weight: 500;
                    cursor: pointer;
                    display: block;
                `;
                button.onclick = function(e) {
                    e.preventDefault();
                    window.location.href = './react-bits-dual-preview.html';
                };
                explorerContainer.appendChild(button);
                console.log('✅ Created and added React Bits button');
            }
            
            // Add scrollbar styles
            const styleId = 'explorer-scrollbar-styles-final';
            if (!document.getElementById(styleId)) {
                const style = document.createElement('style');
                style.id = styleId;
                style.textContent = `
                    /* Custom scrollbar for Explorer */
                    .Explorer::-webkit-scrollbar,
                    [class*="Explorer"]::-webkit-scrollbar,
                    [class*="explorer"]::-webkit-scrollbar,
                    .sidebar::-webkit-scrollbar,
                    [class*="sidebar"]::-webkit-scrollbar {
                        width: 8px;
                    }
                    
                    .Explorer::-webkit-scrollbar-track,
                    [class*="Explorer"]::-webkit-scrollbar-track,
                    [class*="explorer"]::-webkit-scrollbar-track,
                    .sidebar::-webkit-scrollbar-track,
                    [class*="sidebar"]::-webkit-scrollbar-track {
                        background: rgba(255, 255, 255, 0.05);
                        border-radius: 4px;
                    }
                    
                    .Explorer::-webkit-scrollbar-thumb,
                    [class*="Explorer"]::-webkit-scrollbar-thumb,
                    [class*="explorer"]::-webkit-scrollbar-thumb,
                    .sidebar::-webkit-scrollbar-thumb,
                    [class*="sidebar"]::-webkit-scrollbar-thumb {
                        background: rgba(255, 255, 255, 0.2);
                        border-radius: 4px;
                    }
                    
                    .Explorer::-webkit-scrollbar-thumb:hover,
                    [class*="Explorer"]::-webkit-scrollbar-thumb:hover,
                    [class*="explorer"]::-webkit-scrollbar-thumb:hover,
                    .sidebar::-webkit-scrollbar-thumb:hover,
                    [class*="sidebar"]::-webkit-scrollbar-thumb:hover {
                        background: rgba(255, 255, 255, 0.3);
                    }
                    
                    /* Ensure proper spacing */
                    .settings-section {
                        margin-top: 40px !important;
                        position: relative !important;
                    }
                    
                    #react-bits-button {
                        margin: 20px !important;
                        position: relative !important;
                    }
                `;
                document.head.appendChild(style);
            }
            
            console.log('✅ Explorer scroll setup complete');
        } else {
            console.log('❌ Could not find Explorer container');
        }
    }
    
    // Run the setup
    setupExplorerScroll();
    setTimeout(setupExplorerScroll, 500);
    setTimeout(setupExplorerScroll, 1000);
    setTimeout(setupExplorerScroll, 2000);
    
    // Run on DOM ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', setupExplorerScroll);
    }
    
    console.log('📜 Explorer Scroll Final: Script loaded');
})();