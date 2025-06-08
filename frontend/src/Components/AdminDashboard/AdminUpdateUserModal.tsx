import React, { useState } from 'react';
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  Button,
  FormControl,
  FormLabel,
  Input,
  VStack,
  Switch,
  FormHelperText,
  useToast,
  Text
} from '@chakra-ui/react';
import api from '../../api/axios';

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

interface AdminUpdateUserModalProps {
  isOpen: boolean;
  onClose: () => void;
  user: User | null;
  onUserUpdated: () => void;
}

const AdminUpdateUserModal: React.FC<AdminUpdateUserModalProps> = ({ 
  isOpen, 
  onClose, 
  user, 
  onUserUpdated 
}) => {
  const [formData, setFormData] = useState<Partial<User>>({});
  const [loading, setLoading] = useState(false);
  const toast = useToast();

  // Initialize form data when user changes
  React.useEffect(() => {
    if (user) {
      setFormData({
        employee_name: user.employee_name,
        employee_designation: user.employee_designation,
        employee_department: user.employee_department,
        employee_location: user.employee_location,
        is_Employee_Worker: user.is_Employee_Worker
      });
    }
  }, [user]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleSwitchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      is_Employee_Worker: e.target.checked
    });
  };

  const handleSubmit = async () => {
    if (!user) return;

    try {
      setLoading(true);
      
      await api.put('/admin/updateUser', {
        userId: user._id,
        ...formData
      });
      
      toast({
        title: 'Success',
        description: `User ${user.employee_name} updated successfully`,
        status: 'success',
        duration: 3000,
        isClosable: true,
      });
      
      onUserUpdated();
      onClose();
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.response?.data?.message || 'Failed to update user',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    } finally {
      setLoading(false);
    }
  };

  if (!user) return null;

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="lg">
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Edit User: {user.employee_name}</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <VStack spacing={4} align="stretch">
            <Text fontWeight="medium">Employee ID: {user.employee_id}</Text>
            <Text fontWeight="medium">Email: {user.employee_email}</Text>
            
            <FormControl>
              <FormLabel>Name</FormLabel>
              <Input
                name="employee_name"
                value={formData.employee_name || ''}
                onChange={handleInputChange}
                placeholder="Enter name"
              />
            </FormControl>
            
            <FormControl>
              <FormLabel>Designation</FormLabel>
              <Input
                name="employee_designation"
                value={formData.employee_designation || ''}
                onChange={handleInputChange}
                placeholder="Enter designation"
              />
            </FormControl>
            
            <FormControl>
              <FormLabel>Department</FormLabel>
              <Input
                name="employee_department"
                value={formData.employee_department || ''}
                onChange={handleInputChange}
                placeholder="Enter department"
              />
            </FormControl>
            
            <FormControl>
              <FormLabel>Location</FormLabel>
              <Input
                name="employee_location"
                value={formData.employee_location || ''}
                onChange={handleInputChange}
                placeholder="Enter location"
              />
            </FormControl>
            
            <FormControl display="flex" alignItems="center">
              <FormLabel htmlFor="is-worker" mb="0">
                Assign as Worker
              </FormLabel>
              <Switch
                id="is-worker"
                name="is_Employee_Worker"
                isChecked={formData.is_Employee_Worker}
                onChange={handleSwitchChange}
                colorScheme="teal"
                size="lg"
              />
              <FormHelperText ml={2}>
                Workers can be assigned to handle complaints. Only assign this role to employees who should handle maintenance tasks.
              </FormHelperText>
            </FormControl>
          </VStack>
        </ModalBody>
        <ModalFooter>
          <Button variant="ghost" mr={3} onClick={onClose}>
            Cancel
          </Button>
          <Button 
            colorScheme="blue" 
            onClick={handleSubmit}
            isLoading={loading}
          >
            Save Changes
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default AdminUpdateUserModal; 