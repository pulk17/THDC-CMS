import React from 'react';
import { Box, Heading, Text } from '@chakra-ui/react';

const AdminNewComplaints = () => {
  return (
    <Box p={5} fontFamily="'Nunito', sans-serif">
      <Heading as="h1" textAlign="center" mb={4} color="teal.500">New Complaints</Heading>
      <Text>List of new complaints...</Text>
    </Box>
  );
};

export default AdminNewComplaints;
