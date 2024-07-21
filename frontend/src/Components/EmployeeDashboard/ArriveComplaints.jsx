import React, { useState } from 'react';
import { Box, Table, Thead, Tbody, Tr, Th, Td, TableContainer, Text, Button, Tag, useDisclosure } from '@chakra-ui/react';
import { FaEye } from 'react-icons/fa';
import ComplaintDetailModal from './ComplaintDetailModal';

const complaints = [
  {
    complaintId: 'C126',
    assetType: 'THDC Scanner',
    complaintText: "Lorem ipsum dolor sit amet, consectetur adipisicing elit. Minus nesciunt praesentium culpa illo nostrum consequatur quasi voluptas magni. Molestias totam dolorem odit atque sed sint nisi illum placeat minima amet.lorlsdhgladshjglkadsjghlkjdsalhkjaslhjlas",
    mobileNo: '9999999999',
    location: 'Tehri',
    employeeId: 'E459',
    employeeName: 'Alice Johnson',
    dateOfSubmission: '2024-07-22',
    status: 'Open',
    attendedBy: 'John Smith',
  },
  // Add more sample data as needed
];

const ArriveComplaints = () => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [selectedComplaint, setSelectedComplaint] = useState(null);

  const handleViewDetails = (complaint) => {
    setSelectedComplaint(complaint);
    onOpen();
  };

  return (
    <Box p={5} fontFamily="'Nunito', sans-serif" maxW="100%" overflowX="auto">
      <Text fontSize="2xl" fontWeight="bold" mb={4}>Arrived Complaints</Text>
      <Box overflowX="auto">
        <TableContainer bg="white" borderRadius="md" boxShadow="md">
          <Table variant="simple">
            <Thead bg="gray.100">
              <Tr>
                <Th>Complaint Id</Th>
                <Th>Asset Type</Th>
                <Th>Complaint Text</Th>
                <Th>Mobile No</Th>
                <Th>Location</Th>
                <Th>Actions</Th>
              </Tr>
            </Thead>
            <Tbody>
              {complaints.map((complaint) => (
                <Tr key={complaint.complaintId}>
                  <Td>{complaint.complaintId}</Td>
                  <Td>{complaint.assetType}</Td>
                  <Td maxW="150px" isTruncated>{complaint.complaintText}</Td>
                  <Td>{complaint.mobileNo}</Td>
                  <Td>{complaint.location}</Td>
                  <Td>
                    <Button colorScheme="teal" leftIcon={<FaEye />} onClick={() => handleViewDetails(complaint)} size="sm">
                      View Full Details
                    </Button>
                  </Td>
                </Tr>
              ))}
            </Tbody>
          </Table>
        </TableContainer>
      </Box>
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
