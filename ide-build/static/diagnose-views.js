// Diagnose which special views script is actually running
console.log('🔍 DIAGNOSING SPECIAL VIEWS...');

// Check all loaded scripts
const scripts = Array.from(document.querySelectorAll('script')).map(s => s.src);
console.log('📜 All loaded scripts:', scripts.filter(s => s.includes('special-views')));

// Check which showSpecialView is active
if (window.showSpecialView) {
    console.log('✅ showSpecialView exists');
    
    // Override temporarily to see what's being called
    const originalShow = window.showSpecialView;
    window.showSpecialView = function(type) {
        console.log('🎯 showSpecialView called with:', type);
        
        // Create a test to see which version is running
        const testOverlay = document.createElement('div');
        testOverlay.innerHTML = '<div id="view-test"></div>';
        document.body.appendChild(testOverlay);
        
        // Call original
        originalShow(type);
        
        // Check what was created
        setTimeout(() => {
            const hasTemplateGrid = !!document.querySelector('.template-grid');
            const hasInfiniteAgentLoop = document.body.innerHTML.includes('Infinite Agent Loop');
            const hasTemplateCards = !!document.querySelector('.template-card');
            
            console.log('📊 View Analysis:', {
                hasTemplateGrid,
                hasTemplateCards,
                hasInfiniteAgentLoop,
                viewType: type
            });
            
            // Show which version is running
            const versionInfo = document.createElement('div');
            versionInfo.style.cssText = `
                position: fixed;
                bottom: 20px;
                right: 20px;
                background: ${hasTemplateGrid ? '#10b981' : '#ef4444'};
                color: white;
                padding: 12px 20px;
                border-radius: 8px;
                font-size: 14px;
                z-index: 999999;
                box-shadow: 0 4px 12px rgba(0,0,0,0.3);
            `;
            versionInfo.innerHTML = `
                <div>View Type: ${type}</div>
                <div>Has Templates: ${hasTemplateGrid ? '✅ YES' : '❌ NO'}</div>
                <div>Version: ${hasTemplateGrid ? 'V4 Interactive' : 'V3 Static'}</div>
            `;
            document.body.appendChild(versionInfo);
            
            // Remove after 10 seconds
            setTimeout(() => versionInfo.remove(), 10000);
            
            testOverlay.remove();
        }, 500);
    };
    
    console.log('✅ Diagnostic wrapper installed');
} else {
    console.error('❌ showSpecialView not found!');
}

// List all special view related functions
const specialViewFunctions = [
    'showSpecialView',
    'handleSpecTypeChange',
    'selectTemplate',
    'startInfiniteLoop',
    'stopInfiniteLoop',
    'wakeUpSystem',
    'createSupervisionView',
    'createSleepModeView',
    'createInfiniteLoopView',
    'createParallelAgentsView'
];

const functionStatus = {};
specialViewFunctions.forEach(fn => {
    functionStatus[fn] = typeof window[fn] !== 'undefined' ? '✅' : '❌';
});

console.log('📋 Function Status:', functionStatus);

// Check for multiple versions
if (window.showSpecialView && window.showSpecialView.toString().includes('Infinite Agent Loop')) {
    console.error('❌ WRONG VERSION: V3 is running (has "Infinite Agent Loop")');
} else if (window.showSpecialView && window.showSpecialView.toString().includes('template-grid')) {
    console.log('✅ CORRECT VERSION: V4 is running (has template-grid)');
} else {
    console.warn('⚠️ Cannot determine version from function content');
}