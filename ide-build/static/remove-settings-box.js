// Remove Settings Box - Target the specific SETTINGS header element
(function() {
    console.log('🎯 Remove Settings Box: Starting targeted removal...');
    
    function removeSettingsBox() {
        // Look for the specific pattern: gear icon + "SETTINGS" text
        const allElements = document.querySelectorAll('*');
        let removed = 0;
        
        allElements.forEach(element => {
            // Skip our custom settings section
            if (element.classList.contains('settings-section') || 
                element.closest('.settings-section') ||
                element.classList.contains('settings-btn')) {
                return;
            }
            
            // Check if this element contains a gear icon (SVG or emoji)
            const hasGearIcon = element.querySelector('svg') || 
                              element.innerHTML.includes('⚙') ||
                              element.querySelector('[class*="gear"]') ||
                              element.querySelector('[class*="cog"]');
            
            // Check if the next sibling or a child contains "SETTINGS" text
            let hasSettingsText = false;
            
            // Check the element itself
            if (element.textContent.trim() === 'SETTINGS') {
                hasSettingsText = true;
            }
            
            // Check next sibling
            const nextSibling = element.nextElementSibling;
            if (nextSibling && nextSibling.textContent.trim() === 'SETTINGS') {
                hasSettingsText = true;
            }
            
            // Check children
            Array.from(element.children).forEach(child => {
                if (child.textContent.trim() === 'SETTINGS') {
                    hasSettingsText = true;
                }
            });
            
            // If we found the pattern, hide the container
            if (hasGearIcon && hasSettingsText) {
                console.log('🎯 Found SETTINGS box to remove:', element);
                
                // Hide the entire container
                element.style.display = 'none !important';
                element.style.visibility = 'hidden !important';
                element.style.height = '0 !important';
                element.style.margin = '0 !important';
                element.style.padding = '0 !important';
                element.style.overflow = 'hidden !important';
                
                // Also hide the next sibling if it's just "SETTINGS"
                if (nextSibling && nextSibling.textContent.trim() === 'SETTINGS') {
                    nextSibling.style.display = 'none !important';
                    nextSibling.style.visibility = 'hidden !important';
                    nextSibling.style.height = '0 !important';
                }
                
                // Hide parent if it only contains this
                const parent = element.parentElement;
                if (parent && parent.children.length <= 2) {
                    parent.style.display = 'none !important';
                    parent.style.height = '0 !important';
                }
                
                removed++;
            }
            
            // Also check if element is just "SETTINGS" text without our classes
            if (element.textContent.trim() === 'SETTINGS' && 
                !element.querySelector('button') &&
                !element.classList.contains('settings-label')) {
                
                const rect = element.getBoundingClientRect();
                // Only remove if it's in the Explorer area
                if (rect.left < 400) {
                    console.log('🎯 Found standalone SETTINGS text:', element);
                    element.style.display = 'none !important';
                    element.style.height = '0 !important';
                    
                    // Check for gear icon before this element
                    const prevSibling = element.previousElementSibling;
                    if (prevSibling && (prevSibling.querySelector('svg') || 
                                      prevSibling.innerHTML.includes('⚙'))) {
                        prevSibling.style.display = 'none !important';
                    }
                    
                    removed++;
                }
            }
        });
        
        // Additional cleanup: Remove empty containers
        document.querySelectorAll('div').forEach(div => {
            if (div.innerHTML.trim() === '' && 
                div.style.display === 'none' && 
                !div.classList.contains('settings-section')) {
                div.remove();
            }
        });
        
        console.log(`✅ Removed ${removed} SETTINGS elements`);
    }
    
    // CSS injection for persistence
    const style = document.createElement('style');
    style.textContent = `
        /* Hide SETTINGS headers that aren't our buttons */
        div:has(> svg) + div:contains("SETTINGS"):not(.settings-section) {
            display: none !important;
            height: 0 !important;
        }
        
        /* Hide containers with gear + SETTINGS pattern */
        div:has(> svg):has(+ div:contains("SETTINGS")):not(.settings-section) {
            display: none !important;
            height: 0 !important;
        }
    `;
    document.head.appendChild(style);
    
    // Run multiple times
    for (let i = 0; i < 20; i++) {
        setTimeout(removeSettingsBox, i * 100);
    }
    
    // Monitor for changes
    const observer = new MutationObserver(() => {
        removeSettingsBox();
    });
    
    if (document.body) {
        observer.observe(document.body, {
            childList: true,
            subtree: true
        });
    }
    
    console.log('🎯 Remove Settings Box: Active and monitoring');
})();