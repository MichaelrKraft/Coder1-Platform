// Diagnostic script to verify terminal layout
(function() {
    'use strict';
    
    console.log('🔍 Terminal Layout Verification Starting...');
    
    function checkLayout() {
        console.log('\n=== TERMINAL LAYOUT CHECK ===');
        
        // Check for various panel implementations
        const panels = {
            splitPanels: document.querySelectorAll('.split-panel, .resizable-panel, .panel-group, [class*="split"], [class*="resize"]'),
            ideContainers: document.querySelectorAll('.ide-container, .ide-layout, .main-layout, [class*="ide"][class*="layout"]'),
            reactPanels: document.querySelectorAll('[data-panel-group], [data-panel], .react-resizable-panel'),
            flexContainers: document.querySelectorAll('.flex-container, .flex-layout, [style*="display: flex"], [style*="display:flex"]'),
            terminals: document.querySelectorAll('.terminal, .terminal-container, [class*="terminal"]'),
            previews: document.querySelectorAll('.preview, .preview-panel, [class*="preview"]'),
            editors: document.querySelectorAll('.code-editor, .editor-panel, [class*="editor"], [class*="code"]')
        };
        
        // Log findings
        Object.entries(panels).forEach(([key, elements]) => {
            console.log(`${key}: ${elements.length} found`);
            if (elements.length > 0 && elements.length < 5) {
                elements.forEach((el, i) => {
                    const rect = el.getBoundingClientRect();
                    const style = window.getComputedStyle(el);
                    console.log(`  ${i}: ${el.className || el.tagName}`, {
                        width: rect.width,
                        widthPercent: (rect.width / window.innerWidth * 100).toFixed(1) + '%',
                        flex: style.flex,
                        flexBasis: style.flexBasis,
                        display: style.display
                    });
                });
            }
        });
        
        // Check if layout appears correct
        const previewPanels = panels.previews;
        const editorPanels = panels.editors;
        
        let layoutCorrect = false;
        
        previewPanels.forEach(preview => {
            const rect = preview.getBoundingClientRect();
            const widthPercent = rect.width / window.innerWidth * 100;
            
            if (widthPercent > 15 && widthPercent < 25) {
                console.log('✅ Preview panel appears to be ~20%:', widthPercent.toFixed(1) + '%');
                layoutCorrect = true;
            }
        });
        
        editorPanels.forEach(editor => {
            const rect = editor.getBoundingClientRect();
            const widthPercent = rect.width / window.innerWidth * 100;
            
            if (widthPercent > 60 && widthPercent < 85) {
                console.log('✅ Editor/terminal panel appears to be ~80%:', widthPercent.toFixed(1) + '%');
            }
        });
        
        if (!layoutCorrect && previewPanels.length > 0) {
            console.log('⚠️ Layout may not be correctly set to 80/20');
        }
        
        console.log('=== END LAYOUT CHECK ===\n');
    }
    
    // Run checks at intervals
    setTimeout(checkLayout, 2000);
    setTimeout(checkLayout, 5000);
    setTimeout(checkLayout, 10000);
    
    // Add manual check function
    window.checkTerminalLayout = checkLayout;
    
    console.log('💡 You can manually run layout check by typing: checkTerminalLayout()');
    
})();