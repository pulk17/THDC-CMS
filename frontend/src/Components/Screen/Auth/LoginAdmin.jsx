import React, { useState } from 'react';
import { Button, FormControl, FormLabel, Input, InputGroup, InputRightElement, VStack } from '@chakra-ui/react';

const LoginAdmin = () => {
    const [show , setShow] = useState(false)
    const [employee_id , setEmployee_id] = useState(0);
    const [employee_password , setEmployee_password] = useState("")

    //handle password show button :-
    const handlePasswordShow = ()=>{
        setShow(!show)
    }
    

    //login handle button:-
    const submitLoginUpForm = ()=>{

    }
  return (
    <>
        <VStack spacing='5px' color='black'>
            
            <FormControl id='text' isRequired>
             <FormLabel>Employee Id</FormLabel>
                <Input mb='1rem' value={employee_id} placeholder='Enter Your Employee Id' onChange={(e)=> setEmployee_id(e.target.value)}/>
            </FormControl>

            <FormControl id='password' isRequired>
             <FormLabel>Password</FormLabel>
             <InputGroup>
             <Input value={employee_password} mb='1rem' type={show ? 'text':'password'} placeholder='Enter Your Password' onChange={(e)=> setEmployee_password(e.target.value)}/>
             <InputRightElement width="4.5rem">
                <Button h = "1.75rem" size='sm' onClick={handlePasswordShow}>
                    {show ? "Hide" : "show"}
                </Button>
             </InputRightElement>
             </InputGroup>
            </FormControl>

            <Button colorScheme='blue'
            //  isLoading = {loading}
            width='100%'
            style={{marginTop:15}}
                onClick = {submitLoginUpForm}>
                    Login
            </Button>

            
         </VStack>
    </>
  );
};

export default LoginAdmin;
