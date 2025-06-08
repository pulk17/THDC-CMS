import React, { useContext, useState, useEffect } from 'react';
import { Box, Table, Thead, Heading, Tbody, Tr, Th, Td, TableContainer, Tag, Button, Spinner, Center, Alert, AlertIcon, Text } from '@chakra-ui/react';
import AdminComplaintDetailModal from './AdminUpdateDetailModal';
import { AdminContext } from '../context/AdminContext';
import moment from 'moment';
import { Complaint } from '../../types';
import { useDispatch, useSelector } from 'react-redux';
import { getAllEmployeeComplaints } from '../../Redux/Actions/ComplaintAction';
import { ThunkDispatch } from 'redux-thunk';
import { RootState } from '../../Redux/store';
import { AnyAction } from 'redux';

const AdminNewComplaints: React.FC = () => {
  const [currentComplaint, setCurrentComplaint] = useState<Complaint | null>(null);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const dispatch = useDispatch<ThunkDispatch<RootState, unknown, AnyAction>>();
  const { loading, error } = useSelector((state: RootState) => state.getAllEmployeeComplaint);
  
  const adminContext = useContext(AdminContext);
  
  // Ensure data is loaded
  useEffect(() => {
    if (!adminContext?.allEmployeeComplaints.length) {
      dispatch(getAllEmployeeComplaints());
    }
  }, [dispatch, adminContext]);

  const formatDate = (dateString: string): string => {
    return moment(dateString).format('MMMM D, YYYY h:mm A'); // Format as "July 22, 2024 7:19 AM"
  };

  const handleViewDetails = (complaint: Complaint): void => {
    setCurrentComplaint(complaint);
    setIsModalOpen(true);
  };
  
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
  
  if (!adminContext) {
    return (
      <Alert status="info" borderRadius="md" m={5}>
        <AlertIcon />
        <Text>Loading admin data...</Text>
      </Alert>
    );
  }
  
  const { allEmployeeComplaints } = adminContext;
  
  // Filter new complaints
  const newComplaints = allEmployeeComplaints.filter((com: Complaint) => com.status === 'Opened');

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
    <>
      <Box
        p={5}
        fontFamily="'Nunito', sans-serif"
        maxW="100vw"
        overflowX="auto"
        bg="gray.50"
      >
        <Heading as="h1" textAlign="center" mb={14} color="teal.500">New Complaints</Heading>
        <Box overflowX="auto">
          {newComplaints.length === 0 ? (
            <Alert status="info" borderRadius="md">
              <AlertIcon />
              <Text>No new complaints found.</Text>
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
                    <Th>Actions</Th>
                  </Tr>
                </Thead>
                <Tbody>
                  {newComplaints.map((complaint: Complaint) => (
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
                      <Td>
                        <Button onClick={() => handleViewDetails(complaint)} colorScheme="blue" size="sm">
                          View
                        </Button>
                      </Td>
                    </Tr>
                  ))}
                </Tbody>
              </Table>
            </TableContainer>
          )}
        </Box>
      </Box>
      {currentComplaint && (
        <AdminComplaintDetailModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          complaintDetail={currentComplaint}
        />
      )}
    </>
  );
};

export default AdminNewComplaints; 