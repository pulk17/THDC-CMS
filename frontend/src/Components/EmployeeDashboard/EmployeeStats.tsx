import React, { useContext, useEffect, useRef } from 'react';
import {
  Box,
  Text,
  Button,
  HStack,
  VStack,
  useToast,
  Heading,
  Flex,
  Stat,
  StatLabel,
  StatNumber,
  StatGroup,
} from '@chakra-ui/react';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip as ChartTooltip, Legend, ChartData, ChartOptions } from 'chart.js';
import moment from 'moment';
import { EmployeeContext } from '../context/EmployeeContext';
import { useDispatch, useSelector } from 'react-redux';
import { logoutUser } from '../../Redux/Actions/AuthAction';
import { LOGIN_RESET, LOGOUT_USER_RESET } from '../../Redux/ActionType';
import { RootState } from '../../Redux/store';
import { ThunkDispatch } from 'redux-thunk';
import { AnyAction } from 'redux';
import { motion } from 'framer-motion';

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  ChartTooltip,
  Legend
);

// Create motion components
const MotionBox = motion(Box);
const MotionFlex = motion(Flex);

const EmployeeStats: React.FC = () => {
  const { user: lu } = useSelector((state: RootState) => state.loginUser);
  const toast = useToast();
  const dispatch = useDispatch<ThunkDispatch<RootState, unknown, AnyAction>>();
  const chartRef = useRef<any>(null);

  const handleLogOut = () => {
    dispatch(logoutUser());
  };

  const { loading: isLoggedOutUserLoading, isLoggedOut } = useSelector((state: RootState) => state.logOutUser);

  useEffect(() => {
    if(isLoggedOut){
        toast({
            title: 'User Logged Out Successfully!',
            position: 'top',
            status: 'success',
            duration: 9000,
            isClosable: true,
          });
        dispatch({type: LOGOUT_USER_RESET});
    }
  }, [isLoggedOut, dispatch, toast]);
  
  // Cleanup chart instance on unmount to prevent canvas reuse issues
  useEffect(() => {
    const currentChartInstance = chartRef.current;
    return () => {
      if (currentChartInstance && currentChartInstance.destroy) {
        currentChartInstance.destroy();
      }
    };
  }, []);

  const today = moment().format('MMMM D, YYYY');
  const employeeContext = useContext(EmployeeContext);
  
  if (!employeeContext) {
    return <Text>Loading context...</Text>;
  }
  
  const { allMyComplaints } = employeeContext;

  const len1 = allMyComplaints.filter((com) => com.status === 'Opened').length;
  const len2 = allMyComplaints.filter((com) => com.status === 'Processing').length;
  const len3 = allMyComplaints.filter((com) => com.status === 'Closed').length;
  const len4 = allMyComplaints.length;

  // Sample data for bar chart with professional colors
  const barChartData: ChartData<'bar'> = {
    labels: ['Total Complaints', 'Total Closed', 'Total Opened', 'Total Processing'],
    datasets: [
      {
        label: 'Count',
        data: [len4, len3, len1, len2],
        backgroundColor: ['#4A5568', '#2C7A7B', '#2F855A', '#975A16'],
        borderColor: '#ffffff',
        borderWidth: 1,
      },
    ],
  };

  // Chart options
  const chartOptions: ChartOptions<'bar'> = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'bottom',
      }
    },
    scales: {
      x: {
        type: 'category',
        title: {
          display: true,
          text: 'Categories'
        }
      },
      y: {
        type: 'linear',
        beginAtZero: true,
        title: {
          display: true,
          text: 'Count'
        }
      }
    },
    animation: {
      duration: 2000,
      easing: 'easeInOutQuart'
    }
  };

  // Animation variants for Framer Motion
  const fadeIn = {
    hidden: { opacity: 0 },
    visible: { opacity: 1 }
  };

  const slideUp = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  const slideDown = {
    hidden: { opacity: 0, y: -20 },
    visible: { opacity: 1, y: 0 }
  };

  return (
    <Box p={5} fontFamily="'Inter', sans-serif" bg="white" borderRadius="lg" boxShadow="sm" flex="1" h="100vh" overflowY="auto">
      {/* Top Section */}
      <MotionFlex 
        initial="hidden"
        animate="visible"
        variants={slideDown}
        mb={6} 
        p={6} 
        bg="gray.50" 
        color="gray.800" 
        borderRadius="lg" 
        alignItems="center" 
        boxShadow="sm"
      >
        <HStack spacing={6} flex="1" alignItems="flex-start">
          <Box>
            <Heading size="md" mb={2} fontWeight="medium">Welcome, {lu ? lu.employee_name : ""}</Heading>
            <Button 
              isLoading={isLoggedOutUserLoading} 
              colorScheme="teal" 
              variant="outline" 
              onClick={handleLogOut} 
              size="sm"
              _hover={{ bg: 'teal.50' }}
              transition="all 0.3s"
            >
              Logout
            </Button>
          </Box>
          <Box flex="1" textAlign="right">
            <Text fontSize="lg" color="gray.500" fontWeight="medium">
              {today}
            </Text>
          </Box>
        </HStack>
      </MotionFlex>
      
      {/* Main Content */}
      <VStack spacing={8} align="stretch">
        {/* Stats Section */}
        <MotionBox
          initial="hidden"
          animate="visible"
          variants={fadeIn}
          transition={{ delay: 0.3 }}
        >
          <StatGroup 
            display="grid" 
            gridTemplateColumns={{ base: "1fr", md: "repeat(2, 1fr)", lg: "repeat(4, 1fr)" }}
            gap={4}
          >
            <Box
              p={5} 
              bg="white" 
              borderRadius="lg" 
              boxShadow="sm"
              border="1px solid"
              borderColor="gray.100"
              _hover={{ transform: 'scale(1.03)', boxShadow: 'md' }}
              transition="all 0.2s"
            >
              <Stat>
                <StatLabel fontSize="sm" color="gray.500">Total Complaints</StatLabel>
                <StatNumber fontSize="3xl" fontWeight="bold" color="gray.700">{len4}</StatNumber>
              </Stat>
            </Box>
            <Box
              p={5} 
              bg="white" 
              borderRadius="lg" 
              boxShadow="sm"
              border="1px solid"
              borderColor="gray.100"
              _hover={{ transform: 'scale(1.03)', boxShadow: 'md' }}
              transition="all 0.2s"
            >
              <Stat>
                <StatLabel fontSize="sm" color="gray.500">Closed</StatLabel>
                <StatNumber fontSize="3xl" fontWeight="bold" color="teal.600">{len3}</StatNumber>
              </Stat>
            </Box>
            <Box
              p={5} 
              bg="white" 
              borderRadius="lg" 
              boxShadow="sm"
              border="1px solid"
              borderColor="gray.100"
              _hover={{ transform: 'scale(1.03)', boxShadow: 'md' }}
              transition="all 0.2s"
            >
              <Stat>
                <StatLabel fontSize="sm" color="gray.500">Opened</StatLabel>
                <StatNumber fontSize="3xl" fontWeight="bold" color="green.600">{len1}</StatNumber>
              </Stat>
            </Box>
            <Box
              p={5} 
              bg="white" 
              borderRadius="lg" 
              boxShadow="sm"
              border="1px solid"
              borderColor="gray.100"
              _hover={{ transform: 'scale(1.03)', boxShadow: 'md' }}
              transition="all 0.2s"
            >
              <Stat>
                <StatLabel fontSize="sm" color="gray.500">Processing</StatLabel>
                <StatNumber fontSize="3xl" fontWeight="bold" color="yellow.600">{len2}</StatNumber>
              </Stat>
            </Box>
          </StatGroup>
        </MotionBox>

        {/* Chart Section */}
        <MotionBox
          initial="hidden"
          animate="visible"
          variants={slideUp}
          transition={{ delay: 0.6 }}
          p={6} 
          bg="white" 
          borderRadius="lg" 
          boxShadow="sm" 
          border="1px solid"
          borderColor="gray.100"
          height="400px"
        >
          <Heading size="md" mb={4} fontWeight="medium" color="gray.700">Complaint Statistics</Heading>
          <Box height="320px">
            <Bar 
              data={barChartData} 
              options={chartOptions}
              ref={chartRef}
            />
          </Box>
        </MotionBox>
      </VStack>
    </Box>
  );
};

export default EmployeeStats; 