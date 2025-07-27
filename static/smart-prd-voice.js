/**
 * Smart PRD Voice Input Module
 * Enables speech-to-text functionality for PRD creation
 */

(function() {
    'use strict';

    class SmartPRDVoice {
        constructor() {
            this.recognition = null;
            this.isListening = false;
            this.currentInput = null;
            this.voiceButton = null;
            this.initializeSpeechRecognition();
        }

        initializeSpeechRecognition() {
            // Check for browser support
            const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
            
            if (!SpeechRecognition) {
                console.warn('Speech recognition not supported in this browser');
                return;
            }

            this.recognition = new SpeechRecognition();
            this.recognition.continuous = false;
            this.recognition.interimResults = true;
            this.recognition.lang = 'en-US';

            // Set up event handlers
            this.recognition.onstart = () => {
                this.isListening = true;
                this.updateButtonState();
                console.log('Voice recognition started');
            };

            this.recognition.onend = () => {
                this.isListening = false;
                this.updateButtonState();
                console.log('Voice recognition ended');
            };

            this.recognition.onresult = (event) => {
                const transcript = Array.from(event.results)
                    .map(result => result[0].transcript)
                    .join('');

                if (this.currentInput) {
                    // Update the input field with the transcript
                    this.currentInput.value = transcript;
                    
                    // Trigger input event for any listeners
                    const inputEvent = new Event('input', { bubbles: true });
                    this.currentInput.dispatchEvent(inputEvent);

                    // If this is a final result, focus back on the input
                    if (event.results[event.results.length - 1].isFinal) {
                        this.currentInput.focus();
                        // Place cursor at end
                        this.currentInput.setSelectionRange(this.currentInput.value.length, this.currentInput.value.length);
                    }
                }
            };

            this.recognition.onerror = (event) => {
                console.error('Voice recognition error:', event.error);
                this.isListening = false;
                this.updateButtonState();
                
                // Show user-friendly error message
                if (event.error === 'no-speech') {
                    this.showTooltip('No speech detected. Please try again.');
                } else if (event.error === 'not-allowed') {
                    this.showTooltip('Microphone access denied. Please enable microphone permissions.');
                } else {
                    this.showTooltip('Voice recognition error. Please try again.');
                }
            };

            // Initialize UI after DOM is loaded
            if (document.readyState === 'loading') {
                document.addEventListener('DOMContentLoaded', () => this.initializeUI());
            } else {
                this.initializeUI();
            }
        }

        initializeUI() {
            // Add voice buttons to all text inputs and textareas
            this.addVoiceButtons();

            // Watch for dynamically added inputs
            this.observeNewInputs();
        }

        addVoiceButtons() {
            // Find all text inputs and textareas in the PRD form
            const inputs = document.querySelectorAll(
                'input[type="text"]:not([data-voice-enabled]), ' +
                'textarea:not([data-voice-enabled])'
            );

            inputs.forEach(input => {
                this.addVoiceButtonToInput(input);
            });
        }

        addVoiceButtonToInput(input) {
            // Skip if already processed
            if (input.getAttribute('data-voice-enabled') === 'true') return;

            // Mark as processed
            input.setAttribute('data-voice-enabled', 'true');

            // Create wrapper if input isn't already wrapped
            let wrapper = input.parentElement;
            if (!wrapper.classList.contains('voice-input-wrapper')) {
                wrapper = document.createElement('div');
                wrapper.className = 'voice-input-wrapper';
                input.parentNode.insertBefore(wrapper, input);
                wrapper.appendChild(input);
            }

            // Create voice button
            const voiceBtn = document.createElement('button');
            voiceBtn.className = 'voice-input-btn';
            voiceBtn.type = 'button';
            voiceBtn.innerHTML = '<i class="fas fa-microphone"></i>';
            voiceBtn.title = 'Click to use voice input';
            
            // Position the button
            wrapper.appendChild(voiceBtn);

            // Add click handler
            voiceBtn.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                this.toggleVoiceInput(input, voiceBtn);
            });
        }

        toggleVoiceInput(input, button) {
            if (!this.recognition) {
                this.showTooltip('Voice recognition not supported in this browser');
                return;
            }

            if (this.isListening) {
                this.recognition.stop();
            } else {
                this.currentInput = input;
                this.voiceButton = button;
                
                // Request microphone permission and start recognition
                this.recognition.start();
                
                // Focus the input field
                input.focus();
            }
        }

        updateButtonState() {
            if (this.voiceButton) {
                if (this.isListening) {
                    this.voiceButton.classList.add('listening');
                    this.voiceButton.innerHTML = '<i class="fas fa-microphone-slash"></i>';
                    this.voiceButton.title = 'Click to stop voice input';
                } else {
                    this.voiceButton.classList.remove('listening');
                    this.voiceButton.innerHTML = '<i class="fas fa-microphone"></i>';
                    this.voiceButton.title = 'Click to use voice input';
                }
            }
        }

        observeNewInputs() {
            // Watch for dynamically added inputs (e.g., in modals or new form sections)
            const observer = new MutationObserver((mutations) => {
                mutations.forEach((mutation) => {
                    mutation.addedNodes.forEach((node) => {
                        if (node.nodeType === 1) { // Element node
                            // Check if it's an input or contains inputs
                            if (this.isTextInput(node)) {
                                this.addVoiceButtonToInput(node);
                            } else if (node.querySelectorAll) {
                                const inputs = node.querySelectorAll(
                                    'input[type="text"]:not([data-voice-enabled]), ' +
                                    'textarea:not([data-voice-enabled])'
                                );
                                inputs.forEach(input => this.addVoiceButtonToInput(input));
                            }
                        }
                    });
                });
            });

            observer.observe(document.body, {
                childList: true,
                subtree: true
            });
        }

        isTextInput(element) {
            return (element.tagName === 'INPUT' && element.type === 'text') || 
                   element.tagName === 'TEXTAREA';
        }

        showTooltip(message) {
            // Create tooltip element
            const tooltip = document.createElement('div');
            tooltip.className = 'voice-tooltip';
            tooltip.textContent = message;
            document.body.appendChild(tooltip);

            // Position near the voice button
            if (this.voiceButton) {
                const rect = this.voiceButton.getBoundingClientRect();
                tooltip.style.left = rect.left + 'px';
                tooltip.style.top = (rect.top - 40) + 'px';
            }

            // Remove after 3 seconds
            setTimeout(() => {
                tooltip.remove();
            }, 3000);
        }
    }

    // Add CSS styles
    const style = document.createElement('style');
    style.textContent = `
        .voice-input-wrapper {
            position: relative;
            display: flex;
            align-items: center;
        }

        .voice-input-wrapper input,
        .voice-input-wrapper textarea {
            padding-right: 45px;
        }

        .voice-input-btn {
            position: absolute;
            right: 10px;
            top: 50%;
            transform: translateY(-50%);
            background: transparent;
            border: none;
            color: #8b5cf6;
            cursor: pointer;
            padding: 8px;
            border-radius: 4px;
            transition: all 0.3s ease;
            font-size: 16px;
        }

        .voice-input-wrapper textarea + .voice-input-btn {
            top: 20px;
            transform: none;
        }

        .voice-input-btn:hover {
            background: rgba(139, 92, 246, 0.1);
            color: #a78bfa;
        }

        .voice-input-btn.listening {
            color: #ef4444;
            animation: pulse 1.5s infinite;
        }

        @keyframes pulse {
            0% {
                opacity: 1;
                transform: translateY(-50%) scale(1);
            }
            50% {
                opacity: 0.7;
                transform: translateY(-50%) scale(1.1);
            }
            100% {
                opacity: 1;
                transform: translateY(-50%) scale(1);
            }
        }

        .voice-tooltip {
            position: fixed;
            background: #1f2937;
            color: white;
            padding: 8px 16px;
            border-radius: 6px;
            font-size: 14px;
            z-index: 10000;
            box-shadow: 0 4px 6px rgba(0, 0, 0, 0.3);
            animation: fadeIn 0.3s ease;
        }

        @keyframes fadeIn {
            from {
                opacity: 0;
                transform: translateY(10px);
            }
            to {
                opacity: 1;
                transform: translateY(0);
            }
        }
    `;
    document.head.appendChild(style);

    // Initialize the voice system
    window.smartPRDVoice = new SmartPRDVoice();

    // Expose for debugging
    window.SmartPRDVoice = SmartPRDVoice;
})();