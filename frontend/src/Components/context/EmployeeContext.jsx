import React, { createContext, useEffect, useState } from 'react';
import { useSelector } from 'react-redux';

// Create a Context with default value as null
export const EmployeeContext = createContext(null);

export const EmployeeComplaintsProvider = ({ children }) => {
    const [allMyComplaints, setAllMyComplaints] = useState([]);

    // Extract necessary state from Redux
    const { isGetComplaint, allComplaints } = useSelector((state) => state.allMyComplaints);

    useEffect(() => {
        if (isGetComplaint) {
            // Ensure allComplaints is an array
            setAllMyComplaints(Array.isArray(allComplaints) ? allComplaints : []);
        }
    }, [isGetComplaint, allComplaints]);

    return (
        <EmployeeContext.Provider value={{ allMyComplaints, setAllMyComplaints }}>
            {children}
        </EmployeeContext.Provider>
    );
};
