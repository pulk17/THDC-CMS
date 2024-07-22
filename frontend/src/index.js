import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import {BrowserRouter as Router} from "react-router-dom";
import store from './Redux/Store';
import { Provider } from 'react-redux';
import { ChakraProvider } from '@chakra-ui/react'
import { EmployeeComplaintsProvider } from './Components/context/EmployeeContext';
import { AdminAllComplaintsProvider } from './Components/context/AdminContext';


const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <ChakraProvider>
  <React.StrictMode>
    <Provider store = {store}>
      <Router>
        <AdminAllComplaintsProvider>
        <EmployeeComplaintsProvider>
          <App />
        </EmployeeComplaintsProvider>
        </AdminAllComplaintsProvider>
      </Router>
    </Provider>
  </React.StrictMode>
  </ChakraProvider>
);

