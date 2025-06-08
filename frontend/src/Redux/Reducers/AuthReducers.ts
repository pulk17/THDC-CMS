import { 
    LOGIN_REQUEST,
    LOGIN_SUCCESS,
    LOGIN_FAIL,
    LOGIN_RESET,
    REGISTER_USER_REQUEST,
    REGISTER_USER_SUCCESS,
    REGISTER_USER_FAIL,
    REGISTER_USER_RESET,
    LOGOUT_USER_REQUEST,
    LOGOUT_USER_SUCCESS,
    LOGOUT_USER_FAIL,
    LOGOUT_USER_RESET
} from "../ActionType";
import { Action, AuthState, RegisterState, LogoutState, User } from "../../types";

// Initial states
const loginInitialState: AuthState = {
    loading: false,
    user: null,
    isLoggedIn: false,
    token: null,
    error: null
};

const registerInitialState: RegisterState = {
    loading: false,
    user: null,
    isRegistered: false,
    error: null
};

const logoutInitialState: LogoutState = {
    loading: false,
    isLoggedOut: false,
    error: null
};

// Unified login reducer
export const loginUserReducer = (
    state: AuthState = loginInitialState,
    action: Action
): AuthState => {
    const { type, payload } = action;
    switch (type) {
        case LOGIN_REQUEST:
            return {
                ...state,
                loading: true,
                error: null
            };
        case LOGIN_SUCCESS:
            return {
                ...state,
                loading: false,
                user: payload.user,
                token: payload.token,
                isLoggedIn: true
            };
        case LOGIN_FAIL:
            return {
                ...state,
                isLoggedIn: false,
                loading: false,
                error: payload as string,
                user: null,
                token: null
            };
        case LOGIN_RESET:
            return {
                ...loginInitialState
            };
        default:
            return state;
    }
};

// Unified register reducer
export const registerUserReducer = (
    state: RegisterState = registerInitialState,
    action: Action
): RegisterState => {
    const { type, payload } = action;
    switch (type) {
        case REGISTER_USER_REQUEST:
            return {
                ...state,
                loading: true,
                error: null
            };
        case REGISTER_USER_SUCCESS:
            return {
                ...state,
                loading: false,
                user: payload as User,
                isRegistered: true
            };
        case REGISTER_USER_FAIL:
            return {
                ...state,
                isRegistered: false,
                loading: false,
                error: payload as string,
                user: null
            };
        case REGISTER_USER_RESET:
            return {
                ...registerInitialState
            };
        default:
            return state;
    }
};

// Logout reducer
export const logOutUserReducer = (
    state: LogoutState = logoutInitialState,
    action: Action
): LogoutState => {
    const { type, payload } = action;
    switch (type) {
        case LOGOUT_USER_REQUEST:
            return {
                ...state,
                loading: true,
                error: null
            };
        case LOGOUT_USER_SUCCESS:
            return {
                ...state,
                loading: false,
                isLoggedOut: true
            };
        case LOGOUT_USER_FAIL:
            return {
                ...state,
                isLoggedOut: false,
                loading: false,
                error: payload as string
            };
        case LOGOUT_USER_RESET:
            return {
                ...logoutInitialState
            };
        default:
            return state;
    }
}; 