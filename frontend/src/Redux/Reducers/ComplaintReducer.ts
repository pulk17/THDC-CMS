import { 
    REGISTER_COMPLAINT_REQUEST,
    REGISTER_COMPLAINT_SUCCESS,
    REGISTER_COMPLAINT_FAIL,
    REGISTER_COMPLAINT_RESET,
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
    ASSIGN_COMPLAINT_TO_WORKER_RESET,
    FIND_ARRIVED_COMPLAINT_REQUEST,
    FIND_ARRIVED_COMPLAINT_SUCCESS,
    FIND_ARRIVED_COMPLAINT_FAIL,
    CHANGE_STATUS_OF_COMPLAINT_REQUEST,
    CHANGE_STATUS_OF_COMPLAINT_SUCCESS,
    CHANGE_STATUS_OF_COMPLAINT_FAIL,
    CHANGE_STATUS_OF_COMPLAINT_RESET,
    FILTER_COMPLAINT_REQUEST,
    FILTER_COMPLAINT_SUCCESS,
    FILTER_COMPLAINT_FAIL,
    FILTER_COMPLAINT_RESET
} from "../ActionType";
import { Action, ComplaintState, ComplaintsState, Complaint, User } from "../../types";

// Register complaint reducer
interface RegisterComplaintState extends ComplaintState {}

const registerComplaintInitialState: RegisterComplaintState = {
    loading: false,
    complaint: null,
    isRegisteredComplaint: false,
    success: false,
    error: null
};

export const registerComplaintReducer = (
    state: RegisterComplaintState = registerComplaintInitialState,
    action: Action
): RegisterComplaintState => {
    switch(action.type) {
        case REGISTER_COMPLAINT_REQUEST:
            return {
                ...state,
                loading: true,
                error: null
            };
        case REGISTER_COMPLAINT_SUCCESS:
            return {
                ...state,
                loading: false,
                complaint: action.payload,
                isRegisteredComplaint: true,
                success: true,
                error: null
            };
        case REGISTER_COMPLAINT_FAIL:
            return {
                ...state,
                isRegisteredComplaint: false,
                loading: false,
                error: action.payload,
                complaint: null
            };
        case REGISTER_COMPLAINT_RESET:
            return {
                ...registerComplaintInitialState,
                isRegisteredComplaint: false,
                complaint: null
            };
        default:
            return state;
    }
};

// Get all my complaints reducer
interface GetAllMyComplaintsState extends ComplaintsState {
    isGetComplaint?: boolean;
}

const getAllMyComplaintsInitialState: GetAllMyComplaintsState = {
    loading: false,
    allComplaints: [],
    isGetComplaint: false,
    success: false,
    error: null
};

export const getAllMyComplaintReducer = (
    state: GetAllMyComplaintsState = getAllMyComplaintsInitialState,
    action: Action
): GetAllMyComplaintsState => {
    switch(action.type) {
        case GET_ALL_MY_COMPLAINT_REQUEST:
            return {
                ...state,
                loading: true,
                error: null
            };
        case GET_ALL_MY_COMPLAINT_SUCCESS:
            return {
                ...state,
                loading: false,
                allComplaints: action.payload,
                isGetComplaint: true,
                success: true,
                error: null
            };
        case GET_ALL_MY_COMPLAINT_FAIL:
            return {
                ...state,
                isGetComplaint: false,
                loading: false,
                error: action.payload,
                allComplaints: []
            };
        default:
            return state;
    }
};

// Get all employee complaints reducer (admin)
interface GetAllEmployeeComplaintsState extends ComplaintsState {
    isGetEmployeeComplaint?: boolean;
}

const getAllEmployeeComplaintsInitialState: GetAllEmployeeComplaintsState = {
    loading: false,
    allComplaints: [],
    isGetEmployeeComplaint: false,
    success: false,
    error: null
};

export const getAllEmployeeComplaintReducer = (
    state: GetAllEmployeeComplaintsState = getAllEmployeeComplaintsInitialState,
    action: Action
): GetAllEmployeeComplaintsState => {
    switch(action.type) {
        case GET_ALL_EMPLOYEE_COMPLAINT_REQUEST:
            return {
                ...state,
                loading: true,
                error: null
            };
        case GET_ALL_EMPLOYEE_COMPLAINT_SUCCESS:
            return {
                ...state,
                loading: false,
                allComplaints: action.payload,
                isGetEmployeeComplaint: true,
                success: true,
                error: null
            };
        case GET_ALL_EMPLOYEE_COMPLAINT_FAIL:
            return {
                ...state,
                isGetEmployeeComplaint: false,
                loading: false,
                error: action.payload,
                allComplaints: []
            };
        default:
            return state;
    }
};

// Get all workers list reducer
interface GetAllWorkersListState {
    loading: boolean;
    workers: User[];
    isGetWorkers?: boolean;
    success?: boolean;
    error?: string | null;
}

const getAllWorkersListInitialState: GetAllWorkersListState = {
    loading: false,
    workers: [],
    isGetWorkers: false,
    success: false,
    error: null
};

export const getAllWorkersReducer = (
    state: GetAllWorkersListState = getAllWorkersListInitialState,
    action: Action
): GetAllWorkersListState => {
    switch(action.type) {
        case GET_ALL_WORKERS_REQUEST:
            return {
                ...state,
                loading: true,
                error: null
            };
        case GET_ALL_WORKERS_SUCCESS:
            return {
                ...state,
                loading: false,
                workers: action.payload,
                isGetWorkers: true,
                success: true,
                error: null
            };
        case GET_ALL_WORKERS_FAIL:
            return {
                ...state,
                isGetWorkers: false,
                loading: false,
                error: action.payload,
                workers: []
            };
        default:
            return state;
    }
};

// Assign complaint to workers reducer
interface AssignComplaintToWorkersState {
    loading: boolean;
    complaint: Complaint | null;
    isAssigned?: boolean;
    success?: boolean;
    error?: string | null;
}

const assignComplaintToWorkersInitialState: AssignComplaintToWorkersState = {
    loading: false,
    complaint: null,
    isAssigned: false,
    success: false,
    error: null
};

export const assignComplaintToWorkerReducer = (
    state: AssignComplaintToWorkersState = assignComplaintToWorkersInitialState,
    action: Action
): AssignComplaintToWorkersState => {
    switch(action.type) {
        case ASSIGN_COMPLAINT_TO_WORKER_REQUEST:
            return {
                ...state,
                loading: true,
                error: null
            };
        case ASSIGN_COMPLAINT_TO_WORKER_SUCCESS:
            return {
                ...state,
                loading: false,
                complaint: action.payload,
                isAssigned: true,
                success: true,
                error: null
            };
        case ASSIGN_COMPLAINT_TO_WORKER_FAIL:
            return {
                ...state,
                isAssigned: false,
                loading: false,
                error: action.payload,
                complaint: null
            };
        case ASSIGN_COMPLAINT_TO_WORKER_RESET:
            return {
                ...assignComplaintToWorkersInitialState,
                isAssigned: false,
                complaint: null
            };
        default:
            return state;
    }
};

// Find all arrived complaints reducer
interface FindAllArrivedComplaintsState {
    loading: boolean;
    complaints: Complaint[];
    isGetArrived?: boolean;
    success?: boolean;
    error?: string | null;
}

const findAllArrivedComplaintsInitialState: FindAllArrivedComplaintsState = {
    loading: false,
    complaints: [],
    isGetArrived: false,
    success: false,
    error: null
};

export const findArrivedComplaintReducer = (
    state: FindAllArrivedComplaintsState = findAllArrivedComplaintsInitialState,
    action: Action
): FindAllArrivedComplaintsState => {
    switch(action.type) {
        case FIND_ARRIVED_COMPLAINT_REQUEST:
            return {
                ...state,
                loading: true,
                error: null
            };
        case FIND_ARRIVED_COMPLAINT_SUCCESS:
            return {
                ...state,
                loading: false,
                complaints: action.payload,
                isGetArrived: true,
                success: true,
                error: null
            };
        case FIND_ARRIVED_COMPLAINT_FAIL:
            return {
                ...state,
                isGetArrived: false,
                loading: false,
                error: action.payload,
                complaints: []
            };
        default:
            return state;
    }
};

// Change status of complaint reducer
interface ChangeStatusComplaintState {
    loading: boolean;
    complaint: Complaint | null;
    isStatusChanged?: boolean;
    success?: boolean;
    error?: string | null;
}

const changeStatusComplaintInitialState: ChangeStatusComplaintState = {
    loading: false,
    complaint: null,
    isStatusChanged: false,
    success: false,
    error: null
};

export const changeStatusOfComplaintReducer = (
    state: ChangeStatusComplaintState = changeStatusComplaintInitialState,
    action: Action
): ChangeStatusComplaintState => {
    switch(action.type) {
        case CHANGE_STATUS_OF_COMPLAINT_REQUEST:
            return {
                ...state,
                loading: true,
                error: null
            };
        case CHANGE_STATUS_OF_COMPLAINT_SUCCESS:
            return {
                ...state,
                loading: false,
                complaint: action.payload,
                isStatusChanged: true,
                success: true,
                error: null
            };
        case CHANGE_STATUS_OF_COMPLAINT_FAIL:
            return {
                ...state,
                isStatusChanged: false,
                loading: false,
                error: action.payload,
                complaint: null
            };
        case CHANGE_STATUS_OF_COMPLAINT_RESET:
            return changeStatusComplaintInitialState;
        default:
            return state;
    }
};

// Filter complaint reducer
interface FilterComplaintState {
    loading: boolean;
    complaints: Complaint[];
    isFiltered?: boolean;
    success?: boolean;
    error?: string | null;
}

const filterComplaintInitialState: FilterComplaintState = {
    loading: false,
    complaints: [],
    isFiltered: false,
    success: false,
    error: null
};

export const filterComplaintReducer = (
    state: FilterComplaintState = filterComplaintInitialState,
    action: Action
): FilterComplaintState => {
    switch(action.type) {
        case FILTER_COMPLAINT_REQUEST:
            return {
                ...state,
                loading: true,
                error: null
            };
        case FILTER_COMPLAINT_SUCCESS:
            return {
                ...state,
                loading: false,
                complaints: action.payload,
                isFiltered: true,
                success: true,
                error: null
            };
        case FILTER_COMPLAINT_FAIL:
            return {
                ...state,
                isFiltered: false,
                loading: false,
                error: action.payload,
                complaints: []
            };
        case FILTER_COMPLAINT_RESET:
            return filterComplaintInitialState;
        default:
            return state;
    }
}; 