import { configureStore } from '@reduxjs/toolkit'
import {thunk} from 'redux-thunk'
import {logOutReducer, loginAdminReducer, loginEmployeeReducer, registerEmployeeReducer } from './Reducers/AuthReducers'
import { assignComplaintToWorkersReducer, changeStatusComplaintReducer, filterComplaintReducer, findAllArrivedComplaintsReducer, getAllEmployeeComplaintReducer, getAllMyComplaintReducer, getAllWorkersListReducer, registerComplaintReducer } from './Reducers/ComplaintReducer'

const rootReducer = {
   loginUser : loginEmployeeReducer,
   loginAdmin: loginAdminReducer,
   registerUser : registerEmployeeReducer,
   logOutUser : logOutReducer,
   registerComplaint : registerComplaintReducer,
   allMyComplaints : getAllMyComplaintReducer,
   allEmployeeComplaints : getAllEmployeeComplaintReducer,
   allWorkers : getAllWorkersListReducer,
   assignComplaint : assignComplaintToWorkersReducer,
   findAllArrived : findAllArrivedComplaintsReducer,
   changeStatus : changeStatusComplaintReducer,
   filterComplaints : filterComplaintReducer
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
