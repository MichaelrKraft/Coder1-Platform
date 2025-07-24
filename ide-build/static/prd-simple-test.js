/**
 * Simple PRD Test - Direct panel creation
 */

(function() {
    'use strict';
    
    window.testPRDDirect = function() {
        console.log('🎯 Direct PRD test - creating panel...');
        
        // Remove any existing panel
        const existing = document.getElementById('prd-transfer-panel');
        if (existing) {
            existing.remove();
        }
        
        // Create panel HTML directly
        const panel = document.createElement('div');
        panel.id = 'prd-transfer-panel';
        panel.style.cssText = `
            position: fixed;
            top: 50%;
            right: 20px;
            transform: translateY(-50%);
            width: 450px;
            background: rgba(26, 27, 38, 0.98);
            border: 2px solid #8b5cf6;
            border-radius: 16px;
            z-index: 10000;
            color: #c0caf5;
            font-family: Inter, -apple-system, BlinkMacSystemFont, sans-serif;
            padding: 20px;
            box-shadow: 0 0 20px rgba(139, 92, 246, 0.8);
        `;
        
        panel.innerHTML = `
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px;">
                <h3 style="margin: 0; color: #8b5cf6;">PRD Test Panel</h3>
                <button onclick="this.parentElement.parentElement.remove()" style="
                    background: none;
                    border: none;
                    color: #f7768e;
                    font-size: 24px;
                    cursor: pointer;
                ">×</button>
            </div>
            <p>If you can see this panel, the PRD display system is working!</p>
            <p style="color: #7c3aed;">The issue is with the data detection or timing.</p>
            <button onclick="window.location.reload()" style="
                background: #7c3aed;
                color: white;
                border: none;
                padding: 10px 20px;
                border-radius: 6px;
                cursor: pointer;
                margin-top: 10px;
            ">Reload Page</button>
        `;
        
        document.body.appendChild(panel);
        console.log('✅ Test panel created');
    };
    
    // Update the test button to use this function
    setTimeout(() => {
        const button = document.getElementById('prd-test-button');
        if (button) {
            button.onclick = () => {
                window.testPRDDirect();
            };
            console.log('✅ Test button updated to use direct test');
        }
    }, 1000);
    
})();