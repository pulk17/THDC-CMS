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
  Input,
  Flex,
  Divider,
  useColorModeValue,
  Badge
} from '@chakra-ui/react';
import { motion } from 'framer-motion';
import moment from 'moment';
import { changeStatusOfComplaint } from '../../Redux/Actions/ComplaintAction';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { CHANGE_STATUS_OF_COMPLAINT_RESET } from '../../Redux/ActionType';
import { Complaint } from '../../types';
import { RootState } from '../../Redux/store';
import { ThunkDispatch } from 'redux-thunk';
import { AnyAction } from 'redux';

// Create motion components
const MotionBox = motion(Box);
const MotionFlex = motion(Flex);

interface ComplaintDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  complaint: Complaint;
}

const ComplaintDetailModal: React.FC<ComplaintDetailModalProps> = ({ isOpen, onClose, complaint }) => {
  const [isCompleted, setIsCompleted] = useState<string>("false");
  const [feedback, setFeedback] = useState<string>("");
  const dispatch = useDispatch<ThunkDispatch<RootState, unknown, AnyAction>>();
  const toast = useToast();
  
  // Color mode values
  const bgColor = useColorModeValue('white', 'gray.800');
  const headerBgColor = useColorModeValue('gray.50', 'gray.700');
  const borderColor = useColorModeValue('gray.200', 'gray.600');
  const textColor = useColorModeValue('gray.800', 'white');
  const accentColor = useColorModeValue('teal.500', 'teal.300');
  const fieldBgColor = useColorModeValue('gray.50', 'gray.700');

  // Animation variants
  const modalVariants = {
    hidden: { opacity: 0, scale: 0.95 },
    visible: { 
      opacity: 1, 
      scale: 1,
      transition: { 
        duration: 0.3,
        ease: "easeOut"
      }
    },
    exit: {
      opacity: 0,
      scale: 0.95,
      transition: {
        duration: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: (custom: number) => ({
      opacity: 1,
      y: 0,
      transition: {
        delay: custom * 0.05,
        duration: 0.3
      }
    })
  };

  const formatDate = (dateString: string): string => {
    return moment(dateString).format('MMMM D, YYYY h:mm A'); // Format as "July 22, 2024 7:19 AM"
  };
  const navigate = useNavigate();

  const handleChangeStatus = (): void => {
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

  const { isStatusChanged, loading } = useSelector((state: RootState) => state.changeStatusOfComplaint);

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
      dispatch({ type: CHANGE_STATUS_OF_COMPLAINT_RESET });
      navigate('/employee/arrive-complaints');
    }
  }, [isStatusChanged, onClose, toast, dispatch, navigate]);

  const getStatusBadge = (status: string) => {
    let colorScheme;
    switch (status) {
      case 'Opened':
        colorScheme = 'green';
        break;
      case 'Closed':
        colorScheme = 'red';
        break;
      case 'Processing':
        colorScheme = 'yellow';
        break;
      default:
        colorScheme = 'gray';
    }
    
    return (
      <Badge colorScheme={colorScheme} borderRadius="full" px={3} py={1}>
        {status}
      </Badge>
    );
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="lg" isCentered motionPreset="scale">
      <ModalOverlay backdropFilter="blur(4px)" />
      <ModalContent
        as={motion.div}
        initial="hidden"
        animate="visible"
        exit="exit"
        variants={modalVariants}
        w="90%"
        maxW="800px"
        h={{ base: "90vh", md: "80vh" }}
        borderRadius="xl"
        bg={bgColor}
        overflow="hidden"
        fontFamily="'Nunito', sans-serif"
        boxShadow="xl"
      >
        <ModalHeader
          fontSize={{ base: "xl", md: "2xl" }}
          fontWeight="600"
          color={accentColor}
          textAlign="center"
          bg={headerBgColor}
          py={4}
          borderBottomWidth="1px"
          borderColor={borderColor}
        >
          Complaint Details
        </ModalHeader>
        <ModalCloseButton color={textColor} />
        <ModalBody
          p={6}
          overflowY="auto"
          maxH="calc(80vh - 130px)"
        >
          <MotionBox>
            <Flex 
              direction={{ base: "column", md: "row" }} 
              wrap="wrap" 
              gap={4}
            >
              <MotionBox 
                mb={4} 
                flex="1" 
                minW={{ base: "100%", md: "45%" }}
                custom={0}
                variants={itemVariants}
                initial="hidden"
                animate="visible"
              >
                <Text fontWeight="600" color={textColor} mb={1}>Complaint Id:</Text>
                <Text 
                  mt={1} 
                  bg={fieldBgColor} 
                  p={3} 
                  borderRadius="md" 
                  borderWidth="1px"
                  borderColor={borderColor}
                >
                  {complaint.complaint_id}
                </Text>
              </MotionBox>

              <MotionBox 
                mb={4} 
                flex="1" 
                minW={{ base: "100%", md: "45%" }}
                custom={1}
                variants={itemVariants}
                initial="hidden"
                animate="visible"
              >
                <Text fontWeight="600" color={textColor} mb={1}>Employee Id:</Text>
                <Text 
                  mt={1} 
                  bg={fieldBgColor} 
                  p={3} 
                  borderRadius="md" 
                  borderWidth="1px"
                  borderColor={borderColor}
                >
                  {typeof complaint.employee_id === 'object' && complaint.employee_id !== null 
                    ? complaint.employee_id.employee_id 
                    : complaint.employee_id}
                </Text>
              </MotionBox>

              <MotionBox 
                mb={4} 
                flex="1" 
                minW={{ base: "100%", md: "45%" }}
                custom={2}
                variants={itemVariants}
                initial="hidden"
                animate="visible"
              >
                <Text fontWeight="600" color={textColor} mb={1}>Employee Name:</Text>
                <Text 
                  mt={1} 
                  bg={fieldBgColor} 
                  p={3} 
                  borderRadius="md" 
                  borderWidth="1px"
                  borderColor={borderColor}
                >
                  {typeof complaint.employee_id === 'object' && complaint.employee_id !== null 
                    ? complaint.employee_id.employee_name 
                    : ''}
                </Text>
              </MotionBox>

              <MotionBox 
                mb={4} 
                flex="1" 
                minW={{ base: "100%", md: "45%" }}
                custom={3}
                variants={itemVariants}
                initial="hidden"
                animate="visible"
              >
                <Text fontWeight="600" color={textColor} mb={1}>Asset Type:</Text>
                <Text 
                  mt={1} 
                  bg={fieldBgColor} 
                  p={3} 
                  borderRadius="md" 
                  borderWidth="1px"
                  borderColor={borderColor}
                >
                  {complaint.complaint_asset}
                </Text>
              </MotionBox>

              <MotionBox 
                mb={4} 
                flex="1" 
                minW="100%"
                custom={4}
                variants={itemVariants}
                initial="hidden"
                animate="visible"
              >
                <Text fontWeight="600" color={textColor} mb={1}>Complaint Details:</Text>
                <Text 
                  mt={1} 
                  bg={fieldBgColor} 
                  p={3} 
                  borderRadius="md" 
                  borderWidth="1px"
                  borderColor={borderColor}
                >
                  {complaint.complain_details}
                </Text>
              </MotionBox>

              <MotionBox 
                mb={4} 
                flex="1" 
                minW={{ base: "100%", md: "45%" }}
                custom={5}
                variants={itemVariants}
                initial="hidden"
                animate="visible"
              >
                <Text fontWeight="600" color={textColor} mb={1}>Mobile No:</Text>
                <Text 
                  mt={1} 
                  bg={fieldBgColor} 
                  p={3} 
                  borderRadius="md" 
                  borderWidth="1px"
                  borderColor={borderColor}
                >
                  {complaint.employee_phoneNo}
                </Text>
              </MotionBox>

              <MotionBox 
                mb={4} 
                flex="1" 
                minW={{ base: "100%", md: "45%" }}
                custom={6}
                variants={itemVariants}
                initial="hidden"
                animate="visible"
              >
                <Text fontWeight="600" color={textColor} mb={1}>Location:</Text>
                <Text 
                  mt={1} 
                  bg={fieldBgColor} 
                  p={3} 
                  borderRadius="md" 
                  borderWidth="1px"
                  borderColor={borderColor}
                >
                  {complaint.employee_location}
                </Text>
              </MotionBox>

              <MotionBox 
                mb={4} 
                flex="1" 
                minW={{ base: "100%", md: "45%" }}
                custom={7}
                variants={itemVariants}
                initial="hidden"
                animate="visible"
              >
                <Text fontWeight="600" color={textColor} mb={1}>Date of Submission:</Text>
                <Text 
                  mt={1} 
                  bg={fieldBgColor} 
                  p={3} 
                  borderRadius="md" 
                  borderWidth="1px"
                  borderColor={borderColor}
                >
                  {formatDate(complaint.created_date)}
                </Text>
              </MotionBox>

              <MotionBox 
                mb={4} 
                flex="1" 
                minW={{ base: "100%", md: "45%" }}
                custom={8}
                variants={itemVariants}
                initial="hidden"
                animate="visible"
              >
                <Text fontWeight="600" color={textColor} mb={1}>Status of Complaint:</Text>
                <Flex 
                  mt={1} 
                  bg={fieldBgColor} 
                  p={3} 
                  borderRadius="md" 
                  borderWidth="1px"
                  borderColor={borderColor}
                  alignItems="center"
                >
                  {getStatusBadge(complaint.status)}
                </Flex>
              </MotionBox>

              <MotionBox 
                mb={4} 
                flex="1" 
                minW={{ base: "100%", md: "45%" }}
                custom={9}
                variants={itemVariants}
                initial="hidden"
                animate="visible"
              >
                <Text fontWeight="600" color={textColor} mb={1}>Attended By:</Text>
                <Text 
                  mt={1} 
                  bg={fieldBgColor} 
                  p={3} 
                  borderRadius="md" 
                  borderWidth="1px"
                  borderColor={borderColor}
                >
                  {complaint.attended_by && complaint.attended_by.name ? complaint.attended_by.name : 'Not assigned'}
                </Text>
              </MotionBox>
            </Flex>

            <Divider my={6} borderColor={borderColor} />

            <MotionFlex 
              direction="column" 
              gap={4}
              custom={10}
              variants={itemVariants}
              initial="hidden"
              animate="visible"
            >
              <Box mb={4}>
                <Text fontWeight="600" color={textColor} mb={2}>Is Work Completed?</Text>
                <RadioGroup 
                  onChange={setIsCompleted} 
                  value={isCompleted} 
                  mt={2}
                >
                  <Flex gap={6}>
                    <Radio value="true" colorScheme="teal" size="lg">Yes</Radio>
                    <Radio value="false" colorScheme="teal" size="lg">No</Radio>
                  </Flex>
                </RadioGroup>
              </Box>

              <Box mb={4}>
                <Text fontWeight="600" color={textColor} mb={2}>Enter the Feedback:</Text>
                <Input 
                  placeholder="Feedback" 
                  value={feedback} 
                  onChange={(e) => setFeedback(e.target.value)} 
                  bg={fieldBgColor}
                  p={3}
                  borderRadius="md" 
                  borderWidth="1px"
                  borderColor={borderColor}
                  _focus={{
                    borderColor: accentColor,
                    boxShadow: `0 0 0 1px ${accentColor}`
                  }}
                  fontSize="md"
                />
              </Box>
            </MotionFlex>

            <MotionBox 
              p={4} 
              borderTopWidth="1px" 
              borderColor={borderColor} 
              textAlign="right"
              mt={4}
              custom={11}
              variants={itemVariants}
              initial="hidden"
              animate="visible"
            >
              <Button
                colorScheme="teal"
                size="lg"
                width="full"
                onClick={handleChangeStatus}
                isLoading={loading}
                borderRadius="md"
                _hover={{
                  transform: "translateY(-2px)",
                  boxShadow: "md",
                  transition: "all 0.2s"
                }}
              >
                Change Status
              </Button>
            </MotionBox>
          </MotionBox>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};

export default ComplaintDetailModal; 