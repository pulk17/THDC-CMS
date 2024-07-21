import React from 'react';
import { Box, Heading, FormControl, FormLabel, Input, RadioGroup, Radio, Select, Textarea, Button, VStack, useToast } from '@chakra-ui/react';

const RegisterComplaint = () => {
  const toast = useToast();

  const handleSubmit = (event) => {
    event.preventDefault();
    // Handle form submission logic here
    toast({
      title: "Complaint Registered.",
      description: "Your complaint has been successfully registered.",
      status: "success",
      duration: 5000,
      isClosable: true,
    });
  };

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
            <RadioGroup defaultValue="Tehri">
              <VStack align="start">
                <Radio value="Tehri">Tehri</Radio>
                <Radio value="Koteshwar">Koteshwar</Radio>
              </VStack>
            </RadioGroup>
          </FormControl>

          <FormControl isRequired>
            <FormLabel>Asset</FormLabel>
            <Select placeholder="Select asset">
              <option value="THDC Desktop">THDC Desktop</option>
              <option value="THDC UPS">THDC UPS</option>
              <option value="THDC Printer">THDC Printer</option>
              <option value="THDC Scanner">THDC Scanner</option>
            </Select>
          </FormControl>

          <FormControl isRequired>
            <FormLabel>Mobile Number</FormLabel>
            <Input type="tel" placeholder="Enter your mobile number" />
          </FormControl>

          <FormControl isRequired>
            <FormLabel>Complaint Details</FormLabel>
            <Textarea 
              placeholder="Describe your complaint in detail" 
              minH="200px" // Increase height for more space
            />
          </FormControl>

          <Button
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

export default RegisterComplaint;
