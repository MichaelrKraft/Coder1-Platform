// Diagnostic script to find the blue X
console.log('🔍 BLUE X DIAGNOSTIC SCRIPT STARTING...');

function diagnoseBlueX() {
    console.log('\n=== DIAGNOSTIC RUN ===');
    
    // Find all elements with X-like content
    const allElements = document.querySelectorAll('*');
    const xElements = [];
    
    allElements.forEach(el => {
        const text = (el.textContent || '').trim();
        const firstChild = el.firstChild;
        
        // Check if element directly contains X (not in children)
        if (firstChild && firstChild.nodeType === 3 && ['×', 'X', 'x', '✕', '✖', '⨯'].includes(firstChild.textContent.trim())) {
            const computed = window.getComputedStyle(el);
            const rect = el.getBoundingClientRect();
            
            // Collect info about this element
            const info = {
                element: el,
                text: firstChild.textContent.trim(),
                tagName: el.tagName,
                className: el.className,
                id: el.id,
                color: computed.color,
                backgroundColor: computed.backgroundColor,
                position: computed.position,
                zIndex: computed.zIndex,
                opacity: computed.opacity,
                display: computed.display,
                visibility: computed.visibility,
                rect: {
                    top: rect.top,
                    left: rect.left,
                    width: rect.width,
                    height: rect.height
                },
                parent: el.parentElement ? {
                    tagName: el.parentElement.tagName,
                    className: el.parentElement.className,
                    id: el.parentElement.id
                } : null,
                style: el.getAttribute('style'),
                onclick: el.onclick ? 'has onclick' : 'no onclick'
            };
            
            // Check if it's visible and potentially blue
            if (computed.display !== 'none' && computed.visibility !== 'hidden' && parseFloat(computed.opacity) > 0) {
                xElements.push(info);
            }
        }
    });
    
    console.log(`Found ${xElements.length} visible X elements:`);
    
    // Analyze each X element
    xElements.forEach((info, index) => {
        console.group(`X Element #${index + 1}: "${info.text}"`);
        console.log('Element:', info.element);
        console.log('Tag:', info.tagName);
        console.log('Class:', info.className || '(no class)');
        console.log('ID:', info.id || '(no id)');
        console.log('Color:', info.color);
        console.log('Background:', info.backgroundColor);
        console.log('Position:', info.position);
        console.log('Z-Index:', info.zIndex);
        console.log('Location:', `top: ${info.rect.top}px, left: ${info.rect.left}px`);
        console.log('Size:', `${info.rect.width}x${info.rect.height}`);
        console.log('Parent:', info.parent);
        console.log('Inline Style:', info.style || '(none)');
        console.log('Click Handler:', info.onclick);
        
        // Check if it's blue
        const isBlue = info.color.includes('blue') || 
                       info.color.includes('rgb(0') || 
                       info.color.includes('rgba(0') ||
                       info.color === '#0000ff' ||
                       info.color === '#00f';
        
        if (isBlue) {
            console.warn('⚠️ THIS IS A BLUE X!');
        }
        
        // Check if it's near the top (navigation area)
        if (info.rect.top < 100) {
            console.warn('⚠️ This X is in the navigation area');
        }
        
        console.groupEnd();
    });
    
    // Also look for preview buttons
    console.log('\n=== PREVIEW BUTTON ANALYSIS ===');
    const previewElements = Array.from(document.querySelectorAll('*')).filter(el => 
        el.textContent.includes('Preview') || 
        el.getAttribute('title')?.includes('Preview') ||
        el.getAttribute('aria-label')?.includes('Preview')
    );
    
    previewElements.forEach(el => {
        console.log('Preview element:', el);
        console.log('Siblings:', Array.from(el.parentElement?.children || []));
    });
    
    // Check for React root
    console.log('\n=== REACT ANALYSIS ===');
    const reactRoot = document.getElementById('root');
    if (reactRoot) {
        console.log('React root found');
        const reactInternalKey = Object.keys(reactRoot).find(key => key.startsWith('__react'));
        if (reactInternalKey) {
            console.log('React internal key:', reactInternalKey);
            console.log('This is a React app');
        }
    }
}

// Run diagnostic immediately and after delays
diagnoseBlueX();
setTimeout(diagnoseBlueX, 1000);
setTimeout(diagnoseBlueX, 3000);

// Interactive helper
window.diagnoseBlueX = diagnoseBlueX;
console.log('💡 TIP: Run diagnoseBlueX() in console to diagnose again');