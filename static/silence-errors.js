/**
 * Silence API errors when running without backend
 */
(function() {
    // Override console.error to filter out service unavailable messages
    const originalError = console.error;
    console.error = function(...args) {
        const message = args.join(' ');
        if (!message.includes('Service temporarily unavailable') && 
            !message.includes('Failed to fetch') &&
            !message.includes('analytics')) {
            originalError.apply(console, args);
        }
    };

    // Hide error messages in the UI
    const style = document.createElement('style');
    style.textContent = `
        /* Hide service unavailable messages */
        .chat-message:has-text("Service temporarily unavailable") {
            display: none !important;
        }
        
        /* Hide any error messages containing these texts */
        *:has-text("Service temporarily unavailable"),
        *:has-text("Failed to fetch") {
            display: none !important;
        }
    `;
    document.head.appendChild(style);

    // Prevent error messages from being added to chat
    if (window.productCreationHub) {
        const originalAddMessage = window.productCreationHub.addMessageToChat;
        window.productCreationHub.addMessageToChat = function(message, type) {
            if (!message.includes('Service temporarily unavailable') && 
                !message.includes('try again later')) {
                originalAddMessage.call(this, message, type);
            }
        };
    }

    // Retry with delay to catch late initialization
    setTimeout(() => {
        if (window.productCreationHub) {
            const originalAddMessage = window.productCreationHub.addMessageToChat;
            window.productCreationHub.addMessageToChat = function(message, type) {
                if (!message.includes('Service temporarily unavailable') && 
                    !message.includes('try again later')) {
                    originalAddMessage.call(this, message, type);
                }
            };
        }
    }, 1000);
})();