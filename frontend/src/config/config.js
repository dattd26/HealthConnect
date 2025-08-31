// Environment configuration
export const config = {
    // API Configuration
    API_BASE_URL: process.env.REACT_APP_API_URL || 'https://healthconnect-be.onrender.com/api',
    
    // App Configuration
    APP_NAME: 'HealthConnect',
    APP_VERSION: '1.0.0',
    
    // Feature Flags
    ENABLE_ZOOM: true,
    ENABLE_PAYMENTS: true,
    ENABLE_NOTIFICATIONS: true,
    
    // Timeouts
    API_TIMEOUT: 30000, // 30 seconds
    SESSION_TIMEOUT: 3600000, // 1 hour
    
    // Pagination
    DEFAULT_PAGE_SIZE: 10,
    MAX_PAGE_SIZE: 100
};

export default config;
