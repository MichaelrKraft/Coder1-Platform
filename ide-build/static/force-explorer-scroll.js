// Force Explorer Scroll - Aggressive approach to ensure scrollbar works
(function() {
    console.log('🚀 Force Explorer Scroll: Starting aggressive fix...');
    
    function forceExplorerScroll() {
        // Method 1: Find by text content
        let explorerContainer = null;
        const allElements = document.querySelectorAll('*');
        
        for (const el of allElements) {
            // Look for the sidebar containing our specific content
            const hasProjectFiles = el.textContent.includes('PROJECT FILES');
            const hasSettings = el.textContent.includes('SETTINGS');
            const hasCorrectWidth = el.offsetWidth > 200 && el.offsetWidth < 400;
            const isTall = el.offsetHeight > 300;
            
            if (hasProjectFiles && hasSettings && hasCorrectWidth && isTall) {
                // Check this isn't a child element
                let isValidContainer = true;
                let parent = el.parentElement;
                while (parent && parent !== document.body) {
                    if (parent.offsetWidth < 400 && parent.textContent.includes('PROJECT FILES')) {
                        isValidContainer = false;
                        break;
                    }
                    parent = parent.parentElement;
                }
                
                if (isValidContainer) {
                    explorerContainer = el;
                    console.log('✅ Found Explorer by content analysis');
                    break;
                }
            }
        }
        
        // Method 2: Find by structure
        if (!explorerContainer) {
            // Look for the first child of root that's narrow
            const root = document.getElementById('root');
            if (root) {
                const firstLevelDivs = root.querySelectorAll(':scope > div > div');
                for (const div of firstLevelDivs) {
                    if (div.offsetWidth < 400 && div.offsetWidth > 200 && 
                        div.textContent.includes('PROJECT FILES')) {
                        explorerContainer = div;
                        console.log('✅ Found Explorer by structure');
                        break;
                    }
                }
            }
        }
        
        if (explorerContainer) {
            console.log('📏 Explorer found with dimensions:', {
                width: explorerContainer.offsetWidth,
                height: explorerContainer.offsetHeight,
                scrollHeight: explorerContainer.scrollHeight
            });
            
            // Force specific height to trigger scrolling
            explorerContainer.style.height = 'calc(100vh - 40px)';
            explorerContainer.style.maxHeight = 'calc(100vh - 40px)';
            explorerContainer.style.overflowY = 'auto';
            explorerContainer.style.overflowX = 'hidden';
            explorerContainer.style.position = 'relative';
            
            // Add padding at bottom for content
            explorerContainer.style.paddingBottom = '100px';
            
            // Find all buttons and sections that should be inside
            const settingsSection = document.querySelector('.settings-section');
            const reactBitsButton = document.getElementById('react-bits-button');
            
            // Handle settings section
            if (settingsSection) {
                if (!explorerContainer.contains(settingsSection)) {
                    explorerContainer.appendChild(settingsSection);
                    console.log('✅ Moved settings into Explorer');
                }
                
                // Force relative positioning
                settingsSection.style.cssText = `
                    position: relative !important;
                    margin-top: 40px !important;
                    margin-bottom: 20px !important;
                    margin-left: 20px !important;
                    display: flex !important;
                    flex-direction: column !important;
                    bottom: auto !important;
                    left: auto !important;
                    z-index: auto !important;
                `;
            }
            
            // Handle React Bits button
            if (reactBitsButton) {
                if (!explorerContainer.contains(reactBitsButton)) {
                    explorerContainer.appendChild(reactBitsButton);
                    console.log('✅ Moved React Bits button into Explorer');
                }
                
                // Force relative positioning
                reactBitsButton.style.cssText = `
                    position: relative !important;
                    margin: 20px !important;
                    padding: 8px 16px !important;
                    background: linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%) !important;
                    color: white !important;
                    border: none !important;
                    border-radius: 6px !important;
                    font-size: 14px !important;
                    font-weight: 500 !important;
                    cursor: pointer !important;
                    display: block !important;
                    bottom: auto !important;
                    left: auto !important;
                    z-index: auto !important;
                `;
            } else {
                // Create React Bits button if missing
                const button = document.createElement('button');
                button.id = 'react-bits-button';
                button.innerHTML = '🎨 React Bits';
                button.style.cssText = `
                    position: relative !important;
                    margin: 20px !important;
                    padding: 8px 16px !important;
                    background: linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%) !important;
                    color: white !important;
                    border: none !important;
                    border-radius: 6px !important;
                    font-size: 14px !important;
                    font-weight: 500 !important;
                    cursor: pointer !important;
                    display: block !important;
                `;
                button.onclick = function(e) {
                    e.preventDefault();
                    window.location.href = './react-bits-dual-preview.html';
                };
                explorerContainer.appendChild(button);
                console.log('✅ Created and added React Bits button');
            }
            
            // Force scrollbar styles
            const styleId = 'force-scrollbar-styles';
            if (!document.getElementById(styleId)) {
                const style = document.createElement('style');
                style.id = styleId;
                style.textContent = `
                    /* Force scrollbar visibility */
                    *::-webkit-scrollbar {
                        width: 10px !important;
                        height: 10px !important;
                    }
                    
                    *::-webkit-scrollbar-track {
                        background: rgba(255, 255, 255, 0.1) !important;
                        border-radius: 5px !important;
                    }
                    
                    *::-webkit-scrollbar-thumb {
                        background: rgba(139, 92, 246, 0.5) !important;
                        border-radius: 5px !important;
                    }
                    
                    *::-webkit-scrollbar-thumb:hover {
                        background: rgba(139, 92, 246, 0.7) !important;
                    }
                    
                    /* Ensure Explorer container is scrollable */
                    [class*="explorer"], [class*="Explorer"], .sidebar {
                        overflow-y: auto !important;
                    }
                    
                    /* Fix button positioning */
                    .settings-section {
                        position: relative !important;
                        margin-top: 40px !important;
                    }
                    
                    #react-bits-button {
                        position: relative !important;
                        margin: 20px !important;
                    }
                `;
                document.head.appendChild(style);
            }
            
            // Force a reflow to ensure styles are applied
            void explorerContainer.offsetHeight;
            
            // Check if scrolling is needed
            setTimeout(() => {
                const needsScroll = explorerContainer.scrollHeight > explorerContainer.clientHeight;
                console.log('📊 Scroll check:', {
                    scrollHeight: explorerContainer.scrollHeight,
                    clientHeight: explorerContainer.clientHeight,
                    needsScroll: needsScroll
                });
                
                if (!needsScroll) {
                    console.log('⚠️ Content not tall enough for scrolling, adding spacer');
                    const spacer = document.createElement('div');
                    spacer.style.height = '200px';
                    explorerContainer.appendChild(spacer);
                }
            }, 100);
            
            console.log('✅ Force Explorer scroll setup complete');
        } else {
            console.log('❌ Could not find Explorer container, retrying...');
        }
    }
    
    // Run aggressively
    forceExplorerScroll();
    setTimeout(forceExplorerScroll, 100);
    setTimeout(forceExplorerScroll, 300);
    setTimeout(forceExplorerScroll, 500);
    setTimeout(forceExplorerScroll, 1000);
    setTimeout(forceExplorerScroll, 2000);
    
    // Monitor for changes
    const observer = new MutationObserver(() => {
        const hasScroll = document.querySelector('[style*="overflow-y: auto"]');
        if (!hasScroll) {
            console.log('🔄 Scrollbar removed, reapplying...');
            forceExplorerScroll();
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
    
    console.log('🚀 Force Explorer Scroll: Script loaded');
})();