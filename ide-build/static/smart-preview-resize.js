// Smart Preview Resize - Find and resize preview panel to 20%
(function() {
    'use strict';
    
    console.log('🎯 Smart Preview Resize - Starting...');
    
    function findAndResizePreview() {
        // Method 1: Find by Preview text in header
        const allElements = document.querySelectorAll('*');
        let previewPanel = null;
        
        allElements.forEach(el => {
            const text = el.textContent || '';
            // Look for "Preview" text in small elements (likely headers)
            if (text.trim() === 'Preview' && el.children.length === 0) {
                // Walk up to find the panel container
                let parent = el.parentElement;
                while (parent && parent !== document.body) {
                    const rect = parent.getBoundingClientRect();
                    // If this is a large container on the right side
                    if (rect.width > 200 && rect.height > 400 && rect.left > window.innerWidth * 0.5) {
                        previewPanel = parent;
                        break;
                    }
                    parent = parent.parentElement;
                }
            }
        });
        
        if (previewPanel) {
            console.log('✅ Found preview panel by text');
            applyResize(previewPanel);
        }
        
        // Method 2: Find the rightmost large panel
        const panels = [];
        document.querySelectorAll('div').forEach(div => {
            const rect = div.getBoundingClientRect();
            // Large panels only
            if (rect.width > 200 && rect.height > 400) {
                panels.push({ element: div, rect: rect });
            }
        });
        
        // Sort by left position
        panels.sort((a, b) => b.rect.left - a.rect.left);
        
        if (panels.length > 0 && panels[0].rect.left > window.innerWidth * 0.6) {
            console.log('✅ Found rightmost panel');
            applyResize(panels[0].element);
        }
        
        // Method 3: Find panels in a flex container
        const flexContainers = document.querySelectorAll('[style*="display: flex"], [style*="display:flex"]');
        flexContainers.forEach(container => {
            const children = Array.from(container.children);
            if (children.length >= 3) {
                // Assume last child is preview
                const lastChild = children[children.length - 1];
                const rect = lastChild.getBoundingClientRect();
                if (rect.width > 200 && rect.height > 400) {
                    console.log('✅ Found preview as last flex child');
                    applyResize(lastChild);
                }
            }
        });
    }
    
    function applyResize(element) {
        // Apply multiple style properties to ensure it sticks
        element.style.setProperty('width', '20%', 'important');
        element.style.setProperty('max-width', '20%', 'important');
        element.style.setProperty('flex', '0 0 20%', 'important');
        element.style.setProperty('flex-basis', '20%', 'important');
        element.style.setProperty('flex-grow', '0', 'important');
        element.style.setProperty('flex-shrink', '0', 'important');
        
        // Also try to adjust the previous sibling (usually the editor)
        if (element.previousElementSibling) {
            const editor = element.previousElementSibling;
            editor.style.setProperty('flex', '1 1 auto', 'important');
            editor.style.setProperty('flex-grow', '1', 'important');
            editor.style.setProperty('width', 'auto', 'important');
            editor.style.setProperty('min-width', '50%', 'important');
        }
        
        // Look for splitter/resizer and adjust
        const prevElement = element.previousElementSibling;
        if (prevElement && (prevElement.className.includes('sash') || 
            prevElement.className.includes('split') || 
            prevElement.className.includes('resize'))) {
            prevElement.style.left = '80%';
        }
    }
    
    // Run multiple times to catch dynamic content
    const timings = [100, 500, 1000, 2000, 3000];
    timings.forEach(delay => {
        setTimeout(findAndResizePreview, delay);
    });
    
    // Watch for changes
    const observer = new MutationObserver(() => {
        findAndResizePreview();
    });
    
    // Start observing when body is available
    const startObserving = setInterval(() => {
        if (document.body) {
            clearInterval(startObserving);
            observer.observe(document.body, {
                childList: true,
                subtree: true,
                attributes: true,
                attributeFilter: ['style', 'class']
            });
        }
    }, 100);
    
    // Expose for manual triggering
    window.resizePreviewPanel = findAndResizePreview;
    console.log('💡 You can manually resize by typing: resizePreviewPanel()');
    
})();