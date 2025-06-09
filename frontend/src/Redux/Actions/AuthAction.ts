import { Dispatch } from 'redux';
import { 
    LOGIN_REQUEST, 
    LOGIN_SUCCESS, 
    LOGIN_FAIL, 
    REGISTER_USER_REQUEST, 
    REGISTER_USER_SUCCESS, 
    REGISTER_USER_FAIL,
    LOGOUT_USER_REQUEST,
    LOGOUT_USER_SUCCESS,
    LOGOUT_USER_FAIL,
    LOGIN_RESET
} from '../ActionType';
import { 
    findArrivedComplaints, 
    getAllEmployeeComplaints, 
    getAllMyComplaints, 
    getAllWorkersList 
} from './ComplaintAction';
import { User } from '../../types/index';
import api from '../../api/axios';
import axios from 'axios';
import { API_PATHS, API_ENDPOINTS } from '../../api/config';

// Define AppDispatch type
type AppDispatch = Dispatch<any>;

// Login User (handles both employee and admin)
export const loginUser = (
    employee_id: string | number, 
    employee_password: string
) => async (dispatch: AppDispatch) => {
    try {
        dispatch({
            type: LOGIN_REQUEST
        });
        
        // First try with normal authentication
        try {
            // Add a small delay to handle potential network issues or cold starts
            const delayPromise = new Promise(resolve => setTimeout(resolve, 500));
            await delayPromise;
            
            // Use the API_PATHS for consistent endpoint paths
            const { data } = await api.post(
                API_PATHS.LOGIN, 
                { 
                    employee_id: Number(employee_id), 
                    employee_password 
                }
            );
            
            // Make sure we have a token
            if (!data.token) {
                throw new Error("Login succeeded but no token was returned");
            }
            
            // Store token in localStorage for persistence
            localStorage.setItem('authToken', data.token);
            console.log("Token saved to localStorage:", data.token);
            
            // Add a small delay to ensure localStorage is updated
            await new Promise(resolve => setTimeout(resolve, 50));
            
            dispatch({
                type: LOGIN_SUCCESS,
                payload: data
            });
            
            // Load appropriate data based on user role
            if (data.user.employee_role === "admin") {
                dispatch(getAllEmployeeComplaints());
                dispatch(getAllWorkersList());
            } else if (data.user.is_Employee_Worker) {
                dispatch(findArrivedComplaints());
            } else {
                dispatch(getAllMyComplaints());
                dispatch(findArrivedComplaints());
            }
            
            return; // Exit the function if normal login succeeds
        } catch (normalLoginError: any) {
            // Check if this is a network error or 404 (which could indicate cold start or wrong URL)
            if (!normalLoginError.response || normalLoginError.response.status === 404) {
                console.error("API connection error. This could be due to a cold start on Render's free tier or incorrect API URL.");
                
                // Get the configured API URL for debugging
                const apiBaseUrl = process.env.REACT_APP_API_URL || 'http://localhost:6050';
                console.log("Configured API URL:", apiBaseUrl);
                console.log("Attempting to access endpoint:", apiBaseUrl + "/api/v1" + API_PATHS.LOGIN);
                
                // Check if we're using the wrong URL path
                if (normalLoginError.config?.url?.includes('/api/v1/login')) {
                    console.error("Using incorrect API path. The '/api/v1' prefix might be duplicated.");
                }
                
                // Try with the full URL as a last resort
                try {
                    console.log("Trying alternative endpoint as a fallback...");
                    // Use the full endpoint URL from API_ENDPOINTS
                    const { data } = await axios.post(
                        API_ENDPOINTS.LOGIN, 
                        { 
                            employee_id: Number(employee_id), 
                            employee_password 
                        },
                        {
                            headers: {
                                'Content-Type': 'application/json',
                            },
                            withCredentials: true
                        }
                    );
                    
                    if (data && data.token) {
                        localStorage.setItem('authToken', data.token);
                        console.log("Token saved to localStorage from fallback request:", data.token);
                        
                        dispatch({
                            type: LOGIN_SUCCESS,
                            payload: data
                        });
                        
                        // Load appropriate data based on user role
                        if (data.user.employee_role === "admin") {
                            dispatch(getAllEmployeeComplaints());
                            dispatch(getAllWorkersList());
                        } else if (data.user.is_Employee_Worker) {
                            dispatch(findArrivedComplaints());
                        } else {
                            dispatch(getAllMyComplaints());
                            dispatch(findArrivedComplaints());
                        }
                        
                        return;
                    }
                } catch (fallbackError) {
                    console.error("Fallback request also failed:", fallbackError);
                }
                
                // Dispatch a more user-friendly error for cold starts
                dispatch({
                    type: LOGIN_FAIL,
                    payload: "Unable to connect to the server. The backend might be starting up (cold start) or the API URL might be incorrect."
                });
                return;
            }
            
            // If normal login fails with a proper response, try with unencrypted password flag
            console.log("Normal login failed, trying with unencrypted password...");
            
            try {
                const { data } = await api.post(
                    API_PATHS.LOGIN, 
                    { 
                        employee_id: Number(employee_id), 
                        employee_password,
                        use_unencrypted: true // Add flag for unencrypted password
                    }
                );
                
                // Make sure we have a token
                if (!data.token) {
                    throw new Error("Login succeeded but no token was returned");
                }
                
                // Store token in localStorage for persistence
                localStorage.setItem('authToken', data.token);
                console.log("Token saved to localStorage:", data.token);
                
                // Add a small delay to ensure localStorage is updated
                await new Promise(resolve => setTimeout(resolve, 50));
                
                dispatch({
                    type: LOGIN_SUCCESS,
                    payload: data
                });
                
                // Load appropriate data based on user role
                if (data.user.employee_role === "admin") {
                    dispatch(getAllEmployeeComplaints());
                    dispatch(getAllWorkersList());
                } else if (data.user.is_Employee_Worker) {
                    dispatch(findArrivedComplaints());
                } else {
                    dispatch(getAllMyComplaints());
                    dispatch(findArrivedComplaints());
                }
                
                return; // Exit the function if unencrypted login succeeds
            } catch (unencryptedLoginError: any) {
                // If both login attempts fail, dispatch the error
                console.error("Both login attempts failed:", unencryptedLoginError.response?.data || unencryptedLoginError.message);
                
                // Provide a more user-friendly error message
                let errorMessage = "Invalid credentials. Please check your employee ID and password.";
                
                if (!unencryptedLoginError.response) {
                    errorMessage = "Network error. Please check your connection and try again.";
                } else if (unencryptedLoginError.response.status === 429) {
                    errorMessage = "Too many login attempts. Please try again later.";
                } else if (unencryptedLoginError.response.status >= 500) {
                    errorMessage = "Server error. Please try again later.";
                }
                
                dispatch({
                    type: LOGIN_FAIL,
                    payload: errorMessage
                });
            }
        }
    } catch(error: any) {
        console.error("Login error:", error.response?.data || error.message);
        
        // Provide a more user-friendly error message
        let errorMessage = "Login failed";
        
        if (!error.response) {
            errorMessage = "Network error. Please check your connection and try again.";
        } else if (error.response.status === 401) {
            errorMessage = "Invalid credentials. Please check your employee ID and password.";
        } else if (error.response.status === 429) {
            errorMessage = "Too many login attempts. Please try again later.";
        } else if (error.response.status >= 500) {
            errorMessage = "Server error. Please try again later.";
        }
        
        dispatch({
            type: LOGIN_FAIL,
            payload: errorMessage
        });
    }
};

// Register User
export const registerUser = (
    employee_id: string | number, 
    employee_name: string, 
    employee_designation: string, 
    employee_department: string, 
    employee_location: string, 
    employee_password: string, 
    employee_email: string,
    employee_role: 'admin' | 'employee'
) => async (dispatch: AppDispatch) => {
    try {
        dispatch({
            type: REGISTER_USER_REQUEST
        });
        
        // Ensure employee_id is converted to a number
        const numericEmployeeId = Number(employee_id);
        
        // Validate required fields on client side
        if (!numericEmployeeId || isNaN(numericEmployeeId)) {
            throw new Error("Employee ID must be a valid number");
        }
        
        if (!employee_name || !employee_designation || !employee_department || 
            !employee_location || !employee_password || !employee_email) {
            throw new Error("All fields are required");
        }
        
        const { data } = await api.post<{ success: boolean; user: User }>(
            '/api/v1/register', 
            {
                employee_id: numericEmployeeId,
                employee_name, 
                employee_designation, 
                employee_department, 
                employee_location, 
                employee_password, 
                employee_email,
                employee_role
            }
        );
        
        dispatch({
            type: REGISTER_USER_SUCCESS,
            payload: data.user
        });
    } catch(error: any) {
        console.error("Registration error:", error);
        
        let errorMessage = "Registration failed";
        
        // Handle different types of errors
        if (error.response) {
            // The request was made and the server responded with a status code
            // that falls out of the range of 2xx
            errorMessage = error.response.data?.message || "Server error: " + error.response.status;
            console.error("Server response:", error.response.data);
        } else if (error.request) {
            // The request was made but no response was received
            errorMessage = "No response from server. Please check your connection.";
        } else {
            // Something happened in setting up the request
            errorMessage = error.message || "An unknown error occurred";
        }
        
        dispatch({
            type: REGISTER_USER_FAIL,
            payload: errorMessage
        });
    }
};

// Logout User
export const logoutUser = () => async (dispatch: AppDispatch) => {
    try {
        dispatch({
            type: LOGOUT_USER_REQUEST
        });
        
        // Force clear all auth related redux state first
        dispatch({ type: LOGIN_RESET });
        
        try {
            // Try to call the server logout endpoint
            await api.get('/api/v1/logout');
        } catch (err) {
            // If server logout fails, just log it - we'll still do client-side logout
            console.log("Server logout failed, proceeding with client-side logout");
        }
        
        // Always clear local storage regardless of server response
        localStorage.removeItem('rememberedUser');
        localStorage.removeItem('authToken');
        
        // Add small delay to ensure storage is cleared before redirect
        await new Promise(resolve => setTimeout(resolve, 100));
        
        // Dispatch success action to clear Redux state
        dispatch({
            type: LOGOUT_USER_SUCCESS,
            payload: "Logged out successfully"
        });
        
        // Redirect to login page after successful logout
        window.location.href = '/';
        
    } catch(error: any) {
        console.error("Logout error:", error);
        
        // Even if there's an error, we should still try to logout client-side
        localStorage.removeItem('rememberedUser');
        localStorage.removeItem('authToken');
        
        // Force clear all auth related redux state 
        dispatch({ type: LOGIN_RESET });
        
        dispatch({
            type: LOGOUT_USER_FAIL,
            payload: error.response?.data?.message || "Logout failed on server, but client-side logout completed"
        });
        
        // Redirect to login page even if there was an error
        window.location.href = '/';
    }
}; 