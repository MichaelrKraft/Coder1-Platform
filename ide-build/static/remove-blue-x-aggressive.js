// AGGRESSIVE Blue X Removal - Target hs-iframe and all blue X elements
console.log('🔥 AGGRESSIVE Blue X removal starting...');

function aggressiveRemoveBlueX() {
    // 1. Remove hs-iframe-controls specifically
    const hsElements = document.querySelectorAll('.hs-iframe-controls, [class*="hs-iframe"], [class*="hs-"], [class*="hubspot"]');
    hsElements.forEach(el => {
        console.log('🗑️ Removing HubSpot element:', el);
        el.remove();
    });
    
    // 2. Find ALL elements and check for blue X
    const allElements = document.querySelectorAll('*');
    let removedCount = 0;
    
    allElements.forEach(el => {
        try {
            const text = (el.textContent || '').trim();
            const computedStyle = window.getComputedStyle(el);
            const rect = el.getBoundingClientRect();
            
            // Check if it's an X character
            if (text === '×' || text === 'X' || text === 'x' || text === '✕' || text === '✖' || text === '⨯') {
                // Check if it's blue OR translucent OR overlaying
                const isBlue = computedStyle.color.includes('blue') || 
                              computedStyle.color.includes('rgb(0') || 
                              computedStyle.color.includes('rgba(0');
                
                const isOverlay = computedStyle.position === 'absolute' || 
                                 computedStyle.position === 'fixed';
                
                const hasHighZIndex = parseInt(computedStyle.zIndex) > 0;
                
                // Remove if it matches ANY criteria
                if (isBlue || isOverlay || hasHighZIndex) {
                    console.log('❌ Removing X element:', {
                        text,
                        color: computedStyle.color,
                        position: computedStyle.position,
                        zIndex: computedStyle.zIndex,
                        className: el.className
                    });
                    el.remove();
                    removedCount++;
                }
            }
            
            // Also check for containers with blue X
            if (el.innerHTML && el.innerHTML.includes('×') && 
                (computedStyle.position === 'absolute' || computedStyle.position === 'fixed')) {
                // Check if near preview button area
                if (rect.top < 200) {
                    console.log('❌ Removing X container:', el);
                    el.remove();
                    removedCount++;
                }
            }
        } catch (e) {
            // Ignore cross-origin errors
        }
    });
    
    // 3. Target anything in the navigation/header area with an X
    const headerArea = document.querySelector('.header-center, .header-nav, [class*="header"], [class*="nav"]');
    if (headerArea) {
        const xElements = headerArea.querySelectorAll('*');
        xElements.forEach(el => {
            const text = (el.textContent || '').trim();
            if (['×', 'X', 'x'].includes(text) && !el.querySelector('*')) {
                console.log('❌ Removing X in header area:', el);
                el.remove();
            }
        });
    }
    
    // 4. Remove any divs positioned over buttons
    const buttons = document.querySelectorAll('button');
    buttons.forEach(btn => {
        const btnRect = btn.getBoundingClientRect();
        
        // Find overlapping elements
        allElements.forEach(el => {
            if (el === btn || btn.contains(el)) return;
            
            const elRect = el.getBoundingClientRect();
            const overlaps = !(elRect.right < btnRect.left || 
                               elRect.left > btnRect.right || 
                               elRect.bottom < btnRect.top || 
                               elRect.top > btnRect.bottom);
            
            if (overlaps) {
                const text = (el.textContent || '').trim();
                if (['×', 'X', 'x'].includes(text)) {
                    console.log('❌ Removing element overlapping button:', el);
                    el.remove();
                }
            }
        });
    });
    
    console.log(`✅ Aggressive removal complete. Removed ${removedCount} elements`);
}

// Inject global CSS to hide hs-iframe elements
const globalStyle = document.createElement('style');
globalStyle.id = 'aggressive-blue-x-removal';
globalStyle.textContent = `
    /* Hide ALL HubSpot/iframe controls */
    .hs-iframe-controls,
    [class*="hs-iframe"],
    [class*="hs-"],
    [class*="hubspot"],
    .hidden[class*="control"] {
        display: none !important;
        visibility: hidden !important;
        opacity: 0 !important;
        pointer-events: none !important;
        width: 0 !important;
        height: 0 !important;
        position: absolute !important;
        left: -9999px !important;
        top: -9999px !important;
    }
    
    /* Hide any X with blue styling */
    *:not(.superclaude-btn)[style*="blue"]:empty,
    *:not(.superclaude-btn)[style*="rgb(0"]:empty,
    *:not(.superclaude-btn)[style*="rgba(0"]:empty {
        display: none !important;
    }
    
    /* Hide positioned X elements */
    div[style*="position: fixed"]:has-text("×"),
    div[style*="position: absolute"]:has-text("×"),
    div[style*="position: fixed"]:has-text("X"),
    div[style*="position: absolute"]:has-text("X") {
        display: none !important;
    }
    
    /* Target navigation area blue elements */
    .header-nav *[style*="blue"]:not(button),
    .header-center *[style*="blue"]:not(button),
    [class*="nav"] *[style*="blue"]:not(button) {
        display: none !important;
    }
`;

// Remove existing style if present
const existingStyle = document.getElementById('aggressive-blue-x-removal');
if (existingStyle) {
    existingStyle.remove();
}
document.head.appendChild(globalStyle);

// Run removal immediately
aggressiveRemoveBlueX();

// Run periodically with shorter intervals
const intervals = [50, 100, 200, 500, 1000, 2000, 5000];
intervals.forEach(delay => {
    setTimeout(aggressiveRemoveBlueX, delay);
});

// Continuous monitoring
setInterval(aggressiveRemoveBlueX, 3000);

// Mutation observer for immediate response
const aggressiveObserver = new MutationObserver((mutations) => {
    let shouldRun = false;
    
    mutations.forEach(mutation => {
        mutation.addedNodes.forEach(node => {
            if (node.nodeType === 1) {
                const text = (node.textContent || '').trim();
                const className = node.className || '';
                
                if (text.includes('×') || text.includes('X') || 
                    className.includes('hs-') || className.includes('hubspot')) {
                    shouldRun = true;
                }
            }
        });
    });
    
    if (shouldRun) {
        aggressiveRemoveBlueX();
    }
});

if (document.body) {
    aggressiveObserver.observe(document.body, {
        childList: true,
        subtree: true,
        attributes: true,
        attributeFilter: ['style', 'class']
    });
}

// Override createElement to prevent hs-iframe creation
const originalCreateElement = document.createElement;
document.createElement = function(tagName) {
    const element = originalCreateElement.call(document, tagName);
    
    // Intercept setAttribute to block hs-iframe classes
    const originalSetAttribute = element.setAttribute;
    element.setAttribute = function(name, value) {
        if (name === 'class' && value && (value.includes('hs-iframe') || value.includes('hubspot'))) {
            console.log('🚫 Blocked hs-iframe class assignment');
            return;
        }
        return originalSetAttribute.call(this, name, value);
    };
    
    return element;
};

console.log('✅ AGGRESSIVE Blue X removal script loaded with interceptors');