import React, { useContext } from 'react';
import { Box, Table,Heading, Thead, Tbody, Tr, Th, Td, TableContainer, Text, Tag, Button } from '@chakra-ui/react';
import { FaTrash } from 'react-icons/fa';
import { EmployeeContext } from '../context/EmployeeContext';
import moment from 'moment';


const ClosedComplaints = () => {
   
  const {allMyComplaints, setAllMyComplaints } = useContext(EmployeeContext);

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

  const formatDate = (dateString) => {
    return moment(dateString).format('MMMM D, YYYY h:mm A'); // Format as "July 22, 2024 7:19 AM"
  };


  return (
    <Box
      p={5}
      fontFamily="'Nunito', sans-serif"
      maxW="100vw"
      overflowX="auto"
      bg="gray.50"
    >
     <Heading  as="h1" textAlign="center" mb={14} color="teal.500">Closed Complaints</Heading>
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
                {/* <Th>Complaint Id</Th> */}
                {/* <Th>Employee Id</Th> */}
                <Th>Assets Type</Th>
                <Th>Complaint Text</Th>
                {/* <Th>Mobile No</Th> */}
                <Th>Location</Th>
                <Th>Created Date</Th>
                <Th>Closed Date</Th>
                <Th>Status</Th>
                {/* <Th>Actions</Th> */}
              </Tr>
            </Thead>
            <Tbody>
              {allMyComplaints && allMyComplaints.filter((com)=> com.status === 'Closed').map((complaint) => (
                <Tr key={complaint.complaint_id}>
                {/* <Td>{complaint.complaint_id}</Td> */}
                <Td>{complaint.complaint_asset}</Td>
                <Td>{complaint.complain_details}</Td>
                <Td>{complaint.employee_location}</Td>
                <Td>{formatDate(complaint.created_date)}</Td>
                <Td>{formatDate(complaint.closed_date)}</Td>
                <Td>{complaint.feedback}</Td>
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
      </Box>
    </Box>
  );
};

export default ClosedComplaints;
