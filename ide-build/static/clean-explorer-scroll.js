// Clean Explorer Scroll - Minimal changes to preserve layout
(function() {
    console.log('🧹 Clean Explorer Scroll: Starting minimal fix...');
    
    function setupCleanScroll() {
        // Find the Explorer sidebar
        let explorerContainer = null;
        
        // Look for the sidebar containing PROJECT FILES
        const allElements = document.querySelectorAll('div');
        for (const div of allElements) {
            // Check for sidebar characteristics
            const rect = div.getBoundingClientRect();
            const hasProjectFiles = div.textContent.includes('PROJECT FILES');
            const isSidebarWidth = rect.width > 200 && rect.width < 400;
            const isFullHeight = rect.height > window.innerHeight * 0.8;
            const isLeftAligned = rect.left < 100;
            
            if (hasProjectFiles && isSidebarWidth && isFullHeight && isLeftAligned) {
                explorerContainer = div;
                console.log('✅ Found Explorer sidebar');
                break;
            }
        }
        
        if (explorerContainer) {
            // Apply minimal scrolling styles
            explorerContainer.style.overflowY = 'auto';
            explorerContainer.style.overflowX = 'hidden';
            
            // Don't change the height - let it use its natural height
            // This preserves the existing layout
            
            console.log('✅ Applied overflow styles to Explorer');
            
            // Remove any forced positioning from buttons
            const settingsSection = document.querySelector('.settings-section');
            if (settingsSection && settingsSection.style.position === 'fixed') {
                settingsSection.style.position = '';
                settingsSection.style.bottom = '';
                settingsSection.style.left = '';
                settingsSection.style.zIndex = '';
                console.log('✅ Reset settings section positioning');
            }
            
            const reactBitsButton = document.getElementById('react-bits-button');
            if (reactBitsButton && reactBitsButton.style.position === 'fixed') {
                reactBitsButton.style.position = '';
                reactBitsButton.style.bottom = '';
                reactBitsButton.style.left = '';
                reactBitsButton.style.zIndex = '';
                console.log('✅ Reset React Bits button positioning');
            }
            
            // Add subtle scrollbar styling
            const styleId = 'clean-scrollbar-styles';
            if (!document.getElementById(styleId)) {
                const style = document.createElement('style');
                style.id = styleId;
                style.textContent = `
                    /* Subtle scrollbar for Explorer */
                    div::-webkit-scrollbar {
                        width: 6px;
                    }
                    
                    div::-webkit-scrollbar-track {
                        background: transparent;
                    }
                    
                    div::-webkit-scrollbar-thumb {
                        background: rgba(255, 255, 255, 0.2);
                        border-radius: 3px;
                    }
                    
                    div::-webkit-scrollbar-thumb:hover {
                        background: rgba(255, 255, 255, 0.3);
                    }
                `;
                document.head.appendChild(style);
            }
            
            console.log('✅ Clean scroll setup complete');
        } else {
            console.log('⚠️ Could not find Explorer sidebar');
        }
    }
    
    // Run after a delay to let the page settle
    setTimeout(setupCleanScroll, 1000);
    setTimeout(setupCleanScroll, 2000);
    
    console.log('🧹 Clean Explorer Scroll: Script loaded');
})();