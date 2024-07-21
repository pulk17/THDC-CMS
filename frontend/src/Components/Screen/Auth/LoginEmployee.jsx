import React, { useState, useEffect } from 'react';
import {Text , Button, FormControl, FormLabel, Input, InputGroup, InputRightElement, VStack, CloseButton } from '@chakra-ui/react';
import { Box, Alert, AlertIcon, AlertTitle, AlertDescription } from '@chakra-ui/react';
import { useDispatch, useSelector } from 'react-redux';
import { loginAsEmployee } from '../../../Redux/Actions/AuthAction';

const LoginEmployee = () => {
    const [isAdmin , setIsAdmin] = useState(false);
    const [show, setShow] = useState(false);
    const [employee_id, setEmployee_id] = useState('');
    const [employee_password, setEmployee_password] = useState('');
    const [showAlert, setShowAlert] = useState(false);

    // handle password show button
    const handlePasswordShow = () => {
        setShow(!show);
    }

    // hooks call
    const dispatch = useDispatch();

    // login handle button
    const submitLoginUpForm = () => {
        if(!isAdmin){}
        dispatch(loginAsEmployee(employee_id, employee_password));
    }

    // fetch data from store
    const { loading, user: loginUser, isLoggedIn, error } = useSelector((state) => state.loginUser);

    // handle alert close
    const onClose = () => {
        setShowAlert(false);
    }

    // Show alert when there's an error
    useEffect(() => {
        if (error) {
            setShowAlert(true);
        }
    }, [error]);

    return (
        <VStack spacing='5px' color='black'>
            <FormControl id='text' isRequired>
                <FormLabel>Employee Id</FormLabel>
                <Input mb='1rem' value={employee_id} placeholder='Enter Your Employee Id' onChange={(e) => setEmployee_id(e.target.value)} />
            </FormControl>

            <FormControl id='password' isRequired>
                <FormLabel>Password</FormLabel>
                <InputGroup>
                    <Input value={employee_password} mb='1rem' type={show ? 'text' : 'password'} placeholder='Enter Your Password' onChange={(e) => setEmployee_password(e.target.value)} />
                    <InputRightElement width="4.5rem">
                        <Button h="1.75rem" size='sm' onClick={handlePasswordShow}>
                            {show ? "Hide" : "Show"}
                        </Button>
                    </InputRightElement>
                </InputGroup>
            </FormControl>
            {
                showAlert && error && error.length >0 ? (
                    <Alert status='error' display='flex' flexDirection='col' justifyContent='space-between' alignItems='center'>
                        <Box display='flex'>
                        <AlertIcon />
                        <Text fontFamily='Nunito'>{error}</Text>
                        </Box>
                        <CloseButton
                            onClick={onClose}
                        />
                    </Alert>
                ) : null
            }
            <Button colorScheme='blue'
                isLoading={loading}
                width='100%'
                style={{ marginTop: 15 }}
                onClick={submitLoginUpForm}>
                Login
            </Button>
        </VStack>
    );
};

export default LoginEmployee;
