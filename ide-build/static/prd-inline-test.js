/**
 * Inline PRD Test - Test functions directly
 */

(function() {
    'use strict';
    
    // Create a button that tests everything inline
    const testButton = document.createElement('button');
    testButton.innerHTML = '🔧 Debug PRD Functions';
    testButton.style.cssText = `
        position: fixed;
        bottom: 160px;
        right: 20px;
        padding: 12px 24px;
        background: #ff6b00;
        color: white;
        border: none;
        border-radius: 8px;
        font-size: 16px;
        font-weight: 600;
        cursor: pointer;
        z-index: 9999;
    `;
    
    testButton.onclick = function() {
        console.log('=== PRD FUNCTION DEBUG ===');
        console.log('window.displayProjectTransferPanel exists:', typeof window.displayProjectTransferPanel);
        console.log('window.checkForProjectTransfer exists:', typeof window.checkForProjectTransfer);
        console.log('window.injectPRDTransferCSS exists:', typeof window.injectPRDTransferCSS);
        
        // List all window properties containing 'prd' or 'PRD'
        const prdFunctions = Object.keys(window).filter(key => 
            key.toLowerCase().includes('prd') || 
            key.toLowerCase().includes('transfer') ||
            key.toLowerCase().includes('project')
        );
        console.log('All PRD-related window properties:', prdFunctions);
        
        // Try to create panel directly inline
        console.log('Creating panel directly...');
        
        const panel = document.createElement('div');
        panel.id = 'prd-transfer-panel-test';
        panel.innerHTML = `
            <style>
                #prd-transfer-panel-test {
                    position: fixed !important;
                    top: 50% !important;
                    right: 20px !important;
                    transform: translateY(-50%) !important;
                    width: 450px !important;
                    background: rgba(26, 27, 38, 0.98) !important;
                    border: 2px solid #8b5cf6 !important;
                    border-radius: 16px !important;
                    padding: 20px !important;
                    z-index: 999999 !important;
                    color: #c0caf5 !important;
                    box-shadow: 0 0 40px rgba(139, 92, 246, 0.8) !important;
                }
            </style>
            <h3 style="color: #8b5cf6; margin: 0 0 16px 0;">PRD Transfer Panel (Direct)</h3>
            <p>This panel was created directly without using any functions.</p>
            <p style="color: #7c3aed;">If you see this, the issue is with function loading/timing.</p>
            <button onclick="document.getElementById('prd-transfer-panel-test').remove()" style="
                background: #7c3aed;
                color: white;
                border: none;
                padding: 10px 20px;
                border-radius: 6px;
                cursor: pointer;
                margin-top: 10px;
            ">Close</button>
        `;
        
        // Remove any existing test panel
        const existing = document.getElementById('prd-transfer-panel-test');
        if (existing) existing.remove();
        
        document.body.appendChild(panel);
        console.log('✅ Direct panel created');
    };
    
    document.body.appendChild(testButton);
    console.log('🔧 Debug button added');
    
})();