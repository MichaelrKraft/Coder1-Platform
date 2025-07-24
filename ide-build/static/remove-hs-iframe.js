// Remove HubSpot/Third-party iframe controls
console.log('🎯 Removing third-party iframe controls...');

function removeHsIframe() {
    // Target the specific hs-iframe-controls element
    const hsControls = document.querySelectorAll('.hs-iframe-controls, [class*="hs-iframe"]');
    
    hsControls.forEach(element => {
        console.log('🗑️ Removing hs-iframe-controls:', element);
        element.style.display = 'none !important';
        element.style.visibility = 'hidden !important';
        element.style.opacity = '0 !important';
        element.style.pointerEvents = 'none !important';
        
        try {
            element.remove();
            console.log('✅ Successfully removed hs-iframe-controls');
        } catch (e) {
            console.log('⚠️ Could not remove element, but it is hidden');
        }
    });
    
    // Also target any divs with specific positioning that might be iframe controls
    const suspiciousDivs = document.querySelectorAll('div[style*="position: fixed"], div[style*="position: absolute"]');
    
    suspiciousDivs.forEach(div => {
        // Check if it's at the edge of the screen (typical for iframe controls)
        const rect = div.getBoundingClientRect();
        const style = window.getComputedStyle(div);
        
        // Check if it's a small element positioned at the edge
        if (rect.width < 100 && rect.height < 100 && 
            (rect.left < 50 || rect.right > window.innerWidth - 50 ||
             rect.top < 50 || rect.bottom > window.innerHeight - 50)) {
            
            // Check if it contains an X
            const text = div.textContent.trim();
            if (text === '×' || text === 'X' || text === 'x') {
                console.log('🗑️ Removing positioned X element:', div);
                div.style.display = 'none !important';
                div.style.visibility = 'hidden !important';
                try {
                    div.remove();
                } catch (e) {}
            }
        }
    });
    
    // Target any element with 'hidden' class that contains controls
    const hiddenControls = document.querySelectorAll('.hidden[class*="control"], [class*="iframe-control"]');
    hiddenControls.forEach(element => {
        console.log('🗑️ Removing hidden controls:', element);
        element.style.display = 'none !important';
        try {
            element.remove();
        } catch (e) {}
    });
}

// Run immediately
removeHsIframe();

// Run after various delays to catch async loading
setTimeout(removeHsIframe, 100);
setTimeout(removeHsIframe, 500);
setTimeout(removeHsIframe, 1000);
setTimeout(removeHsIframe, 2000);
setTimeout(removeHsIframe, 5000);

// Watch for new additions
const hsObserver = new MutationObserver((mutations) => {
    let shouldCheck = false;
    
    mutations.forEach(mutation => {
        mutation.addedNodes.forEach(node => {
            if (node.nodeType === 1) {
                if (node.className && (
                    node.className.includes('hs-iframe') ||
                    node.className.includes('iframe-control') ||
                    node.className.includes('hidden'))) {
                    shouldCheck = true;
                }
            }
        });
    });
    
    if (shouldCheck) {
        removeHsIframe();
    }
});

// Start observing
if (document.body) {
    hsObserver.observe(document.body, {
        childList: true,
        subtree: true,
        attributes: true,
        attributeFilter: ['class', 'style']
    });
}

// Also add CSS to ensure it stays hidden
const style = document.createElement('style');
style.textContent = `
    /* Hide HubSpot/iframe controls */
    .hs-iframe-controls,
    [class*="hs-iframe"],
    .hidden[class*="control"],
    [class*="iframe-control"] {
        display: none !important;
        visibility: hidden !important;
        opacity: 0 !important;
        pointer-events: none !important;
        position: absolute !important;
        left: -9999px !important;
        top: -9999px !important;
        width: 0 !important;
        height: 0 !important;
    }
    
    /* Hide any fixed positioned small divs with X content */
    div[style*="position: fixed"]:has-text("×"),
    div[style*="position: fixed"]:has-text("X"),
    div[style*="position: absolute"]:has-text("×"),
    div[style*="position: absolute"]:has-text("X") {
        display: none !important;
    }
`;
document.head.appendChild(style);

console.log('✅ HubSpot/iframe control removal script loaded');