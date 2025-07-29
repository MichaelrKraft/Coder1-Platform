// Nuclear Fallback Scanner - Last resort continuous removal
(function() {
    console.log('🚨 NUCLEAR FALLBACK: Continuous scanner starting...');
    
    let totalRemoved = 0;
    let scanCount = 0;
    
    function nuclearFallbackScan() {
        scanCount++;
        let removedThisScan = 0;
        
        // Get ALL elements in the document
        const allElements = document.querySelectorAll('*');
        
        allElements.forEach(element => {
            // Skip our functional elements completely
            if (element.classList.contains('settings-btn') ||
                element.classList.contains('settings-section') ||
                element.closest('.settings-section') ||
                element.tagName === 'BUTTON' ||
                element.id === 'react-bits-button' ||
                element.querySelector('button')) {
                return;
            }
            
            const text = element.textContent ? element.textContent.trim() : '';
            const innerHTML = element.innerHTML || '';
            
            // Look for ANY element containing SETTINGS that's not functional
            if (text === 'SETTINGS' || 
                text === '⚙ SETTINGS' || 
                text === '⚙️ SETTINGS' ||
                (innerHTML.includes('⚙') && text.includes('SETTINGS'))) {
                
                const rect = element.getBoundingClientRect();
                
                // Only remove if it's in the left area and looks like a header
                if (rect.left < 400 && rect.width < 300 && rect.height < 100) {
                    console.log(`🚨 NUCLEAR FALLBACK REMOVAL #${totalRemoved + 1}:`, {
                        scan: scanCount,
                        tag: element.tagName,
                        class: element.className,
                        id: element.id,
                        text: text,
                        innerHTML: innerHTML.substring(0, 100),
                        position: `${rect.left},${rect.top}`,
                        size: `${rect.width}x${rect.height}`,
                        parent: element.parentElement ? element.parentElement.tagName : 'none'
                    });
                    
                    // Nuclear removal - multiple methods
                    try {
                        // Method 1: CSS hiding
                        element.style.cssText = `
                            display: none !important;
                            visibility: hidden !important;
                            opacity: 0 !important;
                            height: 0 !important;
                            width: 0 !important;
                            margin: 0 !important;
                            padding: 0 !important;
                            position: absolute !important;
                            left: -99999px !important;
                            top: -99999px !important;
                            z-index: -999999 !important;
                            overflow: hidden !important;
                            transform: scale(0) !important;
                            pointer-events: none !important;
                        `;
                        
                        // Method 2: Add nuclear class
                        element.classList.add('nuclear-hide-settings', 'nuclear-settings-target');
                        
                        // Method 3: Text content removal
                        if (element.childNodes.length === 1 && 
                            element.firstChild.nodeType === Node.TEXT_NODE) {
                            element.firstChild.textContent = '';
                        }
                        
                        // Method 4: DOM removal
                        setTimeout(() => {
                            if (element.parentNode) {
                                element.parentNode.removeChild(element);
                            }
                        }, 10);
                        
                        removedThisScan++;
                        totalRemoved++;
                    } catch (error) {
                        console.log('🚨 NUCLEAR FALLBACK: Removal error:', error);
                    }
                }
            }
        });
        
        if (removedThisScan > 0) {
            console.log(`🚨 NUCLEAR FALLBACK: Scan #${scanCount} - Removed ${removedThisScan} elements (Total: ${totalRemoved})`);
        }
        
        // Log periodic status
        if (scanCount % 20 === 0) {
            console.log(`🚨 NUCLEAR FALLBACK: Status - ${scanCount} scans completed, ${totalRemoved} total removals`);
        }
    }
    
    // Start immediate scanning
    nuclearFallbackScan();
    
    // High-frequency scanning for first 10 seconds
    const rapidInterval = setInterval(() => {
        nuclearFallbackScan();
    }, 100); // Every 100ms
    
    setTimeout(() => {
        clearInterval(rapidInterval);
        console.log('🚨 NUCLEAR FALLBACK: Rapid scanning phase complete');
        
        // Continue with normal frequency scanning
        setInterval(() => {
            nuclearFallbackScan();
        }, 1000); // Every 1 second
        
    }, 10000); // 10 seconds of rapid scanning
    
    // Also run on any DOM changes
    const fallbackObserver = new MutationObserver(() => {
        // Small delay to let React finish its changes
        setTimeout(nuclearFallbackScan, 50);
    });
    
    if (document.body) {
        fallbackObserver.observe(document.body, {
            childList: true,
            subtree: true,
            characterData: true
        });
    }
    
    console.log('🚨 NUCLEAR FALLBACK: Scanner armed and operational');
    console.log('🚨 This will continuously scan and remove ANY non-functional SETTINGS text');
})();