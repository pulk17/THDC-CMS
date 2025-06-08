import React, { useState, useEffect, useRef } from 'react';
import {
    Box,
    Button,
    Container,
    Flex,
    FormControl,
    FormLabel,
    Heading,
    Input,
    InputGroup,
    InputRightElement,
    Text,
    useToast,
    VStack,
    Tab,
    TabList,
    TabPanel,
    TabPanels,
    Tabs,
    Alert,
    AlertIcon,
    CloseButton,
    useColorModeValue,
    Checkbox,
    Image,
    Stack,
    HStack,
    Modal,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalBody,
    ModalFooter,
    useDisclosure
} from '@chakra-ui/react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { registerUser, loginUser } from '../../../Redux/Actions/AuthAction';
import { RootState } from '../../../Redux/store';
import { LoginFormData, RegisterFormData } from '../../../types';
import { ThunkDispatch } from 'redux-thunk';
import { AnyAction } from 'redux';
import { ViewIcon, ViewOffIcon } from '@chakra-ui/icons';

const Auth: React.FC = () => {
    const [showPassword, setShowPassword] = useState<boolean>(false);
    const [tabIndex, setTabIndex] = useState<number>(0);
    const [showAlert, setShowAlert] = useState<boolean>(false);
    const [hasShownLoginToast, setHasShownLoginToast] = useState<boolean>(false);
    const [hasShownRegisterToast, setHasShownRegisterToast] = useState<boolean>(false);
    const [isLoadingStuck, setIsLoadingStuck] = useState<boolean>(false);
    const [lastLoginAttempt, setLastLoginAttempt] = useState<{id: string, time: number} | null>(null);
    const [loginAttemptCount, setLoginAttemptCount] = useState<number>(0);
    const [showRecoveryOptions, setShowRecoveryOptions] = useState<boolean>(false);
    
    const loadingTimeoutRef = useRef<NodeJS.Timeout | null>(null);
    const { isOpen: isModalOpen, onOpen: openModal, onClose: closeModal } = useDisclosure();
    
    const toast = useToast();
    const dispatch = useDispatch<ThunkDispatch<RootState, unknown, AnyAction>>();
    const navigate = useNavigate();
    
    // Colors
    const bgColor = useColorModeValue('white', 'gray.800');
    const borderColor = useColorModeValue('gray.200', 'gray.600');
    const cardBgColor = useColorModeValue('white', 'gray.700');
    const inputBgColor = useColorModeValue('gray.50', 'gray.800');
    const primaryColor = useColorModeValue('teal.500', 'teal.300');
    const textColor = useColorModeValue('gray.700', 'white');
    const subtleTextColor = useColorModeValue('gray.500', 'gray.400');

    // Form states
    const [loginData, setLoginData] = useState<LoginFormData>({
        employee_id: '',
        employee_password: ''
    });
    const [rememberMe, setRememberMe] = useState<boolean>(false);
    const [registerData, setRegisterData] = useState<RegisterFormData>({
        employee_id: '',
        employee_name: '',
        employee_designation: '',
        employee_department: '',
        employee_location: '',
        employee_email: '',
        employee_password: '',
        employee_role: 'employee'
    });

    // Redux state
    const { loading: loginLoading, isLoggedIn, error: loginError, user } = useSelector((state: RootState) => state.loginUser);
    const { loading: registerLoading, isRegistered, error: registerError } = useSelector((state: RootState) => state.registerUser);

    // Form handlers
    const handleLoginChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setLoginData({ ...loginData, [e.target.name]: e.target.value });
    };

    const handleRegisterChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        setRegisterData({ ...registerData, [e.target.name]: e.target.value });
    };

    const handleResetAuth = () => {
        // Clear all auth data
        localStorage.removeItem('authToken');
        localStorage.removeItem('rememberedUser');
        sessionStorage.removeItem('auth_redirect_timestamp');
        
        // Reset Redux state by dispatching LOGIN_RESET
        dispatch({ type: "LOGIN_RESET" });
        
        // Reset form data
        setLoginData({
            employee_id: '',
            employee_password: ''
        });
        
        // Show notification
        toast({
            title: 'Authentication Reset',
            description: 'All login data has been cleared. Please try logging in again.',
            status: 'info',
            duration: 5000,
            isClosable: true,
            position: 'top'
        });
        
        // Reset counters
        setLoginAttemptCount(0);
        setLastLoginAttempt(null);
        setShowRecoveryOptions(false);
    };

    const handleLoginSubmit = () => {
        const { employee_id, employee_password } = loginData;
        
        if (!employee_id || !employee_password) {
            toast({
                title: 'Please fill all fields',
                status: 'warning',
                duration: 3000,
                isClosable: true,
                position: 'top'
            });
            return;
        }
        
        // Track login attempts
        const now = Date.now();
        const currentAttempt = { id: employee_id.toString(), time: now };
        
        // If same user tried to login in the last 5 seconds, increment counter
        if (lastLoginAttempt && 
            lastLoginAttempt.id === employee_id.toString() && 
            now - lastLoginAttempt.time < 5000) {
            setLoginAttemptCount(prev => prev + 1);
        } else {
            // Reset counter for new attempts or after delay
            setLoginAttemptCount(1);
        }
        
        setLastLoginAttempt(currentAttempt);
        
        // If too many rapid attempts, suggest resetting auth
        if (loginAttemptCount >= 2) {
            toast({
                title: 'Multiple login attempts detected',
                description: 'Try clearing your authentication data first',
                status: 'warning',
                duration: 5000,
                isClosable: true,
                position: 'top',
                render: ({ onClose }) => (
                    <Box
                        p={4}
                        bg="orange.100"
                        color="orange.800"
                        borderRadius="md"
                        boxShadow="md"
                    >
                        <Flex justify="space-between" align="center">
                            <Box>
                                <Heading size="sm">Multiple login attempts detected</Heading>
                                <Text mt={1}>Try clearing your authentication data first</Text>
                            </Box>
                            <Button 
                                size="sm" 
                                colorScheme="orange" 
                                onClick={() => {
                                    handleResetAuth();
                                    onClose();
                                }}
                            >
                                Reset Auth
                            </Button>
                        </Flex>
                    </Box>
                )
            });
        }
        
        if (rememberMe) {
            localStorage.setItem('rememberedUser', JSON.stringify({ employee_id }));
        } else {
            localStorage.removeItem('rememberedUser');
        }
        
        // Set a timeout to detect if we get stuck in loading
        if (loadingTimeoutRef.current) {
            clearTimeout(loadingTimeoutRef.current);
        }
        
        loadingTimeoutRef.current = setTimeout(() => {
            if (loginLoading) {
                handleStuckLoading();
            }
        }, 10000); // 10 seconds timeout
        
        dispatch(loginUser(employee_id, employee_password));
    };

    const handleRegisterSubmit = () => {
        const {
            employee_id,
            employee_name,
            employee_designation,
            employee_department,
            employee_location,
            employee_email,
            employee_password,
            employee_role
        } = registerData;

        if (!employee_id || !employee_name || !employee_designation || 
            !employee_department || !employee_location || 
            !employee_email || !employee_password) {
            toast({
                title: 'Please fill all fields',
                status: 'warning',
                duration: 3000,
                isClosable: true,
                position: 'top'
            });
            return;
        }

        if (isNaN(Number(employee_id))) {
            toast({
                title: 'Invalid Employee ID',
                description: 'Employee ID must be a number',
                status: 'error',
                duration: 3000,
                isClosable: true,
                position: 'top'
            });
            return;
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(employee_email)) {
            toast({
                title: 'Invalid Email',
                description: 'Please enter a valid email address',
                status: 'error',
                duration: 3000,
                isClosable: true,
                position: 'top'
            });
            return;
        }

        dispatch(registerUser(
            employee_id,
            employee_name,
            employee_designation,
            employee_department,
            employee_location,
            employee_password,
            employee_email,
            employee_role
        ));
    };

    // Utility functions
    const handlePasswordShow = () => setShowPassword(!showPassword);
    const onClose = () => setShowAlert(false);

    // Handle getting stuck in loading state
    const handleStuckLoading = () => {
        openModal();
        setIsLoadingStuck(true);
    };

    // Handle redirection from stuck loading modal
    const handleRedirectToLogin = () => {
        // Clear any potential issues
        localStorage.removeItem('authToken');
        localStorage.removeItem('rememberedUser');
        window.location.href = '/';
    };

    const handleRedirectToDashboard = () => {
        if (user) {
            navigate(user.employee_role === 'admin' ? '/admin' : '/employee');
        } else {
            toast({
                title: 'No user data available',
                description: 'Redirecting to login page',
                status: 'info',
                duration: 3000,
                isClosable: true,
                position: 'top'
            });
            handleRedirectToLogin();
        }
        closeModal();
    };

    // Effects
    useEffect(() => {
        console.log("Auth component mounted");
        
        // Check for existing token and redirect if found
        const authToken = localStorage.getItem('authToken');
        if (authToken) {
            console.log("Auth: Found existing token, checking user data");
            // If we have a token but no user data yet, the token might be invalid
            // We'll let the API interceptor handle token validation on the next API call
            if (user) {
                console.log("Auth: User data available, redirecting to appropriate dashboard");
                navigate(user.employee_role === 'admin' ? '/admin' : '/employee');
            }
        } else {
            console.log("Auth: No token found, staying on login page");
        }
        
        const rememberedUser = localStorage.getItem('rememberedUser');
        if (rememberedUser) {
            console.log("Auth: Found remembered user, pre-filling login form");
            const userData = JSON.parse(rememberedUser);
            setLoginData(prevState => ({
                ...prevState,
                employee_id: userData.employee_id || ''
            }));
            setRememberMe(true);
        }
    }, [user, navigate]);

    useEffect(() => {
        console.log("Auth: Login state changed", { isLoggedIn, user });
        
        if (isLoggedIn && user && !hasShownLoginToast) {
            console.log("Auth: Login successful, redirecting");
            
            // Check if token exists in localStorage before redirecting
            const token = localStorage.getItem('authToken');
            if (!token) {
                console.log("Auth: No token in localStorage despite successful login, waiting for token");
                // Don't redirect yet - wait for token to be saved
                return;
            }
            
            toast({
                title: 'Login Successful',
                description: `Welcome back, ${user.employee_name}!`,
                status: 'success',
                duration: 5000,
                isClosable: true,
                position: 'top'
            });
            setHasShownLoginToast(true);
            
            // Add a small delay before redirecting to ensure token is saved
            setTimeout(() => {
                navigate(user.employee_role === 'admin' ? '/admin' : '/employee');
            }, 100);
        }
    }, [isLoggedIn, user, hasShownLoginToast, navigate, toast]);

    useEffect(() => {
        if (isRegistered && !hasShownRegisterToast) {
            toast({
                title: 'Registration Successful',
                description: 'You can now login with your credentials',
                status: 'success',
                duration: 5000,
                isClosable: true,
                position: 'top'
            });
            setHasShownRegisterToast(true);
            setTabIndex(0);
        }
    }, [isRegistered, toast, hasShownRegisterToast]);

    useEffect(() => {
        if (loginError || registerError) {
            setShowAlert(true);
        }
    }, [loginError, registerError]);

    // Add additional useEffect for persistent auth errors
    useEffect(() => {
        // If login error, show recovery options after a few seconds
        if (loginError) {
            const timer = setTimeout(() => {
                setShowRecoveryOptions(true);
            }, 2000);
            
            return () => clearTimeout(timer);
        } else {
            setShowRecoveryOptions(false);
        }
    }, [loginError]);

    // Cleanup timeout on unmount
    useEffect(() => {
        return () => {
            if (loadingTimeoutRef.current) {
                clearTimeout(loadingTimeoutRef.current);
            }
        };
    }, []);

    // Update loading state detection
    useEffect(() => {
        if (loginLoading) {
            // Set a timeout to detect if we get stuck in loading
            if (loadingTimeoutRef.current) {
                clearTimeout(loadingTimeoutRef.current);
            }
            
            loadingTimeoutRef.current = setTimeout(() => {
                if (loginLoading) {
                    handleStuckLoading();
                }
            }, 10000); // 10 seconds timeout
        } else {
            // Clear timeout if no longer loading
            if (loadingTimeoutRef.current) {
                clearTimeout(loadingTimeoutRef.current);
                loadingTimeoutRef.current = null;
            }
        }
    }, [loginLoading]);

    return (
        <Flex
            minH="100vh"
            align="center"
            justify="center"
            bg={bgColor}
            p={4}
        >
            {/* Stuck in loading modal */}
            <Modal isOpen={isModalOpen} onClose={closeModal}>
                <ModalOverlay />
                <ModalContent>
                    <ModalHeader>Loading Taking Too Long</ModalHeader>
                    <ModalBody>
                        <Text>The application seems to be taking longer than expected to load.</Text>
                        <Text mt={2}>You can:</Text>
                        <Text mt={2}>1. Go back to login page</Text>
                        <Text mt={2}>2. Try to navigate to dashboard if you're already logged in</Text>
                    </ModalBody>
                    <ModalFooter>
                        <Button colorScheme="teal" mr={3} onClick={handleRedirectToLogin}>
                            Go to Login
                        </Button>
                        <Button variant="ghost" onClick={handleRedirectToDashboard}>
                            Try Dashboard
                        </Button>
                    </ModalFooter>
                </ModalContent>
            </Modal>

            <Container maxW="lg" py={{ base: '6', md: '12' }}>
                <Stack spacing={8} direction={{ base: 'column', md: 'row' }} align="center" mb={8}>
                    <Image 
                        src="assets/Thdc-logo.png" 
                        alt="THDC Logo" 
                        boxSize="60px"
                        fallbackSrc="data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHJlY3Qgd2lkdGg9IjYwIiBoZWlnaHQ9IjYwIiBmaWxsPSIjMDA4MDgwIi8+Cjx0ZXh0IHg9IjUwJSIgeT0iNTAlIiBkb21pbmFudC1iYXNlbGluZT0ibWlkZGxlIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBmaWxsPSJ3aGl0ZSIgZm9udC1mYW1pbHk9InNhbnMtc2VyaWYiIGZvbnQtc2l6ZT0iMTYiPgpUSERDCjwvdGV4dD4KPC9zdmc+"
                    />
                    <Box>
                        <Heading 
                            as="h1" 
                            size="xl" 
                            fontWeight="medium" 
                            color={textColor}
                            textAlign={{ base: 'center', md: 'left' }}
                        >
                            THDC Complaint Management
                        </Heading>
                        <Text 
                            color={subtleTextColor} 
                            fontSize="md" 
                            mt={1}
                            textAlign={{ base: 'center', md: 'left' }}
                        >
                            Login or register to manage complaints
                        </Text>
                    </Box>
                </Stack>
                
                <Box
                    p={8}
                    bg={cardBgColor}
                    boxShadow="sm"
                    borderRadius="lg"
                    border="1px solid"
                    borderColor={borderColor}
                >
                    {/* Auth recovery section */}
                    {showRecoveryOptions && (
                        <Box 
                            mb={6} 
                            p={4} 
                            bg="red.50" 
                            borderRadius="md" 
                            borderLeft="4px solid" 
                            borderLeftColor="red.500"
                        >
                            <Heading size="sm" mb={2} color="red.600">
                                Having trouble logging in?
                            </Heading>
                            <Text fontSize="sm" mb={3} color="red.700">
                                Your session might be corrupted. Try these recovery options:
                            </Text>
                            <Flex wrap="wrap" gap={2}>
                                <Button 
                                    size="sm" 
                                    colorScheme="red" 
                                    variant="outline"
                                    leftIcon={<span>🔄</span>}
                                    onClick={handleResetAuth}
                                >
                                    Reset Auth Data
                                </Button>
                                <Button
                                    size="sm"
                                    colorScheme="gray"
                                    variant="outline"
                                    leftIcon={<span>🧹</span>}
                                    onClick={() => {
                                        // Clear browser storage
                                        localStorage.clear();
                                        sessionStorage.clear();
                                        
                                        toast({
                                            title: 'Storage Cleared',
                                            description: 'All browser storage has been cleared. Please try logging in again.',
                                            status: 'info',
                                            duration: 5000,
                                            isClosable: true,
                                        });
                                        
                                        // Reload the page
                                        window.location.reload();
                                    }}
                                >
                                    Clear All Storage
                                </Button>
                            </Flex>
                        </Box>
                    )}
                    
                    {showAlert && (loginError || registerError) && (
                        <Flex mb={4} justify="space-between" align="center">
                            <Alert status="error" borderRadius="md" flex="1">
                                <AlertIcon />
                                <Box flex="1">
                                    <Text fontWeight="medium">{loginError || registerError}</Text>
                                </Box>
                                <CloseButton onClick={onClose} />
                            </Alert>
                            {loginError && (
                                <Button 
                                    ml={2} 
                                    size="sm" 
                                    colorScheme="red" 
                                    variant="outline"
                                    onClick={handleResetAuth}
                                >
                                    Reset Auth
                                </Button>
                            )}
                        </Flex>
                    )}
                    
                    <Tabs 
                        isFitted 
                        variant="enclosed" 
                        colorScheme="teal" 
                        index={tabIndex} 
                        onChange={setTabIndex}
                        mb={4}
                    >
                        <TabList mb="1em">
                            <Tab 
                                fontWeight="medium" 
                                _selected={{ 
                                    color: primaryColor, 
                                    borderColor: borderColor,
                                    borderBottom: '2px solid',
                                    borderBottomColor: primaryColor
                                }}
                            >
                                Login
                            </Tab>
                            <Tab 
                                fontWeight="medium"
                                _selected={{ 
                                    color: primaryColor, 
                                    borderColor: borderColor,
                                    borderBottom: '2px solid',
                                    borderBottomColor: primaryColor
                                }}
                            >
                                Register
                            </Tab>
                        </TabList>
                        <TabPanels>
                            {/* Login Panel */}
                            <TabPanel p={0}>
                                <VStack spacing={4} align="stretch">
                                    <FormControl id="login-employee-id" isRequired>
                                        <FormLabel>Employee ID</FormLabel>
                                        <Input
                                            type="text"
                                            name="employee_id"
                                            value={loginData.employee_id}
                                            onChange={handleLoginChange}
                                            placeholder="Enter your employee ID"
                                            bg={inputBgColor}
                                            borderColor={borderColor}
                                        />
                                    </FormControl>
                                    <FormControl id="login-password" isRequired>
                                        <FormLabel>Password</FormLabel>
                                        <InputGroup>
                                            <Input
                                                type={showPassword ? 'text' : 'password'}
                                                name="employee_password"
                                                value={loginData.employee_password}
                                                onChange={handleLoginChange}
                                                placeholder="Enter your password"
                                                bg={inputBgColor}
                                                borderColor={borderColor}
                                            />
                                            <InputRightElement width="4.5rem">
                                                <Button 
                                                    h="1.75rem" 
                                                    size="sm" 
                                                    variant="ghost" 
                                                    onClick={handlePasswordShow}
                                                >
                                                    {showPassword ? <ViewOffIcon /> : <ViewIcon />}
                                                </Button>
                                            </InputRightElement>
                                        </InputGroup>
                                    </FormControl>
                                    <Checkbox 
                                        colorScheme="teal" 
                                        isChecked={rememberMe} 
                                        onChange={(e) => setRememberMe(e.target.checked)}
                                    >
                                        Remember me
                                    </Checkbox>
                                    <Button
                                        colorScheme="teal"
                                        isLoading={loginLoading}
                                        onClick={handleLoginSubmit}
                                        mt={4}
                                        size="lg"
                                        w="100%"
                                    >
                                        Login
                                    </Button>
                                </VStack>
                            </TabPanel>

                            {/* Register Panel */}
                            <TabPanel p={0}>
                                <VStack spacing={4} align="stretch">
                                    <FormControl id="register-employee-id" isRequired>
                                        <FormLabel>Employee ID</FormLabel>
                                        <Input
                                            type="text"
                                            name="employee_id"
                                            value={registerData.employee_id}
                                            onChange={handleRegisterChange}
                                            placeholder="Enter your employee ID"
                                            bg={inputBgColor}
                                            borderColor={borderColor}
                                        />
                                    </FormControl>
                                    <FormControl id="register-name" isRequired>
                                        <FormLabel>Full Name</FormLabel>
                                        <Input
                                            type="text"
                                            name="employee_name"
                                            value={registerData.employee_name}
                                            onChange={handleRegisterChange}
                                            placeholder="Enter your full name"
                                            bg={inputBgColor}
                                            borderColor={borderColor}
                                        />
                                    </FormControl>
                                    <Flex gap={4} direction={{ base: 'column', md: 'row' }}>
                                        <FormControl id="register-designation" isRequired>
                                            <FormLabel>Designation</FormLabel>
                                            <Input
                                                type="text"
                                                name="employee_designation"
                                                value={registerData.employee_designation}
                                                onChange={handleRegisterChange}
                                                placeholder="Enter your designation"
                                                bg={inputBgColor}
                                                borderColor={borderColor}
                                            />
                                        </FormControl>
                                        <FormControl id="register-department" isRequired>
                                            <FormLabel>Department</FormLabel>
                                            <Input
                                                type="text"
                                                name="employee_department"
                                                value={registerData.employee_department}
                                                onChange={handleRegisterChange}
                                                placeholder="Enter your department"
                                                bg={inputBgColor}
                                                borderColor={borderColor}
                                            />
                                        </FormControl>
                                    </Flex>
                                    <FormControl id="register-location" isRequired>
                                        <FormLabel>Location</FormLabel>
                                        <Input
                                            type="text"
                                            name="employee_location"
                                            value={registerData.employee_location}
                                            onChange={handleRegisterChange}
                                            placeholder="Enter your location"
                                            bg={inputBgColor}
                                            borderColor={borderColor}
                                        />
                                    </FormControl>
                                    <FormControl id="register-email" isRequired>
                                        <FormLabel>Email</FormLabel>
                                        <Input
                                            type="email"
                                            name="employee_email"
                                            value={registerData.employee_email}
                                            onChange={handleRegisterChange}
                                            placeholder="Enter your email"
                                            bg={inputBgColor}
                                            borderColor={borderColor}
                                        />
                                    </FormControl>
                                    <FormControl id="register-password" isRequired>
                                        <FormLabel>Password</FormLabel>
                                        <InputGroup>
                                            <Input
                                                type={showPassword ? 'text' : 'password'}
                                                name="employee_password"
                                                value={registerData.employee_password}
                                                onChange={handleRegisterChange}
                                                placeholder="Create a password"
                                                bg={inputBgColor}
                                                borderColor={borderColor}
                                            />
                                            <InputRightElement width="4.5rem">
                                                <Button 
                                                    h="1.75rem" 
                                                    size="sm" 
                                                    variant="ghost" 
                                                    onClick={handlePasswordShow}
                                                >
                                                    {showPassword ? <ViewOffIcon /> : <ViewIcon />}
                                                </Button>
                                            </InputRightElement>
                                        </InputGroup>
                                    </FormControl>
                                    <Button
                                        colorScheme="teal"
                                        isLoading={registerLoading}
                                        onClick={handleRegisterSubmit}
                                        mt={4}
                                        size="lg"
                                        w="100%"
                                    >
                                        Register
                                    </Button>
                                </VStack>
                            </TabPanel>
                        </TabPanels>
                    </Tabs>
                </Box>
                
                {/* Add a "stuck" helper at the bottom when in loading state for a while */}
                {loginLoading && (
                    <Box mt={4} textAlign="center">
                        <Text fontSize="sm" color="gray.500" mb={2}>
                            Taking too long to load?
                        </Text>
                        <Flex justify="center" gap={2}>
                            <Button 
                                size="sm" 
                                colorScheme="teal" 
                                variant="link"
                                onClick={handleStuckLoading}
                            >
                                Show options
                            </Button>
                            <Button 
                                size="sm" 
                                colorScheme="red" 
                                variant="link"
                                onClick={handleResetAuth}
                            >
                                Reset auth data
                            </Button>
                        </Flex>
                    </Box>
                )}
                
                <Text 
                    mt={6} 
                    fontSize="sm" 
                    color={subtleTextColor} 
                    textAlign="center"
                >
                    © {new Date().getFullYear()} THDC India Ltd. All rights reserved.
                </Text>
            </Container>
        </Flex>
    );
};

export default Auth; 