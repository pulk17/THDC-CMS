import React, { useContext, useEffect, useState } from "react";
import {
  Box,
  Text,
  HStack,
  Button,
  Select,
  Input,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  TableContainer,
  Tag,
  useToast,
  VStack,
  FormControl,
  FormLabel,
} from "@chakra-ui/react";
import moment from "moment";
import { AdminContext } from "../context/AdminContext";
import { useDispatch, useSelector } from "react-redux";
import AdminComplaintDetailModal from "./AdminUpdateDetailModal";
import { filterComplaintAction } from "../../Redux/Actions/ComplaintAction";

const FilterComplaint = () => {
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [filteredComplaints, setFilteredComplaints] = useState([]);
  const toast = useToast();
  const dispatch = useDispatch();

  const handleFilter = () => {
    const formatDate = (dateString) => {
      const date = new Date(dateString);
      const day = date.getDate().toString().padStart(2, "0");
      const month = (date.getMonth() + 1).toString().padStart(2, "0");
      const year = date.getFullYear().toString().substr(-2);
      return `${day}/${month}/${year}`;
    };

    const formattedStartDate = formatDate(startDate);
    const formattedEndDate = formatDate(endDate);

    dispatch(
      filterComplaintAction(formattedStartDate, formattedEndDate, statusFilter)
    );
  };
  const handleAssign = (assignedTo) => {
    console.log(`Assigned to: ${assignedTo}`);
  };

  const [currentComplaint, setCurrentComplaint] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const formatDate = (dateString) => {
    return moment(dateString).format("MMMM D, YYYY h:mm A"); // Format as "July 22, 2024 7:19 AM"
  };

  const handleViewDetails = (complaint) => {
    setCurrentComplaint(complaint);
    setIsModalOpen(true);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "Opened":
        return "green";
      case "Closed":
        return "red";
      case "Processing":
        return "yellow";
      default:
        return "gray";
    }
  };

  const {
    complaints,
    isFiltered,
    loading: filterLoading,
  } = useSelector((state) => state.filterComplaints);

  useEffect(() => {
    if (Array.isArray(complaints)) {
      setFilteredComplaints([...complaints]);
    } else {
      setFilteredComplaints([]);
    }
  }, [complaints]);

  return (
    <Box
      p={5}
      fontFamily="'Nunito', sans-serif"
      bg="gray.50"
      borderRadius="md"
      boxShadow="md"
      maxW="100vw"
      overflow="hidden"
    >
      <VStack spacing={6} align="stretch">
        <Text fontSize="2xl" fontWeight="bold" color="teal.500" mb={4}>
          Filter Complaints
        </Text>
        <HStack spacing={4} mb={4} align="center">
          <Box flex="1">
            <FormControl>
              <FormLabel fontSize="sm" mb={1}>
                Start Date
              </FormLabel>
              <Input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                bg="white"
                borderColor="gray.300"
                _hover={{ borderColor: "teal.500" }}
                _focus={{
                  borderColor: "teal.500",
                  boxShadow: "0 0 0 1px teal.500",
                }}
              />
            </FormControl>
          </Box>
          <Box flex="1">
            <FormControl>
              <FormLabel fontSize="sm" mb={1}>
                End Date
              </FormLabel>
              <Input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                bg="white"
                borderColor="gray.300"
                _hover={{ borderColor: "teal.500" }}
                _focus={{
                  borderColor: "teal.500",
                  boxShadow: "0 0 0 1px teal.500",
                }}
              />
            </FormControl>
          </Box>
          <Box flex="1">
            <FormControl>
              <FormLabel fontSize="sm" mb={1}>
                Status
              </FormLabel>
              <Select
                placeholder="Select status"
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                bg="white"
                borderColor="gray.300"
                _hover={{ borderColor: "teal.500" }}
                _focus={{
                  borderColor: "teal.500",
                  boxShadow: "0 0 0 1px teal.500",
                }}
              >
                <option value="Opened">Opened</option>
                <option value="Processing">Processing</option>
                <option value="Closed">Closed</option>
              </Select>
            </FormControl>
          </Box>
        </HStack>
        <Button
          isLoading={filterLoading}
          mt={4}
          colorScheme="teal"
          onClick={handleFilter}
          width="full"
        >
          Apply Filters
        </Button>

        <Box overflowX="auto">
          <TableContainer
            bg="white"
            borderRadius="md"
            boxShadow="md"
            maxW="100%"
          >
            <Table variant="simple">
              <Thead bg="gray.100">
                <Tr>
                  <Th>Complaint Id</Th>
                  <Th>Assets Type</Th>
                  <Th>Complaint Text</Th>
                  <Th>Location</Th>
                  <Th>Created Date</Th>
                  <Th>Status</Th>
                  <Th>Actions</Th>
                </Tr>
              </Thead>
              <Tbody>
                {Array.isArray(filteredComplaints) &&
                filteredComplaints.length > 0 ? (
                  filteredComplaints.map((complaint) => (
                    <Tr key={complaint.complaint_id}>
                      <Td>{complaint.complaint_id}</Td>
                      <Td>{complaint.complaint_asset}</Td>
                      <Td>{complaint.complain_details}</Td>
                      <Td>{complaint.employee_location}</Td>
                      <Td>{formatDate(complaint.created_date)}</Td>
                      <Td>
                        <Tag colorScheme={getStatusColor(complaint.status)}>
                          {complaint.status}
                        </Tag>
                      </Td>
                      <Td>
                        <Button
                          onClick={() => handleViewDetails(complaint)}
                          colorScheme="blue"
                          size="sm"
                        >
                          View
                        </Button>
                      </Td>
                    </Tr>
                  ))
                ) : (
                  <Tr>
                    <Td colSpan="7" textAlign="center">
                      No complaints match the above filters
                    </Td>
                  </Tr>
                )}
              </Tbody>
            </Table>
          </TableContainer>
        </Box>
        {currentComplaint && (
          <AdminComplaintDetailModal
            isOpen={isModalOpen}
            onClose={() => setIsModalOpen(false)}
            complaintDetail={currentComplaint}
            onAssign={handleAssign}
          />
        )}
      </VStack>
    </Box>
  );
};

export default FilterComplaint;
