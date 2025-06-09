import React, { useEffect, useState } from 'react';
import {
  Box,
  Heading,
  Text,
  VStack,
  HStack,
  Badge,
  SimpleGrid,
  Card,
  CardHeader,
  CardBody,
  Divider,
  Flex,
  Spinner,
  Center,
  Button,
  Alert,
  AlertIcon,
  AlertTitle,
  AlertDescription,
  useToast,
} from '@chakra-ui/react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../../Redux/store';
import { findArrivedComplaints } from '../../Redux/Actions/ComplaintAction';
import { ThunkDispatch } from 'redux-thunk';
import { AnyAction } from 'redux';
import api from '../../api/axios';
import { API_PATHS } from '../../api/config';
import moment from 'moment';

interface Complaint {
  _id: string;
  complaint_no: string;
  employee_name: string;
  employee_location: string;
  complaint_asset: string;
  complain_details: string;
  status: string;
  isCompleted: boolean;
  resolution_note?: string;
  createdAt: string;
  updatedAt: string;
  completedAt?: string;
}

const WorkerCompletedComplaints: React.FC = () => {
  const [complaints, setComplaints] = useState<Complaint[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [retryCount, setRetryCount] = useState<number>(0);
  
  const dispatch = useDispatch<ThunkDispatch<RootState, unknown, AnyAction>>();
  const toast = useToast();
  const { loading: reduxLoading, error: arrivedError } = useSelector((state: RootState) => state.findArrivedComplaint);
  const arrivedComplaints = useSelector((state: RootState) => state.findArrivedComplaint.complaints || []);
  
  useEffect(() => {
    const fetchComplaints = async () => {
      try {
        setLoading(true);
        dispatch(findArrivedComplaints());
      } catch (error) {
        console.error('Error fetching completed complaints:', error);
        toast({
          title: 'Error',
          description: 'Failed to load completed tasks',
          status: 'error',
          duration: 5000,
          isClosable: true,
          position: 'top-right',
        });
      }
    };
    
    fetchComplaints();
  }, [dispatch, retryCount]);
  
  // Update local state when redux state changes
  useEffect(() => {
    if (!reduxLoading && Array.isArray(arrivedComplaints)) {
      try {
        // Filter only completed or fixed complaints
        const completedComplaints = arrivedComplaints
          .filter((complaint: any) => 
            complaint && (
              complaint.status === 'Fixed' || 
              complaint.status === 'Closed' || 
              complaint.isCompleted === true
            )
          )
          .map((complaint: any): Complaint => ({
            _id: complaint._id || '',
            complaint_no: complaint.complaint_no || '',
            employee_name: complaint.employee_name || '',
            employee_location: complaint.employee_location || '',
            complaint_asset: complaint.complaint_asset || '',
            complain_details: complaint.complain_details || '',
            status: complaint.status || '',
            isCompleted: true,
            resolution_note: complaint.resolution_note || '',
            createdAt: complaint.createdAt || new Date().toISOString(),
            updatedAt: complaint.updatedAt || new Date().toISOString(),
            completedAt: complaint.completedAt || complaint.updatedAt || new Date().toISOString()
          }));
        
        // Sort by completion date, most recent first
        completedComplaints.sort((a: Complaint, b: Complaint) => {
          const dateA = a.completedAt || a.updatedAt;
          const dateB = b.completedAt || b.updatedAt;
          return new Date(dateB).getTime() - new Date(dateA).getTime();
        });
        
        setComplaints(completedComplaints);
        setLoading(false);
      } catch (error) {
        console.error('Error processing complaints data:', error);
        setLoading(false);
      }
    }
  }, [reduxLoading, arrivedComplaints]);
  
  const getStatusColor = (status: string): string => {
    switch (status) {
      case 'Fixed': return 'green';
      case 'Closed': return 'gray';
      default: return 'blue';
    }
  };
  
  const handleRetry = () => {
    setRetryCount(prev => prev + 1);
    setLoading(true);
    toast({
      title: 'Retrying',
      description: 'Attempting to fetch your completed tasks again...',
      status: 'info',
      duration: 3000,
      isClosable: true,
      position: 'top-right',
    });
  };
  
  // Show loading state
  if (loading || reduxLoading) {
    return (
      <Center h="70vh" flexDirection="column">
        <Spinner size="xl" color="blue.500" thickness="4px" mb={4} />
        <Text fontSize="lg" mb={2}>Loading completed tasks...</Text>
        <Text fontSize="sm" color="gray.500" maxW="md" textAlign="center">
          If this takes too long, the server might be starting up (cold start).
          This can take up to 60 seconds on the first request.
        </Text>
        {loading && retryCount > 0 && (
          <Button 
            mt={4} 
            colorScheme="blue" 
            variant="outline"
            onClick={handleRetry}
          >
            Retry
          </Button>
        )}
      </Center>
    );
  }
  
  // Show error state
  if (arrivedError) {
    return (
      <Box>
        <Heading size="lg" mb={6}>Completed Tasks</Heading>
        <Alert status="error" borderRadius="md" mb={4}>
          <AlertIcon />
          <Box flex="1">
            <AlertTitle>Error loading tasks</AlertTitle>
            <AlertDescription>{arrivedError}</AlertDescription>
          </Box>
        </Alert>
        <Button colorScheme="blue" onClick={handleRetry}>
          Retry
        </Button>
      </Box>
    );
  }
  
  return (
    <Box>
      <Heading size="lg" mb={6}>Completed Tasks</Heading>
      
      {complaints.length === 0 ? (
        <Box p={8} textAlign="center" bg="white" borderRadius="md" shadow="sm">
          <Text fontSize="lg">You haven't completed any tasks yet.</Text>
        </Box>
      ) : (
        <SimpleGrid columns={{ base: 1, lg: 2 }} spacing={6}>
          {complaints.map((complaint) => (
            <Card key={complaint._id} variant="outline" borderColor="gray.200">
              <CardHeader bg={`${getStatusColor(complaint.status)}.50`} p={4}>
                <Flex justifyContent="space-between" alignItems="center">
                  <Heading size="md">{complaint.complaint_no}</Heading>
                  <Badge colorScheme={getStatusColor(complaint.status)} fontSize="0.8em" p={1}>
                    {complaint.status}
                  </Badge>
                </Flex>
              </CardHeader>
              
              <CardBody p={4}>
                <VStack align="stretch" spacing={3}>
                  <HStack>
                    <Text fontWeight="bold" minWidth="100px">Reported by:</Text>
                    <Text>{complaint.employee_name}</Text>
                  </HStack>
                  
                  <HStack>
                    <Text fontWeight="bold" minWidth="100px">Location:</Text>
                    <Text>{complaint.employee_location}</Text>
                  </HStack>
                  
                  <HStack>
                    <Text fontWeight="bold" minWidth="100px">Asset:</Text>
                    <Text>{complaint.complaint_asset}</Text>
                  </HStack>
                  
                  <HStack alignItems="flex-start">
                    <Text fontWeight="bold" minWidth="100px">Details:</Text>
                    <Text>{complaint.complain_details}</Text>
                  </HStack>
                  
                  {complaint.resolution_note && (
                    <HStack alignItems="flex-start">
                      <Text fontWeight="bold" minWidth="100px">Resolution:</Text>
                      <Text>{complaint.resolution_note}</Text>
                    </HStack>
                  )}
                  
                  <Divider my={2} />
                  
                  <HStack>
                    <Text fontWeight="bold" minWidth="100px">Completed:</Text>
                    <Text>
                      {moment(complaint.completedAt || complaint.updatedAt).format('MMM D, YYYY [at] h:mm A')}
                    </Text>
                  </HStack>
                </VStack>
              </CardBody>
            </Card>
          ))}
        </SimpleGrid>
      )}
    </Box>
  );
};

export default WorkerCompletedComplaints; 