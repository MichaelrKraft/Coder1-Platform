// Test Special Views - Debug Script
console.log('🧪 Test Special Views Script Loaded');

// Add test buttons to page for debugging
function addTestButtons() {
    const container = document.createElement('div');
    container.id = 'special-views-test-panel';
    container.style.cssText = `
        position: fixed;
        bottom: 20px;
        left: 20px;
        background: rgba(0, 0, 0, 0.8);
        border: 2px solid #8b5cf6;
        border-radius: 8px;
        padding: 16px;
        z-index: 99999;
        display: flex;
        flex-direction: column;
        gap: 8px;
    `;
    
    container.innerHTML = `
        <h3 style="color: white; margin: 0 0 8px 0; font-size: 14px;">Special Views Test Panel</h3>
        <button onclick="window.showSpecialView('supervision')" style="padding: 8px; background: #8b5cf6; color: white; border: none; border-radius: 4px; cursor: pointer;">Test Supervision</button>
        <button onclick="window.showSpecialView('sleep-mode')" style="padding: 8px; background: #8b5cf6; color: white; border: none; border-radius: 4px; cursor: pointer;">Test Sleep Mode</button>
        <button onclick="window.showSpecialView('infinite-loop')" style="padding: 8px; background: #8b5cf6; color: white; border: none; border-radius: 4px; cursor: pointer;">Test Infinite Loop</button>
        <button onclick="window.showSpecialView('parallel-agents')" style="padding: 8px; background: #8b5cf6; color: white; border: none; border-radius: 4px; cursor: pointer;">Test Parallel Agents</button>
        <button onclick="document.getElementById('special-views-test-panel').remove()" style="padding: 8px; background: #ef4444; color: white; border: none; border-radius: 4px; cursor: pointer;">Close Test Panel</button>
    `;
    
    document.body.appendChild(container);
    console.log('✅ Test panel added to page');
}

// Wait for page to load
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', addTestButtons);
} else {
    addTestButtons();
}

// Also log the state of special views
setInterval(() => {
    console.log('Special Views Status:', {
        showSpecialView: typeof window.showSpecialView,
        overlayExists: !!document.querySelector('.coder1-special-view-overlay'),
        testPanelExists: !!document.getElementById('special-views-test-panel')
    });
}, 5000);