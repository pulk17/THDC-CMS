import { ASSIGN_COMPLAINT_TO_WORKERS_FAIL, ASSIGN_COMPLAINT_TO_WORKERS_REQUEST, ASSIGN_COMPLAINT_TO_WORKERS_RESET, ASSIGN_COMPLAINT_TO_WORKERS_SUCCESS, CHANGE_STATUS_OF_ARRIVED_COMPLAINT_FAIL, CHANGE_STATUS_OF_ARRIVED_COMPLAINT_REQUEST, CHANGE_STATUS_OF_ARRIVED_COMPLAINT_RESET, CHANGE_STATUS_OF_ARRIVED_COMPLAINT_SUCCESS, FILTER_COMPLAINT_FAIL, FILTER_COMPLAINT_REQUEST, FILTER_COMPLAINT_RESET, FILTER_COMPLAINT_SUCCESS, GET_ALL_ARRIVED_COMPLAINT_FAIL, GET_ALL_ARRIVED_COMPLAINT_REQUEST, GET_ALL_ARRIVED_COMPLAINT_RESET, GET_ALL_ARRIVED_COMPLAINT_SUCCESS, GET_ALL_EMPLOYEE_COMPLAINT_FAIL, GET_ALL_EMPLOYEE_COMPLAINT_REQUEST, GET_ALL_EMPLOYEE_COMPLAINT_SUCCESS, GET_ALL_MY_COMPLAINT_FAIL, GET_ALL_MY_COMPLAINT_REQUEST, GET_ALL_MY_COMPLAINT_SUCCESS, GET_WORKERS_LIST_FAIL, GET_WORKERS_LIST_REQUEST, GET_WORKERS_LIST_SUCCESS, REGISTER_COMPLAINT_FAIL, REGISTER_COMPLAINT_REQUEST, REGISTER_COMPLAINT_RESET, REGISTER_COMPLAINT_SUCCESS } from "../ActionType"



export const registerComplaintReducer = (state={
    loading: false,
    complaint: {},
    success: false,
    isRegisteredComplaint: false,
}, action) => {
    const { type, payload } = action
    switch(type){
        case REGISTER_COMPLAINT_REQUEST:
            return {
                ...state,
                loading: true,
                error:[]
            }
        case REGISTER_COMPLAINT_SUCCESS:
            return {
                ...state,
                loading: false,
                complaint : payload,
                isRegisteredComplaint: true,
                success: true
            }
        case REGISTER_COMPLAINT_FAIL:
            return {
                ...state,
                isRegisteredComplaint: false,
                loading: false,
                error: payload,
                user: {}
            }
        case REGISTER_COMPLAINT_RESET:
            return {
                isRegisteredComplaint: false,
                complaint: [],
            }
        default:
            return { ...state }
    }
}



// get all my complaints:-
export const getAllMyComplaintReducer = (state={
    loading: false,
    allComplaints: [],
    isGetComplaint : false,
    success: false,
}, action) => {
    const { type, payload } = action
    switch(type){
        case GET_ALL_MY_COMPLAINT_REQUEST:
            return {
                ...state,
                loading: true,
                error:[]
            }
        case GET_ALL_MY_COMPLAINT_SUCCESS:
            return {
                ...state,
                loading: false,
                allComplaints : payload,
                isGetComplaint : true,
                success: true
            }
        case GET_ALL_MY_COMPLAINT_FAIL:
            return {
                ...state,
                isGetComplaint : false,
                loading: false,
                error: payload,
                allComplaints: []
            }
        default:
            return { ...state }
    }
}


//get all the user complaint ---- admin

export const getAllEmployeeComplaintReducer = (state={
    loading: false,
    allComplaints: [],
    isGetEmployeeComplaint : false,
    success: false,
}, action) => {
    const { type, payload } = action
    switch(type){
        case GET_ALL_EMPLOYEE_COMPLAINT_REQUEST:
            return {
                ...state,
                loading: true,
                error:[]
            }
        case GET_ALL_EMPLOYEE_COMPLAINT_SUCCESS:
            return {
                ...state,
                loading: false,
                allComplaints : payload,
                isGetEmployeeComplaint : true,
                success: true
            }
        case GET_ALL_EMPLOYEE_COMPLAINT_FAIL:
            return {
                ...state,
                isGetEmployeeComplaint : false,
                loading: false,
                error: payload,
                allComplaints: []
            }
        default:
            return { ...state }
    }
}



//get all the user complaint ---- admin
export const getAllWorkersListReducer = (state={
    loading: false,
    workers: [],
    isGetWorkers : false,
    success: false,
}, action) => {
    const { type, payload } = action
    switch(type){
        case GET_WORKERS_LIST_REQUEST:
            return {
                ...state,
                loading: true,
                error:[]
            }
        case GET_WORKERS_LIST_SUCCESS:
            return {
                ...state,
                loading: false,
                workers : payload,
                isGetWorkers : true,
                success: true
            }
        case GET_WORKERS_LIST_FAIL:
            return {
                ...state,
                isGetWorkers : false,
                loading: false,
                error: payload,
                workers: []
            }
        default:
            return { ...state }
    }
}




//assign complaints to workers ---- admin
export const assignComplaintToWorkersReducer = (state={
    loading: false,
    complaint: {},
    isAssigned : false,
    success: false,
}, action) => {
    const { type, payload } = action
    switch(type){
        case ASSIGN_COMPLAINT_TO_WORKERS_REQUEST:
            return {
                ...state,
                loading: true,
                error:[]
            }
        case ASSIGN_COMPLAINT_TO_WORKERS_SUCCESS:
            return {
                ...state,
                loading: false,
                complaint : payload,
                isAssigned : true,
                success: true
            }
        case ASSIGN_COMPLAINT_TO_WORKERS_FAIL:
            return {
                ...state,
                isAssigned : false,
                loading: false,
                error: payload,
                complaint: []
            }
            case ASSIGN_COMPLAINT_TO_WORKERS_RESET:
                return {
                    isAssigned: false,
                    complaint: [],
                    loading : false
                }   
        default:
            return { ...state }
    }
}




//find all arrived complaints ---- employee
export const findAllArrivedComplaintsReducer = (state={
    loading: false,
    complaints: [],
    isGetArrived : false,
    success: false,
}, action) => {
    const { type, payload } = action
    switch(type){
        case GET_ALL_ARRIVED_COMPLAINT_REQUEST:
            return {
                ...state,
                loading: true,
                error:[]
            }
        case GET_ALL_ARRIVED_COMPLAINT_SUCCESS:
            return {
                ...state,
                loading: false,
                complaints : payload,
                isGetArrived : true,
                success: true
            }
        case GET_ALL_ARRIVED_COMPLAINT_FAIL:
            return {
                ...state,
                isGet : false,
                loading: false,
                error: payload,
                complaint: []
            }
            case GET_ALL_ARRIVED_COMPLAINT_RESET:
                return {
                    isGet: false,
                    complaint: [],
                    loading : false
                }   
        default:
            return { ...state }
    }
}


//Change status of complaint ---- 
export const changeStatusComplaintReducer = (state={
    loading: false,
    complaints: {},
    isStatusChanged : false,
    success: false,
}, action) => {
    const { type, payload } = action
    switch(type){
        case CHANGE_STATUS_OF_ARRIVED_COMPLAINT_REQUEST:
            return {
                ...state,
                loading: true,
                error:[]
            }
        case CHANGE_STATUS_OF_ARRIVED_COMPLAINT_SUCCESS:
            return {
                ...state,
                loading: false,
                complaint : payload,
                isStatusChanged : true,
                success: true
            }
        case CHANGE_STATUS_OF_ARRIVED_COMPLAINT_FAIL:
            return {
                ...state,
                isStatusChanged : false,
                loading: false,
                error: payload,
                complaint: {}
            }
            case CHANGE_STATUS_OF_ARRIVED_COMPLAINT_RESET:
                return {
                    isStatusChanged: false,
                    complaint: {},
                    loading : false
                }   
        default:
            return { ...state }
    }
}


//Filter Complaint ---- 
export const filterComplaintReducer = (state={
    loading: false,
    complaints: [],
    isFiltered : false,
    success: false,
}, action) => {
    const { type, payload } = action
    switch(type){
        case FILTER_COMPLAINT_REQUEST:
            return {
                ...state,
                loading: true,
                error:[]
            }
        case FILTER_COMPLAINT_SUCCESS:
            return {
                ...state,
                loading: false,
                complaints : payload,
                isFiltered : true,
                success: true
            }
        case FILTER_COMPLAINT_FAIL:
            return {
                ...state,
                isFiltered : false,
                loading: false,
                error: payload,
                complaints: []
            }
            case FILTER_COMPLAINT_RESET:
                return {
                    isFiltered: false,
                    complaints: [],
                    loading : false
                }   
        default:
            return { ...state }
    }
}