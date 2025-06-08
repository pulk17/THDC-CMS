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

// Define AppDispatch type
type AppDispatch = Dispatch<any>;

// Login User (handles both employee and admin)
export const loginUser = (
    employee_id: string | number, 
    employee_password: string
) => async (dispatch: AppDispatch) => {
    try {
        // First clear any existing state to ensure a fresh login
        dispatch({ type: LOGIN_RESET });
        
        // Clear any previous token to prevent auth conflicts
        localStorage.removeItem('authToken');
        
        dispatch({
            type: LOGIN_REQUEST
        });
        
        // First try with normal authentication
        try {
            const { data } = await api.post(
                '/api/v1/login', 
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
            } else {
                dispatch(getAllMyComplaints());
                dispatch(findArrivedComplaints());
            }
            
            return; // Exit the function if normal login succeeds
        } catch (normalLoginError) {
            // If normal login fails, try with unencrypted password flag
            console.log("Normal login failed, trying with unencrypted password...");
            
            try {
                const { data } = await api.post(
                    '/api/v1/login', 
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
                } else {
                    dispatch(getAllMyComplaints());
                    dispatch(findArrivedComplaints());
                }
                
                return; // Exit the function if unencrypted login succeeds
            } catch (unencryptedLoginError: any) {
                // If both login attempts fail, dispatch the error
                console.error("Both login attempts failed:", unencryptedLoginError.response?.data || unencryptedLoginError.message);
                dispatch({
                    type: LOGIN_FAIL,
                    payload: unencryptedLoginError.response?.data?.message || "Login failed with both encrypted and unencrypted passwords"
                });
            }
        }
    } catch(error: any) {
        console.error("Login error:", error.response?.data || error.message);
        dispatch({
            type: LOGIN_FAIL,
            payload: error.response?.data?.message || "Login failed"
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