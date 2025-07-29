// Diagnose Settings Element - Find exactly what contains the SETTINGS text
(function() {
    console.log('🔍 DIAGNOSTIC: Searching for SETTINGS elements...');
    
    function findSettingsElements() {
        const allElements = document.querySelectorAll('*');
        let found = [];
        
        allElements.forEach((element, index) => {
            const text = element.textContent ? element.textContent.trim() : '';
            const innerHTML = element.innerHTML || '';
            
            // Look for any element that contains SETTINGS
            if (text.includes('SETTINGS') || innerHTML.includes('SETTINGS')) {
                const rect = element.getBoundingClientRect();
                
                const info = {
                    element: element,
                    tagName: element.tagName,
                    className: element.className,
                    id: element.id,
                    textContent: text,
                    innerHTML: innerHTML.substring(0, 200), // First 200 chars
                    position: {
                        top: rect.top,
                        left: rect.left,
                        width: rect.width,
                        height: rect.height
                    },
                    parent: element.parentElement ? element.parentElement.tagName : 'none',
                    parentClass: element.parentElement ? element.parentElement.className : 'none',
                    isVisible: rect.width > 0 && rect.height > 0,
                    hasButtons: !!element.querySelector('button'),
                    isButton: element.tagName === 'BUTTON'
                };
                
                found.push(info);
            }
        });
        
        console.log('🔍 FOUND SETTINGS ELEMENTS:');
        found.forEach((info, index) => {
            console.log(`${index + 1}. ${info.tagName}.${info.className}#${info.id}`);
            console.log(`   Text: "${info.textContent}"`);
            console.log(`   Position: top=${info.position.top}, left=${info.position.left}`);
            console.log(`   Size: ${info.position.width}x${info.position.height}`);
            console.log(`   Parent: ${info.parent}.${info.parentClass}`);
            console.log(`   Visible: ${info.isVisible}, HasButtons: ${info.hasButtons}, IsButton: ${info.isButton}`);
            console.log(`   HTML: ${info.innerHTML}`);
            console.log('   ---');
        });
        
        // Try to identify which one is the duplicate we want to remove
        console.log('🎯 ANALYZING FOR TARGET:');
        const contextButton = document.querySelector('button, .settings-btn');
        if (contextButton) {
            const buttonRect = contextButton.getBoundingClientRect();
            console.log(`Context button position: top=${buttonRect.top}, left=${buttonRect.left}`);
            
            found.forEach((info, index) => {
                if (info.position.top < buttonRect.top && 
                    info.position.left < 400 &&
                    !info.hasButtons &&
                    !info.isButton) {
                    console.log(`🎯 POTENTIAL TARGET #${index + 1}: ${info.tagName}.${info.className}`);
                    console.log(`   This appears to be above the button and has no buttons inside`);
                    
                    // Try to hide this one specifically
                    info.element.style.border = '3px solid red';
                    info.element.style.background = 'yellow';
                    console.log(`   🟡 Marked with yellow background and red border for identification`);
                }
            });
        }
        
        return found;
    }
    
    // Run diagnostic
    setTimeout(() => {
        console.log('🔍 STARTING SETTINGS DIAGNOSTIC...');
        findSettingsElements();
    }, 2000);
    
    console.log('🔍 Diagnostic script loaded');
})();