import React, { useContext } from 'react';
import { Box, Table, Thead, Tbody, Tr, Th, Td, TableContainer, Text, Tag, Button } from '@chakra-ui/react';
import { FaTrash } from 'react-icons/fa';
import { EmployeeContext } from '../context/EmployeeContext';
import moment from 'moment';

const AllComplaints = () => {
  const { allMyComplaints, setAllMyComplaints } = useContext(EmployeeContext);

  // Function to format the created date using moment
  const formatDate = (dateString) => {
    return moment(dateString).format('MMMM D, YYYY h:mm A'); // Format as "July 22, 2024 7:19 AM"
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
    <Box
      p={5}
      fontFamily="'Nunito', sans-serif"
      maxW="100vw"
      overflowX="auto"
      bg="gray.50"
    >
      <Text fontSize="2xl" fontWeight="bold" mb={4}>All Complaints</Text>
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

              </Tr>
            </Thead>
            <Tbody>
              {allMyComplaints && allMyComplaints.map((complaint) => (
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
      </Box>
    </Box>
  );
};

export default AllComplaints;
