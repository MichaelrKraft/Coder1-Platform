// Verify V4 is loaded and working
console.log('🔍 Verifying Special Views V4...');

// Check for V4-specific functions
setTimeout(function() {
    const checks = {
        'showSpecialView': typeof window.showSpecialView === 'function',
        'handleSpecTypeChange': typeof window.handleSpecTypeChange === 'function',
        'selectTemplate': typeof window.selectTemplate === 'function',
        'startInfiniteLoop': typeof window.startInfiniteLoop === 'function',
        'stopInfiniteLoop': typeof window.stopInfiniteLoop === 'function',
        'wakeUpSystem': typeof window.wakeUpSystem === 'function'
    };
    
    console.log('✅ V4 Function Check:', checks);
    
    // Test if CSS classes are available
    const testDiv = document.createElement('div');
    testDiv.className = 'template-card';
    document.body.appendChild(testDiv);
    const computed = window.getComputedStyle(testDiv);
    const hasTemplateCardStyles = computed.backgroundColor !== 'rgba(0, 0, 0, 0)';
    testDiv.remove();
    
    console.log('✅ CSS Classes Loaded:', hasTemplateCardStyles);
    
    // Add version indicator
    const versionDiv = document.createElement('div');
    versionDiv.style.cssText = `
        position: fixed;
        top: 10px;
        right: 10px;
        background: #8b5cf6;
        color: white;
        padding: 8px 16px;
        border-radius: 8px;
        font-size: 14px;
        z-index: 999999;
    `;
    versionDiv.textContent = 'Special Views V4 - Full Interactive';
    document.body.appendChild(versionDiv);
    
    // Remove after 5 seconds
    setTimeout(() => versionDiv.remove(), 5000);
    
}, 1000);