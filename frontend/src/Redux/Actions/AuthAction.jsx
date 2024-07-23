import axios from 'axios'
import { LOGIN_AS_ADMIN_FAIL, LOGIN_AS_ADMIN_REQUEST, LOGIN_AS_ADMIN_SUCCESS, LOGIN_AS_EMPLOYEE_FAIL, LOGIN_AS_EMPLOYEE_REQUEST, LOGIN_AS_EMPLOYEE_SUCCESS, LOGOUT_USER_FAIL, LOGOUT_USER_REQUEST, LOGOUT_USER_SUCCESS, REGISTER_AS_EMPLOYEE_FAIL, REGISTER_AS_EMPLOYEE_REQUEST, REGISTER_AS_EMPLOYEE_SUCCESS } from '../ActionType'
import { findArrivedComplaints, getAllEmployeeComplaints, getAllMyComplaints, getAllWorkersList } from './ComplaintAction'


//Login As A Employee:-
export const loginAsEmployee = (employee_id, employee_password) => async(dispatch) =>{
    try{
        dispatch({
            type: LOGIN_AS_EMPLOYEE_REQUEST
        })
        const config = { headers: { "Content-type": "application/json" } }
        const { data } = await axios.post("/api/v1/user/login", { employee_id, employee_password }, config)
        dispatch({
            type: LOGIN_AS_EMPLOYEE_SUCCESS,
            payload: data.user
        })
        dispatch(getAllMyComplaints());
        dispatch(findArrivedComplaints())
    }catch(error){
        dispatch({
            type: LOGIN_AS_EMPLOYEE_FAIL,
            payload: error.response.data.message
        })
    }
}

//register employee:-
export const RegisterAsEmployee = (employee_id, employee_name,employee_designation,employee_department,employee_location,employee_password ,employee_email) => async(dispatch) =>{
    try{
        dispatch({
            type: REGISTER_AS_EMPLOYEE_REQUEST
        })
        const config = { headers: { "Content-type": "application/json" } }
        const { data } = await axios.post("/api/v1/register", {employee_id, employee_name,employee_designation,employee_department,employee_location,employee_password ,employee_email }, config)
        dispatch({
            type: REGISTER_AS_EMPLOYEE_SUCCESS,
            payload: data.user
        })
    }catch(error){
        dispatch({
            type: REGISTER_AS_EMPLOYEE_FAIL,
            payload: error.response.data.message
        })
    }
}


//Login As A Admin:-
export const loginAsAdmin = (employee_id, employee_password) => async(dispatch) =>{
    try{
        dispatch({
            type: LOGIN_AS_ADMIN_REQUEST
        })
        const config = { headers: { "Content-type": "application/json" } }
        const { data } = await axios.post("/api/v1/admin/login", { employee_id, employee_password }, config)
        dispatch({
            type: LOGIN_AS_ADMIN_SUCCESS,
            payload: data.user
        })
        dispatch(getAllEmployeeComplaints())
        dispatch(getAllWorkersList())
    }catch(error){
        dispatch({
            type: LOGIN_AS_ADMIN_FAIL,
            payload: error.response.data.message
        })
    }
}



//Logout User:-
export const logoutUser = () => async(dispatch) =>{
    console.log("inside logout")
    try{
        dispatch({
            type: LOGOUT_USER_REQUEST
        })
        const { data } = await axios.get("/api/v1//logout")
        dispatch({
            type: LOGOUT_USER_SUCCESS,
            payload: data.message
        })
    }catch(error){
        dispatch({
            type: LOGOUT_USER_FAIL,
            payload: error.response.data.message
        })
    }
}




