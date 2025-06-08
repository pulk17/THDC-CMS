import React, { useContext, useState, useEffect } from 'react';
import { 
  Box, 
  Table, 
  Thead, 
  Tbody, 
  Tr, 
  Heading, 
  Th, 
  Td, 
  TableContainer, 
  Button, 
  Tag, 
  useDisclosure, 
  Spinner, 
  Center, 
  Alert, 
  AlertIcon, 
  Text,
  useColorModeValue
} from '@chakra-ui/react';
import { FaEye } from 'react-icons/fa';
import ComplaintDetailModal from './ComplaintDetailModal';
import { EmployeeContext } from '../context/EmployeeContext';
import { Complaint } from '../../types';
import { useDispatch, useSelector } from 'react-redux';
import { findArrivedComplaints } from '../../Redux/Actions/ComplaintAction';
import { ThunkDispatch } from 'redux-thunk';
import { RootState } from '../../Redux/store';
import { AnyAction } from 'redux';

const ArriveComplaints: React.FC = () => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [selectedComplaint, setSelectedComplaint] = useState<Complaint | null>(null);
  const dispatch = useDispatch<ThunkDispatch<RootState, unknown, AnyAction>>();
  const employeeContext = useContext(EmployeeContext);
  const { loading, error, isGetArrived } = useSelector((state: RootState) => state.findArrivedComplaint);
  
  // Colors
  const bgColor = useColorModeValue('white', 'gray.800');
  const headerBgColor = useColorModeValue('gray.50', 'gray.700');
  const borderColor = useColorModeValue('gray.200', 'gray.600');
  const textColor = useColorModeValue('gray.800', 'white');

  // Load complaints data
  useEffect(() => {
    if (!loading && !isGetArrived) {
      dispatch(findArrivedComplaints());
    }
  }, [dispatch, loading, isGetArrived]);
  
  // Loading and error states
  if (loading) {
    return <Center h="100%" p={10}><Spinner size="xl" color="teal.500" thickness="4px" /></Center>;
  }
  
  if (error) {
    return (
      <Alert status="error" borderRadius="md" m={5}>
        <AlertIcon />
        <Text>Error loading complaints: {error}</Text>
      </Alert>
    );
  }
  
  if (!employeeContext) {
    return (
      <Alert status="info" borderRadius="md" m={5}>
        <AlertIcon />
        <Text>Loading complaint data...</Text>
      </Alert>
    );
  }
  
  // Filter processing complaints
  const { allMyArrivedComplaints } = employeeContext;
  const processingComplaints = allMyArrivedComplaints.filter(com => com.status === 'Processing');

  // Get status color
  const getStatusColor = (status: string): string => 
    status === 'Opened' ? 'green' : status === 'Closed' ? 'red' : status === 'Processing' ? 'yellow' : 'gray';

  // Handle view details
  const handleViewDetails = (complaint: Complaint): void => {
    setSelectedComplaint(complaint);
    onOpen();
  };

  // No processing complaints
  if (processingComplaints.length === 0) {
    return (
      <Box
        bg={bgColor}
        p={5}
        borderRadius="lg"
        boxShadow="sm"
        border="1px solid"
        borderColor={borderColor}
      >
        <Alert 
          status="info" 
          borderRadius="md" 
          variant="subtle"
          flexDirection="column"
          alignItems="center"
          justifyContent="center"
          textAlign="center"
          height="200px"
        >
          <AlertIcon boxSize="40px" mr={0} />
          <Text mt={4} mb={1} fontSize="lg">No Processing Complaints</Text>
          <Text>You don't have any complaints in processing at the moment.</Text>
        </Alert>
      </Box>
    );
  }

  return (
    <Box
      bg={bgColor}
      p={5}
      borderRadius="lg"
      boxShadow="sm"
      border="1px solid"
      borderColor={borderColor}
    >
      <Heading as="h2" size="lg" mb={6} color={textColor}>Processing Complaints</Heading>
      <TableContainer>
        <Table variant="simple">
          <Thead bg={headerBgColor}>
            <Tr>
              <Th>ID</Th>
              <Th>Asset</Th>
              <Th>Location</Th>
              <Th>Status</Th>
              <Th>Actions</Th>
            </Tr>
          </Thead>
          <Tbody>
            {processingComplaints.map((complaint: Complaint) => (
              <Tr key={complaint._id}>
                <Td fontWeight="medium">{complaint.complaint_id}</Td>
                <Td>{complaint.complaint_asset}</Td>
                <Td>{complaint.employee_location}</Td>
                <Td>
                  <Tag colorScheme={getStatusColor(complaint.status)}>
                    {complaint.status}
                  </Tag>
                </Td>
                <Td>
                  <Button
                    leftIcon={<FaEye />}
                    colorScheme="teal"
                    size="sm"
                    onClick={() => handleViewDetails(complaint)}
                  >
                    View
                  </Button>
                </Td>
              </Tr>
            ))}
          </Tbody>
        </Table>
      </TableContainer>
      
      {selectedComplaint && (
        <ComplaintDetailModal
          isOpen={isOpen}
          onClose={onClose}
          complaint={selectedComplaint}
        />
      )}
    </Box>
  );
};

export default ArriveComplaints; 