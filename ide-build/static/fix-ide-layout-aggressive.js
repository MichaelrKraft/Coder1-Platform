// Aggressive IDE Layout Fix - Force 80/20 split
(function() {
    'use strict';
    
    console.log('🔧 Aggressive IDE Layout Fix v1 - Starting...');
    
    function forceIDELayout() {
        console.log('🎯 Forcing IDE layout to 80/20 split...');
        
        // Method 1: Find the main container and its children
        const root = document.getElementById('root');
        if (!root) return;
        
        // Look for the main IDE container (usually the first child of root)
        const mainContainer = root.firstElementChild;
        if (!mainContainer) return;
        
        // Find all direct children that could be panels
        const panels = Array.from(mainContainer.querySelectorAll(':scope > div > div > div'));
        console.log(`Found ${panels.length} potential panels`);
        
        // Method 2: Look for the Allotment split view containers
        const allotmentPanes = document.querySelectorAll('.allotment-module_splitViewView__MGZ6O > div');
        console.log(`Found ${allotmentPanes.length} Allotment panes`);
        
        if (allotmentPanes.length >= 3) {
            // Typically: [0] = file explorer, [1] = editor/terminal, [2] = preview
            const fileExplorer = allotmentPanes[0];
            const editorPanel = allotmentPanes[1];
            const previewPanel = allotmentPanes[2];
            
            if (fileExplorer) {
                fileExplorer.style.width = '20%';
                fileExplorer.style.minWidth = '200px';
                fileExplorer.style.maxWidth = '300px';
                fileExplorer.style.flex = '0 0 20%';
            }
            
            if (editorPanel) {
                editorPanel.style.width = '60%';
                editorPanel.style.flex = '1 1 60%';
                editorPanel.style.minWidth = '500px';
            }
            
            if (previewPanel) {
                console.log('🎯 Setting preview panel to 20%');
                previewPanel.style.width = '20%';
                previewPanel.style.maxWidth = '20%';
                previewPanel.style.minWidth = '200px';
                previewPanel.style.flex = '0 0 20%';
            }
        }
        
        // Method 3: Target Pane class elements
        const panes = document.querySelectorAll('.Pane');
        console.log(`Found ${panes.length} Pane elements`);
        
        if (panes.length >= 3) {
            // Last pane is usually the preview
            const lastPane = panes[panes.length - 1];
            lastPane.style.width = '20%';
            lastPane.style.maxWidth = '20%';
            lastPane.style.flex = '0 0 20%';
            
            // Middle pane should expand
            if (panes.length > 1) {
                panes[1].style.flex = '1 1 auto';
                panes[1].style.width = 'auto';
            }
        }
        
        // Method 4: Find elements with inline styles and adjust
        const elementsWithWidth = document.querySelectorAll('[style*="width"]');
        elementsWithWidth.forEach(el => {
            const style = el.getAttribute('style');
            if (!style) return;
            
            // Look for elements that are roughly 33% or 50% wide (likely panels)
            const widthMatch = style.match(/width:\s*(\d+)%/);
            if (widthMatch) {
                const width = parseInt(widthMatch[1]);
                const rect = el.getBoundingClientRect();
                
                // If it's a large element (likely a panel)
                if (rect.height > 300) {
                    // Check if it's the rightmost element (preview)
                    if (rect.left > window.innerWidth * 0.6) {
                        console.log('🎯 Found right panel by position, setting to 20%');
                        el.style.width = '20%';
                        el.style.maxWidth = '20%';
                        el.style.flex = '0 0 20%';
                    }
                    // Check if it's the middle element (editor)
                    else if (rect.left > window.innerWidth * 0.2 && rect.left < window.innerWidth * 0.6) {
                        console.log('📝 Found middle panel by position, setting to flexible width');
                        el.style.width = 'auto';
                        el.style.flex = '1 1 auto';
                        el.style.minWidth = '50%';
                    }
                }
            }
        });
        
        // Method 5: Find the preview iframe container
        const iframes = document.querySelectorAll('iframe');
        iframes.forEach(iframe => {
            let container = iframe.parentElement;
            while (container && container !== document.body) {
                const rect = container.getBoundingClientRect();
                // If this container is tall and on the right side
                if (rect.height > 300 && rect.left > window.innerWidth * 0.5) {
                    console.log('🎯 Found preview container via iframe');
                    container.style.width = '20%';
                    container.style.maxWidth = '20%';
                    container.style.flex = '0 0 20%';
                    
                    // Also check for the splitter before this container
                    const prevSibling = container.previousElementSibling;
                    if (prevSibling && prevSibling.className.includes('sash')) {
                        // Adjust the splitter position
                        prevSibling.style.left = '80%';
                    }
                    break;
                }
                container = container.parentElement;
            }
        });
        
        // Method 6: Use MutationObserver to catch dynamically added panels
        const observer = new MutationObserver((mutations) => {
            mutations.forEach(mutation => {
                mutation.addedNodes.forEach(node => {
                    if (node.nodeType === 1) { // Element node
                        // Check if it's a panel
                        const className = node.className || '';
                        if (className.includes('Pane') || className.includes('allotment')) {
                            setTimeout(() => forceIDELayout(), 100);
                        }
                    }
                });
            });
        });
        
        // Start observing
        observer.observe(document.body, {
            childList: true,
            subtree: true
        });
        
        console.log('✅ Layout fix applied');
    }
    
    // Run multiple times to catch dynamic content
    function applyLayoutRepeatedly() {
        const timings = [100, 500, 1000, 2000, 3000, 5000];
        timings.forEach(delay => {
            setTimeout(forceIDELayout, delay);
        });
    }
    
    // Start when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', applyLayoutRepeatedly);
    } else {
        applyLayoutRepeatedly();
    }
    
    // Also run on window resize
    let resizeTimeout;
    window.addEventListener('resize', () => {
        clearTimeout(resizeTimeout);
        resizeTimeout = setTimeout(forceIDELayout, 100);
    });
    
    // Expose function globally for manual triggering
    window.forceIDELayout = forceIDELayout;
    
    console.log('💡 You can manually trigger layout fix by typing: forceIDELayout()');
    
})();