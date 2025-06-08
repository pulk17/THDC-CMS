import React, { useState } from 'react';
import {
  Box,
  Flex,
  IconButton,
  Drawer,
  DrawerBody,
  DrawerHeader,
  DrawerOverlay,
  DrawerContent,
  DrawerCloseButton,
  useDisclosure,
  Avatar,
  Text,
  Heading,
  useBreakpointValue,
} from '@chakra-ui/react';
import { HamburgerIcon } from '@chakra-ui/icons';
import { useSelector } from 'react-redux';
import { RootState } from '../../Redux/store';

interface ResponsiveNavbarProps {
  sidebarContent: React.ReactNode;
  colorScheme: 'teal' | 'purple'; // For employee or admin
  title: string;
}

const ResponsiveNavbar: React.FC<ResponsiveNavbarProps> = ({ sidebarContent, colorScheme, title }) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { user } = useSelector((state: RootState) => state.loginUser);
  
  // Show hamburger menu only on mobile
  const isMobile = useBreakpointValue({ base: true, md: false });

  return (
    <>
      {/* Mobile Header with Hamburger */}
      {isMobile && (
        <Flex
          as="header"
          align="center"
          justify="space-between"
          w="100%"
          px={4}
          py={3}
          bg={colorScheme === 'teal' ? 'teal.500' : 'purple.500'}
          color="white"
          boxShadow="md"
          position="sticky"
          top={0}
          zIndex={10}
        >
          <Flex align="center">
            <Avatar 
              name={user?.employee_name || ""} 
              src={colorScheme === 'teal' ? "/assets/profile.png" : "/assets/admin-profile.png"} 
              size="sm" 
              mr={3}
              bg={colorScheme === 'teal' ? 'teal.700' : 'purple.700'}
            />
            <Box>
              <Heading size="xs">{user?.employee_name || ""}</Heading>
              <Text fontSize="xs">{title}</Text>
            </Box>
          </Flex>
          
          <IconButton
            aria-label="Open menu"
            icon={<HamburgerIcon />}
            onClick={onOpen}
            variant="ghost"
            color="white"
            _hover={{ bg: colorScheme === 'teal' ? 'teal.600' : 'purple.600' }}
          />
        </Flex>
      )}

      {/* Sidebar Drawer for Mobile */}
      <Drawer isOpen={isOpen} placement="left" onClose={onClose} size="xs">
        <DrawerOverlay />
        <DrawerContent>
          <DrawerCloseButton />
          <DrawerHeader 
            bg={colorScheme === 'teal' ? 'teal.500' : 'purple.500'} 
            color="white"
          >
            {title}
          </DrawerHeader>
          <DrawerBody p={0}>
            {sidebarContent}
          </DrawerBody>
        </DrawerContent>
      </Drawer>
    </>
  );
};

export default ResponsiveNavbar; 