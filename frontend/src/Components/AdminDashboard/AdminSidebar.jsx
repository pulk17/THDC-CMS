import React from 'react';
import { Box, Flex, Avatar, Text, VStack, Link, Icon, Divider } from '@chakra-ui/react';
import { FaFolderOpen, FaHourglassHalf, FaCheckCircle, FaTimesCircle } from 'react-icons/fa';
import { Link as RouterLink } from 'react-router-dom';

const AdminSidebar = () => {
  return (
    <Box
      w="300px"
      p={5}
      bg="gray.100"
      h="100vh"
      boxShadow="md"
      fontFamily="'Nunito', sans-serif"
    >
      <Flex align="center" mb={6} direction="column">
        <Avatar src="/assets/admin-profile.png" size="xl" mb={4} />
        <Text fontSize="lg" fontWeight="bold">Admin Name</Text>
      </Flex>
      <Divider borderColor="gray.300" mb={4} />
      <VStack align="start" spacing={4}>
        <Link
          as={RouterLink}
          to="/admin/register-complaint"
          display="flex"
          alignItems="center"
          w="100%"
          p={2}
          borderRadius="md"
          _hover={{ bg: 'gray.200' }}
        >
          <Icon as={FaFolderOpen} mr={3} />
          Register a Complaint
        </Link>
        <Link
          as={RouterLink}
          to="/admin/status/new-complaints"
          display="flex"
          alignItems="center"
          w="100%"
          p={2}
          borderRadius="md"
          _hover={{ bg: 'gray.200' }}
        >
          <Icon as={FaHourglassHalf} mr={3} />
          New Complaints
        </Link>
        <Link
          as={RouterLink}
          to="/admin/status/open-complaints"
          display="flex"
          alignItems="center"
          w="100%"
          p={2}
          borderRadius="md"
          _hover={{ bg: 'gray.200' }}
        >
          <Icon as={FaCheckCircle} mr={3} />
          Pending Complaints
        </Link>
        <Link
          as={RouterLink}
          to="/admin/status/closed-complaints"
          display="flex"
          alignItems="center"
          w="100%"
          p={2}
          borderRadius="md"
          _hover={{ bg: 'gray.200' }}
        >
          <Icon as={FaTimesCircle} mr={3} />
          Closed Complaints
        </Link>
      </VStack>
    </Box>
  );
};

export default AdminSidebar;
