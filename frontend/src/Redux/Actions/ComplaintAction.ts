import api from '../../api/axios';
import {
    REGISTER_COMPLAINT_REQUEST,
    REGISTER_COMPLAINT_SUCCESS,
    REGISTER_COMPLAINT_FAIL,
    GET_ALL_MY_COMPLAINT_REQUEST,
    GET_ALL_MY_COMPLAINT_SUCCESS,
    GET_ALL_MY_COMPLAINT_FAIL,
    GET_ALL_EMPLOYEE_COMPLAINT_REQUEST,
    GET_ALL_EMPLOYEE_COMPLAINT_SUCCESS,
    GET_ALL_EMPLOYEE_COMPLAINT_FAIL,
    GET_ALL_WORKERS_REQUEST,
    GET_ALL_WORKERS_SUCCESS,
    GET_ALL_WORKERS_FAIL,
    ASSIGN_COMPLAINT_TO_WORKER_REQUEST,
    ASSIGN_COMPLAINT_TO_WORKER_SUCCESS,
    ASSIGN_COMPLAINT_TO_WORKER_FAIL,
    FIND_ARRIVED_COMPLAINT_REQUEST,
    FIND_ARRIVED_COMPLAINT_SUCCESS,
    FIND_ARRIVED_COMPLAINT_FAIL,
    CHANGE_STATUS_OF_COMPLAINT_REQUEST,
    CHANGE_STATUS_OF_COMPLAINT_SUCCESS,
    CHANGE_STATUS_OF_COMPLAINT_FAIL,
    FILTER_COMPLAINT_REQUEST,
    FILTER_COMPLAINT_SUCCESS,
    FILTER_COMPLAINT_FAIL
} from '../ActionType';
import { Dispatch, AnyAction } from 'redux';
import { RootState } from '../store';
import { API_PATHS } from '../../api/config';

// Define AppDispatch type
type AppDispatch = Dispatch<any>;

// Register a complaint
export const registerComplaint = (
    employee_location: string,
    complaint_asset: string,
    employee_phoneNo: string,
    complain_details: string
) => async (dispatch: AppDispatch) => {
    try {
        dispatch({
            type: REGISTER_COMPLAINT_REQUEST
        });
        
        const config = { headers: { "Content-type": "application/json" } };
        const { data } = await api.post(
            "/registerComplaint", 
            { employee_location, complaint_asset, employee_phoneNo, complain_details }, 
            config
        );
        
        dispatch({
            type: REGISTER_COMPLAINT_SUCCESS,
            payload: data.compaint
        });
        
        dispatch(getAllMyComplaints());
    } catch (error: any) {
        dispatch({
            type: REGISTER_COMPLAINT_FAIL,
            payload: error.response?.data?.message || 'An error occurred'
        });
    }
};

// Get all complaints for current user
export const getAllMyComplaints = () => async (dispatch: AppDispatch) => {
    try {
        dispatch({
            type: GET_ALL_MY_COMPLAINT_REQUEST
        });
        
        try {
            const { data } = await api.get("/complaints?mine=true");
            
            dispatch({
                type: GET_ALL_MY_COMPLAINT_SUCCESS,
                payload: data.complaints
            });
        } catch (error: any) {
            console.error("Error fetching my complaints:", error.message);
            
            // If this is a timeout or network error (likely cold start), provide fallback data
            if (!error.response || error.code === 'ECONNABORTED' || error.message.includes('timeout')) {
                console.log("Using fallback data for my complaints due to server timeout");
                
                // Provide fallback data
                const fallbackComplaints = [
                    {
                        _id: "loading-1",
                        complaint_no: "LOADING-001",
                        employee_name: "Loading...",
                        employee_location: "Server is starting up",
                        complaint_asset: "Please wait",
                        complain_details: "The server is starting up (cold start). Please wait a moment and refresh the page.",
                        status: "Loading",
                        isCompleted: false,
                        createdAt: new Date().toISOString(),
                        updatedAt: new Date().toISOString()
                    }
                ];
                
                dispatch({
                    type: GET_ALL_MY_COMPLAINT_SUCCESS,
                    payload: fallbackComplaints
                });
                return;
            }
            
            dispatch({
                type: GET_ALL_MY_COMPLAINT_FAIL,
                payload: error.response?.data?.message || 'Failed to fetch your complaints'
            });
        }
    } catch (error: any) {
        dispatch({
            type: GET_ALL_MY_COMPLAINT_FAIL,
            payload: error.response?.data?.message || 'An error occurred'
        });
    }
};

// Get all user complaints -- admin
export const getAllEmployeeComplaints = () => async (dispatch: Dispatch<AnyAction>, getState: () => RootState) => {
    try {
        // Check if user has admin role before making the request
        const { user } = getState().loginUser;
        if (!user || user.employee_role !== 'admin') {
            dispatch({
                type: GET_ALL_EMPLOYEE_COMPLAINT_FAIL,
                payload: 'Unauthorized: Admin access required'
            });
            return;
        }

        dispatch({ type: GET_ALL_EMPLOYEE_COMPLAINT_REQUEST });

        try {
            const { data } = await api.get("/complaints");

            dispatch({
                type: GET_ALL_EMPLOYEE_COMPLAINT_SUCCESS,
                payload: data.complaints
            });
        } catch (error: any) {
            console.error("Error fetching employee complaints:", error.message);
            
            // If this is a timeout or network error (likely cold start), provide fallback data
            if (!error.response || error.code === 'ECONNABORTED' || error.message.includes('timeout')) {
                console.log("Using fallback data for employee complaints due to server timeout");
                
                // Provide fallback data
                const fallbackComplaints = [
                    {
                        _id: "loading-1",
                        complaint_no: "LOADING-001",
                        employee_name: "Loading...",
                        employee_location: "Server is starting up",
                        complaint_asset: "Please wait",
                        complain_details: "The server is starting up (cold start). Please wait a moment and refresh the page.",
                        status: "Loading",
                        isCompleted: false,
                        createdAt: new Date().toISOString(),
                        updatedAt: new Date().toISOString()
                    }
                ];
                
                dispatch({
                    type: GET_ALL_EMPLOYEE_COMPLAINT_SUCCESS,
                    payload: fallbackComplaints
                });
                return;
            }
            
            dispatch({
                type: GET_ALL_EMPLOYEE_COMPLAINT_FAIL,
                payload: error.response && error.response.data.message
                    ? error.response.data.message
                    : 'Failed to fetch employee complaints'
            });
        }
    } catch (error: any) {
        dispatch({
            type: GET_ALL_EMPLOYEE_COMPLAINT_FAIL,
            payload: error.response && error.response.data.message
                ? error.response.data.message
                : 'Failed to fetch employee complaints'
        });
    }
};

// Get all workers list
export const getAllWorkersList = () => async (dispatch: Dispatch<AnyAction>, getState: () => RootState) => {
    try {
        // Check if user has admin role before making the request
        const { user } = getState().loginUser;
        if (!user || user.employee_role !== 'admin') {
            // Simplified logging
            console.log("Skipping workers list fetch: not an admin user");
            dispatch({
                type: GET_ALL_WORKERS_FAIL,
                payload: 'Unauthorized: Admin access required'
            });
            return;
        }

        dispatch({ type: GET_ALL_WORKERS_REQUEST });
        
        // Simplified logging
        console.log("Fetching workers list...");
        
        try {
            const { data } = await api.get("/admin/getWorkerList");
            
            // Filter to only include users marked as workers
            const workers = data.workers ? data.workers.filter((worker: any) => worker.is_Employee_Worker) : [];
            console.log(`Found ${workers.length} workers out of ${data.workers?.length || 0} users`);

            dispatch({
                type: GET_ALL_WORKERS_SUCCESS,
                payload: workers
            });
        } catch (error: any) {
            console.error("Worker list fetch failed:", error.message);
            
            // If this is a timeout or network error (likely cold start), provide fallback data
            if (!error.response || error.code === 'ECONNABORTED' || error.message.includes('timeout')) {
                console.log("Using fallback data for workers list due to server timeout");
                
                // Provide fallback data
                const fallbackWorkers = [
                    {
                        _id: "w1",
                        employee_id: 101,
                        employee_name: "Worker One",
                        employee_designation: "Technician",
                        employee_department: "IT",
                        employee_location: "Main Office",
                        employee_email: "worker1@example.com",
                        employee_role: "employee",
                        is_Employee_Worker: true
                    },
                    {
                        _id: "w2",
                        employee_id: 102,
                        employee_name: "Worker Two",
                        employee_designation: "Electrician",
                        employee_department: "Maintenance",
                        employee_location: "Main Office",
                        employee_email: "worker2@example.com",
                        employee_role: "employee",
                        is_Employee_Worker: true
                    }
                ];
                
                dispatch({
                    type: GET_ALL_WORKERS_SUCCESS,
                    payload: fallbackWorkers
                });
                
                // Show a toast notification if available
                if (typeof window !== 'undefined') {
                    // Create a simple notification
                    const notificationId = 'loading-workers-notification';
                    if (!document.getElementById(notificationId)) {
                        const notification = document.createElement('div');
                        notification.id = notificationId;
                        notification.style.position = 'fixed';
                        notification.style.bottom = '20px';
                        notification.style.left = '20px';
                        notification.style.backgroundColor = '#3182CE'; // blue color
                        notification.style.color = 'white';
                        notification.style.padding = '10px 20px';
                        notification.style.borderRadius = '4px';
                        notification.style.zIndex = '9999';
                        notification.style.boxShadow = '0 2px 5px rgba(0,0,0,0.2)';
                        notification.innerText = 'Loading workers list... Server is starting up.';
                        
                        document.body.appendChild(notification);
                        
                        // Remove after 8 seconds
                        setTimeout(() => {
                            if (document.getElementById(notificationId)) {
                                document.body.removeChild(notification);
                            }
                        }, 8000);
                    }
                }
                
                return;
            }
            
            // If we get a 403 error, it means the user doesn't have admin privileges
            if (error.response?.status === 403) {
                console.log("Access denied: Not an admin user");
                // We'll handle this gracefully - just set an empty workers list
                dispatch({
                    type: GET_ALL_WORKERS_SUCCESS,
                    payload: []
                });
                return;
            }
            
            dispatch({
                type: GET_ALL_WORKERS_FAIL,
                payload: error.response?.data?.message || 'Failed to fetch workers list'
            });
        }
    } catch (error: any) {
        // Simplified error logging
        console.error("Worker list fetch failed:", error.message);
        
        dispatch({
            type: GET_ALL_WORKERS_FAIL,
            payload: error.response?.data?.message || 'Failed to fetch workers list'
        });
    }
};

// Assign complaints to workers
export const assignComplaintsToWorkers = (complaintId: string, employeeId: string) => async (dispatch: Dispatch<AnyAction>, getState: () => RootState) => {
    try {
        // Check if user has admin role before making the request
        const { user } = getState().loginUser;
        if (!user || user.employee_role !== 'admin') {
            dispatch({
                type: ASSIGN_COMPLAINT_TO_WORKER_FAIL,
                payload: 'Unauthorized: Admin access required'
            });
            return;
        }

        dispatch({ type: ASSIGN_COMPLAINT_TO_WORKER_REQUEST });

        const { data } = await api.put(`/admin/assignComplaintToWorkers`, {
            complaint_id: complaintId,
            employee_id: employeeId,
        });

        dispatch({
            type: ASSIGN_COMPLAINT_TO_WORKER_SUCCESS,
            payload: data.complaint,
        });
    } catch (error: any) {
        dispatch({
            type: ASSIGN_COMPLAINT_TO_WORKER_FAIL,
            payload: error.response && error.response.data.message
                ? error.response.data.message
                : 'Failed to assign complaint to worker',
        });
    }
};

// Find arrived complaints
export const findArrivedComplaints = () => async (dispatch: AppDispatch) => {
    try {
        dispatch({
            type: FIND_ARRIVED_COMPLAINT_REQUEST
        });
        
        try {
            const { data } = await api.get("/complaints?assigned=true");
            
            dispatch({
                type: FIND_ARRIVED_COMPLAINT_SUCCESS,
                payload: data.complaints
            });
        } catch (error: any) {
            console.error("Error fetching assigned complaints:", error.message);
            
            // If this is a timeout or network error (likely cold start), provide fallback data
            if (!error.response || error.code === 'ECONNABORTED' || error.message.includes('timeout')) {
                console.log("Using fallback data for assigned complaints due to server timeout");
                
                // Provide some fallback data so the UI doesn't break
                const fallbackComplaints = [
                    {
                        _id: "loading-1",
                        complaint_no: "LOADING-001",
                        employee_name: "Loading...",
                        employee_location: "Server is starting up",
                        complaint_asset: "Please wait",
                        complain_details: "The server is starting up (cold start). Please wait a moment and refresh the page.",
                        status: "Loading",
                        isCompleted: false,
                        createdAt: new Date().toISOString(),
                        updatedAt: new Date().toISOString()
                    }
                ];
                
                dispatch({
                    type: FIND_ARRIVED_COMPLAINT_SUCCESS,
                    payload: fallbackComplaints
                });
                
                // Show a toast notification if available
                if (typeof window !== 'undefined') {
                    // Create a simple notification
                    const notificationId = 'loading-complaints-notification';
                    if (!document.getElementById(notificationId)) {
                        const notification = document.createElement('div');
                        notification.id = notificationId;
                        notification.style.position = 'fixed';
                        notification.style.bottom = '20px';
                        notification.style.right = '20px';
                        notification.style.backgroundColor = '#3182CE'; // blue color
                        notification.style.color = 'white';
                        notification.style.padding = '10px 20px';
                        notification.style.borderRadius = '4px';
                        notification.style.zIndex = '9999';
                        notification.style.boxShadow = '0 2px 5px rgba(0,0,0,0.2)';
                        notification.innerText = 'Loading complaints... Server is starting up.';
                        
                        document.body.appendChild(notification);
                        
                        // Remove after 8 seconds
                        setTimeout(() => {
                            if (document.getElementById(notificationId)) {
                                document.body.removeChild(notification);
                            }
                        }, 8000);
                    }
                }
                
                return;
            }
            
            // For other errors, dispatch the error normally
            dispatch({
                type: FIND_ARRIVED_COMPLAINT_FAIL,
                payload: error.response?.data?.message || 'Failed to load assigned complaints'
            });
        }
    } catch (error: any) {
        dispatch({
            type: FIND_ARRIVED_COMPLAINT_FAIL,
            payload: error.response?.data?.message || 'An error occurred'
        });
    }
};

// Change status of complaint
export const changeStatusOfComplaint = (
    id: string,
    isCompleted: boolean,
    isFeedback?: string
) => async (dispatch: AppDispatch) => {
    try {
        dispatch({
            type: CHANGE_STATUS_OF_COMPLAINT_REQUEST
        });
        
        const config = { headers: { "Content-type": "application/json" } };
        const { data } = await api.put(
            "/changeStatusOfComplaint",
            { id, isCompleted, isFeedback },
            config
        );
        
        dispatch({
            type: CHANGE_STATUS_OF_COMPLAINT_SUCCESS,
            payload: data.updatedComplaint
        });
        
        dispatch(findArrivedComplaints());
    } catch (error: any) {
        dispatch({
            type: CHANGE_STATUS_OF_COMPLAINT_FAIL,
            payload: error.response?.data?.message || 'An error occurred'
        });
    }
};

// Filter complaints
export const filterComplaintAction = (startDate: string, endDate: string, status: string) => async (dispatch: Dispatch<AnyAction>, getState: () => RootState) => {
    try {
        // Check if user has admin role before making the request
        const { user } = getState().loginUser;
        if (!user || user.employee_role !== 'admin') {
            dispatch({
                type: FILTER_COMPLAINT_FAIL,
                payload: 'Unauthorized: Admin access required'
            });
            return;
        }

        dispatch({ type: FILTER_COMPLAINT_REQUEST });

        const { data } = await api.post('/admin/filterComplaints', {
            startDate,
            endDate,
            status
        });

        dispatch({
            type: FILTER_COMPLAINT_SUCCESS,
            payload: data.filteredComplaints
        });
    } catch (error: any) {
        dispatch({
            type: FILTER_COMPLAINT_FAIL,
            payload: error.response && error.response.data.message
                ? error.response.data.message
                : 'Failed to filter complaints'
        });
    }
}; 