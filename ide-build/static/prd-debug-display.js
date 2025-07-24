/**
 * Debug PRD Display - Find exactly where it's failing
 */

(function() {
    'use strict';
    
    // Override displayProjectTransferPanel with debugging
    window.debugPRDDisplay = function() {
        console.log('🔍 Starting PRD debug...');
        
        // Step 1: Check if function exists
        if (!window.displayProjectTransferPanel) {
            console.error('❌ displayProjectTransferPanel does not exist!');
            return;
        }
        
        // Step 2: Create test project
        const testProject = {
            title: "Test Project",
            timestamp: Date.now(),
            projectType: "Web App",
            questions: [{question: "Q1"}],
            answers: ["A1"],
            prd: { content: "Test PRD" }
        };
        
        console.log('✅ Test project created:', testProject);
        
        // Step 3: Backup original function
        const originalDisplay = window.displayProjectTransferPanel;
        
        // Step 4: Create wrapper with error catching
        window.displayProjectTransferPanel = function(project) {
            console.log('🎯 displayProjectTransferPanel called with:', project);
            try {
                // Call original function
                return originalDisplay.call(this, project);
            } catch (error) {
                console.error('❌ Error in displayProjectTransferPanel:', error);
                console.error('Stack trace:', error.stack);
                
                // Try to display error panel
                const errorPanel = document.createElement('div');
                errorPanel.style.cssText = `
                    position: fixed;
                    top: 50%;
                    right: 20px;
                    transform: translateY(-50%);
                    width: 450px;
                    background: #ff0000;
                    border: 2px solid #ff6666;
                    border-radius: 16px;
                    z-index: 10000;
                    color: white;
                    padding: 20px;
                `;
                errorPanel.innerHTML = `
                    <h3>PRD Display Error</h3>
                    <p>Error: ${error.message}</p>
                    <pre style="font-size: 12px; overflow: auto; max-height: 200px;">${error.stack}</pre>
                    <button onclick="this.parentElement.remove()" style="
                        background: white;
                        color: red;
                        border: none;
                        padding: 10px 20px;
                        border-radius: 6px;
                        cursor: pointer;
                        margin-top: 10px;
                    ">Close</button>
                `;
                document.body.appendChild(errorPanel);
            }
        };
        
        // Step 5: Try to display
        console.log('🚀 Attempting to display panel...');
        window.displayProjectTransferPanel(testProject);
        
        // Restore original function after a delay
        setTimeout(() => {
            window.displayProjectTransferPanel = originalDisplay;
            console.log('✅ Original function restored');
        }, 5000);
    };
    
    // Update test button
    setTimeout(() => {
        const button = document.getElementById('prd-test-button');
        if (button) {
            button.onclick = () => {
                window.debugPRDDisplay();
            };
            console.log('✅ Test button updated to use debug display');
        }
    }, 1000);
    
})();