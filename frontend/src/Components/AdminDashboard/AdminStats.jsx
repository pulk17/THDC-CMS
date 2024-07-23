import React, { useContext, useEffect } from 'react';
import {
  Box,
  Text,
  Button,
  HStack,
  useToast,
  VStack,
  useDisclosure,
  Tooltip,
} from '@chakra-ui/react';
import { Bar } from 'react-chartjs-2';
import Chart from 'chart.js/auto';
import moment from 'moment';
import { AdminContext } from '../context/AdminContext';
import { logoutUser } from '../../Redux/Actions/AuthAction';
import { LOGIN_AS_ADMIN_RESET, LOGOUT_USER_RESET } from '../../Redux/ActionType';
import { useDispatch, useSelector } from 'react-redux';


const AdminStats = () => {


    // logout User:-
    const { loading, user: lu, isLoggedIn, error } = useSelector((state) => state.loginAdmin);

    const toast = useToast()
    const dispatch = useDispatch();
  
    const handleLogOut = () => {
      dispatch(logoutUser());
    };
  
    const { loading : isLoggedOutUserLoading , isLoggedOut } = useSelector((state) => state.logOutUser);
  
    useEffect(() => {
      if(isLoggedOut){
          toast({
              title: 'Admin Logged Out Successfully!',
              position: 'top',
              status: 'success',
              duration: 9000,
              isClosable: true,
            })
          dispatch({type : LOGOUT_USER_RESET})
          dispatch({ type: LOGIN_AS_ADMIN_RESET});
      }
    }, [isLoggedOut]);

  const today = moment().format('MMMM D, YYYY');
  const userName = 'Admin'; // Replace with dynamic username if available
  const { isOpen, onOpen, onClose } = useDisclosure();

  const {allEmployeeComplaints, setAllEmployeeComplaints} = useContext(AdminContext);

  const len1 = allEmployeeComplaints.filter((com)=> com.status == 'Opened').length
   const len2 = allEmployeeComplaints.filter((com)=> com.status == 'Processing').length
   const len3 = allEmployeeComplaints.filter((com)=> com.status == 'Closed').length
   const len4 = allEmployeeComplaints.length

  // Sample data for bar chart
  const barChartData = {
    labels: ['Total Complaints', 'Total Closed', 'Total Opened', 'Total Processing'],
    datasets: [
      {
        label: 'Count',
        data: [len4, len3, len1, len2],
        backgroundColor: ['#0088FE', '#FFBB28', '#FF8042', '#00C49F'],
        borderColor: '#ffffff',
        borderWidth: 1,
      },
    ],
  };

  return (
    <Box p={5} fontFamily="'Nunito', sans-serif" bg="gray.50" borderRadius="md" boxShadow="md" flex="1" h="100vh" overflowY="auto">
      {/* Top Section */}
      <HStack spacing={4} mb={6} p={4} bg="teal.500" color="white" borderRadius="md" alignItems="center" h="130px">
        <HStack spacing={6} flex="1" alignItems="flex-start">
          <Box>
            <Text fontSize="2xl" fontWeight="bold" fontFamily="'Nunito', sans-serif">Hello, {lu && lu ? lu.employee_name : ""}</Text>
            <Button isLoading={isLoggedOutUserLoading} colorScheme="red" onClick={handleLogOut} mt={2}>
              Logout
            </Button>
          </Box>
          <Box flex="1" mt='40px'  textAlign="right">
            <Text fontSize= '30px' mt='6px' fontFamily="'Nunito', sans-serif">
              {today}
            </Text>
          </Box>
        </HStack>
      </HStack>
      
      {/* Main Content */}
      <VStack spacing={6} align="stretch">
        <HStack spacing={6} mb={6} align="stretch">
          {/* Complaint Counts Boxes */}
          <VStack spacing={6} flex="1" align="stretch">
            <HStack spacing={6} mb={6} align="stretch">
              <Tooltip label="Total Complaints" placement="top" hasArrow>
                <Box
                  p={6}
                  bg="blue.500"
                  color="white"
                  borderRadius="md"
                  boxShadow="md"
                  textAlign="center"
                  flex="1"
                  _hover={{ transform: 'scale(1.05)', boxShadow: 'lg' }}
                  transition="all 0.3s"
                >
                  <Text fontSize="xl" fontWeight="bold" fontFamily="'Nunito', sans-serif">Total Complaints</Text>
                  <Text fontSize="3xl" fontWeight="bold" fontFamily="'Nunito', sans-serif">{len4}</Text>
                </Box>
              </Tooltip>
              <Tooltip label="Total Closed" placement="top" hasArrow>
                <Box
                  p={6}
                  bg="green.500"
                  color="white"
                  borderRadius="md"
                  boxShadow="md"
                  textAlign="center"
                  flex="1"
                  _hover={{ transform: 'scale(1.05)', boxShadow: 'lg' }}
                  transition="all 0.3s"
                >
                  <Text fontSize="xl" fontWeight="bold" fontFamily="'Nunito', sans-serif">Total Closed</Text>
                  <Text fontSize="3xl" fontWeight="bold" fontFamily="'Nunito', sans-serif">{len3}</Text>
                </Box>
              </Tooltip>
            </HStack>
            <HStack spacing={6} align="stretch">
              <Tooltip label="Total Opened" placement="top" hasArrow>
                <Box
                  p={6}
                  bg="orange.500"
                  color="white"
                  borderRadius="md"
                  boxShadow="md"
                  textAlign="center"
                  flex="1"
                  _hover={{ transform: 'scale(1.05)', boxShadow: 'lg' }}
                  transition="all 0.3s"
                >
                  <Text fontSize="xl" fontWeight="bold" fontFamily="'Nunito', sans-serif">Total Opened</Text>
                  <Text fontSize="3xl" fontWeight="bold" fontFamily="'Nunito', sans-serif">{len1}</Text>
                </Box>
              </Tooltip>
              <Tooltip label="Total Processing" placement="top" hasArrow>
                <Box
                  p={6}
                  bg="yellow.500"
                  color="white"
                  borderRadius="md"
                  boxShadow="md"
                  textAlign="center"
                  flex="1"
                  _hover={{ transform: 'scale(1.05)', boxShadow: 'lg' }}
                  transition="all 0.3s"
                >
                  <Text fontSize="xl" fontWeight="bold" fontFamily="'Nunito', sans-serif">Total Processing</Text>
                  <Text fontSize="3xl" fontWeight="bold" fontFamily="'Nunito', sans-serif">{len2}</Text>
                </Box>
              </Tooltip>
            </HStack>
          </VStack>

          {/* Bar Chart */}
          <Box flex="2" overflowY="auto">
            <Text fontSize="lg" mb={2} textAlign="center" fontFamily="'Nunito', sans-serif">Complaint Counts</Text>
            <Bar data={barChartData} options={{ responsive: true, plugins: { legend: { position: 'bottom' } } }} height={250} />
          </Box>
        </HStack>
      </VStack>
    </Box>
  );
};

export default AdminStats;
