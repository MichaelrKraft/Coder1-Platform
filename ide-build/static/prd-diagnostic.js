/**
 * PRD Diagnostic Script - Check why PRD popup isn't showing
 */

(function() {
    console.log('🔍 PRD Diagnostic Check:');
    console.log('------------------------');
    
    // Check URL parameters
    const urlParams = new URLSearchParams(window.location.search);
    console.log('URL params:', window.location.search);
    console.log('Has project=transfer:', urlParams.get('project') === 'transfer');
    console.log('Has prd-transfer:', urlParams.has('prd-transfer'));
    
    // Check localStorage
    const projectData = localStorage.getItem('productCreationProject');
    const transferReady = localStorage.getItem('projectTransferReady');
    const timestamp = localStorage.getItem('productCreationProjectTimestamp');
    
    console.log('localStorage status:');
    console.log('- productCreationProject exists:', !!projectData);
    console.log('- projectTransferReady:', transferReady);
    console.log('- timestamp:', timestamp);
    
    if (projectData) {
        try {
            const project = JSON.parse(projectData);
            console.log('- Project title:', project.title || 'No title');
            console.log('- Project data keys:', Object.keys(project));
        } catch (e) {
            console.log('- Error parsing project data:', e);
        }
    }
    
    // Check if PRD panel already exists
    const existingPanel = document.getElementById('prd-transfer-panel');
    console.log('PRD panel in DOM:', !!existingPanel);
    
    // Manual trigger for testing
    window.testPRDPopup = function() {
        console.log('🚀 Manually triggering PRD popup...');
        
        // Set test data if none exists
        if (!projectData) {
            const testProject = {
                title: "Test Project",
                timestamp: Date.now(),
                projectType: "Web Application",
                questions: ["Q1", "Q2", "Q3", "Q4", "Q5"],
                answers: ["A1", "A2", "A3", "A4", "A5"],
                prd: { content: "This is a test PRD content" }
            };
            localStorage.setItem('productCreationProject', JSON.stringify(testProject));
            localStorage.setItem('productCreationProjectTimestamp', Date.now().toString());
        }
        
        // Set transfer ready flag
        localStorage.setItem('projectTransferReady', 'true');
        
        // Reload to trigger popup
        console.log('Reloading page to show popup...');
        window.location.reload();
    };
    
    console.log('------------------------');
    console.log('💡 To manually test PRD popup, run: testPRDPopup()');
})();