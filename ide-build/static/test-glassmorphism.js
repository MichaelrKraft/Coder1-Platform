// Test script to verify glassmorphism is working
(function() {
    // Add test button to quickly test special views
    const testButton = document.createElement('button');
    testButton.textContent = 'Test Glassmorphism';
    testButton.style.cssText = `
        position: fixed;
        bottom: 20px;
        right: 20px;
        z-index: 10000;
        background: #8b5cf6;
        color: white;
        border: none;
        padding: 10px 20px;
        border-radius: 8px;
        cursor: pointer;
        font-family: Inter, sans-serif;
        font-weight: 500;
    `;
    
    let viewIndex = 0;
    const views = ['supervision', 'sleep', 'infinite', 'parallel'];
    
    testButton.addEventListener('click', () => {
        // Show next view in sequence
        if (window.showSpecialView) {
            window.showSpecialView(views[viewIndex]);
            viewIndex = (viewIndex + 1) % views.length;
            testButton.textContent = `Test Glassmorphism (Next: ${views[viewIndex]})`;
        } else {
            console.error('showSpecialView not available');
        }
    });
    
    // Wait for DOM to be ready
    setTimeout(() => {
        document.body.appendChild(testButton);
        console.log('✅ Glassmorphism test button added');
    }, 2000);
})();