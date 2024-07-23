import React, { useState, useEffect } from 'react';
import { Text, Button, FormControl, FormLabel, Input, InputGroup, InputRightElement, VStack, CloseButton, Heading, Flex } from '@chakra-ui/react';
import { Box, Alert, AlertIcon } from '@chakra-ui/react';
import { useDispatch, useSelector } from 'react-redux';
import { loginAsAdmin, loginAsEmployee } from '../../../Redux/Actions/AuthAction';
import {useNavigate} from 'react-router-dom'

const LoginEmployee = () => {
    const [show, setShow] = useState(false);
    const [employee_id, setEmployee_id] = useState('');
    const [employee_password, setEmployee_password] = useState('');
    const [showAlert, setShowAlert] = useState(false);

    const handlePasswordShow = () => setShow(!show);

    const dispatch = useDispatch();
    const navigate = useNavigate();

    const submitLoginUpForm = () => {
        dispatch(loginAsAdmin(employee_id, employee_password));
    }

    const { loading, user: loginUser, isLoggedIn:isLoggedInAdmin, error } = useSelector((state) => state.loginAdmin);

    useEffect(()=>{
        if(isLoggedInAdmin){
            navigate('/admin/status/new-complaints')
        }
    },[isLoggedInAdmin])

    const onClose = () => setShowAlert(false);

    useEffect(() => {
        if (error) {
            setShowAlert(true);
        }
    }, [error]);

    return (
        <Flex
            height="100vh"
            alignItems="center"
            justifyContent="center"
            bg="gray.50"
        >
            <Box
                w={{ base: '90%', md: '500px' }}
                p={8}
                borderWidth={1}
                borderRadius={8}
                boxShadow="lg"
                bg="white"
            >
                <VStack spacing={5} color="black">
                    <Heading as="h1" size="lg" mb={6} textAlign="center">
                        Admin Login
                    </Heading>
                    <FormControl id="employee_id" isRequired>
                        <FormLabel>Employee Id</FormLabel>
                        <Input
                            mb="1rem"
                            value={employee_id}
                            placeholder="Enter Your Employee Id"
                            onChange={(e) => setEmployee_id(e.target.value)}
                        />
                    </FormControl>
                    <FormControl id="password" isRequired>
                        <FormLabel>Password</FormLabel>
                        <InputGroup>
                            <Input
                                value={employee_password}
                                mb="1rem"
                                type={show ? 'text' : 'password'}
                                placeholder="Enter Your Password"
                                onChange={(e) => setEmployee_password(e.target.value)}
                            />
                            <InputRightElement width="4.5rem">
                                <Button h="1.75rem" size="sm" onClick={handlePasswordShow}>
                                    {show ? "Hide" : "Show"}
                                </Button>
                            </InputRightElement>
                        </InputGroup>
                    </FormControl>
                    {showAlert && error && error.length > 0 && (
                        <Alert status="error" display="flex" justifyContent="space-between" alignItems="center">
                            <Box display="flex" alignItems="center">
                                <AlertIcon />
                                <Text fontFamily="Nunito">{error}</Text>
                            </Box>
                            <CloseButton onClick={onClose} />
                        </Alert>
                    )}
                    <Button
                        colorScheme="blue"
                        isLoading={loading}
                        width="100%"
                        mt={4}
                        onClick={submitLoginUpForm}
                    >
                        Login
                    </Button>
                </VStack>
            </Box>
        </Flex>
    );
};

export default LoginEmployee;
