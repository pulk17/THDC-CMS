import React, { useContext, useState } from 'react';
import { Box, Table, Thead, Heading,Tbody, Tr, Th, Td, TableContainer, Text, Tag, Button } from '@chakra-ui/react';
import AdminComplaintDetailModal from './AdminUpdateDetailModal';
import { AdminContext } from '../context/AdminContext';
import moment from 'moment';


const AdminNewComplaints = () => {
  const [currentComplaint, setCurrentComplaint] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const formatDate = (dateString) => {
    return moment(dateString).format('MMMM D, YYYY h:mm A'); // Format as "July 22, 2024 7:19 AM"
  };

  const handleViewDetails = (complaint) => {
    setCurrentComplaint(complaint);
    setIsModalOpen(true);
  };

  const {allEmployeeComplaints, setAllEmployeeComplaints} = useContext(AdminContext);


  const handleAssign = (assignedTo) => {
    console.log(`Assigned to: ${assignedTo}`);
    
  };

  const getStatusColor = (status) => {
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
       <Heading  as="h1" textAlign="center" mb={14} color="teal.500">New Complaints</Heading>
      <Box overflowX="auto">
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
              {allEmployeeComplaints && allEmployeeComplaints.filter((com)=> com.status === 'Opened').map((complaint) => (
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
                    <Button onClick={()=>handleViewDetails(complaint)} colorScheme="blue" size="sm">
                      View
                    </Button>
                  </Td>
                </Tr>
              ))}
            </Tbody>
          </Table>
        </TableContainer>
      </Box>
    </Box>
      {currentComplaint && (
        <AdminComplaintDetailModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          complaintDetail={currentComplaint} 
          onAssign={handleAssign}
        />
      )}
    </>
  );
};

export default AdminNewComplaints;
