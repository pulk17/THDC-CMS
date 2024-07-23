import React, { createContext, useEffect, useState } from 'react';
import { useSelector } from 'react-redux';

// Create a Context with default value as null
export const EmployeeContext = createContext(null);

export const EmployeeComplaintsProvider = ({ children }) => {
    const [allMyComplaints, setAllMyComplaints] = useState([]);
    const [allMyArrivedComplaints, setAllMyArrivedComplaints] = useState([]);

    // Extract necessary state from Redux
    const { isGetComplaint, allComplaints } = useSelector((state) => state.allMyComplaints);
    const { isGetArrived, complaints } = useSelector((state) => state.findAllArrived);

    useEffect(() => {
        if (isGetComplaint) {
            // Ensure allComplaints is an array
            setAllMyComplaints(Array.isArray(allComplaints) ? allComplaints : []);
        }
    }, [isGetComplaint, allComplaints]);

    useEffect(() => {
        if (isGetArrived) {
            // Ensure allComplaints is an array
            setAllMyArrivedComplaints(Array.isArray(complaints) ? complaints : []);
        }
    }, [isGetArrived, complaints]);

    return (
        <EmployeeContext.Provider value={{ allMyComplaints, setAllMyComplaints , allMyArrivedComplaints, setAllMyArrivedComplaints}}>
            {children}
        </EmployeeContext.Provider>
    );
};
