import axios from 'axios';

// Extract the base URL from environment variables or use default
const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:6050';

// Log the API URL being used (for debugging)
console.log(`API configured with base URL: ${API_BASE_URL}`);

// Create an axios instance with default config
const api = axios.create({
  // Use the configured base URL
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true, // Important for cookies/authentication
  timeout: 30000, // Increase timeout to 30 seconds to account for cold starts on Render's free tier
});

// Add a request interceptor
api.interceptors.request.use(
  (config) => {
    // Get token from localStorage
    const token = localStorage.getItem('authToken');
    
    // If token exists, add it to headers
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    
    // Simplify request logging
    console.log(`[API] ${config.method?.toUpperCase()} ${config.url}`);
    return config;
  },
  (error) => {
    console.error('[API Request Error]', error);
    return Promise.reject(error);
  }
);

// Add a response interceptor
api.interceptors.response.use(
  (response) => {
    // Only log success for non-GET requests to reduce noise
    if (response.config.method !== 'get') {
      console.log(`[API Success] ${response.status} ${response.config.url}`);
    }
    return response;
  },
  (error) => {
    // Check for network errors which could indicate cold starts
    if (!error.response) {
      console.error(`[API Network Error] ${error.config?.url || 'unknown URL'}: ${error.message}`);
      
      // Check if this might be a cold start issue
      if (error.message.includes('timeout') || error.message.includes('Network Error')) {
        console.log('[API] Possible cold start detected. The backend might be starting up.');
      }
      
      return Promise.reject(error);
    }
    
    // Error response - simplify error logging
    const status = error.response.status;
    console.error(`[API Error] ${status} ${error.config?.url || 'unknown URL'}: ${error.message}`);
    
    // Handle 401 Unauthorized errors
    if (status === 401) {
      // Don't clear token or redirect if we're already on the login page
      if (window.location.pathname !== '/') {
        console.log('[API] Authentication failed - redirecting to login');
        
        // Clear all auth-related storage
        localStorage.removeItem('authToken');
        localStorage.removeItem('rememberedUser');
        
        // Add a small notification to the user
        if (document.getElementById('auth-redirect-notification') === null) {
          const notification = document.createElement('div');
          notification.id = 'auth-redirect-notification';
          notification.style.position = 'fixed';
          notification.style.top = '20px';
          notification.style.left = '50%';
          notification.style.transform = 'translateX(-50%)';
          notification.style.backgroundColor = '#285E61'; // teal color
          notification.style.color = 'white';
          notification.style.padding = '10px 20px';
          notification.style.borderRadius = '4px';
          notification.style.zIndex = '9999';
          notification.innerText = 'Authentication error. Redirecting to login...';
          
          document.body.appendChild(notification);
          
          // Set a failsafe redirect flag in sessionStorage
          sessionStorage.setItem('auth_redirect_timestamp', Date.now().toString());
          
          setTimeout(() => {
            // Manual redirect to avoid loops - with a small delay to show notification
            window.location.href = '/';
          }, 2000);
        } else {
          // If notification exists, just redirect
          window.location.href = '/';
        }
      }
    } else if (status === 404 && error.config?.url?.includes('/api/v1/login')) {
      // Special handling for login 404 errors which might indicate wrong API URL
      console.error('[API URL Error] Login endpoint not found. Check if API_BASE_URL is correct:', API_BASE_URL);
    }
    
    return Promise.reject(error);
  }
);

// Add a failsafe check for auth redirects on app init
const checkAuthRedirect = () => {
  const authRedirectTimestamp = sessionStorage.getItem('auth_redirect_timestamp');
  
  if (authRedirectTimestamp) {
    const now = Date.now();
    const redirectTime = parseInt(authRedirectTimestamp, 10);
    
    // If the redirect happened in the last 5 seconds, we're probably in a redirect loop
    // Clear it and show a message
    if (now - redirectTime < 5000) {
      console.log('[AUTH FAILSAFE] Detected possible auth redirect loop');
      
      // Clear auth data completely
      localStorage.clear();
      sessionStorage.clear();
      
      // If we're not on the login page, force redirect
      if (window.location.pathname !== '/') {
        window.location.href = '/';
      }
    } else {
      // Just clear the timestamp if it's old
      sessionStorage.removeItem('auth_redirect_timestamp');
    }
  }
};

// Run the check
checkAuthRedirect();

export default api; 