/**
 * Premium Bank Index Router
 * Handles initial routing to login or account summary based on authentication state
 */

// Check authentication immediately when script loads
(function() {
    console.log('Premium Bank: Checking authentication state...');
    
    // Check if user is authenticated
    const authenticated = localStorage.getItem('premium_bank_authenticated');
    const username = localStorage.getItem('premium_bank_username');
    const loginTime = localStorage.getItem('premium_bank_login_time');
    
    if (authenticated === 'true' && username && loginTime) {
        // Check if session is still valid (24 hours)
        const loginDate = new Date(loginTime);
        const now = new Date();
        const hoursSinceLogin = (now - loginDate) / (1000 * 60 * 60);
        
        if (hoursSinceLogin < 24) {
            console.log('Premium Bank: User authenticated, redirecting to account summary...');
            // User is authenticated and session is valid
            window.location.href = 'account-summary.html';
            return;
        } else {
            console.log('Premium Bank: Session expired, clearing authentication...');
            // Session expired - clear authentication
            localStorage.removeItem('premium_bank_authenticated');
            localStorage.removeItem('premium_bank_username');
            localStorage.removeItem('premium_bank_login_time');
            localStorage.removeItem('premium_bank_remember');
        }
    }
    
    console.log('Premium Bank: User not authenticated, redirecting to login...');
    // User is not authenticated or session expired
    window.location.href = 'login.html';
})();