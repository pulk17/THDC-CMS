import React, { useState, useEffect } from 'react';
import {
  Box,
  Heading,
  Button,
  FormControl,
  FormLabel,
  Input,
  VStack,
  HStack,
  useToast,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  TableContainer,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  useDisclosure,
  Text,
  Badge,
  AlertDialog,
  AlertDialogBody,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogContent,
  AlertDialogOverlay,
} from '@chakra-ui/react';
import { useSelector } from 'react-redux';
import { RootState } from '../../Redux/store';
import api from '../../api/axios';
import AdminUpdateUserModal from './AdminUpdateUserModal';

interface User {
  _id: string;
  employee_id: string;
  employee_name: string;
  employee_email: string;
  employee_department: string;
  employee_designation: string;
  employee_location: string;
  employee_role: string;
  is_Employee_Worker: boolean;
}

interface NewAdminData {
  employee_id: string;
  employee_name: string;
  employee_email: string;
  employee_department: string;
  employee_designation: string;
  employee_location: string;
  employee_password: string;
  admin_registration_code: string;
}

const AdminManagement: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [userToDelete, setUserToDelete] = useState<User | null>(null);
  const [userToEdit, setUserToEdit] = useState<User | null>(null);
  const [newAdmin, setNewAdmin] = useState<NewAdminData>({
    employee_id: '',
    employee_name: '',
    employee_email: '',
    employee_department: '',
    employee_designation: '',
    employee_location: '',
    employee_password: '',
    admin_registration_code: '',
  });
  
  const { isOpen: isCreateModalOpen, onOpen: onCreateModalOpen, onClose: onCreateModalClose } = useDisclosure();
  const { isOpen: isDeleteAlertOpen, onOpen: onDeleteAlertOpen, onClose: onDeleteAlertClose } = useDisclosure();
  const { isOpen: isEditModalOpen, onOpen: onEditModalOpen, onClose: onEditModalClose } = useDisclosure();
  const cancelRef = React.useRef<HTMLButtonElement>(null);
  
  const toast = useToast();
  const { user: currentUser } = useSelector((state: RootState) => state.loginUser);
  
  // Fetch all users
  const fetchUsers = async () => {
    try {
      setLoading(true);
      const { data } = await api.get('/admin/getAllUsers');
      setUsers(data.users);
      setLoading(false);
    } catch (error: any) {
      setError(error.response?.data?.message || 'Failed to fetch users');
      setLoading(false);
      toast({
        title: 'Error',
        description: error.response?.data?.message || 'Failed to fetch users',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    }
  };
  
  useEffect(() => {
    fetchUsers();
  }, []);  // eslint-disable-line react-hooks/exhaustive-deps
  
  // Handle input change for new admin form
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setNewAdmin({
      ...newAdmin,
      [name]: value,
    });
  };
  
  // Create new admin
  const handleCreateAdmin = async () => {
    // Validate required fields
    const requiredFields = [
      'employee_id', 
      'employee_name', 
      'employee_email', 
      'employee_department', 
      'employee_designation', 
      'employee_location', 
      'employee_password', 
      'admin_registration_code'
    ];
    
    const missingFields = requiredFields.filter(field => !newAdmin[field as keyof NewAdminData]);
    
    if (missingFields.length > 0) {
      toast({
        title: 'Missing Fields',
        description: `Please fill all required fields: ${missingFields.join(', ')}`,
        status: 'warning',
        duration: 5000,
        isClosable: true,
      });
      return;
    }
    
    try {
      setLoading(true);
      
      // Validate email format
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(newAdmin.employee_email)) {
        throw new Error('Please enter a valid email address');
      }
      
      // Validate employee ID is a number
      if (isNaN(Number(newAdmin.employee_id))) {
        throw new Error('Employee ID must be a number');
      }
      
      console.log('Sending admin registration request:', {
        ...newAdmin,
        admin_registration_code: '[HIDDEN]' // Don't log the secret code
      });
      
      const response = await api.post('/admin/register', newAdmin);
      console.log('Admin registration response:', response.data);
      
      toast({
        title: 'Success',
        description: 'Admin account created successfully',
        status: 'success',
        duration: 5000,
        isClosable: true,
      });
      
      // Reset form and close modal
      setNewAdmin({
        employee_id: '',
        employee_name: '',
        employee_email: '',
        employee_department: '',
        employee_designation: '',
        employee_location: '',
        employee_password: '',
        admin_registration_code: '',
      });
      onCreateModalClose();
      
      // Refresh user list
      fetchUsers();
    } catch (error: any) {
      console.error('Admin registration error:', error);
      const errorMessage = error.response?.data?.message || error.message || 'Failed to create admin account';
      
      toast({
        title: 'Error',
        description: errorMessage,
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    } finally {
      setLoading(false);
    }
  };
  
  // Delete user
  const handleDeleteUser = async () => {
    if (!userToDelete) return;
    
    try {
      setLoading(true);
      await api.delete(`/admin/deleteUser/${userToDelete._id}`);
      
      toast({
        title: 'Success',
        description: `User ${userToDelete.employee_name} deleted successfully`,
        status: 'success',
        duration: 5000,
        isClosable: true,
      });
      
      // Close alert and refresh user list
      onDeleteAlertClose();
      fetchUsers();
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.response?.data?.message || 'Failed to delete user',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    } finally {
      setLoading(false);
      setUserToDelete(null);
    }
  };
  
  // Open delete confirmation
  const openDeleteConfirmation = (user: User) => {
    setUserToDelete(user);
    onDeleteAlertOpen();
  };
  
  // Open edit modal
  const openEditModal = (user: User) => {
    setUserToEdit(user);
    onEditModalOpen();
  };
  
  return (
    <Box p={5}>
      <VStack spacing={5} align="stretch">
        <HStack justifyContent="space-between">
          <Heading size="lg">User Management</Heading>
          <Button colorScheme="teal" onClick={onCreateModalOpen}>
            Create Admin Account
          </Button>
        </HStack>
        
        {loading && users.length === 0 ? (
          <Text textAlign="center" py={10}>Loading users...</Text>
        ) : error ? (
          <Text color="red.500" textAlign="center">{error}</Text>
        ) : (
          <TableContainer>
            <Table variant="simple">
              <Thead>
                <Tr>
                  <Th>Employee ID</Th>
                  <Th>Name</Th>
                  <Th>Email</Th>
                  <Th>Department</Th>
                  <Th>Role</Th>
                  <Th>Worker</Th>
                  <Th>Actions</Th>
                </Tr>
              </Thead>
              <Tbody>
                {users.map((user) => (
                  <Tr key={user._id}>
                    <Td>{user.employee_id}</Td>
                    <Td>{user.employee_name}</Td>
                    <Td>{user.employee_email}</Td>
                    <Td>{user.employee_department}</Td>
                    <Td>
                      <Badge colorScheme={user.employee_role === 'admin' ? 'purple' : 'green'}>
                        {user.employee_role}
                      </Badge>
                    </Td>
                    <Td>
                      <Badge colorScheme={user.is_Employee_Worker ? 'blue' : 'gray'}>
                        {user.is_Employee_Worker ? 'Yes' : 'No'}
                      </Badge>
                    </Td>
                    <Td>
                      <HStack spacing={2}>
                        <Button 
                          colorScheme="blue" 
                          size="sm"
                          onClick={() => openEditModal(user)}
                        >
                          Edit
                        </Button>
                        <Button 
                          colorScheme="red" 
                          size="sm"
                          isDisabled={user._id === currentUser?._id} // Prevent deleting yourself
                          onClick={() => openDeleteConfirmation(user)}
                        >
                          Delete
                        </Button>
                      </HStack>
                    </Td>
                  </Tr>
                ))}
              </Tbody>
            </Table>
          </TableContainer>
        )}
      </VStack>
      
      {/* Create Admin Modal */}
      <Modal isOpen={isCreateModalOpen} onClose={onCreateModalClose} size="lg">
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Create Admin Account</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <VStack spacing={4}>
              <Text>
                Create a new administrator account. This account will have full access to the system.
                You'll need the admin registration code provided by the system administrator.
              </Text>
              
              <FormControl isRequired>
                <FormLabel>Employee ID</FormLabel>
                <Input
                  name="employee_id"
                  value={newAdmin.employee_id}
                  onChange={handleInputChange}
                  placeholder="Enter employee ID (numbers only)"
                  type="number"
                />
              </FormControl>
              
              <FormControl isRequired>
                <FormLabel>Full Name</FormLabel>
                <Input
                  name="employee_name"
                  value={newAdmin.employee_name}
                  onChange={handleInputChange}
                  placeholder="Enter full name"
                />
              </FormControl>
              
              <FormControl isRequired>
                <FormLabel>Email</FormLabel>
                <Input
                  name="employee_email"
                  value={newAdmin.employee_email}
                  onChange={handleInputChange}
                  placeholder="Enter email address"
                  type="email"
                />
              </FormControl>
              
              <HStack width="100%">
                <FormControl isRequired>
                  <FormLabel>Department</FormLabel>
                  <Input
                    name="employee_department"
                    value={newAdmin.employee_department}
                    onChange={handleInputChange}
                    placeholder="Enter department"
                  />
                </FormControl>
                
                <FormControl isRequired>
                  <FormLabel>Designation</FormLabel>
                  <Input
                    name="employee_designation"
                    value={newAdmin.employee_designation}
                    onChange={handleInputChange}
                    placeholder="Enter designation"
                  />
                </FormControl>
              </HStack>
              
              <FormControl isRequired>
                <FormLabel>Location</FormLabel>
                <Input
                  name="employee_location"
                  value={newAdmin.employee_location}
                  onChange={handleInputChange}
                  placeholder="Enter location"
                />
              </FormControl>
              
              <FormControl isRequired>
                <FormLabel>Password</FormLabel>
                <Input
                  name="employee_password"
                  value={newAdmin.employee_password}
                  onChange={handleInputChange}
                  placeholder="Enter password"
                  type="password"
                />
              </FormControl>
              
              <FormControl isRequired>
                <FormLabel>Admin Registration Code</FormLabel>
                <Input
                  name="admin_registration_code"
                  value={newAdmin.admin_registration_code}
                  onChange={handleInputChange}
                  placeholder="Enter admin registration code"
                  type="password"
                />
                <Text fontSize="sm" color="gray.500" mt={1}>
                  This is a special code provided by the system administrator. If you don't have it, please contact IT support.
                </Text>
              </FormControl>
            </VStack>
          </ModalBody>
          <ModalFooter>
            <Button variant="ghost" mr={3} onClick={onCreateModalClose}>
              Cancel
            </Button>
            <Button 
              colorScheme="teal" 
              onClick={handleCreateAdmin}
              isLoading={loading}
            >
              Create Admin
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
      
      {/* Delete User Confirmation */}
      <AlertDialog
        isOpen={isDeleteAlertOpen}
        leastDestructiveRef={cancelRef}
        onClose={onDeleteAlertClose}
      >
        <AlertDialogOverlay>
          <AlertDialogContent>
            <AlertDialogHeader fontSize="lg" fontWeight="bold">
              Delete User
            </AlertDialogHeader>

            <AlertDialogBody>
              Are you sure you want to delete {userToDelete?.employee_name}? This action cannot be undone.
            </AlertDialogBody>

            <AlertDialogFooter>
              <Button ref={cancelRef} onClick={onDeleteAlertClose}>
                Cancel
              </Button>
              <Button colorScheme="red" onClick={handleDeleteUser} ml={3} isLoading={loading}>
                Delete
              </Button>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialogOverlay>
      </AlertDialog>
      
      {/* Edit User Modal */}
      <AdminUpdateUserModal 
        isOpen={isEditModalOpen}
        onClose={onEditModalClose}
        user={userToEdit}
        onUserUpdated={fetchUsers}
      />
    </Box>
  );
};

export default AdminManagement; 