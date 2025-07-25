/**
 * Terminal Voice Integration
 * Adds push-to-talk voice input and TTS responses to the IDE terminal
 */

class TerminalVoice {
    constructor() {
        this.settings = this.loadSettings();
        this.isMobile = /Android|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
        this.recognition = null;
        this.isRecording = false;
        this.currentTooltip = null;
        this.simpleCommands = ['ls', 'pwd', 'cd', 'whoami', 'date', 'clear', 'help', 'cat', 'mkdir', 'rm', 'cp', 'mv'];
        
        this.init();
    }

    init() {
        this.setupSpeechRecognition();
        this.waitForTerminalLoad();
        this.addVoiceSettings();
    }

    loadSettings() {
        const stored = localStorage.getItem('terminal-voice-settings');
        return stored ? JSON.parse(stored) : {
            voiceResponseEnabled: true,
            voiceInputEnabled: true,
            selectedVoiceIndex: 0
        };
    }

    saveSettings() {
        localStorage.setItem('terminal-voice-settings', JSON.stringify(this.settings));
    }

    setupSpeechRecognition() {
        if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
            return;
        }

        const SpeechRecognition = window.webkitSpeechRecognition || window.SpeechRecognition;
        this.recognition = new SpeechRecognition();
        this.recognition.continuous = false;
        this.recognition.interimResults = false;
        this.recognition.lang = 'en-US';
    }

    waitForTerminalLoad() {
        const checkForTerminal = () => {
            const terminalInput = document.querySelector('input[placeholder*="terminal"], input[type="text"]');
            if (terminalInput) {
                this.addMicrophoneButton(terminalInput);
            } else {
                setTimeout(checkForTerminal, 1000);
            }
        };
        
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', checkForTerminal);
        } else {
            checkForTerminal();
        }
    }

    addMicrophoneButton(terminalInput) {
        if (document.querySelector('.microphone-btn')) return;

        const micBtn = document.createElement('button');
        micBtn.className = 'microphone-btn';
        micBtn.innerHTML = '🎤';
        micBtn.title = 'Hold to speak';
        
        micBtn.style.cssText = `
            position: absolute;
            right: 8px;
            top: 50%;
            transform: translateY(-50%);
            background: #1a1b26;
            border: 1px solid #414868;
            border-radius: 4px;
            color: #c0caf5;
            cursor: pointer;
            padding: 4px 8px;
            font-size: 14px;
            z-index: 1000;
        `;

        const container = terminalInput.parentElement;
        if (container && container.style.position !== 'relative') {
            container.style.position = 'relative';
        }
        container.appendChild(micBtn);

        // Add event listeners
        micBtn.addEventListener('mousedown', () => this.startRecording());
        micBtn.addEventListener('mouseup', () => this.stopRecording());
        micBtn.addEventListener('mouseleave', () => this.stopRecording());
    }

    startRecording() {
        if (!this.recognition || !this.settings.voiceInputEnabled) return;
        
        this.isRecording = true;
        const micBtn = document.querySelector('.microphone-btn');
        if (micBtn) {
            micBtn.style.background = '#ef4444';
            micBtn.innerHTML = '🔴';
        }

        this.recognition.start();
        
        this.recognition.onresult = (event) => {
            const transcript = event.results[0][0].transcript;
            const terminalInput = document.querySelector('input[placeholder*="terminal"], input[type="text"]');
            if (terminalInput) {
                terminalInput.value = transcript;
                terminalInput.dispatchEvent(new Event('input', { bubbles: true }));
            }
        };
    }

    stopRecording() {
        if (!this.isRecording) return;
        
        this.isRecording = false;
        const micBtn = document.querySelector('.microphone-btn');
        if (micBtn) {
            micBtn.style.background = '#1a1b26';
            micBtn.innerHTML = '🎤';
        }

        if (this.recognition) {
            this.recognition.stop();
        }
    }

    addVoiceSettings() {
        // Create main settings section container
        let settingsSection = document.querySelector('.settings-section');
        if (!settingsSection) {
            settingsSection = document.createElement('div');
            settingsSection.className = 'settings-section';
            document.body.appendChild(settingsSection);
        }

        // Add Settings label/header
        let settingsLabel = settingsSection.querySelector('.settings-label');
        if (!settingsLabel) {
            settingsLabel = document.createElement('div');
            settingsLabel.className = 'settings-label';
            settingsLabel.innerHTML = '<span>⚙️ Settings</span>';
            settingsSection.appendChild(settingsLabel);
        }

        // Create buttons container
        let buttonsContainer = settingsSection.querySelector('.settings-buttons');
        if (!buttonsContainer) {
            buttonsContainer = document.createElement('div');
            buttonsContainer.className = 'settings-buttons';
            settingsSection.appendChild(buttonsContainer);
        }

        // Add Context Priming button (NEW - first button)
        const contextPrimingBtn = document.createElement('button');
        contextPrimingBtn.className = 'settings-btn context-priming-btn';
        contextPrimingBtn.innerHTML = '<span>🧠 Context Priming</span>';
        contextPrimingBtn.title = 'Pre-load project context for smarter AI interactions';
        contextPrimingBtn.onclick = () => {
            // Check if we're on GitHub Pages
            if (window.location.hostname.includes('github.io')) {
                window.open('../context-priming.html', '_blank');
            } else {
                // For Render or local development
                window.open('/context-priming.html', '_blank');
            }
        };

        // Add Voice Settings button
        const voiceToggleBtn = document.createElement('button');
        voiceToggleBtn.className = 'settings-btn voice-settings-btn';
        voiceToggleBtn.innerHTML = '<span>🎤 Voice Settings</span>';
        voiceToggleBtn.onclick = () => {
            const panel = document.querySelector('.voice-settings');
            if (panel) {
                const isVisible = panel.style.display !== 'none';
                panel.style.display = isVisible ? 'none' : 'block';
            }
        };
        
        // Add IDE Settings button
        const ideSettingsBtn = document.createElement('button');
        ideSettingsBtn.className = 'settings-btn ide-settings-btn';
        ideSettingsBtn.innerHTML = '<span>⚙️ IDE Settings</span>';
        ideSettingsBtn.onclick = () => {
            window.open('https://docs.anthropic.com/en/docs/claude-code', '_blank');
        };
        
        // Add Documentation button
        const docBtn = document.createElement('button');
        docBtn.className = 'settings-btn documentation-btn';
        docBtn.innerHTML = '<span>🤖 Documentation</span>';
        docBtn.onclick = () => {
            window.open('https://docs.anthropic.com/en/docs/claude-code', '_blank');
        };
        
        // Clear existing buttons and add in order
        buttonsContainer.innerHTML = '';
        buttonsContainer.appendChild(contextPrimingBtn);  // NEW - Context Priming first
        buttonsContainer.appendChild(voiceToggleBtn);     // Voice Settings
        buttonsContainer.appendChild(ideSettingsBtn);     // IDE Settings
        buttonsContainer.appendChild(docBtn);             // Documentation

        // Add floating voice settings panel (hidden by default)
        const settingsPanel = document.createElement('div');
        settingsPanel.className = 'voice-settings';
        settingsPanel.style.display = 'none';
        settingsPanel.innerHTML = `
            <div class="voice-settings-header">
                <span>🎤 Voice Settings</span>
                <button class="settings-toggle">×</button>
            </div>
            <div class="voice-settings-content">
                <label>
                    <input type="checkbox" id="voiceResponseToggle" ${this.settings.voiceResponseEnabled ? 'checked' : ''}>
                    🔊 Voice responses
                </label>
                <label>
                    <input type="checkbox" id="voiceInputToggle" ${this.settings.voiceInputEnabled ? 'checked' : ''}>
                    🎤 Voice input
                </label>
                <div class="voice-selector-container">
                    <label>TTS Voice:</label>
                    <select id="voiceSelector">
                        <option value="">Loading voices...</option>
                    </select>
                    <button id="testVoiceBtn">🔊 Test Selected Voice</button>
                </div>
            </div>
        `;
        document.body.appendChild(settingsPanel);

        // Add event listeners for settings
        document.getElementById('voiceResponseToggle')?.addEventListener('change', (e) => {
            this.settings.voiceResponseEnabled = e.target.checked;
            this.saveSettings();
        });

        document.getElementById('voiceInputToggle')?.addEventListener('change', (e) => {
            this.settings.voiceInputEnabled = e.target.checked;
            this.saveSettings();
        });

        // Close settings panel
        settingsPanel.querySelector('.settings-toggle')?.addEventListener('click', () => {
            settingsPanel.style.display = 'none';
        });
    }
}

// Initialize voice integration
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        new TerminalVoice();
    });
} else {
    new TerminalVoice();
}