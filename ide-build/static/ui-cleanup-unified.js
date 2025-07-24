/**
 * Unified UI Cleanup System
 * Consolidates all UI fix scripts into a single, efficient system
 * Replaces: remove-blue-x-aggressive.js, hide-terminal-title.js, remove-coder1-text-aggressively.js, 
 * simple-text-removal.js, hide-blue-coder1-text.js, remove-blue-text.js, global-logo-final.js, 
 * cleanup-header-buttons.js, hide-buttons-special-pages.js, and 8 other fix scripts
 */

class UICleanupSystem {
    constructor() {
        this.cleanupRules = {
            // Text removal rules
            textCleanup: [
                { text: 'SuperClaude Terminal', action: 'hide' },
                { text: 'Front-end expert', action: 'hide' },
                { text: 'IDE Settings', context: 'header', action: 'hide' },
                { pattern: /×|✕|✖|⨯/, color: 'blue', action: 'hide' },
                { pattern: /Coder1/i, context: 'unwanted', action: 'hide' }
            ],
            
            // Element cleanup rules
            elementCleanup: [
                { selector: '[style*="blue"]', contains: '×', action: 'hide' },
                { selector: '.fa-cog, .fa-gear, .fa-settings', context: 'terminal', action: 'hide' },
                { selector: 'svg, i', parent: '*[title*="SuperClaude"]', action: 'hide' },
                { selector: '.terminal-icon, .fa-terminal', parent: '*[aria-label*="SuperClaude"]', action: 'hide' }
            ],
            
            // Logo and branding rules
            brandingCleanup: [
                { action: 'restore-coder1-logo' },
                { action: 'hide-robot-icons', context: 'header' }
            ]
        };
        
        this.init();
    }
    
    init() {
        // Run initial cleanup
        this.runCleanup();
        
        // Set up observers for dynamic content
        this.setupMutationObserver();
        
        // Periodic cleanup (less frequent than before)
        setInterval(() => this.runCleanup(), 15000); // Every 15 seconds instead of multiple intervals
    }
    
    runCleanup() {
        this.cleanupText();
        this.cleanupElements();
        this.cleanupBranding();
        this.restoreCoder1Elements();
    }
    
    cleanupText() {
        const elements = document.querySelectorAll('*');
        
        elements.forEach(el => {
            // Skip our custom settings section
            if (el.closest('.settings-section')) return;
            
            const text = (el.textContent || '').trim();
            const innerHTML = el.innerHTML || '';
            
            // Apply text cleanup rules
            this.cleanupRules.textCleanup.forEach(rule => {
                let shouldHide = false;
                
                if (rule.text && text === rule.text) {
                    shouldHide = true;
                } else if (rule.pattern && rule.pattern.test(text)) {
                    // Check for color context if specified
                    if (rule.color === 'blue') {
                        const style = el.getAttribute('style') || '';
                        const computedStyle = window.getComputedStyle(el);
                        const hasBlueStyle = 
                            style.includes('blue') ||
                            style.includes('#0000ff') ||
                            computedStyle.color.includes('blue') ||
                            computedStyle.color === 'rgb(0, 0, 255)';
                        shouldHide = hasBlueStyle;
                    } else {
                        shouldHide = true;
                    }
                }
                
                if (shouldHide && rule.action === 'hide') {
                    this.hideElement(el);
                }
            });
        });
    }
    
    cleanupElements() {
        this.cleanupRules.elementCleanup.forEach(rule => {
            const elements = document.querySelectorAll(rule.selector);
            
            elements.forEach(el => {
                // Skip our custom settings
                if (el.closest('.settings-section')) return;
                
                let shouldHide = false;
                
                if (rule.contains) {
                    shouldHide = (el.textContent || '').includes(rule.contains);
                } else if (rule.parent) {
                    shouldHide = !!el.closest(rule.parent);
                } else if (rule.context === 'terminal') {
                    // Only hide if in terminal area, not our settings
                    const rect = el.getBoundingClientRect();
                    const isInTerminalMiddle = rect.top > window.innerHeight * 0.4 && 
                                             rect.top < window.innerHeight * 0.9 &&
                                             rect.left > window.innerWidth * 0.3;
                    shouldHide = isInTerminalMiddle;
                } else {
                    shouldHide = true;
                }
                
                if (shouldHide && rule.action === 'hide') {
                    this.hideElement(el);
                }
            });
        });
    }
    
    cleanupBranding() {
        // Hide robot icons from header (but not our documentation button)
        const robotElements = document.querySelectorAll('*');
        robotElements.forEach(el => {
            if (el.closest('.settings-section')) return;
            
            const text = (el.textContent || '').trim();
            const innerHTML = el.innerHTML || '';
            
            // Check for robot emoji in header area
            if (text === '🤖' || (innerHTML.includes('🤖') && el.children.length === 0)) {
                const rect = el.getBoundingClientRect();
                // Check if it's in the header area (top 20% of screen)
                if (rect.top < window.innerHeight * 0.2 && rect.width > 0 && rect.height > 0) {
                    this.hideElement(el);
                }
            }
        });
    }
    
    restoreCoder1Elements() {
        // Ensure Coder1 logo and branding elements are visible where appropriate
        const coder1Elements = document.querySelectorAll('[class*="coder1"], [id*="coder1"]');
        coder1Elements.forEach(el => {
            // Only restore elements that should be visible
            if (el.classList.contains('settings-section') || 
                el.classList.contains('coder1-logo') ||
                el.id === 'coder1-main-logo') {
                el.style.display = '';
                el.style.visibility = '';
                el.style.opacity = '';
            }
        });
    }
    
    hideElement(element) {
        if (!element) return;
        
        element.style.display = 'none !important';
        element.style.visibility = 'hidden !important';
        element.style.opacity = '0 !important';
        element.style.width = '0 !important';
        element.style.height = '0 !important';
        element.style.margin = '0 !important';
        element.style.padding = '0 !important';
        
        // Try to remove from DOM if safe
        try {
            if (element.parentElement && 
                element.parentElement.children.length === 1 &&
                !element.parentElement.closest('.settings-section')) {
                element.remove();
            }
        } catch (error) {
            // Ignore removal errors
        }
    }
    
    setupMutationObserver() {
        const observer = new MutationObserver((mutations) => {
            let shouldRunCleanup = false;
            
            mutations.forEach(mutation => {
                if (mutation.type === 'childList' && mutation.addedNodes.length > 0) {
                    // Check if new elements were added that might need cleanup
                    mutation.addedNodes.forEach(node => {
                        if (node.nodeType === 1) { // Element node
                            const text = (node.textContent || '').trim();
                            if (text.includes('SuperClaude') || 
                                text.includes('IDE Settings') || 
                                text === '🤖' ||
                                text.match(/×|✕|✖|⨯/)) {
                                shouldRunCleanup = true;
                            }
                        }
                    });
                }
            });
            
            if (shouldRunCleanup) {
                // Debounce cleanup calls
                clearTimeout(this.cleanupTimeout);
                this.cleanupTimeout = setTimeout(() => this.runCleanup(), 500);
            }
        });
        
        if (document.body) {
            observer.observe(document.body, { 
                childList: true, 
                subtree: true 
            });
        }
    }
}

// Initialize the unified cleanup system
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        new UICleanupSystem();
    });
} else {
    new UICleanupSystem();
}