import React from 'react';
import { Box, Flex } from '@chakra-ui/react';
import { Outlet } from 'react-router-dom';
import AdminSidebar from './AdminSidebar';

const AdminLayout = () => {
  return (
    <Flex>
      <AdminSidebar />
      <Box flex="1" p={5} bg="gray.50" h="100vh">
        <Outlet />
      </Box>
    </Flex>
  );
};

export default AdminLayout;
