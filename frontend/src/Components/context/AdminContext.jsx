import React, { createContext, useEffect, useState } from 'react';
import { useSelector } from 'react-redux';


export const AdminContext = createContext(null);

export const AdminAllComplaintsProvider = ({ children }) => {
    const [allEmployeeComplaints, setAllEmployeeComplaints] = useState([]);
    const [allWorkers, setAllWorkers] = useState([]);

    // Extract necessary state from Redux
    const { isGetEmployeeComplaint, allComplaints } = useSelector((state) => state.allEmployeeComplaints);
    const { isGetWorkers, workers} = useSelector((state) => state.allWorkers);

    useEffect(() => {
        if (isGetEmployeeComplaint) {
            // Ensure allComplaints is an array
            setAllEmployeeComplaints(Array.isArray(allComplaints) ? allComplaints : []);
        }
    }, [isGetEmployeeComplaint, allComplaints]);

    return (
        <AdminContext.Provider value={{ allEmployeeComplaints, setAllEmployeeComplaints ,  isGetWorkers, workers}}>
            {children}
        </AdminContext.Provider>
    );
};
