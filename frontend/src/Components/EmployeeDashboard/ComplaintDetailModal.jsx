import React, { useEffect, useState } from 'react';
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  Box,
  Text,
  useToast,
  RadioGroup,
  Radio,
  Button,
  Input
} from '@chakra-ui/react';
import moment from 'moment';
import { changeStatusOfComplaint } from '../../Redux/Actions/ComplaintAction';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate} from 'react-router-dom';
import { CHANGE_STATUS_OF_ARRIVED_COMPLAINT_RESET } from '../../Redux/ActionType';

const ComplaintDetailModal = ({ isOpen, onClose, complaint }) => {
  const [isCompleted, setIsCompleted] = useState("false");
  const [feedback, setFeedback] = useState("");
  const dispatch = useDispatch();
  const toast = useToast();

  const formatDate = (dateString) => {
    return moment(dateString).format('MMMM D, YYYY h:mm A'); // Format as "July 22, 2024 7:19 AM"
  };
  const navigate = useNavigate();

  const handleChangeStatus = () => {
    if (isCompleted === "true" && feedback.trim() !== "") {
      dispatch(changeStatusOfComplaint(complaint._id, true, feedback));
    }
    else if (feedback.trim() === "") {
      toast({
        title: 'Feedback is required',
        description: 'Please provide feedback before changing the status',
        status: 'error',
        position: 'top-right',
        duration: 5000,
        isClosable: true,
      });
    }
  };

  const { isStatusChanged, loading } = useSelector((state) => state.changeStatus);

  useEffect(() => {
    if (isStatusChanged) {
      onClose();
      toast({
        title: 'Complaint Updated Successfully',
        status: 'success',
        position: 'top-right',
        duration: 9000,
        isClosable: true,
      });
      dispatch({ type: CHANGE_STATUS_OF_ARRIVED_COMPLAINT_RESET });
      navigate('/employee/arrive-complaints');
    }
  }, [isStatusChanged, onClose, toast, dispatch]);

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
        fontFamily="'Nunito', sans-serif"
      >
        <ModalHeader
          fontSize="2xl"
          fontWeight="bold"
          color="teal.600"
          textAlign="center"
        >
          Complaint Details
        </ModalHeader>
        <ModalCloseButton />
        <ModalBody
          p={6}
          overflowY="auto"
          maxH="calc(80vh - 130px)"
        >
          <Box>
            <Box mb={4}>
              <Text fontWeight="bold">Complaint Id:</Text>
              <Text mt={1} bg="white" p={2} borderRadius="md" borderWidth="1px">{complaint.complaint_id}</Text>
            </Box>
            <Box mb={4}>
              <Text fontWeight="bold">Employee Id:</Text>
              <Text mt={1} bg="white" p={2} borderRadius="md" borderWidth="1px">{complaint.employee_id.employee_id}</Text>
            </Box>
            <Box mb={4}>
              <Text fontWeight="bold">Employee Name:</Text>
              <Text mt={1} bg="white" p={2} borderRadius="md" borderWidth="1px">{complaint.employee_id.employee_name}</Text>
            </Box>
            <Box mb={4}>
              <Text fontWeight="bold">Asset Type:</Text>
              <Text mt={1} bg="white" p={2} borderRadius="md" borderWidth="1px">{complaint.complaint_asset}</Text>
            </Box>
            <Box mb={4}>
              <Text fontWeight="bold">Complaint Details:</Text>
              <Text mt={1} bg="white" p={2} borderRadius="md" borderWidth="1px">{complaint.complain_details}</Text>
            </Box>
            <Box mb={4}>
              <Text fontWeight="bold">Mobile No:</Text>
              <Text mt={1} bg="white" p={2} borderRadius="md" borderWidth="1px">{complaint.employee_phoneNo}</Text>
            </Box>
            <Box mb={4}>
              <Text fontWeight="bold">Location:</Text>
              <Text mt={1} bg="white" p={2} borderRadius="md" borderWidth="1px">{complaint.employee_location}</Text>
            </Box>
            <Box mb={4}>
              <Text fontWeight="bold">Date of Submission:</Text>
              <Text mt={1} bg="white" p={2} borderRadius="md" borderWidth="1px">{formatDate(complaint.created_date)}</Text>
            </Box>
            <Box mb={4}>
              <Text fontWeight="bold">Status of Complaint:</Text>
              <Text mt={1} bg="white" p={2} borderRadius="md" borderWidth="1px">{complaint.status}</Text>
            </Box>
            <Box mb={4}>
              <Text fontWeight="bold">Attended By:</Text>
              <Text mt={1} bg="white" p={2} borderRadius="md" borderWidth="1px">{complaint.attended_by.name}</Text>
            </Box>
            <Box mb={6}>
              <Text fontWeight="bold">Is Work Completed?</Text>
              <RadioGroup onChange={setIsCompleted} value={isCompleted} mt={2}>
                <Box display="flex" gap={4}>
                  <Radio value="true" colorScheme="teal">Yes</Radio>
                  <Radio value="false" colorScheme="teal">No</Radio>
                </Box>
              </RadioGroup>
            </Box>
            <Box mb={4}>
               <Text fontWeight="bold">Enter the Feedback :</Text>
               <Input placeholder="Feedback" value={feedback} onChange={(e) => setFeedback(e.target.value)} bg="white" p={2} borderRadius="md" borderWidth="1px" />
            </Box>
            <Box p={4} borderTopWidth="1px" borderColor="gray.200" textAlign="right">
              <Button
                colorScheme="teal"
                size="lg"
                width="full"
                onClick={handleChangeStatus}
                isLoading={loading}
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
