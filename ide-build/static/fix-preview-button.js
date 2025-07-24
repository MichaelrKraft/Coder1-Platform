// Fix Preview Button - Remove Blue X Overlay
console.log('🎯 Preview Button Fix Active');

function findAndRemovePreviewX() {
    // Look for preview button
    const previewButtons = document.querySelectorAll('button[title*="Preview"], button[title*="preview"], button:contains("Preview")');
    
    previewButtons.forEach(btn => {
        console.log('👀 Found preview button:', btn);
        
        // Check parent and siblings for blue X
        const parent = btn.parentElement;
        if (parent) {
            // Look for any X-like siblings
            Array.from(parent.children).forEach(child => {
                const text = (child.textContent || '').trim();
                if (['×', 'X', 'x', '✕', '✖', '⨯'].includes(text)) {
                    const style = window.getComputedStyle(child);
                    console.log('🔍 Found X near preview:', {
                        element: child,
                        text,
                        color: style.color,
                        position: style.position,
                        zIndex: style.zIndex
                    });
                    
                    // Remove it
                    child.style.cssText = 'display: none !important; visibility: hidden !important;';
                    try {
                        child.remove();
                    } catch (e) {}
                }
            });
        }
    });
    
    // Also look for nav items containing preview
    const navItems = document.querySelectorAll('.nav-item, .nav-item-container, [class*="nav"]');
    navItems.forEach(nav => {
        if (nav.textContent.includes('Preview')) {
            // Check all children for blue X
            const allChildren = nav.querySelectorAll('*');
            allChildren.forEach(child => {
                const text = (child.textContent || '').trim();
                const style = window.getComputedStyle(child);
                
                if (['×', 'X', 'x', '✕', '✖', '⨯'].includes(text) && 
                    (style.color.includes('blue') || style.color.includes('rgb(0') || style.color.includes('rgba(0'))) {
                    console.log('❌ Removing blue X in nav area:', child);
                    child.style.cssText = 'display: none !important; visibility: hidden !important;';
                    try {
                        child.remove();
                    } catch (e) {}
                }
            });
        }
    });
    
    // Look for any absolutely positioned overlays
    const overlays = document.querySelectorAll('[style*="position: absolute"], [style*="position: fixed"]');
    overlays.forEach(overlay => {
        const rect = overlay.getBoundingClientRect();
        const text = (overlay.textContent || '').trim();
        
        // Check if it's near the top of the page (where nav buttons are)
        if (rect.top < 100 && ['×', 'X', 'x', '✕', '✖', '⨯'].includes(text)) {
            const style = window.getComputedStyle(overlay);
            if (style.color.includes('blue') || style.color.includes('rgb(0') || style.color.includes('rgba(0')) {
                console.log('❌ Removing positioned blue X overlay:', overlay);
                overlay.style.cssText = 'display: none !important; visibility: hidden !important;';
                try {
                    overlay.remove();
                } catch (e) {}
            }
        }
    });
}

// Run multiple times to catch React renders
findAndRemovePreviewX();
setTimeout(findAndRemovePreviewX, 100);
setTimeout(findAndRemovePreviewX, 500);
setTimeout(findAndRemovePreviewX, 1000);
setTimeout(findAndRemovePreviewX, 2000);

// Watch for changes
const previewObserver = new MutationObserver(() => {
    findAndRemovePreviewX();
});

if (document.body) {
    previewObserver.observe(document.body, {
        childList: true,
        subtree: true,
        attributes: true,
        attributeFilter: ['style', 'class']
    });
}

// Add specific CSS to hide blue X near preview
const style = document.createElement('style');
style.textContent = `
    /* Hide blue X in navigation area */
    .nav-item-container [style*="blue"]:not(button),
    .header-nav [style*="blue"]:not(button),
    .header-center [style*="blue"]:not(button),
    [class*="nav"] [style*="blue"]:not(button) {
        display: none !important;
        visibility: hidden !important;
    }
    
    /* Hide any X character with blue color */
    *:not(.superclaude-btn) {
        &[style*="color: blue"],
        &[style*="color:#0000ff"],
        &[style*="color:#00f"],
        &[style*="rgb(0"][style*="255)"],
        &[style*="rgba(0"][style*="255"] {
            &:has-text("×"),
            &:has-text("X"),
            &:has-text("x") {
                display: none !important;
                visibility: hidden !important;
            }
        }
    }
`;
document.head.appendChild(style);