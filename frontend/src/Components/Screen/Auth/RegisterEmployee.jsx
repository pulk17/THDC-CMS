import React, { useState, useEffect } from 'react';
import { Button, FormControl, FormLabel, Input, InputGroup, InputRightElement, VStack, useToast } from '@chakra-ui/react';
import { useDispatch, useSelector } from 'react-redux';
import { RegisterAsEmployee } from '../../../Redux/Actions/AuthAction';

const RegisterEmployee = () => {
    const [show, setShow] = useState(false);
    const [employee_id, setEmployee_id] = useState('');
    const [employee_name, setEmployee_name] = useState('');
    const [employee_designation, setEmployee_designation] = useState('');
    const [employee_department, setEmployee_department] = useState('');
    const [employee_location, setEmployee_location] = useState('');
    const [employee_email, setEmployee_email] = useState('');
    const [employee_password, setEmployee_password] = useState('');

    const toast = useToast();

    // hide and unHide password
    const handlePasswordShow = () => {
        setShow(!show);
    }

    // hooks call
    const dispatch = useDispatch();

    // handle submit form
    const submitSignUpForm = () => {
        if (!employee_id || !employee_name || !employee_designation || !employee_department || !employee_location || !employee_email || !employee_password) {
            toast({
                title: "Incomplete Form",
                description: "Please fill in all the fields.",
                status: "warning",
                duration: 3000,
                isClosable: true,
            });
            return;
        }
        dispatch(RegisterAsEmployee(employee_id, employee_name, employee_designation, employee_department, employee_location, employee_password, employee_email));
    }

    // register as a user
    const { loading, user: registerUser, isRegistered, error } = useSelector((state) => state.registerUser);

    useEffect(() => {
        if (error && error.length > 0) {
            toast({
                title: error,
                status: 'error',
                duration: 9000,
                isClosable: true,
            });
        }
    }, [error]);

    useEffect(()=>{
        if (isRegistered) {
            toast({
                title: 'User Registered Successfully!',
                status: 'success',
                duration: 9000,
                isClosable: true,
            });
            toast({
                title: 'Please Login Again !',
                status: 'info',
                duration: 9000,
                isClosable: true,
            });
        }

    },[isRegistered])

    return (
        <>
            <VStack spacing='6px' color='black'>
                <FormControl id='Employee_Id' isRequired>
                    <FormLabel>Employee ID : </FormLabel>
                    <Input mb='1rem' placeholder='Enter Your Employee Id' onChange={(e) => setEmployee_id(e.target.value)} />
                </FormControl>

                <FormControl id='first-name' isRequired>
                    <FormLabel>Employee Name : </FormLabel>
                    <Input mb='1rem' placeholder='Enter Your Name' onChange={(e) => setEmployee_name(e.target.value)} />
                </FormControl>

                <FormControl id='employee_email' isRequired>
                    <FormLabel>Employee Email :</FormLabel>
                    <Input mb='1rem' placeholder='Enter Your Email' onChange={(e) => setEmployee_email(e.target.value)} />
                </FormControl>

                <FormControl id='employee_designation' isRequired>
                    <FormLabel>Employee Designation :</FormLabel>
                    <Input mb='1rem' placeholder='Enter Your Designation' onChange={(e) => setEmployee_designation(e.target.value)} />
                </FormControl>

                <FormControl id='employee_department' isRequired>
                    <FormLabel>Employee Department :</FormLabel>
                    <Input mb='1rem' placeholder='Enter Your Department Name' onChange={(e) => setEmployee_department(e.target.value)} />
                </FormControl>

                <FormControl id='employee_location' isRequired>
                    <FormLabel>Employee Location :</FormLabel>
                    <Input mb='1rem' placeholder='Enter Your Location' onChange={(e) => setEmployee_location(e.target.value)} />
                </FormControl>

                <FormControl id='password' isRequired>
                    <FormLabel>Password</FormLabel>
                    <InputGroup mb='2px'>
                        <Input mb='1rem' type={show ? 'text' : 'password'} placeholder='Enter Your Password' onChange={(e) => setEmployee_password(e.target.value)} />
                        <InputRightElement width="4.5rem">
                            <Button h="1.75rem" size='sm' onClick={handlePasswordShow}>
                                {show ? "Hide" : "Show"}
                            </Button>
                        </InputRightElement>
                    </InputGroup>
                </FormControl>

                <Button colorScheme='blue'
                    width='100%'
                    isLoading={loading}
                    style={{ marginTop: 15 }}
                    onClick={submitSignUpForm}>
                    Sign Up
                </Button>
            </VStack>
        </>
    );
};

export default RegisterEmployee;
