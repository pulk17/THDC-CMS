import React, { useEffect } from "react";
import {
  Box,
  Flex,
  Avatar,
  Text,
  VStack,
  Link,
  Icon,
  Divider,
  Heading,
  useBreakpointValue,
} from "@chakra-ui/react";
import {
  FaRegEdit,
  FaList,
  FaCheckCircle,
  FaTimesCircle,
  FaArrowRight,
  FaHome,
} from "react-icons/fa";
import { Link as RouterLink, useNavigate, useLocation } from "react-router-dom";
import { useSelector } from "react-redux";
import { RootState } from "../../Redux/store";
import { motion } from "framer-motion";

// Create motion components
const MotionBox = motion(Box);
const MotionFlex = motion(Flex);
const MotionVStack = motion(VStack);

const Sidebar: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const {
    user: lu,
    isLoggedIn,
  } = useSelector((state: RootState) => state.loginUser);
  
  // Responsive adjustments
  const isMobile = useBreakpointValue({ base: true, md: false });
  const sidebarWidth = useBreakpointValue({ base: "100%", md: "280px" });
  const showFooter = useBreakpointValue({ base: false, md: true });
  
  useEffect(() => {
    if (!isLoggedIn) {
      navigate("/");
    }
  }, [isLoggedIn, navigate]);

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
    return location.pathname === "/employee" + path;
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
              name={lu ? lu.employee_name : ""} 
              src="/assets/profile.png" 
              size={isMobile ? "md" : "xl"} 
              mb={4}
              bg="teal.500"
            />
            <Heading size="sm" fontWeight="medium" textAlign="center">
              {lu && lu.employee_name}
            </Heading>
            <Text fontSize="sm" color="gray.500" mt={1}>
              Employee
            </Text>
          </MotionFlex>
          
          <Divider borderColor="gray.200" mb={6} />
        </>
      )}
      
      <MotionVStack align="start" spacing={1} variants={containerVariants}>
        <MotionBox variants={itemVariants} width="100%">
          <Link
            as={RouterLink}
            to=""
            display="flex"
            alignItems="center"
            w="100%"
            p={3}
            borderRadius="md"
            bg={isActive("") ? "teal.50" : "transparent"}
            color={isActive("") ? "teal.700" : "gray.700"}
            fontWeight={isActive("") ? "medium" : "normal"}
            _hover={{ bg: "gray.50", color: "teal.700" }}
            transition="all 0.2s"
          >
            <Icon as={FaHome} mr={3} />
            Dashboard
          </Link>
        </MotionBox>
        
        <MotionBox variants={itemVariants} width="100%">
          <Link
            as={RouterLink}
            to="register-complaint"
            display="flex"
            alignItems="center"
            w="100%"
            p={3}
            borderRadius="md"
            bg={isActive("/register-complaint") ? "teal.50" : "transparent"}
            color={isActive("/register-complaint") ? "teal.700" : "gray.700"}
            fontWeight={isActive("/register-complaint") ? "medium" : "normal"}
            _hover={{ bg: "gray.50", color: "teal.700" }}
            transition="all 0.2s"
          >
            <Icon as={FaRegEdit} mr={3} />
            Register a Complaint
          </Link>
        </MotionBox>
        
        <MotionBox variants={itemVariants} width="100%" mt={6} mb={2} pl={3}>
          <Heading size="xs" color="gray.500">
            COMPLAINT STATUS
          </Heading>
        </MotionBox>
        
        <MotionBox variants={itemVariants} width="100%">
          <Link
            as={RouterLink}
            to="status/all-complaints"
            display="flex"
            alignItems="center"
            w="100%"
            p={3}
            borderRadius="md"
            bg={isActive("/status/all-complaints") ? "teal.50" : "transparent"}
            color={isActive("/status/all-complaints") ? "teal.700" : "gray.700"}
            fontWeight={isActive("/status/all-complaints") ? "medium" : "normal"}
            _hover={{ bg: "gray.50", color: "teal.700" }}
            transition="all 0.2s"
          >
            <Icon as={FaList} mr={3} />
            All Complaints
          </Link>
        </MotionBox>
        
        <MotionBox variants={itemVariants} width="100%">
          <Link
            as={RouterLink}
            to="status/open-complaints"
            display="flex"
            alignItems="center"
            w="100%"
            p={3}
            borderRadius="md"
            bg={isActive("/status/open-complaints") ? "teal.50" : "transparent"}
            color={isActive("/status/open-complaints") ? "teal.700" : "gray.700"}
            fontWeight={isActive("/status/open-complaints") ? "medium" : "normal"}
            _hover={{ bg: "gray.50", color: "teal.700" }}
            transition="all 0.2s"
          >
            <Icon as={FaArrowRight} mr={3} />
            Open Complaints
          </Link>
        </MotionBox>
        
        <MotionBox variants={itemVariants} width="100%">
          <Link
            as={RouterLink}
            to="status/closed-complaints"
            display="flex"
            alignItems="center"
            w="100%"
            p={3}
            borderRadius="md"
            bg={isActive("/status/closed-complaints") ? "teal.50" : "transparent"}
            color={isActive("/status/closed-complaints") ? "teal.700" : "gray.700"}
            fontWeight={isActive("/status/closed-complaints") ? "medium" : "normal"}
            _hover={{ bg: "gray.50", color: "teal.700" }}
            transition="all 0.2s"
          >
            <Icon as={FaTimesCircle} mr={3} />
            Closed Complaints
          </Link>
        </MotionBox>
        
        <MotionBox variants={itemVariants} width="100%">
          <Link
            as={RouterLink}
            to="arrive-complaints"
            display="flex"
            alignItems="center"
            w="100%"
            p={3}
            borderRadius="md"
            bg={isActive("/arrive-complaints") ? "teal.50" : "transparent"}
            color={isActive("/arrive-complaints") ? "teal.700" : "gray.700"}
            fontWeight={isActive("/arrive-complaints") ? "medium" : "normal"}
            _hover={{ bg: "gray.50", color: "teal.700" }}
            transition="all 0.2s"
          >
            <Icon as={FaCheckCircle} mr={3} />
            Assigned Complaints
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
          THDC Complaint Management System
        </Text>
      )}
    </MotionBox>
  );
};

export default Sidebar; 