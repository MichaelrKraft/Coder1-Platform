// Fix Panel Sizes - Ensure right panel is 20% and middle section is wider

(function() {
    'use strict';
    
    function fixPanelSizes() {
        console.log('🔧 Fixing panel sizes...');
        
        // Method 1: Target allotment panels
        const allotmentViews = document.querySelectorAll('.allotment-module_splitViewView__MGZ6O');
        if (allotmentViews.length >= 3) {
            // Assuming: [0] = file explorer, [1] = editor/terminal, [2] = preview
            const fileExplorer = allotmentViews[0];
            const editor = allotmentViews[1];
            const preview = allotmentViews[2];
            
            if (preview) {
                preview.style.width = '20%';
                preview.style.maxWidth = '20%';
                preview.style.flex = '0 0 20%';
                console.log('✅ Set preview panel to 20%');
            }
            
            if (editor) {
                editor.style.flex = '1 1 auto';
                editor.style.minWidth = '60%';
                console.log('✅ Set editor panel to expand');
            }
        }
        
        // Method 2: Target Pane elements
        const panes = document.querySelectorAll('.Pane');
        if (panes.length >= 3) {
            const lastPane = panes[panes.length - 1];
            const middlePane = panes[1];
            
            if (lastPane) {
                lastPane.style.width = '20%';
                lastPane.style.maxWidth = '20%';
                lastPane.style.flex = '0 0 20%';
            }
            
            if (middlePane) {
                middlePane.style.flex = '1 1 auto';
                middlePane.style.minWidth = '60%';
            }
        }
        
        // Method 3: Find preview panel by content (iframe)
        const iframes = document.querySelectorAll('iframe');
        iframes.forEach(iframe => {
            let container = iframe.parentElement;
            while (container && container !== document.body) {
                if (container.classList.contains('allotment-module_splitViewView__MGZ6O') ||
                    container.classList.contains('Pane') ||
                    container.style.width) {
                    container.style.width = '20%';
                    container.style.maxWidth = '20%';
                    container.style.flex = '0 0 20%';
                    console.log('✅ Found and resized preview container');
                    break;
                }
                container = container.parentElement;
            }
        });
        
        // Method 4: Target by position in split container
        const splitContainers = document.querySelectorAll('.allotment-module_splitViewContainer__rQnVa');
        splitContainers.forEach(container => {
            const children = container.children;
            if (children.length >= 3) {
                const lastChild = children[children.length - 1];
                const middleChild = children[1];
                
                if (lastChild) {
                    lastChild.style.width = '20%';
                    lastChild.style.maxWidth = '20%';
                    lastChild.style.flex = '0 0 20%';
                }
                
                if (middleChild) {
                    middleChild.style.flex = '1 1 auto';
                    middleChild.style.minWidth = '60%';
                }
            }
        });
        
        // Method 5: Override any elements with specific width styles
        const elementsWithWidth = document.querySelectorAll('[style*="width"]');
        elementsWithWidth.forEach(el => {
            const style = el.getAttribute('style');
            if (style && (style.includes('width: 50%') || style.includes('width:50%') || 
                         style.includes('width: 33') || style.includes('width:33'))) {
                // Check if this might be the preview panel
                if (el.querySelector('iframe') || 
                    el.classList.toString().toLowerCase().includes('preview') ||
                    el.classList.toString().toLowerCase().includes('output')) {
                    el.style.width = '20%';
                    el.style.maxWidth = '20%';
                    el.style.flex = '0 0 20%';
                    console.log('✅ Resized element with inline width style');
                }
            }
        });
    }
    
    // Run on page load
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', fixPanelSizes);
    } else {
        fixPanelSizes();
    }
    
    // Run after a delay to catch dynamically loaded content
    setTimeout(fixPanelSizes, 1000);
    setTimeout(fixPanelSizes, 2000);
    setTimeout(fixPanelSizes, 3000);
    
    // Watch for changes
    const observer = new MutationObserver(function(mutations) {
        let shouldFix = false;
        mutations.forEach(mutation => {
            if (mutation.type === 'childList' || 
                (mutation.type === 'attributes' && mutation.attributeName === 'style')) {
                shouldFix = true;
            }
        });
        if (shouldFix) {
            fixPanelSizes();
        }
    });
    
    // Start observing
    observer.observe(document.body, {
        childList: true,
        subtree: true,
        attributes: true,
        attributeFilter: ['style']
    });
    
    // Also listen for resize events
    let resizeTimeout;
    window.addEventListener('resize', function() {
        clearTimeout(resizeTimeout);
        resizeTimeout = setTimeout(fixPanelSizes, 100);
    });
    
    console.log('🚀 Panel size fixer initialized');
})();