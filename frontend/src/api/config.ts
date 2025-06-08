// API configuration
const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:6050'; // Default to port 6050 for backend

// Add /api/v1 to the base URL since all our endpoints are under this path
const API_URL_WITH_PREFIX = `${API_BASE_URL}/api/v1`;

export const API_ENDPOINTS = {
  // Auth endpoints
  LOGIN: `${API_URL_WITH_PREFIX}/login`,
  REGISTER: `${API_URL_WITH_PREFIX}/register`,
  LOGOUT: `${API_URL_WITH_PREFIX}/logout`,
  
  // Complaint endpoints
  REGISTER_COMPLAINT: `${API_URL_WITH_PREFIX}/register-complaint`,
  GET_ALL_MY_COMPLAINTS: `${API_URL_WITH_PREFIX}/get-all-my-complaints`,
  GET_ALL_EMPLOYEE_COMPLAINTS: `${API_URL_WITH_PREFIX}/get-all-employee-complaints`,
  GET_ALL_WORKERS: `${API_URL_WITH_PREFIX}/get-all-workers`,
  FIND_ARRIVED_COMPLAINTS: `${API_URL_WITH_PREFIX}/find-arrived-complaints`,
  ASSIGN_COMPLAINT: `${API_URL_WITH_PREFIX}/assign-complaint-to-worker`,
  CHANGE_STATUS: `${API_URL_WITH_PREFIX}/change-status-of-complaint`,
  FILTER_COMPLAINTS: `${API_URL_WITH_PREFIX}/filter-complaints`,
};

// For direct use with axios (without the /api/v1 prefix since it's included in the axios baseURL)
export const API_PATHS = {
  // Auth endpoints
  LOGIN: '/login',
  REGISTER: '/register',
  LOGOUT: '/logout',
  
  // Complaint endpoints
  REGISTER_COMPLAINT: '/register-complaint',
  GET_ALL_MY_COMPLAINTS: '/get-all-my-complaints',
  GET_ALL_EMPLOYEE_COMPLAINTS: '/get-all-employee-complaints',
  GET_ALL_WORKERS: '/get-all-workers',
  FIND_ARRIVED_COMPLAINTS: '/find-arrived-complaints',
  ASSIGN_COMPLAINT: '/assign-complaint-to-worker',
  CHANGE_STATUS: '/change-status-of-complaint',
  FILTER_COMPLAINTS: '/filter-complaints',
};

export default API_ENDPOINTS; 