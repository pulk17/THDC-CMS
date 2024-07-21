import React from 'react';
import { Box, Heading, Text } from '@chakra-ui/react';

const AdminPendingComplaints = () => {
  return (
    <Box p={5} fontFamily="'Nunito', sans-serif">
      <Heading as="h1" textAlign="center" mb={4} color="teal.500">Pending Complaints</Heading>
      <Text>List of pending complaints...</Text>
    </Box>
  );
};

export default AdminPendingComplaints;
