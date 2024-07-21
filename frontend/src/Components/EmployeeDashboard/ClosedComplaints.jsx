import React from 'react';
import { Box, Table, Thead, Tbody, Tr, Th, Td, TableContainer, Text, Tag, Button } from '@chakra-ui/react';
import { FaTrash } from 'react-icons/fa';

const complaints = [
  {
    complaintId: 'C123',
    employeeId: 'E456',
    assetType: 'THDC Desktop',
    complaintText: 'The desktop is not turning on.',
    mobileNo: '9876543210',
    location: 'Tehri',
    createdDate: '2024-07-21',
    status: 'Closed',
  },
  {
    complaintId: 'C124',
    employeeId: 'E457',
    assetType: 'THDC UPS',
    complaintText: 'UPS battery is faulty.',
    mobileNo: '9123456789',
    location: 'Koteshwar',
    createdDate: '2024-07-20',
    status: 'Closed',
  },
  {
    complaintId: 'C125',
    employeeId: 'E458',
    assetType: 'THDC Printer',
    complaintText: 'Printer is out of ink.',
    mobileNo: '9876543210',
    location: 'Tehri',
    createdDate: '2024-07-19',
    status: 'Closed',
  },
  // Add more sample data as needed
];

const ClosedComplaints = () => {
  const getStatusColor = (status) => {
    switch (status) {
      case 'Open':
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
      <Text fontSize="2xl" fontWeight="bold" mb={4}>Closed Complaints</Text>
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
                {/* <Th>Employee Id</Th> */}
                <Th>Assets Type</Th>
                <Th>Complaint Text</Th>
                {/* <Th>Mobile No</Th> */}
                <Th>Location</Th>
                <Th>Created Date</Th>
                <Th>Status</Th>
                <Th>Actions</Th>
              </Tr>
            </Thead>
            <Tbody>
              {complaints.map((complaint) => (
                <Tr key={complaint.complaintId}>
                  <Td>{complaint.complaintId}</Td>
                  {/* <Td>{complaint.employeeId}</Td> */}
                  <Td>{complaint.assetType}</Td>
                  <Td>{complaint.complaintText}</Td>
                  {/* <Td>{complaint.mobileNo}</Td> */}
                  <Td>{complaint.location}</Td>
                  <Td>{complaint.createdDate}</Td>
                  <Td>
                    <Tag colorScheme={getStatusColor(complaint.status)}>{complaint.status}</Tag>
                  </Td>
                  <Td>
                    <Button colorScheme="red" leftIcon={<FaTrash />} size="sm">
                      Remove
                    </Button>
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
