import { configureStore } from '@reduxjs/toolkit'
import {thunk} from 'redux-thunk'
import {loginAdminReducer, loginEmployeeReducer, registerEmployeeReducer } from './Reducers/AuthReducers'
import { assignComplaintToWorkersReducer, changeStatusComplaintReducer, findAllArrivedComplaintsReducer, getAllEmployeeComplaintReducer, getAllMyComplaintReducer, getAllWorkersListReducer, registerComplaintReducer } from './Reducers/ComplaintReducer'

const rootReducer = {
   loginUser : loginEmployeeReducer,
   loginAdmin: loginAdminReducer,
   registerUser : registerEmployeeReducer,
   registerComplaint : registerComplaintReducer,
   allMyComplaints : getAllMyComplaintReducer,
   allEmployeeComplaints : getAllEmployeeComplaintReducer,
   allWorkers : getAllWorkersListReducer,
   assignComplaint : assignComplaintToWorkersReducer,
   findAllArrived : findAllArrivedComplaintsReducer,
   changeStatus : changeStatusComplaintReducer
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
