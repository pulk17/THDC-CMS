import React, { useEffect, useState } from 'react';
import { Routes, Route, Navigate, useLocation, Link } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from './Redux/store';
import { ProtectedRouteProps } from './types';
import { Box, Button, Center, Flex, Heading, Spinner, Text, VStack, useToast } from "@chakra-ui/react";
import { LOGIN_RESET } from "./Redux/ActionType";

// Auth component
import Auth from "./Components/Screen/Auth/Auth";

// Employee components
import EmployeeLayout from "./Components/EmployeeDashboard/EmployeeLayout";
import RegisterComplaint from "./Components/EmployeeDashboard/RegisterComplaint";
import AllComplaints from "./Components/EmployeeDashboard/AllComplaints";
import OpenComplaints from "./Components/EmployeeDashboard/OpenComplaints";
import ClosedComplaints from "./Components/EmployeeDashboard/ClosedComplaints";
import ArriveComplaints from "./Components/EmployeeDashboard/ArriveComplaints";
import EmployeeStats from "./Components/EmployeeDashboard/EmployeeStats";

// Admin components
import AdminLayout from "./Components/AdminDashboard/AdminLayout";
import AdminRegisterComplaint from "./Components/AdminDashboard/AdminRegisterComplaint";
import AdminNewComplaints from "./Components/AdminDashboard/AdminNewComplaints";
import AdminPendingComplaints from "./Components/AdminDashboard/AdminPendingComplaints";
import AdminCompleteComplaints from "./Components/AdminDashboard/AdminCompleteComplaints";
import AdminStats from "./Components/AdminDashboard/AdminStats";
import FilterComplaint from "./Components/AdminDashboard/FilterComplaint";
import AdminManagement from "./Components/AdminDashboard/AdminManagement";

// More robust route guard component
const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const { isLoggedIn, user, loading } = useSelector((state: RootState) => state.loginUser);
  const location = useLocation();
  const [authCheckComplete, setAuthCheckComplete] = useState(false);
  const [authTimeout, setAuthTimeout] = useState(false);
  const dispatch = useDispatch();
  const toast = useToast();
  
  // Check both token and Redux state
  const token = localStorage.getItem('authToken');
  
  // Simplified logging
  console.log(`Route check: ${location.pathname} - Auth: ${!!token && (isLoggedIn && !!user)}`);
  
  // Complete auth reset function
  const handleCompleteReset = () => {
    // Clear all storage
    localStorage.removeItem('authToken');
    localStorage.removeItem('rememberedUser');
    sessionStorage.removeItem('auth_redirect_timestamp');
    
    // Reset Redux auth state
    dispatch({ type: LOGIN_RESET });
    
    // Show notification
    toast({
      title: 'Authentication Reset',
      description: 'Your login session has been reset. Please log in again.',
      status: 'info',
      duration: 5000,
      isClosable: true,
      position: 'top'
    });
    
    // Redirect to login
    window.location.href = '/';
  };
  
  // Handle loading timeout
  useEffect(() => {
    let timeout: NodeJS.Timeout;
    
    if (loading) {
      // Set a timeout for loading state
      timeout = setTimeout(() => {
        setAuthTimeout(true);
      }, 5000); // 5 seconds timeout
    } else {
      setAuthCheckComplete(true);
    }
    
    return () => {
      if (timeout) clearTimeout(timeout);
    };
  }, [loading]);
  
  // If still loading and not timed out, show spinner
  if (loading && !authTimeout) {
    return (
      <Center height="100vh">
        <VStack spacing={4}>
          <Spinner size="xl" color="teal.500" thickness="4px" />
          <Text color="gray.600">Verifying your authentication...</Text>
        </VStack>
      </Center>
    );
  }
  
  // If loading timed out, show options
  if (authTimeout) {
    return (
      <Center height="100vh">
        <VStack spacing={4} maxW="md" p={6} bg="white" boxShadow="md" borderRadius="md">
          <Heading size="md">Authentication is taking longer than expected</Heading>
          <Text textAlign="center">There may be an issue with your current session.</Text>
          <Flex gap={4} flexWrap="wrap" justify="center">
            <Button as={Link} to="/" colorScheme="teal">
              Return to Login
            </Button>
            <Button 
              onClick={handleCompleteReset}
              colorScheme="red"
              variant="outline"
            >
              Reset Authentication
            </Button>
          </Flex>
        </VStack>
      </Center>
    );
  }
  
  // Check if there's a token mismatch (token exists but no user data)
  if (token && !user && !loading) {
    console.log("Token exists but no user data - possible invalid token");
    return (
      <Center height="100vh">
        <VStack spacing={4} maxW="md" p={6} bg="white" boxShadow="md" borderRadius="md">
          <Heading size="md">Authentication Error</Heading>
          <Text textAlign="center">
            Your session appears to be invalid or expired. Please log in again.
          </Text>
          <Flex gap={4}>
            <Button as={Link} to="/" colorScheme="teal">
              Go to Login
            </Button>
            <Button 
              onClick={handleCompleteReset}
              colorScheme="red"
              variant="outline"
            >
              Reset Session
            </Button>
          </Flex>
        </VStack>
      </Center>
    );
  }
  
  // If we have a token OR we're logged in with user data, allow access
  if ((token && user) || (isLoggedIn && user)) {
    return <>{children}</>;
  }
  
  // Otherwise redirect to login
  console.log("Authentication failed - redirecting to login");
  return <Navigate to="/" state={{ from: location }} replace />;
};

const App: React.FC = () => {
  // Log authentication state on app load for debugging
  useEffect(() => {
    const token = localStorage.getItem('authToken');
    console.log("App loaded - Auth token exists:", !!token);
    
    // Check for redirect loops
    const authRedirectCount = sessionStorage.getItem('auth_redirect_count');
    if (authRedirectCount) {
      const count = parseInt(authRedirectCount, 10);
      if (count > 3) {
        console.log("Detected potential redirect loop - clearing auth data");
        localStorage.removeItem('authToken');
        sessionStorage.clear();
      } else {
        sessionStorage.setItem('auth_redirect_count', (count + 1).toString());
      }
    } else {
      sessionStorage.setItem('auth_redirect_count', '1');
    }
    
    // Clear redirect count after 10 seconds
    setTimeout(() => {
      sessionStorage.removeItem('auth_redirect_count');
    }, 10000);
  }, []);

  return (
    <Routes>
      {/* Auth Route */}
      <Route path="/" element={<Auth />} />
      
      {/* Employee Routes */}
      <Route path="/employee" element={
        <ProtectedRoute>
          <EmployeeLayout />
        </ProtectedRoute>
      }>
        <Route index element={<EmployeeStats />} />
        <Route path="register-complaint" element={<RegisterComplaint />} />
        <Route path="status/all-complaints" element={<AllComplaints />} />
        <Route path="status/open-complaints" element={<OpenComplaints />} />
        <Route path="status/closed-complaints" element={<ClosedComplaints />} />
        <Route path="arrive-complaints" element={<ArriveComplaints />} />
      </Route>
      
      {/* Admin Routes */}
      <Route path="/admin" element={
        <ProtectedRoute>
          <AdminLayout />
        </ProtectedRoute>
      }>
        <Route index element={<AdminStats />} />
        <Route path="filterComplaints" element={<FilterComplaint />} />
        <Route path="register-complaint" element={<AdminRegisterComplaint />} />
        <Route path="status/new-complaints" element={<AdminNewComplaints />} />
        <Route path="status/open-complaints" element={<AdminPendingComplaints />} />
        <Route path="status/closed-complaints" element={<AdminCompleteComplaints />} />
        <Route path="user-management" element={<AdminManagement />} />
      </Route>
    </Routes>
  );
};

export default App; 