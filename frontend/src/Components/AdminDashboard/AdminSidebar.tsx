import React, { useEffect } from 'react';
import { Box, Flex, Avatar, Text, VStack, Link, Icon, Divider, Heading, useBreakpointValue } from '@chakra-ui/react';
import { FaHourglassHalf, FaCheckCircle, FaTimesCircle, FaHome, FaFilter, FaRegEdit, FaUsers } from 'react-icons/fa';
import { Link as RouterLink, useNavigate, useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { RootState } from '../../Redux/store';
import { motion } from 'framer-motion';

// Create motion components
const MotionBox = motion(Box);
const MotionFlex = motion(Flex);
const MotionVStack = motion(VStack);

const AdminSidebar: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user: loginUser, isLoggedIn } = useSelector((state: RootState) => state.loginUser);
  
  // Responsive adjustments
  const isMobile = useBreakpointValue({ base: true, md: false });
  const sidebarWidth = useBreakpointValue({ base: "100%", md: "280px" });
  const showFooter = useBreakpointValue({ base: false, md: true });
  
  useEffect(() => {
    if (!isLoggedIn || (loginUser && loginUser.employee_role !== 'admin')) {
      navigate('/');
    }
  }, [isLoggedIn, loginUser, navigate]);

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { 
        staggerChildren: 0.1 
      } 
    }
  };
  
  const itemVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: { opacity: 1, x: 0 }
  };

  // Check if link is active
  const isActive = (path: string) => {
    return location.pathname === "/admin" + path;
  };

  return (
    <MotionBox
      initial="hidden"
      animate="visible"
      variants={containerVariants}
      w={sidebarWidth}
      p={6}
      bg="white"
      h={isMobile ? "auto" : "100vh"}
      boxShadow={isMobile ? "none" : "sm"}
      borderRight={isMobile ? "none" : "1px solid"}
      borderColor="gray.100"
      fontFamily="'Inter', sans-serif"
      overflowY="auto"
      position="relative"
    >
      {/* Only show profile section on desktop or at the top of mobile sidebar */}
      {(!isMobile || true) && (
        <>
          <MotionFlex 
            variants={itemVariants}
            align="center" 
            mb={8} 
            direction="column"
          >
            <Avatar 
              name={loginUser ? loginUser.employee_name : ""} 
              src="/assets/admin-profile.png" 
              size={isMobile ? "md" : "xl"} 
              mb={4}
              bg="purple.500"
            />
            <Heading size="sm" fontWeight="medium" textAlign="center">
              {loginUser ? loginUser.employee_name : ""}
            </Heading>
            <Text fontSize="sm" color="gray.500" mt={1}>
              Administrator
            </Text>
          </MotionFlex>
          
          <Divider borderColor="gray.200" mb={6} />
        </>
      )}
      
      <MotionVStack align="start" spacing={1} variants={containerVariants}>
        <MotionBox variants={itemVariants} width="100%">
          <Link
            as={RouterLink}
            to="/admin"
            display="flex"
            alignItems="center"
            w="100%"
            p={3}
            borderRadius="md"
            bg={isActive("") ? "purple.50" : "transparent"}
            color={isActive("") ? "purple.700" : "gray.700"}
            fontWeight={isActive("") ? "medium" : "normal"}
            _hover={{ bg: "gray.50", color: "purple.700" }}
            transition="all 0.2s"
          >
            <Icon as={FaHome} mr={3} />
            Dashboard
          </Link>
        </MotionBox>

        <MotionBox variants={itemVariants} width="100%">
          <Link
            as={RouterLink}
            to="/admin/register-complaint"
            display="flex"
            alignItems="center"
            w="100%"
            p={3}
            borderRadius="md"
            bg={isActive("/register-complaint") ? "purple.50" : "transparent"}
            color={isActive("/register-complaint") ? "purple.700" : "gray.700"}
            fontWeight={isActive("/register-complaint") ? "medium" : "normal"}
            _hover={{ bg: "gray.50", color: "purple.700" }}
            transition="all 0.2s"
          >
            <Icon as={FaRegEdit} mr={3} />
            Register a Complaint
          </Link>
        </MotionBox>
        
        <MotionBox variants={itemVariants} width="100%" mt={6} mb={2} pl={3}>
          <Heading size="xs" color="gray.500">
            COMPLAINT MANAGEMENT
          </Heading>
        </MotionBox>
        
        <MotionBox variants={itemVariants} width="100%">
          <Link
            as={RouterLink}
            to="/admin/status/new-complaints"
            display="flex"
            alignItems="center"
            w="100%"
            p={3}
            borderRadius="md"
            bg={isActive("/status/new-complaints") ? "purple.50" : "transparent"}
            color={isActive("/status/new-complaints") ? "purple.700" : "gray.700"}
            fontWeight={isActive("/status/new-complaints") ? "medium" : "normal"}
            _hover={{ bg: "gray.50", color: "purple.700" }}
            transition="all 0.2s"
          >
            <Icon as={FaHourglassHalf} mr={3} />
            New Complaints
          </Link>
        </MotionBox>
        
        <MotionBox variants={itemVariants} width="100%">
          <Link
            as={RouterLink}
            to="/admin/status/open-complaints"
            display="flex"
            alignItems="center"
            w="100%"
            p={3}
            borderRadius="md"
            bg={isActive("/status/open-complaints") ? "purple.50" : "transparent"}
            color={isActive("/status/open-complaints") ? "purple.700" : "gray.700"}
            fontWeight={isActive("/status/open-complaints") ? "medium" : "normal"}
            _hover={{ bg: "gray.50", color: "purple.700" }}
            transition="all 0.2s"
          >
            <Icon as={FaCheckCircle} mr={3} />
            Pending Complaints
          </Link>
        </MotionBox>
        
        <MotionBox variants={itemVariants} width="100%">
          <Link
            as={RouterLink}
            to="/admin/status/closed-complaints"
            display="flex"
            alignItems="center"
            w="100%"
            p={3}
            borderRadius="md"
            bg={isActive("/status/closed-complaints") ? "purple.50" : "transparent"}
            color={isActive("/status/closed-complaints") ? "purple.700" : "gray.700"}
            fontWeight={isActive("/status/closed-complaints") ? "medium" : "normal"}
            _hover={{ bg: "gray.50", color: "purple.700" }}
            transition="all 0.2s"
          >
            <Icon as={FaTimesCircle} mr={3} />
            Closed Complaints
          </Link>
        </MotionBox>
        
        <MotionBox variants={itemVariants} width="100%">
          <Link
            as={RouterLink}
            to="/admin/filterComplaints"
            display="flex"
            alignItems="center"
            w="100%"
            p={3}
            borderRadius="md"
            bg={isActive("/filterComplaints") ? "purple.50" : "transparent"}
            color={isActive("/filterComplaints") ? "purple.700" : "gray.700"}
            fontWeight={isActive("/filterComplaints") ? "medium" : "normal"}
            _hover={{ bg: "gray.50", color: "purple.700" }}
            transition="all 0.2s"
          >
            <Icon as={FaFilter} mr={3} />
            Filter Complaints
          </Link>
        </MotionBox>
        
        <MotionBox variants={itemVariants} width="100%" mt={6} mb={2} pl={3}>
          <Heading size="xs" color="gray.500">
            ADMINISTRATION
          </Heading>
        </MotionBox>
        
        <MotionBox variants={itemVariants} width="100%">
          <Link
            as={RouterLink}
            to="/admin/user-management"
            display="flex"
            alignItems="center"
            w="100%"
            p={3}
            borderRadius="md"
            bg={isActive("/user-management") ? "purple.50" : "transparent"}
            color={isActive("/user-management") ? "purple.700" : "gray.700"}
            fontWeight={isActive("/user-management") ? "medium" : "normal"}
            _hover={{ bg: "gray.50", color: "purple.700" }}
            transition="all 0.2s"
          >
            <Icon as={FaUsers} mr={3} />
            User Management
          </Link>
        </MotionBox>
      </MotionVStack>
      
      {showFooter && (
        <Text 
          fontSize="xs" 
          color="gray.400" 
          position="absolute" 
          bottom="4" 
          left="0" 
          width="100%" 
          textAlign="center"
        >
          THDC Admin Portal
        </Text>
      )}
    </MotionBox>
  );
};

export default AdminSidebar; 