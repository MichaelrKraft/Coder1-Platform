// Terminal Header Diagnostic - Check if special view buttons are visible
console.log('🟢 DIAGNOSTIC SCRIPT LOADED');

(function() {
    'use strict';
    
    console.log('🔍 Starting terminal header diagnostic...');
    
    function checkTerminalHeader() {
        console.log('=== TERMINAL HEADER DIAGNOSTIC ===');
        
        const terminalHeader = document.querySelector('.terminal-header');
        console.log('Terminal header found:', !!terminalHeader);
        
        if (!terminalHeader) {
            // Look for any element that might be the terminal
            const possibleTerminals = document.querySelectorAll('[class*="terminal"], [class*="Terminal"]');
            console.log('Possible terminal elements found:', possibleTerminals.length);
            possibleTerminals.forEach((el, i) => {
                console.log(`Terminal ${i}:`, el.className, el.tagName);
            });
            return;
        }
        
        // Check what's in the header
        console.log('Header innerHTML:', terminalHeader.innerHTML);
        
        // Look for any buttons
        const allButtons = terminalHeader.querySelectorAll('button');
        console.log('Buttons in header:', allButtons.length);
        
        allButtons.forEach((btn, i) => {
            console.log(`Button ${i}: "${btn.textContent.trim()}" (class: ${btn.className})`);
        });
        
        // Look for specific special view buttons
        const buttonSelectors = [
            '.supervision',
            '.sleep-mode',
            '.infinite-loop', 
            '.parallel-agents',
            '[class*="supervision"]',
            '[class*="sleep"]',
            '[class*="infinite"]',
            '[class*="parallel"]'
        ];
        
        buttonSelectors.forEach(selector => {
            const btn = document.querySelector(selector);
            if (btn) {
                console.log(`Found button with selector ${selector}:`, btn.textContent);
            }
        });
        
        console.log('=== END DIAGNOSTIC ===');
    }
    
    // Run immediately
    console.log('Running diagnostic immediately...');
    checkTerminalHeader();
    
    // Run after delays
    setTimeout(() => {
        console.log('Running diagnostic after 2 seconds...');
        checkTerminalHeader();
    }, 2000);
    
    setTimeout(() => {
        console.log('Running diagnostic after 5 seconds...');  
        checkTerminalHeader();
    }, 5000);
    
})();