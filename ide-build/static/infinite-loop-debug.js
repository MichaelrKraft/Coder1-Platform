// Debug script to find the right elements
console.log('🔍 Infinite Loop Debug Starting...');

// Function to find all text nodes containing specific text
function findTextNodes(searchText) {
    const walker = document.createTreeWalker(
        document.body,
        NodeFilter.SHOW_TEXT,
        null,
        false
    );
    
    const nodes = [];
    let node;
    while (node = walker.nextNode()) {
        if (node.textContent.includes(searchText)) {
            nodes.push({
                text: node.textContent.trim(),
                parent: node.parentElement,
                element: node
            });
        }
    }
    return nodes;
}

// Debug function to analyze the page
function debugPage() {
    console.log('=== Page Debug Info ===');
    
    // Find STATUS elements
    const statusNodes = findTextNodes('STATUS:');
    console.log('STATUS nodes found:', statusNodes.length);
    statusNodes.forEach((node, i) => {
        console.log(`STATUS ${i}:`, node.text);
        console.log('Parent element:', node.parent);
        console.log('Next sibling:', node.parent?.nextElementSibling);
    });
    
    // Find SESSION ID elements
    const sessionNodes = findTextNodes('SESSION ID:');
    console.log('\nSESSION ID nodes found:', sessionNodes.length);
    sessionNodes.forEach((node, i) => {
        console.log(`SESSION ID ${i}:`, node.text);
        console.log('Parent element:', node.parent);
        console.log('Next sibling:', node.parent?.nextElementSibling);
    });
    
    // Try different approaches to find the status value
    console.log('\n=== Looking for status value ===');
    
    // Method 1: Look for elements with specific classes
    const allDivs = document.querySelectorAll('div');
    allDivs.forEach(div => {
        if (div.textContent.trim() === 'Stopped' && !div.textContent.includes('STATUS:')) {
            console.log('Found "Stopped" text in:', div);
            console.log('Previous sibling:', div.previousElementSibling);
        }
    });
    
    // Method 2: Look for session ID pattern
    const sessionPattern = /[a-f0-9]{8}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{12}/;
    allDivs.forEach(div => {
        if (sessionPattern.test(div.textContent.trim())) {
            console.log('Found session ID:', div.textContent.trim());
            console.log('Element:', div);
            console.log('Previous sibling:', div.previousElementSibling);
        }
    });
}

// Run debug immediately and after a delay
debugPage();
setTimeout(debugPage, 2000);

// Also log all click events to see if something is intercepting
document.addEventListener('click', (e) => {
    console.log('Click detected on:', e.target);
}, true);