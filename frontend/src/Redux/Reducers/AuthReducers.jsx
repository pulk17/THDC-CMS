import { LOGIN_AS_ADMIN_FAIL, LOGIN_AS_ADMIN_REQUEST, LOGIN_AS_ADMIN_RESET, LOGIN_AS_ADMIN_SUCCESS, LOGIN_AS_EMPLOYEE_FAIL, LOGIN_AS_EMPLOYEE_REQUEST, LOGIN_AS_EMPLOYEE_RESET, LOGIN_AS_EMPLOYEE_SUCCESS, LOGOUT_USER_FAIL, LOGOUT_USER_REQUEST, LOGOUT_USER_RESET, LOGOUT_USER_SUCCESS, REGISTER_AS_EMPLOYEE_FAIL, REGISTER_AS_EMPLOYEE_REQUEST, REGISTER_AS_EMPLOYEE_SUCCESS } from "../ActionType"

// Login As a Employee
export const loginEmployeeReducer = (state={
    loading: false,
    user: {},
    success: false,
    isLoggedIn: false,
}, action) => {
    const { type, payload } = action
    switch(type){
        case LOGIN_AS_EMPLOYEE_REQUEST:
            return {
                ...state,
                loading: true,
                error:[]
            }
        case LOGIN_AS_EMPLOYEE_SUCCESS:
            return {
                ...state,
                loading: false,
                user: payload,
                isLoggedIn: true,
                success: true
            }
        case LOGIN_AS_EMPLOYEE_FAIL:
            return {
                ...state,
                isLoggedIn: false,
                loading: false,
                error: payload,
                user: {}
            }
        case LOGIN_AS_EMPLOYEE_RESET:
            return {
                isLoggedIn: false,
                isActive: false,
                user: [],
            }
        default:
            return { ...state }
    }
}



// Login As a Employee
export const registerEmployeeReducer = (state={
    loading: false,
    user: {},
    success: false,
    isRegistered: false,
}, action) => {
    const { type, payload } = action
    switch(type){
        case REGISTER_AS_EMPLOYEE_REQUEST:
            return {
                ...state,
                loading: true,
                error:[]
            }
        case REGISTER_AS_EMPLOYEE_SUCCESS:
            return {
                ...state,
                loading: false,
                user: payload,
                isRegistered: true,
                success: true
            }
        case REGISTER_AS_EMPLOYEE_FAIL:
            return {
                ...state,
                isRegistered: false,
                loading: false,
                error: payload,
                user: {}
            }
        default:
            return { ...state }
    }
}


// Login As a Admin:-
export const loginAdminReducer = (state={
    loading: false,
    user: {},
    success: false,
    isLoggedIn: false,
}, action) => {
    const { type, payload } = action
    switch(type){
        case LOGIN_AS_ADMIN_REQUEST:
            return {
                ...state,
                loading: true,
                error:[]
            }
        case LOGIN_AS_ADMIN_SUCCESS:
            return {
                ...state,
                loading: false,
                user: payload,
                isLoggedIn: true,
                success: true
            }
        case LOGIN_AS_ADMIN_FAIL:
            return {
                ...state,
                isLoggedIn: false,
                loading: false,
                error: payload,
                user: {}
            }
        case LOGIN_AS_ADMIN_RESET:
            return {
                isLoggedIn: false,
                isActive: false,
                user: [],
            }
        default:
            return { ...state }
    }
}



//Logout User:-
export const logOutReducer = (state={
    loading: false,
    message : "",
    isLoggedOut: false,
}, action) => {
    const { type, payload } = action
    switch(type){
        case LOGOUT_USER_REQUEST:
            return {
                ...state,
                loading: true,
                error:[]
            }
        case LOGOUT_USER_SUCCESS:
            return {
                ...state,
                loading: false,
                message : payload,
                isLoggedOut: true,
                success: true
            }
        case LOGOUT_USER_FAIL:
            return {
                ...state,
                isLoggedOut: false,
                loading: false,
                error: payload,
                message: ""
            }
            case LOGOUT_USER_RESET:
                return {
                    ...state,
                    loading: false,
                    isLoggedOut :false,
                    error:[]
                }
        default:
            return { ...state }
    }
}