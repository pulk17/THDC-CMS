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
            "/api/v1/registerComplaint", 
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
        
        const { data } = await api.get("/api/v1/complaints?mine=true");
        
        dispatch({
            type: GET_ALL_MY_COMPLAINT_SUCCESS,
            payload: data.complaints
        });
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

        const { data } = await api.get("/api/v1/complaints");

        dispatch({
            type: GET_ALL_EMPLOYEE_COMPLAINT_SUCCESS,
            payload: data.complaints
        });
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
        
        const { data } = await api.get("/api/v1/admin/getWorkerList");
        
        // Filter to only include users marked as workers
        const workers = data.workers ? data.workers.filter((worker: any) => worker.is_Employee_Worker) : [];
        console.log(`Found ${workers.length} workers out of ${data.workers?.length || 0} users`);

        dispatch({
            type: GET_ALL_WORKERS_SUCCESS,
            payload: workers
        });
    } catch (error: any) {
        // Simplified error logging
        console.error("Worker list fetch failed:", error.message);
        
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

        const { data } = await api.put(`/api/v1/admin/assignComplaintToWorkers`, {
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
        
        const { data } = await api.get("/api/v1/complaints?assigned=true");
        
        dispatch({
            type: FIND_ARRIVED_COMPLAINT_SUCCESS,
            payload: data.complaints
        });
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
            "/api/v1/changeStatusOfComplaint",
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

// Filter complaints by date and status
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

    const { data } = await api.post('/api/v1/admin/filterComplaints', {
      startDate,
      endDate,
      status,
    });

    dispatch({
      type: FILTER_COMPLAINT_SUCCESS,
      payload: data.complaints,
    });
  } catch (error: any) {
    dispatch({
      type: FILTER_COMPLAINT_FAIL,
      payload: error.response && error.response.data.message
        ? error.response.data.message
        : 'Failed to filter complaints',
    });
  }
}; 