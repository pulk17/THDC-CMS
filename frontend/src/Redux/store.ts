import { createStore, applyMiddleware, combineReducers } from 'redux';
import { thunk } from 'redux-thunk';
import { persistStore, persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage';

import { 
  loginUserReducer, 
  registerUserReducer, 
  logOutUserReducer 
} from './Reducers/AuthReducers';
import { 
  registerComplaintReducer, 
  getAllMyComplaintReducer, 
  getAllEmployeeComplaintReducer,
  getAllWorkersReducer,
  findArrivedComplaintReducer,
  assignComplaintToWorkerReducer,
  changeStatusOfComplaintReducer,
  filterComplaintReducer
} from './Reducers/ComplaintReducer';

// Persist config
const persistConfig = {
  key: 'root',
  storage,
  whitelist: ['loginUser'] // Only persist authentication state
};

// Combine all reducers
const rootReducer = combineReducers({
  // Auth reducers
  loginUser: loginUserReducer,
  registerUser: registerUserReducer,
  logOutUser: logOutUserReducer,
  
  // Complaint reducers
  registerComplaint: registerComplaintReducer,
  getAllMyComplaint: getAllMyComplaintReducer,
  getAllEmployeeComplaint: getAllEmployeeComplaintReducer,
  getAllWorkers: getAllWorkersReducer,
  findArrivedComplaint: findArrivedComplaintReducer,
  assignComplaintToWorker: assignComplaintToWorkerReducer,
  changeStatusOfComplaint: changeStatusOfComplaintReducer,
  filterComplaint: filterComplaintReducer
});

// Define the RootState type
export type RootState = ReturnType<typeof rootReducer>;

// Create persisted reducer
const persistedReducer = persistReducer(persistConfig, rootReducer);

// Create store with middleware
const store = createStore(
  persistedReducer,
  applyMiddleware(thunk)
);

// Use type assertion to fix TypeScript error with persistStore
export const persistor = persistStore(store as any);
export default store; 