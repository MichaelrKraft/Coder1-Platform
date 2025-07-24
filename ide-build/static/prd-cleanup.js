/**
 * PRD Cleanup Script
 * Ensures PRD popup only shows when there's an actual transfer from Smart PRD Generator
 */

(function() {
    'use strict';
    
    console.log('🧹 PRD Cleanup Script loaded');
    
    // Check if we're coming from the Smart PRD Generator with a transfer
    const urlParams = new URLSearchParams(window.location.search);
    const isTransfer = urlParams.get('project') === 'transfer' || urlParams.has('prd-transfer');
    
    console.log('🔍 PRD Cleanup: URL params:', window.location.search);
    console.log('🔍 PRD Cleanup: isTransfer:', isTransfer);
    
    if (!isTransfer) {
        // We're not in a transfer scenario, clean up any stale data
        console.log('🗑️ Not a transfer scenario - cleaning up stale PRD data');
        
        // Remove the transfer ready flag
        const transferReady = localStorage.getItem('projectTransferReady');
        if (transferReady) {
            console.log('🔧 Removing stale projectTransferReady flag');
            localStorage.removeItem('projectTransferReady');
        }
        
        // Optional: Remove old project data if it's older than 1 hour
        const projectData = localStorage.getItem('productCreationProject');
        const projectTimestamp = localStorage.getItem('productCreationProjectTimestamp');
        
        if (projectData && projectTimestamp) {
            const age = Date.now() - parseInt(projectTimestamp);
            const oneHour = 60 * 60 * 1000;
            
            if (age > oneHour) {
                console.log('🕐 Removing old project data (older than 1 hour)');
                localStorage.removeItem('productCreationProject');
                localStorage.removeItem('productCreationProjectTimestamp');
            }
        }
    } else {
        console.log('✅ Transfer scenario detected - PRD popup will show if data is available');
    }
})();