// User related types
export interface User {
  _id: string;
  employee_id: number;
  employee_role: 'admin' | 'employee';
  is_Employee_Worker: boolean;
  employee_name: string;
  employee_designation: string;
  employee_department: string;
  employee_location: string;
  employee_email: string;
  createdAt: string;
  __v: number;
}

// Authentication related types
export interface LoginFormData {
  employee_id: string;
  employee_password: string;
}

export interface RegisterFormData {
  employee_id: string;
  employee_name: string;
  employee_designation: string;
  employee_department: string;
  employee_location: string;
  employee_email: string;
  employee_password: string;
  employee_role: 'admin' | 'employee';
}

export interface AuthState {
  loading: boolean;
  isLoggedIn?: boolean;
  user: User | null;
  token?: string | null;
  error?: string | null;
}

export interface RegisterState {
  loading: boolean;
  isRegistered?: boolean;
  user: User | null;
  error?: string | null;
}

export interface LogoutState {
  loading: boolean;
  isLoggedOut?: boolean;
  error?: string | null;
}

// Complaint related types
export interface Complaint {
  _id: string;
  employee_location: string;
  complaint_asset: string;
  complaint_id: string;
  employee_phoneNo: number;
  complain_details: string;
  employee_id: string | User;
  status: 'Opened' | 'Processing' | 'Closed';
  attended_by: {
    id?: string;
    name?: string;
  };
  closed_date: string | null;
  created_date: string;
  feedback?: string;
  __v: number;
}

export interface ComplaintFormData {
  employee_location: string;
  complaint_asset: string;
  employee_phoneNo: string;
  complain_details: string;
}

export interface ComplaintState {
  loading: boolean;
  complaint: Complaint | null;
  isRegisteredComplaint?: boolean;
  success?: boolean;
  error?: string | null;
}

export interface ComplaintsState {
  loading: boolean;
  allComplaints: Complaint[];
  isGetComplaint?: boolean;
  success?: boolean;
  error?: string | null;
}

// Redux action types
export interface Action<T = any> {
  type: string;
  payload?: T;
}

// Route props
export interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredRole?: 'admin' | 'employee';
} 