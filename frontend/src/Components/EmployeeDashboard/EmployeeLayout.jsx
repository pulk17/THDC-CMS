import React from 'react';
import { Box, Flex } from '@chakra-ui/react';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';

const EmployeeLayout = () => {
  return (
    <Flex>
      <Sidebar />
      <Box flex="1" p={5} bg="gray.50" h="100vh">
        <Outlet />
      </Box>
    </Flex>
  );
};

export default EmployeeLayout;
