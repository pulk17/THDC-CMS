// API configuration
const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:6050'; // Default to port 6050 for backend

export const API_ENDPOINTS = {
  // Auth endpoints
  LOGIN: `${API_BASE_URL}/api/v1/login`,
  REGISTER: `${API_BASE_URL}/api/v1/register`,
  LOGOUT: `${API_BASE_URL}/api/v1/logout`,
  
  // Complaint endpoints
  REGISTER_COMPLAINT: `${API_BASE_URL}/api/v1/register-complaint`,
  GET_ALL_MY_COMPLAINTS: `${API_BASE_URL}/api/v1/get-all-my-complaints`,
  GET_ALL_EMPLOYEE_COMPLAINTS: `${API_BASE_URL}/api/v1/get-all-employee-complaints`,
  GET_ALL_WORKERS: `${API_BASE_URL}/api/v1/get-all-workers`,
  FIND_ARRIVED_COMPLAINTS: `${API_BASE_URL}/api/v1/find-arrived-complaints`,
  ASSIGN_COMPLAINT: `${API_BASE_URL}/api/v1/assign-complaint-to-worker`,
  CHANGE_STATUS: `${API_BASE_URL}/api/v1/change-status-of-complaint`,
  FILTER_COMPLAINTS: `${API_BASE_URL}/api/v1/filter-complaints`,
};

export default API_ENDPOINTS; 