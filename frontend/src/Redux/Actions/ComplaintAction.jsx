import axios from 'axios'
import { ASSIGN_COMPLAINT_TO_WORKERS_FAIL, ASSIGN_COMPLAINT_TO_WORKERS_REQUEST, ASSIGN_COMPLAINT_TO_WORKERS_SUCCESS, CHANGE_STATUS_OF_ARRIVED_COMPLAINT_FAIL, CHANGE_STATUS_OF_ARRIVED_COMPLAINT_REQUEST, CHANGE_STATUS_OF_ARRIVED_COMPLAINT_SUCCESS, FILTER_COMPLAINT_FAIL, FILTER_COMPLAINT_REQUEST, FILTER_COMPLAINT_SUCCESS, GET_ALL_ARRIVED_COMPLAINT_FAIL, GET_ALL_ARRIVED_COMPLAINT_REQUEST, GET_ALL_ARRIVED_COMPLAINT_SUCCESS, GET_ALL_EMPLOYEE_COMPLAINT_FAIL, GET_ALL_EMPLOYEE_COMPLAINT_REQUEST, GET_ALL_EMPLOYEE_COMPLAINT_SUCCESS, GET_ALL_MY_COMPLAINT_FAIL, GET_ALL_MY_COMPLAINT_REQUEST, GET_ALL_MY_COMPLAINT_SUCCESS, GET_WORKERS_LIST_FAIL, GET_WORKERS_LIST_REQUEST, GET_WORKERS_LIST_SUCCESS, REGISTER_COMPLAINT_FAIL, REGISTER_COMPLAINT_REQUEST, REGISTER_COMPLAINT_SUCCESS } from '../ActionType'






//Register a complaint:-
export const registerComplaint = (employee_location, complaint_asset , employee_phoneNo ,complain_details) => async(dispatch) =>{
    try{
        dispatch({
            type: REGISTER_COMPLAINT_REQUEST
        })
        const config = { headers: { "Content-type": "application/json" } }
        const { data } = await axios.post("/api/v1/registerComplaint", { employee_location, complaint_asset , employee_phoneNo ,complain_details}, config)
        dispatch({
            type: REGISTER_COMPLAINT_SUCCESS,
            payload: data.compaint
        })
        dispatch(getAllMyComplaints());
    }catch(error){
        dispatch({
            type: REGISTER_COMPLAINT_FAIL,
            payload: error.response.data.message
        })
    }
}

//get all complaints:-
export const getAllMyComplaints = () => async(dispatch) =>{
    try{
        dispatch({
            type: GET_ALL_MY_COMPLAINT_REQUEST
        })
        const { data } = await axios.get("/api/v1/myComplaints")
        dispatch({
            type: GET_ALL_MY_COMPLAINT_SUCCESS,
            payload: data.allComplaints
        })
    }catch(error){
        dispatch({
            type: GET_ALL_MY_COMPLAINT_FAIL,
            payload: error.response.data.message
        })
    }
}


//get all user complaint -- admin:-
export const getAllEmployeeComplaints = () => async(dispatch) =>{
    try{
        dispatch({
            type: GET_ALL_EMPLOYEE_COMPLAINT_REQUEST
        })
        const { data } = await axios.get("/api/v1/admin/getAllComplaints")
        dispatch({
            type: GET_ALL_EMPLOYEE_COMPLAINT_SUCCESS,
            payload: data.allComplaints
        })
    }catch(error){
        dispatch({
            type: GET_ALL_EMPLOYEE_COMPLAINT_FAIL,
            payload: error.response.data.message
        })
    }
}

//get workers List:-
export const getAllWorkersList = () => async(dispatch) =>{
    try{
        dispatch({
            type: GET_WORKERS_LIST_REQUEST
        })
        const { data } = await axios.get("/api/v1/admin/getWorkerList")
        dispatch({
            type: GET_WORKERS_LIST_SUCCESS,
            payload: data.workers
        })
    }catch(error){
        dispatch({
            type: GET_WORKERS_LIST_FAIL,
            payload: error.response.data.message
        })
    }
}


// assign complaint to workers:-
export const assignComplaintsToWorkers = (id , emp_id) => async(dispatch) =>{
    try{
        dispatch({
            type: ASSIGN_COMPLAINT_TO_WORKERS_REQUEST
        })
        const config = { headers: { "Content-type": "application/json" } }
        const { data } = await axios.put("/api/v1/admin/assignComplaintToWorkers", {complaint_id:id , employee_id:emp_id}, config)
        dispatch({
            type: ASSIGN_COMPLAINT_TO_WORKERS_SUCCESS,
            payload: data.complaint
        })
        dispatch(getAllEmployeeComplaints())
    }catch(error){
        dispatch({
            type: ASSIGN_COMPLAINT_TO_WORKERS_FAIL,
            payload: error.response.data.message
        })
    }
}

// Change status of arrived complaint:-
export const findArrivedComplaints = () => async(dispatch) =>{
    try{
        dispatch({
            type: GET_ALL_ARRIVED_COMPLAINT_REQUEST
        })
        const { data } = await axios.get("/api/v1/getAllAssignedComplaint")
        dispatch({
            type: GET_ALL_ARRIVED_COMPLAINT_SUCCESS,
            payload: data.complaints
        })
    }catch(error){
        dispatch({
            type: GET_ALL_ARRIVED_COMPLAINT_FAIL,
            payload: error.response.data.message
        })
    }
}

//Change status of complaint:-
export const changeStatusOfComplaint = (id , isCompleted , isFeedback) => async(dispatch) =>{
    try{
        dispatch({
            type: CHANGE_STATUS_OF_ARRIVED_COMPLAINT_REQUEST
        })
        const config = { headers: { "Content-type": "application/json" } }
        const { data } = await axios.put("/api/v1/changeStatusOfComplaint", {complaint_id:id , isCompleted:isCompleted , isFeedback:isFeedback}, config)
        dispatch({
            type: CHANGE_STATUS_OF_ARRIVED_COMPLAINT_SUCCESS,
            payload: data.complaint
        })
        dispatch(findArrivedComplaints())
        dispatch(getAllMyComplaints());
    }catch(error){
        dispatch({
            type: CHANGE_STATUS_OF_ARRIVED_COMPLAINT_FAIL,
            payload: error.response.data.message
        })
    }
}

 //Change status of complaint:-
export const filterComplaintAction = (formattedStartDate , formattedEndDate , statusFilter) => async(dispatch) =>{
    console.log(formattedStartDate , formattedEndDate  , statusFilter)
    try{
        dispatch({
            type: FILTER_COMPLAINT_REQUEST
        })
        const config = { headers: { "Content-type": "application/json" } }
        const { data } = await axios.post("/api/v1/admin/filterComplaints", {startDate : formattedStartDate  , endDate : formattedEndDate , status:statusFilter}, config)
        dispatch({
            type: FILTER_COMPLAINT_SUCCESS,
            payload: data.complaints
        })

    }catch(error){
        dispatch({
            type: FILTER_COMPLAINT_FAIL,
            payload: error.response.data.message
        })
    }
}