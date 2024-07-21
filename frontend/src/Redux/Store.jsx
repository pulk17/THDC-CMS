import { configureStore } from '@reduxjs/toolkit'
import {thunk} from 'redux-thunk'
import { loginEmployeeReducer, registerEmployeeReducer } from './Reducers/AuthReducers'

const rootReducer = {
   loginUser : loginEmployeeReducer,
   registerUser : registerEmployeeReducer
}

const preloadedState = {
  // initial state here
}

const store = configureStore({
  reducer: rootReducer,
  middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(thunk),
  devTools: process.env.NODE_ENV !== 'production',
  preloadedState,
})

export default store
