// API Configuration Override
// This fixes the hardcoded localhost:3002 issue in the built React app

(function() {
    console.log('🔧 API Configuration Override Loading...');
    
    // Store the original fetch function
    const originalFetch = window.fetch;
    
    // Override fetch to fix API URLs
    window.fetch = function(url, options) {
        let fixedUrl = url;
        
        // Convert string URL to URL object for easier manipulation
        if (typeof url === 'string') {
            // Fix the localhost:3002 issue
            if (url.includes('localhost:3002')) {
                fixedUrl = url.replace('http://localhost:3002', '');
                fixedUrl = fixedUrl.replace('https://localhost:3002', '');
                fixedUrl = fixedUrl.replace('localhost:3002', '');
            }
            
            // Fix the /api/i.e bug (should be /api/infinite)
            if (url.includes('/api/i.e/')) {
                fixedUrl = fixedUrl.replace('/api/i.e/', '/api/infinite/');
            }
            
            console.log('🔄 API URL fixed:', url, '→', fixedUrl);
        }
        
        // Call the original fetch with the fixed URL
        return originalFetch.call(this, fixedUrl, options);
    };
    
    console.log('✅ API Configuration Override Ready');
})();