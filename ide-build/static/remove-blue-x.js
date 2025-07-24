// Aggressive Blue X Removal Script
console.log('🎯 Blue X Removal Script Active');

// Function to check if an element is a blue X
function isBlueX(element) {
    if (!element) return false;
    
    const text = (element.textContent || '').trim();
    const isX = ['×', 'X', 'x', '✕', '✖', '⨯'].includes(text);
    
    if (!isX) return false;
    
    // Check computed styles
    const computed = window.getComputedStyle(element);
    const color = computed.color || '';
    const bgColor = computed.backgroundColor || '';
    
    // Check if it's blue
    const isBlue = 
        color.includes('blue') ||
        color.includes('rgb(0') && color.includes('255') ||
        color.includes('rgba(0') && color.includes('255') ||
        bgColor.includes('blue') ||
        bgColor.includes('rgb(0') && bgColor.includes('255') ||
        bgColor.includes('rgba(0') && bgColor.includes('255');
    
    // Check if it's positioned like an overlay
    const isOverlay = 
        computed.position === 'absolute' || 
        computed.position === 'fixed' ||
        parseInt(computed.zIndex) > 1000;
    
    // Log what we find
    if (isX && (isBlue || isOverlay)) {
        console.log('🔍 Potential blue X found:', {
            element,
            text,
            color: computed.color,
            bgColor: computed.backgroundColor,
            position: computed.position,
            zIndex: computed.zIndex,
            opacity: computed.opacity,
            display: computed.display,
            parent: element.parentElement
        });
    }
    
    return isX && (isBlue || (isOverlay && color !== 'black' && color !== 'rgb(0, 0, 0)'));
}

// Function to remove blue X elements
function removeBlueX() {
    console.log('🔄 Scanning for blue X elements...');
    
    // Get all elements
    const allElements = document.querySelectorAll('*');
    let removedCount = 0;
    
    allElements.forEach(element => {
        try {
            // Skip SuperClaude elements
            if (element.classList.contains('superclaude-btn') ||
                element.closest('.superclaude-btn') ||
                element.closest('[class*="superclaude"]')) {
                return;
            }
            
            if (isBlueX(element)) {
                console.log('❌ Removing blue X:', element);
                
                // Hide the element completely
                element.style.cssText = 'display: none !important; visibility: hidden !important; opacity: 0 !important; pointer-events: none !important; width: 0 !important; height: 0 !important; position: absolute !important; left: -9999px !important;';
                
                // Try to remove from DOM
                try {
                    element.remove();
                } catch (e) {
                    // If we can't remove, at least it's hidden
                }
                
                removedCount++;
            }
        } catch (error) {
            // Ignore errors
        }
    });
    
    // Also check for any overlay containers
    const overlays = document.querySelectorAll('[style*="position: absolute"], [style*="position: fixed"]');
    overlays.forEach(overlay => {
        try {
            const innerHTML = overlay.innerHTML || '';
            const hasX = ['×', 'X', 'x', '✕', '✖', '⨯'].some(x => innerHTML.includes(x));
            const style = overlay.getAttribute('style') || '';
            const hasBlue = style.includes('blue') || style.includes('rgba(0') || style.includes('rgb(0');
            
            if (hasX && hasBlue && !overlay.closest('.superclaude-btn')) {
                console.log('❌ Removing blue X overlay container:', overlay);
                overlay.style.cssText = 'display: none !important; visibility: hidden !important;';
                try {
                    overlay.remove();
                } catch (e) {}
                removedCount++;
            }
        } catch (error) {
            // Ignore errors
        }
    });
    
    if (removedCount > 0) {
        console.log(`✅ Removed ${removedCount} blue X element(s)`);
    }
}

// Run immediately
removeBlueX();

// Run after DOM content loaded
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', removeBlueX);
} else {
    setTimeout(removeBlueX, 100);
}

// Run periodically to catch dynamically added elements
let runCount = 0;
const interval = setInterval(() => {
    removeBlueX();
    runCount++;
    
    // Stop after 20 runs (10 seconds)
    if (runCount > 20) {
        clearInterval(interval);
        console.log('🛑 Blue X removal monitoring stopped');
    }
}, 500);

// Watch for new elements being added
const blueXObserver = new MutationObserver((mutations) => {
    mutations.forEach(mutation => {
        // Check added nodes
        mutation.addedNodes.forEach(node => {
            if (node.nodeType === 1) { // Element node
                if (isBlueX(node)) {
                    console.log('❌ Removing newly added blue X:', node);
                    node.style.cssText = 'display: none !important; visibility: hidden !important;';
                    try {
                        node.remove();
                    } catch (e) {}
                }
                
                // Check children
                if (node.querySelectorAll) {
                    const children = node.querySelectorAll('*');
                    children.forEach(child => {
                        if (isBlueX(child)) {
                            console.log('❌ Removing blue X child:', child);
                            child.style.cssText = 'display: none !important; visibility: hidden !important;';
                            try {
                                child.remove();
                            } catch (e) {}
                        }
                    });
                }
            }
        });
        
        // Also check if attributes changed (style changes)
        if (mutation.type === 'attributes' && mutation.target.nodeType === 1) {
            if (isBlueX(mutation.target)) {
                console.log('❌ Removing blue X after attribute change:', mutation.target);
                mutation.target.style.cssText = 'display: none !important; visibility: hidden !important;';
                try {
                    mutation.target.remove();
                } catch (e) {}
            }
        }
    });
});

// Start observing when body is available
const startBlueXObserver = () => {
    if (document.body) {
        blueXObserver.observe(document.body, {
            childList: true,
            subtree: true,
            attributes: true,
            attributeFilter: ['style', 'class']
        });
        console.log('👁️ Blue X observer started');
    } else {
        setTimeout(startBlueXObserver, 50);
    }
};

startBlueXObserver();

// Also add CSS rules dynamically to catch any blue X
const styleElement = document.createElement('style');
styleElement.textContent = `
    /* Hide any element that might be a blue X */
    [style*="color: blue"]:empty,
    [style*="color:#0000ff"]:empty,
    [style*="color:#00f"]:empty,
    [style*="rgb(0"][style*="255)"]:empty,
    [style*="rgba(0"][style*="255"]:empty {
        display: none !important;
        visibility: hidden !important;
        opacity: 0 !important;
        pointer-events: none !important;
    }
    
    /* Hide positioned blue elements that contain X */
    [style*="position: absolute"][style*="blue"],
    [style*="position: fixed"][style*="blue"] {
        display: none !important;
        visibility: hidden !important;
    }
    
    /* Specific targeting for overlays */
    body > div[style*="position: absolute"],
    body > div[style*="position: fixed"],
    #root > div[style*="position: absolute"],
    #root > div[style*="position: fixed"] {
        /* Will be checked by JavaScript */
    }
`;
document.head.appendChild(styleElement);