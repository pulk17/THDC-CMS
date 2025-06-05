import React, { useContext, useEffect, useState } from "react";
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  Box,
  Text,
  SimpleGrid,
  useToast,
  Select,
  Button,
} from "@chakra-ui/react";
import moment from "moment";
import { AdminContext } from "../context/AdminContext";
import {useDispatch , useSelector} from 'react-redux'
import {useNavigate} from 'react-router-dom'
import { assignComplaintsToWorkers } from "../../Redux/Actions/ComplaintAction";
import { ASSIGN_COMPLAINT_TO_WORKERS_RESET } from "../../Redux/ActionType";

const AdminComplaintDetailModal = ({
  isOpen,
  onClose,
  complaintDetail,
}) => {
  const [empId , setEmpId] = useState("");
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const toast = useToast()

  const handleAssign = (e)=>{
      e.preventDefault()
      dispatch(assignComplaintsToWorkers(complaintDetail._id , empId))
  }


  const {isGetWorkers, workers} = useContext(AdminContext);

  const formatDate = (dateString) => {
    return moment(dateString).format('MMMM D, YYYY h:mm A'); // Format as "July 22, 2024 7:19 AM"
  };

  const {loading:isAssignedLoading , isAssigned} = useSelector((state)=> state.assignComplaint)

  useEffect(()=>{
    if(isAssigned){
      onClose()
      toast({
        title: 'Complaint Assigned Successfully',
        status: 'success',
        position: 'top-right',
        duration: 9000,
        isClosable: true,
      });
      dispatch({type : ASSIGN_COMPLAINT_TO_WORKERS_RESET})
      navigate('/admin/status/new-complaints')
    }
  },[isAssigned])

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
        <ModalBody p={6} overflowY="auto" maxH="calc(80vh - 130px)">
          <Box>
            <Box mb={4}>
              <Text fontWeight="bold">Complaint Id:</Text>
              <Text mt={1} bg="white" p={2} borderRadius="md" borderWidth="1px">
                {complaintDetail.complaint_id}
              </Text>
            </Box>
            <Box mb={4}>
              <Text fontWeight="bold">Employee Id:</Text>
              <Text mt={1} bg="white" p={2} borderRadius="md" borderWidth="1px">
                {complaintDetail.employee_id.employee_id}
              </Text>
            </Box>
            <Box mb={4}>
              <Text fontWeight="bold">Employee Name:</Text>
              <Text mt={1} bg="white" p={2} borderRadius="md" borderWidth="1px">
                {complaintDetail.employee_id.employee_name}
              </Text>
            </Box>
            <Box mb={4}>
              <Text fontWeight="bold">Asset Type:</Text>
              <Text mt={1} bg="white" p={2} borderRadius="md" borderWidth="1px">
                {complaintDetail.complaint_asset}
              </Text>
            </Box>
            <Box mb={4}>
              <Text fontWeight="bold">Complaint Details:</Text>
              <Text mt={1} bg="white" p={2} borderRadius="md" borderWidth="1px">
                {complaintDetail.complain_details}
              </Text>
            </Box>
            <Box mb={4}>
              <Text fontWeight="bold">Mobile No:</Text>
              <Text mt={1} bg="white" p={2} borderRadius="md" borderWidth="1px">
                {complaintDetail.employee_phoneNo}
              </Text>
            </Box>
            <Box mb={4}>
              <Text fontWeight="bold">Employee Department:</Text>
              <Text mt={1} bg="white" p={2} borderRadius="md" borderWidth="1px">
                {complaintDetail.employee_id.employee_department}
              </Text>
            </Box>
            <Box mb={4}>
              <Text fontWeight="bold">Location:</Text>
              <Text mt={1} bg="white" p={2} borderRadius="md" borderWidth="1px">
                {complaintDetail.employee_location}
              </Text>
            </Box>
            <Box mb={4}>
              <Text fontWeight="bold">Date And Time of Submission:</Text>
              <Text mt={1} bg="white" p={2} borderRadius="md" borderWidth="1px">
                {formatDate(complaintDetail.created_date)}
              </Text>
            </Box>
            <Box mb={4}>
              <Text fontWeight="bold">Status of Complaint:</Text>
              <Text mt={1} bg="white" p={2} borderRadius="md" borderWidth="1px">
                {complaintDetail.status}
              </Text>
            </Box>
            <Box mb={6}>
              <Text fontWeight="bold">Assign To:</Text>
              {
                complaintDetail && complaintDetail.status === 'Opened' ? (
                  <Select placeholder="Select a worker" onChange={(e) => setEmpId(e.target.value)} mt={2}>
                    {workers && workers.map((worker) => (
                      <option key={worker._id} value={worker._id}>
                        {worker.employee_name}
                      </option>
                    ))}
                  </Select>
                ) : (
                  <Text mt={1} bg="white" p={2} borderRadius="md" borderWidth="1px">
                    {complaintDetail.attended_by.name}
                  </Text>
                )
              }
            </Box>
            {complaintDetail.feedback != "" && <Box mb={4}>
              <Text fontWeight="bold">Feedback</Text>
              <Text mt={1} bg="white" p={2} borderRadius="md" borderWidth="1px">
                {complaintDetail.feedback}
              </Text>
            </Box>
            }
            <Box
              p={4}
              display={complaintDetail && complaintDetail.status === 'Opened' ? 'block' : 'none'}
              borderTopWidth="1px"
              borderColor="gray.200"
              textAlign="right"
            >
              <Button
                colorScheme="teal"
                isLoading={isAssignedLoading}
                size="lg"
                width="full"
                onClick={handleAssign}
              >
                Assign
              </Button>
            </Box>
          </Box>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};

export default AdminComplaintDetailModal;
