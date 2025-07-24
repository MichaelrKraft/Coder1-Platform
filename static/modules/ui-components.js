/**
 * UI Components Module
 * Handles DOM manipulation, chat interface, and modal management
 */

class UIComponents {
    constructor() {
        this.chatContainer = null;
        this.messageInput = null;
        this.sendButton = null;
        this.modals = new Map();
        
        this.initializeElements();
        this.setupEventListeners();
    }
    
    initializeElements() {
        // Chat elements
        this.chatContainer = document.getElementById('chatMessages');
        this.messageInput = document.getElementById('messageInput');
        this.sendButton = document.getElementById('sendMessage');
        
        // Create chat container if it doesn't exist
        if (!this.chatContainer) {
            this.createChatInterface();
        }
    }
    
    createChatInterface() {
        const chatContainer = document.createElement('div');
        chatContainer.id = 'chatMessages';
        chatContainer.className = 'chat-messages';
        
        const inputContainer = document.createElement('div');
        inputContainer.className = 'input-container';
        
        const messageInput = document.createElement('input');
        messageInput.id = 'messageInput';
        messageInput.type = 'text';
        messageInput.placeholder = 'Type your message...';
        
        const sendButton = document.createElement('button');
        sendButton.id = 'sendMessage';
        sendButton.textContent = 'Send';
        
        inputContainer.appendChild(messageInput);
        inputContainer.appendChild(sendButton);
        
        const chatSection = document.querySelector('.chat-section') || document.body;
        chatSection.appendChild(chatContainer);
        chatSection.appendChild(inputContainer);
        
        this.chatContainer = chatContainer;
        this.messageInput = messageInput;
        this.sendButton = sendButton;
    }
    
    setupEventListeners() {
        if (this.sendButton) {
            this.sendButton.addEventListener('click', () => this.handleSendMessage());
        }
        
        if (this.messageInput) {
            this.messageInput.addEventListener('keypress', (e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    this.handleSendMessage();
                }
            });
        }
    }
    
    handleSendMessage() {
        const message = this.messageInput?.value?.trim();
        if (!message) return;
        
        // Check if wizard is waiting for answer
        if (window.WizardController.waitingForAnswer) {
            const success = window.WizardController.submitAnswer(message);
            if (success) {
                this.messageInput.value = '';
            }
        } else {
            // Handle as regular message
            this.addMessageToChat(message, 'user');
            this.messageInput.value = '';
            
            // Process message (could be starting wizard, etc.)
            this.processMessage(message);
        }
    }
    
    processMessage(message) {
        // Check if this looks like a project request
        if (message.length > 10 && !window.WizardController.waitingForAnswer) {
            // Start wizard with this message
            const project = window.WizardController.initializeWizard(message);
            
            this.addMessageToChat(
                `I'll help you create a comprehensive PRD for your project: "${message}". Let me ask you some questions to better understand your needs.`,
                'assistant'
            );
            
            if (window.TimerManager) {
                window.TimerManager.setTimeout(() => {
                    window.WizardController.startQuestionFlow();
                }, 1500);
            } else {
                setTimeout(() => {
                    window.WizardController.startQuestionFlow();
                }, 1500);
            }
        }
    }
    
    addMessageToChat(message, sender) {
        if (!this.chatContainer) return;
        
        const messageDiv = document.createElement('div');
        messageDiv.className = `message ${sender}`;
        
        const messageContent = document.createElement('div');
        messageContent.className = 'message-content';
        messageContent.textContent = message;
        
        const timestamp = document.createElement('div');
        timestamp.className = 'message-timestamp';
        timestamp.textContent = new Date().toLocaleTimeString();
        
        messageDiv.appendChild(messageContent);
        messageDiv.appendChild(timestamp);
        
        this.chatContainer.appendChild(messageDiv);
        this.chatContainer.scrollTop = this.chatContainer.scrollHeight;
    }
    
    clearChat() {
        if (this.chatContainer) {
            this.chatContainer.innerHTML = '';
        }
    }
    
    showModal(modalId, content) {
        // Remove existing modal
        this.hideModal(modalId);
        
        const modal = document.createElement('div');
        modal.className = 'modal-overlay';
        modal.id = modalId;
        
        const modalContent = document.createElement('div');
        modalContent.className = 'modal-content';
        
        const closeButton = document.createElement('button');
        closeButton.className = 'modal-close';
        closeButton.innerHTML = '×';
        closeButton.onclick = () => this.hideModal(modalId);
        
        modalContent.appendChild(closeButton);
        
        if (typeof content === 'string') {
            modalContent.innerHTML += content;
        } else {
            modalContent.appendChild(content);
        }
        
        modal.appendChild(modalContent);
        document.body.appendChild(modal);
        
        this.modals.set(modalId, modal);
        
        // Add click outside to close
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                this.hideModal(modalId);
            }
        });
    }
    
    hideModal(modalId) {
        const modal = this.modals.get(modalId) || document.getElementById(modalId);
        if (modal) {
            modal.remove();
            this.modals.delete(modalId);
        }
    }
    
    showToast(message, type = 'info') {
        const toast = document.createElement('div');
        toast.className = `toast toast-${type}`;
        toast.textContent = message;
        
        document.body.appendChild(toast);
        
        // Auto remove after 3 seconds
        if (window.TimerManager) {
            window.TimerManager.setTimeout(() => {
                toast.remove();
            }, 3000);
        } else {
            setTimeout(() => {
                toast.remove();
            }, 3000);
        }
    }
    
    updateStepProgress(step, total, percentage) {
        const progressBar = document.querySelector('.progress-fill');
        const progressText = document.querySelector('.progress-text');
        const stepIndicator = document.querySelector('.step-indicator');
        
        if (progressBar) {
            progressBar.style.width = `${percentage}%`;
        }
        
        if (progressText) {
            progressText.textContent = `Step ${step} of ${total} (${percentage}% Complete)`;
        }
        
        if (stepIndicator) {
            stepIndicator.textContent = `${step}/${total}`;
        }
    }
    
    showLoadingState(element, message = 'Loading...') {
        if (!element) return;
        
        element.disabled = true;
        element.originalContent = element.innerHTML;
        element.innerHTML = `<span class="loading-spinner"></span> ${message}`;
    }
    
    hideLoadingState(element) {
        if (!element || !element.originalContent) return;
        
        element.disabled = false;
        element.innerHTML = element.originalContent;
        delete element.originalContent;
    }
    
    enableButton(buttonId) {
        const button = document.getElementById(buttonId);
        if (button) {
            button.disabled = false;
            button.style.opacity = '1';
        }
    }
    
    disableButton(buttonId) {
        const button = document.getElementById(buttonId);
        if (button) {
            button.disabled = true;
            button.style.opacity = '0.5';
        }
    }
    
    highlightSuccess(elementId) {
        const element = document.getElementById(elementId);
        if (element) {
            element.classList.add('success-highlight');
            if (window.TimerManager) {
                window.TimerManager.setTimeout(() => {
                    element.classList.remove('success-highlight');
                }, 2000);
            } else {
                setTimeout(() => {
                    element.classList.remove('success-highlight');
                }, 2000);
            }
        }
    }
}

// Export singleton instance
window.UIComponents = new UIComponents();