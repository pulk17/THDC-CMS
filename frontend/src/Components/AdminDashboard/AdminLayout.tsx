import React, { useEffect, useState } from 'react';
import { Box, Flex, Alert, AlertIcon, AlertTitle, AlertDescription, Button, useBreakpointValue } from '@chakra-ui/react';
import { Outlet, useNavigate } from 'react-router-dom';
import AdminSidebar from './AdminSidebar';
import { useDispatch, useSelector } from 'react-redux';
import { getAllEmployeeComplaints, getAllWorkersList } from '../../Redux/Actions/ComplaintAction';
import { ThunkDispatch } from 'redux-thunk';
import { RootState } from '../../Redux/store';
import { AnyAction } from 'redux';
import ResponsiveNavbar from '../Common/ResponsiveNavbar';

const AdminLayout: React.FC = () => {
  const dispatch = useDispatch<ThunkDispatch<RootState, unknown, AnyAction>>();
  const navigate = useNavigate();
  const [error, setError] = useState<Error | null>(null);
  const { loading: complaintsLoading, error: complaintsError } = useSelector((state: RootState) => state.getAllEmployeeComplaint);
  const { loading: workersLoading, error: workersError } = useSelector((state: RootState) => state.getAllWorkers);
  const { user, isLoggedIn } = useSelector((state: RootState) => state.loginUser);
  const [isInitialLoad, setIsInitialLoad] = useState(true);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Simple authentication check
  useEffect(() => {
    console.log("AdminLayout auth check running");
    console.log("isLoggedIn:", isLoggedIn);
    console.log("user:", user ? `${user.employee_name} (${user.employee_role})` : "No user data");
    
    // Safer token logging - only show if exists and truncate
    const token = localStorage.getItem('authToken');
    console.log("token:", token ? `${token.substring(0, 15)}...` : "No token");
    
    // Simple check - if no user and no token, redirect to login
    if (!user && !token) {
      console.log("No user and no token - redirecting to login");
      navigate('/');
      return;
    }
    
    // If we have a user, check role
    if (user) {
      if (user.employee_role !== 'admin') {
        console.log("User is not admin - redirecting to employee dashboard");
        navigate('/employee', { 
          state: { 
            errorMessage: 'You do not have permission to access the admin dashboard.' 
          } 
        });
        return;
      }
      
      // User is admin, load data if needed
      if (isInitialLoad) {
        console.log("Loading admin data");
        try {
          // Load complaints data first
          dispatch(getAllEmployeeComplaints());
          
          // Try to load workers list, but don't block on errors
          try {
            dispatch(getAllWorkersList());
          } catch (workerErr) {
            console.error("Error loading workers list, continuing anyway:", workerErr);
          }
          
          setIsInitialLoad(false);
        } catch (err) {
          console.error("Error loading data:", err);
          setError(err instanceof Error ? err : new Error('Failed to load data'));
          setIsInitialLoad(false);
        }
      }
    }
    
    // We've done our checks, not loading anymore
    setIsLoading(false);
  }, [user, isLoggedIn, navigate, dispatch, isInitialLoad]);

  // Reset error and retry loading data
  const handleRetry = () => {
    setError(null);
    setIsInitialLoad(true);
  };

  // Navigate to home on error
  const handleGoHome = () => {
    navigate('/admin');
  };

  // Show error if any Redux action failed, but ignore worker list errors
  const hasError = error || (complaintsError && !complaintsError.includes('workers'));
  const isDataLoading = complaintsLoading || workersLoading;

  // Determine the error message to display
  const getErrorMessage = () => {
    if (error) return error.message;
    if (complaintsError?.includes('Unauthorized')) {
      return 'You do not have permission to access this resource. Please log in with an admin account.';
    }
    return complaintsError || 'An unexpected error occurred.';
  };

  // Show loading state
  if (isLoading) {
    return (
      <Box textAlign="center" py={10}>
        Loading admin dashboard...
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
    <Flex h="100vh" direction="column">
      {/* Responsive Navbar - only visible on mobile */}
      <ResponsiveNavbar 
        sidebarContent={<AdminSidebar />}
        colorScheme="purple"
        title="Admin Dashboard"
      />
      
      <Flex flex="1" overflow="hidden">
        {/* Regular Sidebar - hidden on mobile */}
        <Box display={{ base: 'none', md: 'block' }}>
          <AdminSidebar />
        </Box>
        
        <Box flex="1" p={5} bg="gray.50" overflowY="auto">
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
              <Box mt={4} display="flex" gap={4}>
                <Button colorScheme="teal" onClick={handleRetry}>
                  Retry
                </Button>
                <Button colorScheme="gray" onClick={handleGoHome}>
                  Go to Home
                </Button>
              </Box>
            </Alert>
          ) : isDataLoading ? (
            <Box textAlign="center" py={10}>Loading admin dashboard...</Box>
          ) : (
            <Outlet />
          )}
        </Box>
      </Flex>
    </Flex>
  );
};

export default AdminLayout; 