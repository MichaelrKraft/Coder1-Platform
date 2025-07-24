/**
 * Force show PRD popup for testing
 * This script ensures the PRD popup shows when conditions are met
 */

(function() {
    'use strict';
    
    console.log('🚀 PRD Force Show Script loaded');
    
    // Function to force show the PRD popup
    function forceShowPRD() {
        // Check URL for transfer parameter
        const urlParams = new URLSearchParams(window.location.search);
        const isTransfer = urlParams.get('project') === 'transfer' || urlParams.has('prd-transfer');
        
        if (!isTransfer) {
            console.log('⚠️ No transfer parameter in URL, skipping force show');
            return;
        }
        
        console.log('✅ Transfer parameter detected, checking for PRD data...');
        
        const projectData = localStorage.getItem('productCreationProject');
        const existingPanel = document.getElementById('prd-transfer-panel');
        
        if (projectData && !existingPanel) {
            console.log('📦 PRD data found and no panel exists, forcing display...');
            
            // Set the transfer ready flag
            localStorage.setItem('projectTransferReady', 'true');
            
            // Directly call the PRD transfer script's check function if it exists
            if (typeof window.checkForProjectTransfer === 'function') {
                console.log('🎯 Calling checkForProjectTransfer directly');
                window.checkForProjectTransfer();
            } else {
                console.log('⚠️ checkForProjectTransfer not found, reloading scripts...');
                // Force reload the PRD transfer script
                const script = document.createElement('script');
                script.src = './static/prd-project-transfer.js?' + Date.now();
                document.body.appendChild(script);
            }
        } else if (existingPanel) {
            console.log('📌 Panel already exists');
        } else {
            console.log('❌ No PRD data in localStorage');
        }
    }
    
    // Try multiple times with delays to catch different load scenarios
    forceShowPRD();
    setTimeout(forceShowPRD, 100);
    setTimeout(forceShowPRD, 500);
    setTimeout(forceShowPRD, 1000);
    setTimeout(forceShowPRD, 2000);
    
    // Also expose globally for manual testing
    window.forceShowPRD = forceShowPRD;
    
})();