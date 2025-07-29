// Remove Settings By Position - Ultra-specific targeting based on screenshot
(function() {
    console.log('🎯 POSITION-BASED REMOVAL: Starting ultra-specific targeting...');
    
    function removeSettingsByPosition() {
        // Find the Context Priming button as reference point
        const contextButton = Array.from(document.querySelectorAll('button')).find(btn => 
            btn.textContent.includes('Context Priming') || 
            btn.innerHTML.includes('Context Priming')
        );
        
        if (!contextButton) {
            console.log('🎯 Context Priming button not found yet');
            return;
        }
        
        const buttonRect = contextButton.getBoundingClientRect();
        console.log('🎯 Found Context Priming button at:', buttonRect.top, buttonRect.left);
        
        // Now find ALL elements and check their position relative to this button
        const allElements = document.getElementsByTagName('*');
        let removed = 0;
        
        for (let i = 0; i < allElements.length; i++) {
            const element = allElements[i];
            
            // Skip functional elements
            if (element.tagName === 'BUTTON' || 
                element.classList.contains('settings-btn') ||
                element.querySelector('button')) {
                continue;
            }
            
            const text = element.textContent || '';
            const trimmedText = text.trim();
            
            // Check if this element contains ONLY "SETTINGS" or "⚙ SETTINGS"
            if (trimmedText === 'SETTINGS' || 
                trimmedText === '⚙ SETTINGS' || 
                trimmedText === '⚙️ SETTINGS' ||
                trimmedText === '⚙️SETTINGS' ||
                trimmedText === '⚙SETTINGS') {
                
                // Get position
                const rect = element.getBoundingClientRect();
                
                // Check if it's:
                // 1. Above the Context Priming button (lower top value)
                // 2. In the left sidebar area (left < 400)
                // 3. Close to the button horizontally (similar left position)
                if (rect.top < buttonRect.top && 
                    rect.top > buttonRect.top - 100 && // Within 100px above
                    rect.left < 400 &&
                    Math.abs(rect.left - buttonRect.left) < 100) {
                    
                    console.log('🎯 FOUND TARGET SETTINGS ELEMENT:', {
                        element: element,
                        tag: element.tagName,
                        class: element.className,
                        text: trimmedText,
                        position: `top: ${rect.top}, left: ${rect.left}`,
                        buttonPosition: `top: ${buttonRect.top}, left: ${buttonRect.left}`,
                        parent: element.parentElement?.tagName
                    });
                    
                    // Remove it completely
                    element.style.display = 'none';
                    element.style.visibility = 'hidden';
                    element.style.opacity = '0';
                    element.style.height = '0';
                    element.style.overflow = 'hidden';
                    element.style.position = 'absolute';
                    element.style.left = '-9999px';
                    
                    // Also try to remove from DOM
                    setTimeout(() => {
                        try {
                            element.remove();
                            console.log('🎯 Successfully removed SETTINGS element');
                        } catch (e) {
                            console.log('🎯 Could not remove from DOM, but it is hidden');
                        }
                    }, 10);
                    
                    removed++;
                }
            }
        }
        
        if (removed > 0) {
            console.log(`🎯 POSITION-BASED REMOVAL: Removed ${removed} SETTINGS elements`);
        }
    }
    
    // Also try a different approach - find by tree structure
    function removeByTreeStructure() {
        // Look for settings section
        const settingsSection = document.querySelector('.settings-section');
        if (!settingsSection) return;
        
        // Check elements just before the settings section
        let sibling = settingsSection.previousElementSibling;
        while (sibling) {
            const text = sibling.textContent ? sibling.textContent.trim() : '';
            if (text === 'SETTINGS' || text.includes('SETTINGS') && !sibling.querySelector('button')) {
                console.log('🎯 Found SETTINGS sibling:', sibling);
                sibling.style.display = 'none';
                sibling.remove();
                break;
            }
            sibling = sibling.previousElementSibling;
        }
        
        // Also check parent container for any SETTINGS text
        let parent = settingsSection.parentElement;
        while (parent && parent !== document.body) {
            const children = Array.from(parent.children);
            children.forEach(child => {
                if (child !== settingsSection && 
                    child.textContent && 
                    child.textContent.trim().includes('SETTINGS') &&
                    !child.querySelector('button') &&
                    !child.classList.contains('settings-section')) {
                    console.log('🎯 Found SETTINGS in parent structure:', child);
                    child.style.display = 'none';
                    child.remove();
                }
            });
            parent = parent.parentElement;
        }
    }
    
    // Run multiple times with delays
    removeSettingsByPosition();
    removeByTreeStructure();
    
    setTimeout(() => {
        removeSettingsByPosition();
        removeByTreeStructure();
    }, 100);
    
    setTimeout(() => {
        removeSettingsByPosition();
        removeByTreeStructure();
    }, 500);
    
    setTimeout(() => {
        removeSettingsByPosition();
        removeByTreeStructure();
    }, 1000);
    
    setTimeout(() => {
        removeSettingsByPosition();
        removeByTreeStructure();
    }, 2000);
    
    // Set up continuous monitoring
    setInterval(() => {
        removeSettingsByPosition();
        removeByTreeStructure();
    }, 3000);
    
    console.log('🎯 POSITION-BASED REMOVAL: Active and monitoring');
})();