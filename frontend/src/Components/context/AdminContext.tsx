import React, { createContext, useEffect, useState, ReactNode } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../../Redux/store';
import { Complaint, User } from '../../types';

// Define the context type
interface AdminContextType {
  allEmployeeComplaints: Complaint[];
  setAllEmployeeComplaints: React.Dispatch<React.SetStateAction<Complaint[]>>;
  isGetWorkers: boolean | undefined;
  workers: User[];
}

// Create a Context with default value
export const AdminContext = createContext<AdminContextType | null>(null);

interface AdminAllComplaintsProviderProps {
  children: ReactNode;
}

export const AdminAllComplaintsProvider: React.FC<AdminAllComplaintsProviderProps> = ({ children }) => {
    const [allEmployeeComplaints, setAllEmployeeComplaints] = useState<Complaint[]>([]);

    // Extract necessary state from Redux
    const { isGetEmployeeComplaint, allComplaints } = useSelector((state: RootState) => state.getAllEmployeeComplaint);
    const { isGetWorkers, workers } = useSelector((state: RootState) => state.getAllWorkers);

    useEffect(() => {
        if (isGetEmployeeComplaint) {
            // Ensure allComplaints is an array
            setAllEmployeeComplaints(Array.isArray(allComplaints) ? allComplaints : []);
        }
    }, [isGetEmployeeComplaint, allComplaints]);

    return (
        <AdminContext.Provider value={{ 
            allEmployeeComplaints, 
            setAllEmployeeComplaints, 
            isGetWorkers, 
            workers 
        }}>
            {children}
        </AdminContext.Provider>
    );
}; 