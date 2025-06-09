import React, { useEffect, useState } from 'react';
import {
  Box,
  Heading,
  Text,
  VStack,
  HStack,
  Badge,
  Button,
  useToast,
  SimpleGrid,
  Card,
  CardHeader,
  CardBody,
  CardFooter,
  Divider,
  Flex,
  Spinner,
  Center,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  FormControl,
  FormLabel,
  Textarea,
  useDisclosure,
  Alert,
  AlertIcon,
  AlertTitle,
  AlertDescription,
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
  createdAt: string;
  updatedAt: string;
}

const WorkerAssignedComplaints: React.FC = () => {
  const [complaints, setComplaints] = useState<Complaint[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [selectedComplaint, setSelectedComplaint] = useState<Complaint | null>(null);
  const [resolutionNote, setResolutionNote] = useState<string>('');
  const [submitting, setSubmitting] = useState<boolean>(false);
  const [retryCount, setRetryCount] = useState<number>(0);
  const { isOpen, onOpen, onClose } = useDisclosure();
  
  const dispatch = useDispatch<ThunkDispatch<RootState, unknown, AnyAction>>();
  const toast = useToast();
  const { user } = useSelector((state: RootState) => state.loginUser);
  const { loading: reduxLoading, error: arrivedError } = useSelector((state: RootState) => state.findArrivedComplaint);
  const arrivedComplaints = useSelector((state: RootState) => state.findArrivedComplaint.complaints || []);
  
  useEffect(() => {
    const fetchComplaints = async () => {
      try {
        setLoading(true);
        dispatch(findArrivedComplaints());
      } catch (error) {
        console.error('Error fetching assigned complaints:', error);
        toast({
          title: 'Error',
          description: 'Failed to load assigned complaints',
          status: 'error',
          duration: 5000,
          isClosable: true,
          position: 'top-right',
        });
      }
    };
    
    fetchComplaints();
  }, [dispatch, toast, retryCount]);
  
  // Update local state when redux state changes
  useEffect(() => {
    if (!reduxLoading && Array.isArray(arrivedComplaints)) {
      try {
        // Filter only assigned and not completed complaints
        const assignedComplaints = arrivedComplaints
          .filter((complaint: any) => 
            complaint && 
            complaint.status === 'Assigned' && 
            complaint.isCompleted === false
          )
          .map((complaint: any): Complaint => ({
            _id: complaint._id || '',
            complaint_no: complaint.complaint_no || '',
            employee_name: complaint.employee_name || '',
            employee_location: complaint.employee_location || '',
            complaint_asset: complaint.complaint_asset || '',
            complain_details: complaint.complain_details || '',
            status: complaint.status || '',
            isCompleted: !!complaint.isCompleted,
            createdAt: complaint.createdAt || new Date().toISOString(),
            updatedAt: complaint.updatedAt || new Date().toISOString()
          }));
        
        setComplaints(assignedComplaints);
        setLoading(false);
      } catch (error) {
        console.error('Error processing complaints data:', error);
        setLoading(false);
      }
    }
  }, [reduxLoading, arrivedComplaints]);
  
  const handleCompleteTask = (complaint: Complaint) => {
    setSelectedComplaint(complaint);
    setResolutionNote('');
    onOpen();
  };
  
  const handleSubmitResolution = async () => {
    if (!selectedComplaint) return;
    
    try {
      setSubmitting(true);
      
      // Update complaint status to "Fixed"
      await api.put(`/complaints/status/${selectedComplaint._id}`, {
        status: 'Fixed',
        resolution_note: resolutionNote,
      });
      
      // Show success message
      toast({
        title: 'Task Completed',
        description: 'The complaint has been marked as fixed. The requester will be notified.',
        status: 'success',
        duration: 5000,
        isClosable: true,
        position: 'top-right',
      });
      
      // Update local state
      setComplaints(complaints.filter(c => c._id !== selectedComplaint._id));
      
      // Close modal
      onClose();
      
      // Refresh complaints list
      dispatch(findArrivedComplaints());
      
    } catch (error) {
      console.error('Error updating complaint status:', error);
      toast({
        title: 'Error',
        description: 'Failed to update complaint status',
        status: 'error',
        duration: 5000,
        isClosable: true,
        position: 'top-right',
      });
    } finally {
      setSubmitting(false);
    }
  };
  
  const handleRetry = () => {
    setRetryCount(prev => prev + 1);
    setLoading(true);
    toast({
      title: 'Retrying',
      description: 'Attempting to fetch your assigned tasks again...',
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
        <Text fontSize="lg" mb={2}>Loading assigned tasks...</Text>
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
        <Heading size="lg" mb={6}>Assigned Tasks</Heading>
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
      <Heading size="lg" mb={6}>Assigned Tasks</Heading>
      
      {complaints.length === 0 ? (
        <Box p={8} textAlign="center" bg="white" borderRadius="md" shadow="sm">
          <Text fontSize="lg">No tasks are currently assigned to you.</Text>
        </Box>
      ) : (
        <SimpleGrid columns={{ base: 1, lg: 2 }} spacing={6}>
          {complaints.map((complaint) => (
            <Card key={complaint._id} variant="outline" borderColor="gray.200">
              <CardHeader bg="blue.50" p={4}>
                <Flex justifyContent="space-between" alignItems="center">
                  <Heading size="md">{complaint.complaint_no}</Heading>
                  <Badge colorScheme="blue" fontSize="0.8em" p={1}>
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
                  
                  <HStack>
                    <Text fontWeight="bold" minWidth="100px">Reported on:</Text>
                    <Text>{moment(complaint.createdAt).format('MMM D, YYYY [at] h:mm A')}</Text>
                  </HStack>
                </VStack>
              </CardBody>
              
              <Divider />
              
              <CardFooter p={4}>
                <Button 
                  colorScheme="green" 
                  width="full"
                  onClick={() => handleCompleteTask(complaint)}
                >
                  Mark as Completed
                </Button>
              </CardFooter>
            </Card>
          ))}
        </SimpleGrid>
      )}
      
      {/* Resolution Modal */}
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Complete Task</ModalHeader>
          <ModalCloseButton />
          <ModalBody pb={6}>
            <Text mb={4}>
              You are marking complaint <strong>{selectedComplaint?.complaint_no}</strong> as completed.
            </Text>
            
            <FormControl>
              <FormLabel>Resolution Details</FormLabel>
              <Textarea
                placeholder="Describe how you fixed the issue..."
                value={resolutionNote}
                onChange={(e) => setResolutionNote(e.target.value)}
                rows={5}
              />
            </FormControl>
          </ModalBody>
          
          <ModalFooter>
            <Button 
              colorScheme="green" 
              mr={3} 
              onClick={handleSubmitResolution}
              isLoading={submitting}
            >
              Submit
            </Button>
            <Button onClick={onClose}>Cancel</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Box>
  );
};

export default WorkerAssignedComplaints; 