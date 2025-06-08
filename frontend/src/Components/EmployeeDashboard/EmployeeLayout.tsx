import React, { useEffect, useState } from 'react';
import { Box, Flex, Alert, AlertIcon, AlertTitle, AlertDescription, Button } from '@chakra-ui/react';
import { Outlet, useNavigate } from 'react-router-dom';
import Sidebar from './Sidebar';
import { useDispatch, useSelector } from 'react-redux';
import { getAllMyComplaints, findArrivedComplaints } from '../../Redux/Actions/ComplaintAction';
import { ThunkDispatch } from 'redux-thunk';
import { RootState } from '../../Redux/store';
import { AnyAction } from 'redux';

const EmployeeLayout: React.FC = () => {
  const dispatch = useDispatch<ThunkDispatch<RootState, unknown, AnyAction>>();
  const navigate = useNavigate();
  const [error, setError] = useState<Error | null>(null);
  const { error: complaintsError, isGetComplaint } = useSelector((state: RootState) => state.getAllMyComplaint);
  const { error: arrivedError, isGetArrived } = useSelector((state: RootState) => state.findArrivedComplaint);
  const { user, isLoggedIn } = useSelector((state: RootState) => state.loginUser);
  const [hasInitializedData, setHasInitializedData] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Simple authentication check
  useEffect(() => {
    console.log("EmployeeLayout auth check running");
    console.log("isLoggedIn:", isLoggedIn);
    console.log("user:", user);
    console.log("token:", localStorage.getItem('authToken'));
    
    const token = localStorage.getItem('authToken');
    
    // Simple check - if no user and no token, redirect to login
    if (!user && !token) {
      console.log("No user and no token - redirecting to login");
      navigate('/');
      return;
    }
    
    // If we have a user, check role
    if (user) {
      if (user.employee_role === 'admin') {
        console.log("User is admin - redirecting to admin dashboard");
        navigate('/admin');
        return;
      }
      
      // User is employee, load data if needed
      if (!hasInitializedData) {
        console.log("Loading employee data");
        try {
          if (!isGetComplaint) dispatch(getAllMyComplaints());
          if (!isGetArrived) dispatch(findArrivedComplaints());
          setHasInitializedData(true);
        } catch (err) {
          console.error("Error loading data:", err);
          setError(err instanceof Error ? err : new Error('Failed to load data'));
        }
      }
    }
    
    // We've done our checks, not loading anymore
    setIsLoading(false);
  }, [user, isLoggedIn, navigate, dispatch, hasInitializedData, isGetComplaint, isGetArrived]);

  // Reset error and retry loading data
  const handleRetry = () => {
    setError(null);
    setHasInitializedData(false);
  };

  // Navigate to home on error
  const handleGoHome = () => {
    navigate('/employee');
  };

  // Show error if any Redux action failed
  const hasError = error || complaintsError || arrivedError;
  
  // Determine the error message to display
  const getErrorMessage = () => {
    if (error) return error.message;
    if (complaintsError?.includes('Unauthorized') || arrivedError?.includes('Unauthorized')) {
      return 'You do not have permission to access this resource. Please log in again.';
    }
    return complaintsError || arrivedError || 'An unexpected error occurred.';
  };

  // Show loading state
  if (isLoading) {
    return (
      <Box textAlign="center" py={10}>
        Loading employee dashboard...
      </Box>
    );
  }

  // If we don't have user data, show a message
  if (!user) {
    return (
      <Box textAlign="center" py={10}>
        Authentication error. Please try logging in again.
      </Box>
    );
  }

  return (
    <Flex h="100vh">
      <Sidebar />
      <Box flex="1" p={5} overflowY="auto">
        {hasError ? (
          <Alert
            status="error"
            variant="subtle"
            flexDirection="column"
            alignItems="center"
            justifyContent="center"
            textAlign="center"
            height="200px"
            borderRadius="md"
          >
            <AlertIcon boxSize="40px" mr={0} />
            <AlertTitle mt={4} mb={1} fontSize="lg">
              Error Loading Data
            </AlertTitle>
            <AlertDescription maxWidth="sm">
              {getErrorMessage()}
            </AlertDescription>
            <Flex mt={4}>
              <Button colorScheme="red" mr={3} onClick={handleRetry}>
                Retry
              </Button>
              <Button variant="ghost" onClick={handleGoHome}>
                Go Home
              </Button>
            </Flex>
          </Alert>
        ) : (
          <Outlet />
        )}
      </Box>
    </Flex>
  );
};

export default EmployeeLayout; 