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
  Accordion,
  AccordionItem,
  AccordionButton,
  AccordionPanel,
  AccordionIcon,
} from "@chakra-ui/react";
import {
  FaRegEdit,
  FaList,
  FaCheckCircle,
  FaTimesCircle,
  FaArrowRight,
} from "react-icons/fa";
import { Link as RouterLink, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";

const Sidebar = () => {
  const navigate = useNavigate();
  const {
    loading,
    user: lu,
    isLoggedIn,
    error,
  } = useSelector((state) => state.loginUser);
  useEffect(() => {
    if (!isLoggedIn) {
      navigate("/");
    }
  }, [isLoggedIn]);

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
        <Avatar name={lu ? lu.employee_name : ""} src="/assets/profile.png" size="xl" mb={4} />
        <Text fontSize="lg" fontWeight="bold">
          {lu && lu.employee_name}
        </Text>
      </Flex>
      <Divider borderColor="gray.300" mb={4} />
      <VStack align="start" spacing={4}>
      <Link
          as={RouterLink}
          to=""
          display="flex"
          alignItems="center"
          w="100%"
          p={2}
          borderRadius="md"
          _hover={{ bg: "gray.200" }}
        >
          <Icon as={FaArrowRight} mr={3} />
          Back To Home
        </Link>
        <Link
          as={RouterLink}
          to="register-complaint"
          display="flex"
          alignItems="center"
          w="100%"
          p={2}
          borderRadius="md"
          _hover={{ bg: "gray.200" }}
        >
          <Icon as={FaRegEdit} mr={3} />
          Register a Complaint
        </Link>
        <Link
          as={RouterLink}
          to="status/all-complaints"
          display="flex"
          alignItems="center"
          w="100%"
          p={2}
          borderRadius="md"
          _hover={{ bg: "gray.200" }}
        >
          <Icon as={FaList} mr={3} />
          All Complaints
        </Link>
        <Link
          as={RouterLink}
          to="status/open-complaints"
          display="flex"
          alignItems="center"
          w="100%"
          p={2}
          borderRadius="md"
          _hover={{ bg: "gray.200" }}
        >
          <Icon as={FaArrowRight} mr={3} />
          Open Complaints
        </Link>
        <Link
          as={RouterLink}
          to="status/closed-complaints"
          display="flex"
          alignItems="center"
          w="100%"
          p={2}
          borderRadius="md"
          _hover={{ bg: "gray.200" }}
        >
          <Icon as={FaTimesCircle} mr={3} />
          Closed Complaints
        </Link>
        <Link
          as={RouterLink}
          to="arrive-complaints"
          display="flex"
          alignItems="center"
          w="100%"
          p={2}
          borderRadius="md"
          _hover={{ bg: "gray.200" }}
        >
          <Icon as={FaCheckCircle} mr={3} />
          Arrive Complaints
        </Link>
      </VStack>
    </Box>
  );
};

export default Sidebar;
