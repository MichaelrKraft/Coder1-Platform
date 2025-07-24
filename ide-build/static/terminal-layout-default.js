// Terminal Layout Default - Set terminal/code to 80%, preview to 20%
(function() {
    'use strict';
    
    console.log('📐 Terminal Layout Default v2 - More aggressive approach...');
    
    function setTerminalLayoutDefault() {
        console.log('🔧 Attempting to set 80/20 layout...');
        
        // More aggressive approach - look for any element that might be a preview panel
        const allElements = document.querySelectorAll('*');
        let previewFound = false;
        let editorFound = false;
        
        allElements.forEach(el => {
            const className = (el.className || '').toString().toLowerCase();
            const id = (el.id || '').toLowerCase();
            const rect = el.getBoundingClientRect();
            
            // Skip if element is too small or not visible
            if (rect.width < 100 || rect.height < 100) return;
            
            // Check if this is a preview panel
            if (className.includes('preview') || id.includes('preview') || 
                className.includes('output') || id.includes('output') ||
                className.includes('result') || id.includes('result')) {
                
                // Check if it's taking up roughly half the screen (needs adjustment)
                const widthPercent = rect.width / window.innerWidth * 100;
                if (widthPercent > 30 && widthPercent < 70) {
                    console.log('📊 Found preview panel taking', widthPercent.toFixed(1) + '% - adjusting to 20%');
                    
                    // Apply multiple styling approaches
                    el.style.width = '20%';
                    el.style.maxWidth = '20%';
                    el.style.flex = '0 0 20%';
                    el.style.flexBasis = '20%';
                    el.style.flexGrow = '0';
                    el.style.flexShrink = '0';
                    
                    // Also try setting CSS custom properties if they exist
                    el.style.setProperty('--panel-width', '20%');
                    el.style.setProperty('--preview-width', '20%');
                    
                    previewFound = true;
                }
            }
            
            // Check if this is an editor/terminal panel
            if (className.includes('editor') || id.includes('editor') ||
                className.includes('terminal') || id.includes('terminal') ||
                className.includes('code') || id.includes('code')) {
                
                const widthPercent = rect.width / window.innerWidth * 100;
                if (widthPercent > 30 && widthPercent < 70) {
                    console.log('📝 Found editor/terminal panel taking', widthPercent.toFixed(1) + '% - adjusting to 80%');
                    
                    el.style.width = '80%';
                    el.style.maxWidth = '80%';
                    el.style.flex = '1 1 80%';
                    el.style.flexBasis = '80%';
                    el.style.flexGrow = '1';
                    
                    el.style.setProperty('--panel-width', '80%');
                    el.style.setProperty('--editor-width', '80%');
                    
                    editorFound = true;
                }
            }
        });
        
        // Method 1: Look for split panels with specific classes
        const splitPanels = document.querySelectorAll('.split-panel, .resizable-panel, .panel-group, [class*="split"], [class*="resize"]');
        
        if (splitPanels.length > 0) {
            console.log('Found split panels:', splitPanels.length);
            
            // Try to find the preview panel and resize it
            splitPanels.forEach(panel => {
                const isPreview = panel.classList.contains('preview') || 
                                 panel.querySelector('.preview') ||
                                 panel.querySelector('[class*="preview"]');
                
                if (isPreview) {
                    console.log('Found preview panel, setting to 20%');
                    panel.style.width = '20%';
                    panel.style.flexBasis = '20%';
                    panel.style.maxWidth = '20%';
                }
            });
        }
        
        // Method 2: Look for specific IDE layout containers
        const ideContainers = document.querySelectorAll('.ide-container, .ide-layout, .main-layout, [class*="ide"][class*="layout"]');
        
        ideContainers.forEach(container => {
            // Find code/terminal section
            const codeSection = container.querySelector('.code-editor, .editor-panel, [class*="editor"], [class*="code"]');
            const terminalSection = container.querySelector('.terminal, .terminal-panel, [class*="terminal"]');
            const previewSection = container.querySelector('.preview, .preview-panel, [class*="preview"]');
            
            if (codeSection && previewSection) {
                console.log('Setting code section to 80%');
                codeSection.style.width = '80%';
                codeSection.style.flex = '0 0 80%';
                
                console.log('Setting preview section to 20%');
                previewSection.style.width = '20%';
                previewSection.style.flex = '0 0 20%';
            }
        });
        
        // Method 3: Look for React-specific implementations
        const reactPanels = document.querySelectorAll('[data-panel-group], [data-panel], .react-resizable-panel');
        
        reactPanels.forEach(panel => {
            const panelType = panel.getAttribute('data-panel-type') || 
                            panel.getAttribute('data-panel') ||
                            panel.className;
            
            if (panelType && panelType.includes('preview')) {
                console.log('Found React preview panel, setting to 20%');
                panel.style.width = '20%';
                panel.style.flexBasis = '20%';
                
                // Also try to set the data attribute if it exists
                if (panel.hasAttribute('data-panel-size')) {
                    panel.setAttribute('data-panel-size', '20');
                }
            } else if (panelType && (panelType.includes('code') || panelType.includes('editor'))) {
                console.log('Found React code panel, setting to 80%');
                panel.style.width = '80%';
                panel.style.flexBasis = '80%';
                
                if (panel.hasAttribute('data-panel-size')) {
                    panel.setAttribute('data-panel-size', '80');
                }
            }
        });
        
        // Method 4: Look for flexbox containers
        const flexContainers = document.querySelectorAll('.flex-container, .flex-layout, [style*="display: flex"], [style*="display:flex"]');
        
        flexContainers.forEach(container => {
            const children = Array.from(container.children);
            
            // Look for a 3-panel layout (file tree, editor, preview)
            if (children.length >= 2) {
                const lastChild = children[children.length - 1];
                const previewKeywords = ['preview', 'output', 'result', 'live'];
                
                const isPreviewPanel = previewKeywords.some(keyword => 
                    lastChild.className.toLowerCase().includes(keyword) ||
                    lastChild.id.toLowerCase().includes(keyword)
                );
                
                if (isPreviewPanel) {
                    console.log('Found preview panel in flex container, adjusting sizes');
                    
                    // Set preview to 20%
                    lastChild.style.flex = '0 0 20%';
                    lastChild.style.width = '20%';
                    lastChild.style.maxWidth = '20%';
                    
                    // Set other panels to fill remaining 80%
                    for (let i = 0; i < children.length - 1; i++) {
                        children[i].style.flex = '1 1 auto';
                    }
                }
            }
        });
        
        // Method 5: Look for CSS Grid containers
        const gridContainers = document.querySelectorAll('[style*="display: grid"], [style*="display:grid"], .grid-container, .grid-layout');
        
        gridContainers.forEach(container => {
            const style = window.getComputedStyle(container);
            if (style.display === 'grid') {
                // Update grid template columns to 80% 20%
                const currentTemplate = style.gridTemplateColumns;
                if (currentTemplate && currentTemplate.includes('fr')) {
                    console.log('Updating grid template columns');
                    container.style.gridTemplateColumns = '4fr 1fr'; // 80% 20%
                }
            }
        });
        
        // Method 6: Terminal specific - expand terminal height
        const terminals = document.querySelectorAll('.terminal, .terminal-container, [class*="terminal"]');
        
        terminals.forEach(terminal => {
            const style = window.getComputedStyle(terminal);
            const currentHeight = parseInt(style.height);
            
            // If terminal seems collapsed (less than 300px), expand it
            if (currentHeight < 300) {
                console.log('Expanding terminal height');
                terminal.style.height = '400px';
                terminal.style.minHeight = '300px';
                terminal.style.maxHeight = '80vh';
            }
        });
        
        // Method 7: Look for splitter/divider elements
        const splitters = document.querySelectorAll('.splitter, .divider, .resize-handle, [class*="splitter"], [class*="divider"]');
        
        splitters.forEach(splitter => {
            // Try to trigger resize event to 80/20 split
            const parent = splitter.parentElement;
            if (parent) {
                const parentWidth = parent.offsetWidth;
                const newPosition = parentWidth * 0.8; // 80% position
                
                // Try to set splitter position
                splitter.style.left = `${newPosition}px`;
                
                // Dispatch resize event
                const resizeEvent = new MouseEvent('mouseup', {
                    clientX: newPosition,
                    bubbles: true
                });
                splitter.dispatchEvent(resizeEvent);
            }
        });
        
        console.log('✅ Terminal layout defaults applied');
    }
    
    // Run on initial load
    function initializeLayout() {
        // Wait a bit for React components to render
        setTimeout(setTerminalLayoutDefault, 1000);
        setTimeout(setTerminalLayoutDefault, 2000);
        setTimeout(setTerminalLayoutDefault, 3000);
    }
    
    // Initialize when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initializeLayout);
    } else {
        initializeLayout();
    }
    
    // Watch for dynamic changes
    const observer = new MutationObserver((mutations) => {
        // Only react to major structural changes
        const hasSignificantChange = mutations.some(mutation => 
            mutation.type === 'childList' && 
            mutation.addedNodes.length > 0 &&
            Array.from(mutation.addedNodes).some(node => 
                node.nodeType === 1 && 
                (node.classList?.contains('terminal') || 
                 node.classList?.contains('preview') ||
                 node.classList?.contains('editor'))
            )
        );
        
        if (hasSignificantChange) {
            console.log('Layout structure changed, reapplying defaults');
            setTimeout(setTerminalLayoutDefault, 500);
        }
    });
    
    // Start observing when body is available
    const startObserving = setInterval(() => {
        if (document.body) {
            clearInterval(startObserving);
            observer.observe(document.body, {
                childList: true,
                subtree: true
            });
        }
    }, 100);
    
})();