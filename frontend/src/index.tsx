import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import {BrowserRouter as Router} from "react-router-dom";
import store, { persistor } from './Redux/store';
import { Provider } from 'react-redux';
import { ChakraProvider } from '@chakra-ui/react'
import { EmployeeComplaintsProvider } from './Components/context/EmployeeContext';
import { AdminAllComplaintsProvider } from './Components/context/AdminContext';
import { PersistGate } from 'redux-persist/integration/react';

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);

root.render(
  <ChakraProvider>
    <React.StrictMode>
      <Provider store={store}>
        <PersistGate loading={null} persistor={persistor}>
          <Router>
            <AdminAllComplaintsProvider>
              <EmployeeComplaintsProvider>
                <App />
              </EmployeeComplaintsProvider>
            </AdminAllComplaintsProvider>
          </Router>
        </PersistGate>
      </Provider>
    </React.StrictMode>
  </ChakraProvider>
); 