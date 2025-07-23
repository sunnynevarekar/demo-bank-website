/**
 * Premium Bank Authentication System
 * Handles user authentication state and session management
 */

class PremiumBankAuth {
    constructor() {
        this.isAuthenticated = false;
        this.username = null;
        this.loginTime = null;
        
        // Initialize authentication state
        this.checkAuthenticationState();
        
        // Setup logout handlers
        this.setupLogoutHandlers();
    }

    /**
     * Check if user is authenticated
     */
    checkAuthenticationState() {
        const authenticated = localStorage.getItem('premium_bank_authenticated');
        const username = localStorage.getItem('premium_bank_username');
        const loginTime = localStorage.getItem('premium_bank_login_time');
        
        if (authenticated === 'true' && username && loginTime) {
            // Check if session is still valid (24 hours)
            const loginDate = new Date(loginTime);
            const now = new Date();
            const hoursSinceLogin = (now - loginDate) / (1000 * 60 * 60);
            
            if (hoursSinceLogin < 24) {
                this.isAuthenticated = true;
                this.username = username;
                this.loginTime = loginDate;
                
                // Update UI to show authenticated state
                this.updateAuthenticatedUI();
                return true;
            } else {
                // Session expired
                this.logout();
                return false;
            }
        }
        
        // Not authenticated - redirect to login
        this.redirectToLogin();
        return false;
    }

    /**
     * Update UI elements for authenticated users
     */
    updateAuthenticatedUI() {
        // Update welcome message if present
        const welcomeElements = document.querySelectorAll('.welcome-message');
        welcomeElements.forEach(el => {
            if (el.textContent.includes('Welcome back') || el.textContent.includes('User')) {
                el.textContent = `Welcome back, ${this.getDisplayName()}`;
            } else if (el.textContent.includes('View and download your transaction history')) {
                el.textContent = `Welcome ${this.getDisplayName()}, view and download your transaction history`;
            } else if (el.textContent.includes('View and download your monthly account statements')) {
                el.textContent = `Welcome ${this.getDisplayName()}, view and download your monthly account statements`;
            }
        });

        // Update last login if present
        const lastLoginElements = document.querySelectorAll('.last-login');
        lastLoginElements.forEach(el => {
            const loginTimeStr = this.loginTime.toLocaleString('en-US', {
                month: 'short',
                day: 'numeric',
                hour: 'numeric',
                minute: '2-digit',
                hour12: true
            });
            el.textContent = `Last login: ${loginTimeStr}`;
        });

        // Show session info in console for testing
        console.log('Premium Bank Session Info:', {
            username: this.username,
            displayName: this.getDisplayName(),
            loginTime: this.loginTime,
            sessionDuration: this.getSessionDuration()
        });
    }

    /**
     * Get display name for user
     */
    getDisplayName() {
        const displayNames = {
            'demo_user': 'Demo User',
            'test_user': 'Test User', 
            'sarah.johnson': 'Sarah Johnson',
            'admin': 'Administrator',
            'user': 'User'
        };
        
        return displayNames[this.username] || this.username;
    }

    /**
     * Get user-specific account data
     */
    getUserAccountData() {
        const accountData = {
            'demo_user': {
                'premium_checking': { balance: 8456.23, number: '****7890' },
                'high_yield_savings': { balance: 15250.67, number: '****2341' },
                'emergency_fund': { balance: 3000.00, number: '****5678' }
            },
            'test_user': {
                'premium_checking': { balance: 5234.56, number: '****1234' },
                'high_yield_savings': { balance: 12000.00, number: '****5678' },
                'auto_loan': { balance: 18567.43, number: '****9012' }
            },
            'sarah.johnson': {
                'premium_checking': { balance: 8456.23, number: '****7890' },
                'high_yield_savings': { balance: 15250.67, number: '****2341' },
                'emergency_fund': { balance: 3000.00, number: '****5678' },
                'auto_loan': { balance: 18567.43, number: '****9012' },
                'home_mortgage': { balance: 245890.12, number: '****3456' }
            },
            'admin': {
                'premium_checking': { balance: 25000.00, number: '****0001' },
                'high_yield_savings': { balance: 50000.00, number: '****0002' }
            },
            'user': {
                'premium_checking': { balance: 2500.00, number: '****9999' }
            }
        };
        
        return accountData[this.username] || accountData['user'];
    }

    /**
     * Get session duration in minutes
     */
    getSessionDuration() {
        if (!this.loginTime) return 0;
        
        const now = new Date();
        const duration = (now - this.loginTime) / (1000 * 60);
        return Math.round(duration);
    }

    /**
     * Setup logout event handlers
     */
    setupLogoutHandlers() {
        // Handle logout links
        document.addEventListener('click', (event) => {
            if (event.target.matches('.logout, .nav-link.logout')) {
                event.preventDefault();
                const confirmed = confirm('Are you sure you want to logout?');
                if (confirmed) {
                    this.logout();
                }
            }
        });

        // Handle session timeout warning
        this.setupSessionTimeout();
    }

    /**
     * Setup session timeout warning
     */
    setupSessionTimeout() {
        // Warn user 5 minutes before session expires (23 hours after login)
        const warningTime = 23 * 60 * 60 * 1000; // 23 hours in milliseconds
        
        if (this.loginTime) {
            const timeUntilWarning = warningTime - (new Date() - this.loginTime);
            
            if (timeUntilWarning > 0) {
                setTimeout(() => {
                    this.showSessionWarning();
                }, timeUntilWarning);
            }
        }
    }

    /**
     * Show session expiration warning
     */
    showSessionWarning() {
        const extend = confirm(
            'Your session will expire in 5 minutes. Would you like to extend your session?'
        );
        
        if (extend) {
            this.extendSession();
        }
    }

    /**
     * Extend user session
     */
    extendSession() {
        localStorage.setItem('premium_bank_login_time', new Date().toISOString());
        this.loginTime = new Date();
        console.log('Premium Bank session extended');
    }

    /**
     * Logout user
     */
    logout() {
        // Clear authentication data
        localStorage.removeItem('premium_bank_authenticated');
        localStorage.removeItem('premium_bank_username');
        localStorage.removeItem('premium_bank_login_time');
        localStorage.removeItem('premium_bank_remember');
        
        // Reset instance variables
        this.isAuthenticated = false;
        this.username = null;
        this.loginTime = null;
        
        console.log('Premium Bank user logged out');
        
        // Redirect to login
        this.redirectToLogin();
    }

    /**
     * Redirect to login page
     */
    redirectToLogin() {
        // Don't redirect if already on login page
        if (window.location.pathname.includes('login.html')) {
            return;
        }
        
        // Store current page for redirect after login
        const currentPage = window.location.pathname + window.location.search;
        const loginUrl = `login.html?redirect=${encodeURIComponent(currentPage)}`;
        
        window.location.href = loginUrl;
    }

    /**
     * Check if user has specific permissions (placeholder for future use)
     */
    hasPermission(permission) {
        if (!this.isAuthenticated) return false;
        
        // For demo purposes, all authenticated users have all permissions
        return true;
    }

    /**
     * Get authentication headers for API calls (if needed)
     */
    getAuthHeaders() {
        return {
            'Authorization': `Bearer demo-token-${this.username}`,
            'X-Session-ID': `session-${Date.now()}`,
            'X-Username': this.username
        };
    }
}

// Initialize authentication when page loads
document.addEventListener('DOMContentLoaded', function() {
    // Only initialize auth on non-login pages
    if (!window.location.pathname.includes('login.html')) {
        window.premiumBankAuth = new PremiumBankAuth();
    }
});

// Export for use in other scripts
if (typeof module !== 'undefined' && module.exports) {
    module.exports = PremiumBankAuth;
}