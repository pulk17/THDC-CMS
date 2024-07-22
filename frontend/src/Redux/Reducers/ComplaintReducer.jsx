import { ASSIGN_COMPLAINT_TO_WORKERS_FAIL, ASSIGN_COMPLAINT_TO_WORKERS_REQUEST, ASSIGN_COMPLAINT_TO_WORKERS_RESET, ASSIGN_COMPLAINT_TO_WORKERS_SUCCESS, GET_ALL_EMPLOYEE_COMPLAINT_FAIL, GET_ALL_EMPLOYEE_COMPLAINT_REQUEST, GET_ALL_EMPLOYEE_COMPLAINT_SUCCESS, GET_ALL_MY_COMPLAINT_FAIL, GET_ALL_MY_COMPLAINT_REQUEST, GET_ALL_MY_COMPLAINT_SUCCESS, GET_WORKERS_LIST_FAIL, GET_WORKERS_LIST_REQUEST, GET_WORKERS_LIST_SUCCESS, REGISTER_COMPLAINT_FAIL, REGISTER_COMPLAINT_REQUEST, REGISTER_COMPLAINT_RESET, REGISTER_COMPLAINT_SUCCESS } from "../ActionType"



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