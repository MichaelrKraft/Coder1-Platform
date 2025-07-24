// Stop Button Debug Script
console.log('🔍 Stop Button Debug Script Loading...');

// Monitor for stop button creation
const originalAppendChild = document.body.appendChild;
document.body.appendChild = function(element) {
    if (element.id === 'infinite-stop-btn') {
        console.log('✅ Stop button being added to DOM!');
        console.log('Button styles:', element.style.cssText);
        console.log('Button z-index:', element.style.zIndex);
        
        // Check visibility after a short delay
        setTimeout(() => {
            const rect = element.getBoundingClientRect();
            console.log('Button position:', {
                top: rect.top,
                left: rect.left,
                bottom: rect.bottom,
                right: rect.right,
                width: rect.width,
                height: rect.height,
                visible: rect.width > 0 && rect.height > 0
            });
            
            // Check if button is covered by other elements
            const elementAtPoint = document.elementFromPoint(rect.right - 10, rect.bottom - 10);
            console.log('Element at button position:', elementAtPoint);
            
            if (elementAtPoint !== element) {
                console.warn('⚠️ Stop button might be covered by:', elementAtPoint);
            }
        }, 100);
    }
    
    return originalAppendChild.call(this, element);
};

// Override addStopButton to add extra debugging
if (window.addStopButton) {
    const originalAddStopButton = window.addStopButton;
    window.addStopButton = function(sessionId) {
        console.log('🎯 addStopButton called with sessionId:', sessionId);
        return originalAddStopButton.call(this, sessionId);
    };
}

// Monitor startInfiniteLoop
let checkCount = 0;
const checkInterval = setInterval(() => {
    checkCount++;
    if (window.startInfiniteLoop) {
        clearInterval(checkInterval);
        console.log('✅ Found startInfiniteLoop function');
        
        const originalStartInfiniteLoop = window.startInfiniteLoop;
        window.startInfiniteLoop = async function() {
            console.log('🚀 startInfiniteLoop called!');
            try {
                const result = await originalStartInfiniteLoop.call(this);
                console.log('startInfiniteLoop result:', result);
                return result;
            } catch (error) {
                console.error('startInfiniteLoop error:', error);
                throw error;
            }
        };
    } else if (checkCount > 50) {
        clearInterval(checkInterval);
        console.warn('⚠️ Could not find startInfiniteLoop after 10 seconds');
    }
}, 200);

console.log('✅ Stop Button Debug Script Ready');