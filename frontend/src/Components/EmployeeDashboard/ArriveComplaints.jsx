import React, { useContext, useState } from 'react';
import { Box, Table, Thead, Tbody, Tr,Heading,Th, Td, TableContainer, Text, Button, Tag, useDisclosure } from '@chakra-ui/react';
import { FaEye } from 'react-icons/fa';
import ComplaintDetailModal from './ComplaintDetailModal';
import { EmployeeContext } from '../context/EmployeeContext';


const ArriveComplaints = () => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [selectedComplaint, setSelectedComplaint] = useState(null);

  const {allMyArrivedComplaints, setAllMyArrivedComplaint} = useContext(EmployeeContext);

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


  const handleViewDetails = (complaint) => {
    setSelectedComplaint(complaint);
    onOpen();
  };

  return (
    <Box p={5} fontFamily="'Nunito', sans-serif" maxW="100%" overflowX="auto">
      <Heading  as="h1" textAlign="center" mb={14} color="teal.500">New Complaints</Heading>
      <Box overflowX="auto">
        <TableContainer bg="white" borderRadius="md" boxShadow="md">
          <Table variant="simple">
            <Thead bg="gray.100">
              <Tr>
                {/* <Th>Complaint Id</Th> */}
                <Th>Asset Type</Th>
                <Th>Complaint Text</Th>
                <Th>Mobile No</Th>
                <Th>Location</Th>
                <Th>Status</Th>
                <Th>Actions</Th>
              </Tr>
            </Thead>
            <Tbody>
              {allMyArrivedComplaints && allMyArrivedComplaints.filter((com)=> com.status === 'Processing').map((complaint) => (
                <Tr key={complaint.complaint_id}>
                  {/* <Td>{complaint.complaint_id}</Td> */}
                  <Td>{complaint.complaint_asset}</Td>
                  <Td maxW="150px" isTruncated>{complaint.complain_details}</Td>
                  <Td>{complaint.employee_phoneNo}</Td>
                  <Td>{complaint.employee_location}</Td>
                  <Td>
                  <Tag colorScheme={getStatusColor(complaint.status)}>
                    {complaint.status}
                  </Tag>
                </Td>
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
