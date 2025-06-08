import React, { createContext, useEffect, useState, ReactNode } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../../Redux/store';
import { Complaint } from '../../types';

// Define the context type
interface EmployeeContextType {
  allMyComplaints: Complaint[];
  setAllMyComplaints: React.Dispatch<React.SetStateAction<Complaint[]>>;
  allMyArrivedComplaints: Complaint[];
  setAllMyArrivedComplaints: React.Dispatch<React.SetStateAction<Complaint[]>>;
}

// Create a Context with default value
export const EmployeeContext = createContext<EmployeeContextType | null>(null);

interface EmployeeComplaintsProviderProps {
  children: ReactNode;
}

export const EmployeeComplaintsProvider: React.FC<EmployeeComplaintsProviderProps> = ({ children }) => {
    const [allMyComplaints, setAllMyComplaints] = useState<Complaint[]>([]);
    const [allMyArrivedComplaints, setAllMyArrivedComplaints] = useState<Complaint[]>([]);

    // Extract necessary state from Redux
    const { isGetComplaint, allComplaints } = useSelector((state: RootState) => state.getAllMyComplaint);
    const { isGetArrived, complaints } = useSelector((state: RootState) => state.findArrivedComplaint);

    useEffect(() => {
        if (isGetComplaint) {
            // Ensure allComplaints is an array
            setAllMyComplaints(Array.isArray(allComplaints) ? allComplaints : []);
        }
    }, [isGetComplaint, allComplaints]);

    useEffect(() => {
        if (isGetArrived) {
            // Ensure complaints is an array
            setAllMyArrivedComplaints(Array.isArray(complaints) ? complaints : []);
        }
    }, [isGetArrived, complaints]);

    return (
        <EmployeeContext.Provider value={{ 
            allMyComplaints, 
            setAllMyComplaints, 
            allMyArrivedComplaints, 
            setAllMyArrivedComplaints 
        }}>
            {children}
        </EmployeeContext.Provider>
    );
};
