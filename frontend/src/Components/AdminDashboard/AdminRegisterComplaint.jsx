import React, { useEffect, useState } from 'react';
import { Box, Heading, FormControl, FormLabel, Input, RadioGroup, Radio, Select, Textarea, Button, VStack, useToast } from '@chakra-ui/react';
import { useDispatch, useSelector } from 'react-redux';
import { registerComplaint } from '../../Redux/Actions/ComplaintAction';
import { useNavigate } from 'react-router-dom';
import { REGISTER_COMPLAINT_RESET } from '../../Redux/ActionType';

const AdminRegisterComplaint = () => {
  const toast = useToast();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [employee_location, setEmployee_location] = useState("");
  const [complaint_asset, setComplaint_asset] = useState("");
  const [employee_phoneNo, setEmployee_phoneNo] = useState("");
  const [complain_details, setComplain_details] = useState("");

  const handleSubmit = (event) => {
    event.preventDefault();
    if (!employee_location || !complaint_asset || !complain_details || !employee_phoneNo) {
      toast({
        title: 'Please fill all the details',
        status: 'error',
        duration: 9000,
        isClosable: true,
      });
      return; // Prevent form submission if validation fails
    }
    dispatch(registerComplaint(employee_location, complaint_asset, employee_phoneNo, complain_details));
  };

  const { loading: isComplaintLoading, isRegisteredComplaint } = useSelector((state) => state.registerComplaint);

  useEffect(() => {
    if (isRegisteredComplaint) {
      toast({
        title: 'Complaint Registered Successfully',
        status: 'success',
        position: 'top-right',
        duration: 9000,
        isClosable: true,
      });
      setComplain_details("");
      setEmployee_phoneNo("");
      setComplaint_asset("");
      dispatch({ type: REGISTER_COMPLAINT_RESET });
      navigate('/admin/status/new-complaints');
    }
  }, [isRegisteredComplaint, dispatch, navigate, toast]);

  return (
    <Box
      p={8}
      bg="white"
      borderRadius="md"
      boxShadow="md"
      fontFamily="'Nunito', sans-serif"
      maxW="90%"
      mx="auto"
      mt={1}
      mb={10}
    >
      <Heading as="h1" size="xl" mb={6} textAlign="center" color="teal.500">
        Register a Complaint
      </Heading>
      <form onSubmit={handleSubmit}>
        <VStack spacing={6} align="stretch">
          <FormControl isRequired>
            <FormLabel>Employee Location</FormLabel>
            <RadioGroup
              value={employee_location}
              onChange={(value) => setEmployee_location(value)}
              defaultValue="Tehri"
            >
              <VStack align="start">
                <Radio value="Tehri">Tehri</Radio>
                <Radio value="Koteshwar">Koteshwar</Radio>
              </VStack>
            </RadioGroup>
          </FormControl>

          <FormControl isRequired>
            <FormLabel>Asset</FormLabel>
            <Select
              value={complaint_asset}
              onChange={(e) => setComplaint_asset(e.target.value)} // Correctly access value
              placeholder="Select asset"
            >
              <option value="THDC Desktop">THDC Desktop</option>
              <option value="THDC UPS">THDC UPS</option>
              <option value="THDC Printer">THDC Printer</option>
              <option value="THDC Scanner">THDC Scanner</option>
            </Select>
          </FormControl>

          <FormControl isRequired>
            <FormLabel>Mobile Number</FormLabel>
            <Input
              value={employee_phoneNo}
              onChange={(e) => setEmployee_phoneNo(e.target.value)}
              type="tel"
              placeholder="Enter your mobile number"
            />
          </FormControl>

          <FormControl isRequired>
            <FormLabel>Complaint Details</FormLabel>
            <Textarea
              value={complain_details}
              onChange={(e) => setComplain_details(e.target.value)}
              placeholder="Describe your complaint in detail"
              minH="200px" // Increase height for more space
            />
          </FormControl>

          <Button
            isLoading={isComplaintLoading}
            type="submit"
            colorScheme="teal"
            size="lg"
            width="full"
            mt={4}
          >
            Submit
          </Button>
        </VStack>
      </form>
    </Box>
  );
};

export default AdminRegisterComplaint;

