import React, { useContext, useEffect } from 'react';
import { Box, Table, Thead, Tbody, Tr, Th, Td, TableContainer, Text, Tag, Heading, Spinner, Center, Alert, AlertIcon } from '@chakra-ui/react';
import { EmployeeContext } from '../context/EmployeeContext';
import moment from 'moment';
import { Complaint } from '../../types';
import { useDispatch, useSelector } from 'react-redux';
import { getAllMyComplaints } from '../../Redux/Actions/ComplaintAction';
import { ThunkDispatch } from 'redux-thunk';
import { RootState } from '../../Redux/store';
import { AnyAction } from 'redux';

const AllComplaints: React.FC = () => {
  const dispatch = useDispatch<ThunkDispatch<RootState, unknown, AnyAction>>();
  const employeeContext = useContext(EmployeeContext);
  const { loading, error } = useSelector((state: RootState) => state.getAllMyComplaint);
  
  // Ensure data is loaded
  useEffect(() => {
    if (!employeeContext?.allMyComplaints.length) {
      dispatch(getAllMyComplaints());
    }
  }, [dispatch, employeeContext]);
  
  if (loading) {
    return (
      <Center h="100%" p={10}>
        <Spinner size="xl" color="teal.500" thickness="4px" />
      </Center>
    );
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
  
  const { allMyComplaints } = employeeContext;

  // Function to format the created date using moment
  const formatDate = (dateString: string): string => {
    return moment(dateString).format('MMMM D, YYYY h:mm A'); // Format as "July 22, 2024 7:19 AM"
  };

  const getStatusColor = (status: string): string => {
    switch (status) {
      case 'Opened':
        return 'green';
      case 'Closed':
        return 'red';
      case 'Processing':
        return 'yellow';
      default:
        return 'gray';
    }
  };

  return (
    <Box
      p={5}
      fontFamily="'Nunito', sans-serif"
      maxW="100vw"
      overflowX="auto"
      bg="gray.50"
    >
      <Heading as="h1" textAlign="center" mb={14} color="teal.500">All Complaints</Heading>
      <Box overflowX="auto">
        {allMyComplaints.length === 0 ? (
          <Alert status="info" borderRadius="md">
            <AlertIcon />
            <Text>No complaints found.</Text>
          </Alert>
        ) : (
          <TableContainer
            bg="white"
            borderRadius="md"
            boxShadow="md"
            maxW="100%"
          >
            <Table variant="simple">
              <Thead bg="gray.100">
                <Tr>
                  <Th>Complaint Id</Th>
                  <Th>Assets Type</Th>
                  <Th>Complaint Text</Th>
                  <Th>Location</Th>
                  <Th>Created Date</Th>
                  <Th>Status</Th>
                </Tr>
              </Thead>
              <Tbody>
                {allMyComplaints.map((complaint: Complaint) => (
                  <Tr key={complaint.complaint_id}>
                    <Td>{complaint.complaint_id}</Td>
                    <Td>{complaint.complaint_asset}</Td>
                    <Td>{complaint.complain_details}</Td>
                    <Td>{complaint.employee_location}</Td>
                    <Td>{formatDate(complaint.created_date)}</Td>
                    <Td>
                      <Tag colorScheme={getStatusColor(complaint.status)}>
                        {complaint.status}
                      </Tag>
                    </Td>
                  </Tr>
                ))}
              </Tbody>
            </Table>
          </TableContainer>
        )}
      </Box>
    </Box>
  );
};

export default AllComplaints; 