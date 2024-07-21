import React from 'react';
import { Box, Flex, Avatar, Text, VStack, Link, Icon, Divider, Accordion, AccordionItem, AccordionButton, AccordionPanel, AccordionIcon } from '@chakra-ui/react';
import { FaRegEdit, FaList, FaCheckCircle, FaTimesCircle, FaArrowRight } from 'react-icons/fa';
import { Link as RouterLink } from 'react-router-dom';

const Sidebar = () => {
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
        <Avatar src="/assets/profile.png" size="xl" mb={4} />
        <Text fontSize="lg" fontWeight="bold">John Doe</Text>
      </Flex>
      <Divider borderColor="gray.300" mb={4} />
      <VStack align="start" spacing={4}>
        <Link
          as={RouterLink}
          to="register-complaint"
          display="flex"
          alignItems="center"
          w="100%"
          p={2}
          borderRadius="md"
          _hover={{ bg: 'gray.200' }}
        >
          <Icon as={FaRegEdit} mr={3} />
          Register a Complaint
        </Link>
        <Accordion allowToggle>
          <AccordionItem border="none">
            <AccordionButton
              _expanded={{ bg: 'gray.200' }}
              _hover={{ bg: 'gray.200' }}
              p={2}
              borderRadius="md"
              display="flex"
              alignItems="center"
              w="100%"
              whiteSpace="nowrap" // Prevent text from wrapping
              overflow="hidden"   // Hide overflow text
              textOverflow="ellipsis" // Add ellipsis to overflow text
            >
              <Icon as={FaList} mr={3} />
              <Text flex="1" textAlign="left">Status of Complaints</Text>
              <AccordionIcon />
            </AccordionButton>
            <AccordionPanel p={0}>
              <VStack align="start" spacing={2} pl={8} mt={2}>
                <Link
                  as={RouterLink}
                  to="status/all-complaints"
                  display="flex"
                  alignItems="center"
                  w="100%"
                  p={2}
                  borderRadius="md"
                  _hover={{ bg: 'gray.200' }}
                >
                  <Icon as={FaList} mr={2} />
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
                  _hover={{ bg: 'gray.200' }}
                >
                  <Icon as={FaArrowRight} mr={2} />
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
                  _hover={{ bg: 'gray.200' }}
                >
                  <Icon as={FaTimesCircle} mr={2} />
                  Closed Complaints
                </Link>
              </VStack>
            </AccordionPanel>
          </AccordionItem>
        </Accordion>
        <Link
          as={RouterLink}
          to="arrive-complaints"
          display="flex"
          alignItems="center"
          w="100%"
          p={2}
          borderRadius="md"
          _hover={{ bg: 'gray.200' }}
        >
          <Icon as={FaCheckCircle} mr={3} />
          Arrive Complaints
        </Link>
      </VStack>
    </Box>
  );
};

export default Sidebar;
