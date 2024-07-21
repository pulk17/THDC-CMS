import React, { useState } from 'react';
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  Box,
  Text,
  Input,
  RadioGroup,
  Radio,
  Button
} from '@chakra-ui/react';

const ComplaintDetailModal = ({ isOpen, onClose, complaint, onChangeStatus }) => {
  const [workCompleted, setWorkCompleted] = useState(complaint.workCompleted || 'No');

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="lg" isCentered>
      <ModalOverlay />
      <ModalContent
        w="80%"
        maxW="1200px"
        h="80vh"
        borderRadius="lg"
        bg="gray.50"
        overflow="hidden"
        fontFamily="'Nunito', sans-serif" // Apply Nunito font globally
      >
        <ModalHeader
          fontSize="2xl"
          fontWeight="bold"
          color="teal.600"
          textAlign="center" // Center align the header
        >
          Complaint Details
        </ModalHeader>
        <ModalCloseButton />
        <ModalBody
          p={6}
          overflowY="auto" // Enables vertical scrolling inside the modal
          maxH="calc(80vh - 130px)" // Adjusts height to leave room for header, footer, and padding
        >
          <Box>
            <Box mb={4}>
              <Text fontWeight="bold">Complaint Id:</Text>
              <Text mt={1} bg="white" p={2} borderRadius="md" borderWidth="1px">{complaint.complaintId}</Text>
            </Box>
            <Box mb={4}>
              <Text fontWeight="bold">Employee Id:</Text>
              <Text mt={1} bg="white" p={2} borderRadius="md" borderWidth="1px">{complaint.employeeId}</Text>
            </Box>
            <Box mb={4}>
              <Text fontWeight="bold">Employee Name:</Text>
              <Text mt={1} bg="white" p={2} borderRadius="md" borderWidth="1px">{complaint.employeeName}</Text>
            </Box>
            <Box mb={4}>
              <Text fontWeight="bold">Asset Type:</Text>
              <Text mt={1} bg="white" p={2} borderRadius="md" borderWidth="1px">{complaint.assetType}</Text>
            </Box>
            <Box mb={4}>
              <Text fontWeight="bold">Complaint Details:</Text>
              <Text mt={1} bg="white" p={2} borderRadius="md" borderWidth="1px">{complaint.complaintText}</Text>
            </Box>
            <Box mb={4}>
              <Text fontWeight="bold">Mobile No:</Text>
              <Text mt={1} bg="white" p={2} borderRadius="md" borderWidth="1px">{complaint.mobileNo}</Text>
            </Box>
            <Box mb={4}>
              <Text fontWeight="bold">Location:</Text>
              <Text mt={1} bg="white" p={2} borderRadius="md" borderWidth="1px">{complaint.location}</Text>
            </Box>
            <Box mb={4}>
              <Text fontWeight="bold">Date of Submission:</Text>
              <Text mt={1} bg="white" p={2} borderRadius="md" borderWidth="1px">{complaint.dateOfSubmission}</Text>
            </Box>
            <Box mb={4}>
              <Text fontWeight="bold">Status of Complaint:</Text>
              <Text mt={1} bg="white" p={2} borderRadius="md" borderWidth="1px">{complaint.status}</Text>
            </Box>
            <Box mb={4}>
              <Text fontWeight="bold">Attended By:</Text>
              <Text mt={1} bg="white" p={2} borderRadius="md" borderWidth="1px">{complaint.attendedBy}</Text>
            </Box>
            <Box mb={6}>
              <Text fontWeight="bold">Is Work Completed?</Text>
              <RadioGroup onChange={setWorkCompleted} value={workCompleted} mt={2}>
                <Box display="flex" gap={4}>
                  <Radio value="Yes" colorScheme="teal">Yes</Radio>
                  <Radio value="No" colorScheme="teal">No</Radio>
                </Box>
              </RadioGroup>
            </Box>
            <Box p={4} borderTopWidth="1px" borderColor="gray.200" textAlign="right">
          <Button
            colorScheme="teal"
            size="lg"
            width="full"
            onClick={() => {
              onChangeStatus(workCompleted);
              onClose();
            }}
          >
            Change Status
          </Button>
        </Box>
          </Box>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};

export default ComplaintDetailModal;
