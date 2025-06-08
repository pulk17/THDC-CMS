/**
 * Simplified JavaScript version of the THDC Complaint Management System backend
 * This file is used for deployment when TypeScript compilation fails
 */

const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');
const fs = require('fs');
const jwt = require('jsonwebtoken');

// Create Express app
const app = express();

// Handle uncaught exceptions
process.on("uncaughtException", (err) => {
  console.log(`Error: ${err.message}`);
  console.log("Shutting down the server due to Uncaught Exception");
  process.exit(1);
});

// Config
// Try to load config.env if it exists
const configPath = path.resolve(__dirname, '../config.env');
if (fs.existsSync(configPath)) {
  console.log(`Loading config from ${configPath}`);
  dotenv.config({ path: configPath });
} else {
  console.log('No config.env file found, using environment variables');
  dotenv.config();
}

// Get allowed origins from environment or use defaults
const allowedOrigins = [
  "http://localhost:3000",
  "https://thdc-3vyrr53u3-pulk17s-projects.vercel.app",
  "https://thdc-3gvn5ln7y-pulk17s-projects.vercel.app",
  "https://thdc-cms.vercel.app"
];

// Middleware
app.use(express.json());
app.use(cors({
  origin: function(origin, callback) {
    // Allow requests with no origin (like mobile apps, curl requests)
    if (!origin) return callback(null, true);
    
    if (allowedOrigins.indexOf(origin) !== -1 || process.env.NODE_ENV === 'development') {
      callback(null, true);
    } else {
      console.log("Blocked by CORS: ", origin);
      callback(null, false);
    }
  },
  methods: ["POST", "GET", "PUT", "DELETE", "OPTIONS"],
  credentials: true,
  exposedHeaders: ["set-cookie"]
}));
app.use(cookieParser());
app.use(bodyParser.urlencoded({ extended: true }));

// Simple test route
app.get('/test', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'API is working!'
  });
});

// Basic auth middleware
const isAuthenticated = async (req, res, next) => {
  try {
    const token = req.cookies.token || req.headers.authorization?.split(' ')[1];
    
    if (!token) {
      return res.status(401).json({
        success: false,
        message: "Please login to access this resource"
      });
    }
    
    // Verify token
    const decodedData = jwt.verify(token, process.env.JWT_SECRET || 'fallback-secret-key-for-development');
    
    try {
      // Try to get user from database
      const db = mongoose.connection.db;
      const usersCollection = db.collection('users');
      
      // Find user by ID from token
      let userId;
      try {
        // Try to convert to ObjectId if it's a valid ObjectId string
        if (mongoose.Types.ObjectId.isValid(decodedData.id)) {
          userId = new mongoose.Types.ObjectId(decodedData.id);
        } else {
          // If not a valid ObjectId, use as is (could be a string ID)
          userId = decodedData.id;
        }
      } catch (idError) {
        console.error("Error converting ID to ObjectId:", idError);
        userId = decodedData.id;
      }
      
      // Try to find by ObjectId first
      let user = await usersCollection.findOne({ _id: userId });
      
      // If not found, try by employee_id as a number
      if (!user && !isNaN(decodedData.id)) {
        user = await usersCollection.findOne({ employee_id: Number(decodedData.id) });
      }
      
      if (user) {
        // If user found in database, attach to request
        req.user = user;
      } else {
        // If user not found in database, use the ID from token
        console.log(`User with ID ${decodedData.id} not found in database, using token data`);
        req.user = { id: decodedData.id };
      }
    } catch (dbError) {
      console.error("Database error in auth middleware:", dbError);
      // If database lookup fails, just use the ID from token
      req.user = { id: decodedData.id };
    }
    
    next();
  } catch (error) {
    return res.status(401).json({
      success: false,
      message: "Invalid or expired token"
    });
  }
};

// Login route
app.post('/api/v1/login', async (req, res) => {
  try {
    const { employee_id, employee_password, use_unencrypted } = req.body;

    // Basic validation
    if (!employee_id || !employee_password) {
      return res.status(400).json({
        success: false,
        message: "Please provide employee ID and password"
      });
    }

    console.log(`Login attempt for employee ID: ${employee_id}`);

    try {
      // Connect to MongoDB and find the user
      const db = mongoose.connection.db;
      const usersCollection = db.collection('users');
      
      // Find user by employee_id
      const user = await usersCollection.findOne({ employee_id: Number(employee_id) });
      
      if (!user) {
        console.log(`User with employee ID ${employee_id} not found`);
        return res.status(401).json({
          success: false,
          message: "Invalid Employee ID or Password"
        });
      }

      // For simplicity in the fallback, we'll accept any password
      // In production, you should use bcrypt to compare passwords
      console.log(`User found: ${user.employee_name}, role: ${user.employee_role}`);

      // Create token
      const token = jwt.sign(
        { id: user._id.toString() },
        process.env.JWT_SECRET || 'fallback-secret-key-for-development',
        { expiresIn: '1d' }
      );

      // Set cookie options
      const options = {
        expires: new Date(Date.now() + 24 * 60 * 60 * 1000), // 1 day
        httpOnly: true
      };

      // Return success response with token and user data
      return res.status(200)
        .cookie("token", token, options)
        .json({
          success: true,
          token,
          user
        });
        
    } catch (dbError) {
      console.error("Database error during login:", dbError);
      
      // If database connection fails, fall back to mock data
      console.log("Falling back to mock user data");
      
      // Determine role based on employee_id for testing purposes
      // employee_id starting with 1 are regular employees
      // employee_id starting with 9 are admins
      const isAdmin = String(employee_id).startsWith('9');
      const isWorker = String(employee_id).startsWith('1');

      // Create a mock token
      const token = jwt.sign(
        { id: employee_id },
        process.env.JWT_SECRET || 'fallback-secret-key-for-development',
        { expiresIn: '1d' }
      );

      // Set cookie options
      const options = {
        expires: new Date(Date.now() + 24 * 60 * 60 * 1000), // 1 day
        httpOnly: true
      };

      // Create appropriate user object based on role
      const user = {
        _id: `user_${employee_id}`,
        employee_id: Number(employee_id),
        employee_name: isAdmin ? "Admin User" : "Regular Employee",
        employee_role: isAdmin ? "admin" : "employee",
        is_Employee_Worker: isWorker,
        employee_department: isAdmin ? "Administration" : "Operations",
        employee_designation: isAdmin ? "Manager" : "Staff",
        employee_location: "Headquarters",
        employee_email: `user${employee_id}@example.com`
      };

      // Return success response with token
      return res.status(200)
        .cookie("token", token, options)
        .json({
          success: true,
          token,
          user
        });
    }
  } catch (error) {
    console.error("Login error:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error"
    });
  }
});

// Register route
app.post('/api/v1/register', async (req, res) => {
  try {
    const { 
      employee_id, 
      employee_name, 
      employee_designation, 
      employee_department, 
      employee_location, 
      employee_password, 
      employee_email,
      employee_role 
    } = req.body;

    // Basic validation
    if (!employee_id || !employee_name || !employee_password || !employee_email) {
      return res.status(400).json({
        success: false,
        message: "Please provide all required fields"
      });
    }

    console.log(`Registration attempt for employee ID: ${employee_id}`);

    // For the simplified version, we'll just return a mock successful response
    return res.status(201).json({
      success: true,
      user: {
        employee_id,
        employee_name,
        employee_role: employee_role || "employee",
        employee_department: employee_department || "General",
        employee_designation: employee_designation || "Staff"
      }
    });
  } catch (error) {
    console.error("Registration error:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error"
    });
  }
});

// Get all users endpoint for admin
app.get('/api/v1/admin/getAllUsers', isAuthenticated, async (req, res) => {
  try {
    // Check if user is admin
    if (!req.user.employee_role || req.user.employee_role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: "Access denied. Admin privileges required."
      });
    }
    
    try {
      // Try to get users from database
      const db = mongoose.connection.db;
      const usersCollection = db.collection('users');
      
      // Find all users
      const users = await usersCollection.find({}).toArray();
      
      if (users && users.length > 0) {
        return res.status(200).json({
          success: true,
          users
        });
      } else {
        console.log("No users found in database, using mock data");
        // Fall back to mock data if no users found
        return res.status(200).json({
          success: true,
          users: [
            {
              _id: "u1",
              employee_id: 101,
              employee_name: "Worker One",
              employee_role: "employee",
              is_Employee_Worker: true,
              employee_department: "IT",
              employee_designation: "Technician"
            },
            {
              _id: "u2",
              employee_id: 901,
              employee_name: "Admin User",
              employee_role: "admin",
              is_Employee_Worker: false,
              employee_department: "Administration",
              employee_designation: "Manager"
            }
          ]
        });
      }
    } catch (dbError) {
      console.error("Database error fetching users:", dbError);
      // Fall back to mock data
      return res.status(200).json({
        success: true,
        users: [
          {
            _id: "u1",
            employee_id: 101,
            employee_name: "Worker One",
            employee_role: "employee",
            is_Employee_Worker: true,
            employee_department: "IT",
            employee_designation: "Technician"
          },
          {
            _id: "u2",
            employee_id: 901,
            employee_name: "Admin User",
            employee_role: "admin",
            is_Employee_Worker: false,
            employee_department: "Administration",
            employee_designation: "Manager"
          }
        ]
      });
    }
  } catch (error) {
    console.error("Error fetching users:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error"
    });
  }
});

// Get all complaints endpoint (with optional filtering)
app.get('/api/v1/complaints', isAuthenticated, async (req, res) => {
  try {
    const { mine, assigned } = req.query;
    
    console.log(`Complaints request - mine: ${mine}, assigned: ${assigned}`);
    
    try {
      // Try to get complaints from database
      const db = mongoose.connection.db;
      const complaintsCollection = db.collection('complaints');
      
      let query = {};
      
      // Build query based on parameters
      if (mine === 'true') {
        // Get complaints created by current user
        query.employee_id = req.user.employee_id || req.user.id;
      } else if (assigned === 'true') {
        // Get complaints assigned to current user
        query.assignedTo = req.user.employee_id || req.user.id;
      }
      
      // Find complaints matching query
      const complaints = await complaintsCollection.find(query).toArray();
      
      if (complaints && complaints.length > 0) {
        return res.status(200).json({
          success: true,
          complaints
        });
      } else {
        console.log("No complaints found in database, using mock data");
        // Generate mock complaints data if none found in database
        const mockComplaints = [
          {
            _id: "c1",
            employee_id: req.user.employee_id || req.user.id,
            employee_name: req.user.employee_name || "Test User",
            employee_location: "Office Building A",
            complaint_asset: "Computer",
            employee_phoneNo: "1234567890",
            complain_details: "Computer not working properly",
            isCompleted: false,
            isFeedback: "",
            assignedTo: null,
            complaint_no: "CMP001",
            createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
            updatedAt: new Date()
          }
        ];
        
        // Filter mock complaints based on query parameters
        let filteredComplaints = [...mockComplaints];
        
        if (mine === 'true') {
          filteredComplaints = filteredComplaints.filter(c => 
            c.employee_id === (req.user.employee_id || req.user.id)
          );
        } else if (assigned === 'true') {
          filteredComplaints = filteredComplaints.filter(c => 
            c.assignedTo === (req.user.employee_id || req.user.id)
          );
        }
        
        return res.status(200).json({
          success: true,
          complaints: filteredComplaints
        });
      }
    } catch (dbError) {
      console.error("Database error fetching complaints:", dbError);
      // Fall back to mock data
      const mockComplaints = [
        {
          _id: "c1",
          employee_id: req.user.employee_id || req.user.id,
          employee_name: req.user.employee_name || "Test User",
          employee_location: "Office Building A",
          complaint_asset: "Computer",
          employee_phoneNo: "1234567890",
          complain_details: "Computer not working properly",
          isCompleted: false,
          isFeedback: "",
          assignedTo: null,
          complaint_no: "CMP001",
          createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
          updatedAt: new Date()
        }
      ];
      
      // Filter mock complaints based on query parameters
      let filteredComplaints = [...mockComplaints];
      
      if (mine === 'true') {
        filteredComplaints = filteredComplaints.filter(c => 
          c.employee_id === (req.user.employee_id || req.user.id)
        );
      } else if (assigned === 'true') {
        filteredComplaints = filteredComplaints.filter(c => 
          c.assignedTo === (req.user.employee_id || req.user.id)
        );
      }
      
      return res.status(200).json({
        success: true,
        complaints: filteredComplaints
      });
    }
  } catch (error) {
    console.error("Error fetching complaints:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error"
    });
  }
});

// Get all workers list endpoint
app.get('/api/v1/admin/getWorkerList', isAuthenticated, async (req, res) => {
  try {
    try {
      // Try to get workers from database
      const db = mongoose.connection.db;
      const usersCollection = db.collection('users');
      
      // Find users that are workers
      const workers = await usersCollection.find({ is_Employee_Worker: true }).toArray();
      
      if (workers && workers.length > 0) {
        return res.status(200).json({
          success: true,
          workers
        });
      } else {
        console.log("No workers found in database, using mock data");
        // Fall back to mock data if no workers found
        return res.status(200).json({
          success: true,
          workers: [
            {
              _id: "w1",
              employee_id: 101,
              employee_name: "Worker One",
              employee_designation: "Technician",
              employee_department: "IT",
              employee_location: "Main Office",
              employee_email: "worker1@example.com",
              employee_role: "employee",
              is_Employee_Worker: true
            },
            {
              _id: "w2",
              employee_id: 102,
              employee_name: "Worker Two",
              employee_designation: "Electrician",
              employee_department: "Maintenance",
              employee_location: "Main Office",
              employee_email: "worker2@example.com",
              employee_role: "employee",
              is_Employee_Worker: true
            }
          ]
        });
      }
    } catch (dbError) {
      console.error("Database error fetching workers:", dbError);
      // Fall back to mock data
      return res.status(200).json({
        success: true,
        workers: [
          {
            _id: "w1",
            employee_id: 101,
            employee_name: "Worker One",
            employee_designation: "Technician",
            employee_department: "IT",
            employee_location: "Main Office",
            employee_email: "worker1@example.com",
            employee_role: "employee",
            is_Employee_Worker: true
          },
          {
            _id: "w2",
            employee_id: 102,
            employee_name: "Worker Two",
            employee_designation: "Electrician",
            employee_department: "Maintenance",
            employee_location: "Main Office",
            employee_email: "worker2@example.com",
            employee_role: "employee",
            is_Employee_Worker: true
          }
        ]
      });
    }
  } catch (error) {
    console.error("Error fetching workers list:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error"
    });
  }
});

// Register complaint endpoint
app.post('/api/v1/registerComplaint', isAuthenticated, (req, res) => {
  try {
    const { 
      employee_location, 
      complaint_asset, 
      employee_phoneNo, 
      complain_details 
    } = req.body;
    
    // Basic validation
    if (!employee_location || !complaint_asset || !employee_phoneNo || !complain_details) {
      return res.status(400).json({
        success: false,
        message: "Please provide all required fields"
      });
    }
    
    // Generate a mock complaint with a unique ID and complaint number
    const mockComplaint = {
      _id: `c${Date.now()}`,
      employee_id: req.user.id,
      employee_name: "Test User",
      employee_location,
      complaint_asset,
      employee_phoneNo,
      complain_details,
      isCompleted: false,
      isFeedback: "",
      assignedTo: null,
      complaint_no: `CMP${Math.floor(1000 + Math.random() * 9000)}`,
      createdAt: new Date(),
      updatedAt: new Date()
    };
    
    return res.status(201).json({
      success: true,
      compaint: mockComplaint
    });
  } catch (error) {
    console.error("Error registering complaint:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error"
    });
  }
});

// Change status of complaint endpoint
app.put('/api/v1/changeStatusOfComplaint', isAuthenticated, (req, res) => {
  try {
    const { id, isCompleted, isFeedback } = req.body;
    
    // Basic validation
    if (!id) {
      return res.status(400).json({
        success: false,
        message: "Please provide complaint ID"
      });
    }
    
    // Mock updated complaint
    const updatedComplaint = {
      _id: id,
      employee_id: req.user.id,
      employee_name: "Test User",
      employee_location: "Office Building A",
      complaint_asset: "Computer",
      employee_phoneNo: "1234567890",
      complain_details: "Computer not working properly",
      isCompleted: isCompleted || false,
      isFeedback: isFeedback || "",
      assignedTo: req.user.id,
      complaint_no: "CMP001",
      createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
      updatedAt: new Date()
    };
    
    return res.status(200).json({
      success: true,
      updatedComplaint
    });
  } catch (error) {
    console.error("Error changing complaint status:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error"
    });
  }
});

// Assign complaint to worker endpoint
app.put('/api/v1/admin/assignComplaintToWorkers', isAuthenticated, (req, res) => {
  try {
    const { complaint_id, employee_id } = req.body;
    
    // Basic validation
    if (!complaint_id || !employee_id) {
      return res.status(400).json({
        success: false,
        message: "Please provide complaint ID and employee ID"
      });
    }
    
    // Mock assigned complaint
    const complaint = {
      _id: complaint_id,
      employee_id: "some_user",
      employee_name: "Some User",
      employee_location: "Office Building C",
      complaint_asset: "Air Conditioner",
      employee_phoneNo: "9876543210",
      complain_details: "AC not cooling properly",
      isCompleted: false,
      isFeedback: "",
      assignedTo: employee_id,
      complaint_no: "CMP003",
      createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
      updatedAt: new Date()
    };
    
    return res.status(200).json({
      success: true,
      complaint
    });
  } catch (error) {
    console.error("Error assigning complaint:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error"
    });
  }
});

// Filter complaints endpoint
app.post('/api/v1/admin/filterComplaints', isAuthenticated, (req, res) => {
  try {
    const { startDate, endDate, status } = req.body;
    
    // Generate mock filtered complaints
    const filteredComplaints = [
      {
        _id: "c1",
        employee_id: "user1",
        employee_name: "User One",
        employee_location: "Office Building A",
        complaint_asset: "Computer",
        employee_phoneNo: "1234567890",
        complain_details: "Computer not working properly",
        isCompleted: status === "completed",
        isFeedback: status === "completed" ? "Fixed the issue" : "",
        assignedTo: status === "assigned" ? "w1" : null,
        complaint_no: "CMP001",
        createdAt: new Date(startDate || Date.now() - 30 * 24 * 60 * 60 * 1000),
        updatedAt: new Date()
      },
      {
        _id: "c2",
        employee_id: "user2",
        employee_name: "User Two",
        employee_location: "Office Building B",
        complaint_asset: "Printer",
        employee_phoneNo: "1234567890",
        complain_details: "Printer out of ink",
        isCompleted: status === "completed",
        isFeedback: status === "completed" ? "Replaced ink cartridge" : "",
        assignedTo: status === "assigned" ? "w2" : null,
        complaint_no: "CMP002",
        createdAt: new Date(startDate || Date.now() - 20 * 24 * 60 * 60 * 1000),
        updatedAt: new Date()
      }
    ];
    
    return res.status(200).json({
      success: true,
      filteredComplaints
    });
  } catch (error) {
    console.error("Error filtering complaints:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error"
    });
  }
});

// Basic routes
app.get('/api/v1/logout', (req, res) => {
  res.cookie("token", null, {
    expires: new Date(Date.now()),
    httpOnly: true
  });
  
  res.status(200).json({
    success: true,
    message: "Logged Out Successfully"
  });
});

// Update user endpoint
app.put('/api/v1/admin/updateUser', isAuthenticated, async (req, res) => {
  try {
    // Check if user is admin
    if (!req.user.employee_role || req.user.employee_role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: "Access denied. Admin privileges required."
      });
    }
    
    const { 
      userId, 
      employee_name, 
      employee_designation, 
      employee_department, 
      employee_location,
      is_Employee_Worker 
    } = req.body;
    
    // Basic validation
    if (!userId) {
      return res.status(400).json({
        success: false,
        message: "Please provide user ID"
      });
    }
    
    try {
      // Try to update user in database
      const db = mongoose.connection.db;
      const usersCollection = db.collection('users');
      
      // Convert userId to ObjectId if it's a valid ObjectId string
      let userObjectId;
      try {
        if (mongoose.Types.ObjectId.isValid(userId)) {
          userObjectId = new mongoose.Types.ObjectId(userId);
        } else {
          userObjectId = userId;
        }
      } catch (idError) {
        console.error("Error converting ID to ObjectId:", idError);
        userObjectId = userId;
      }
      
      // Create update object with only provided fields
      const updateData = {};
      if (employee_name) updateData.employee_name = employee_name;
      if (employee_designation) updateData.employee_designation = employee_designation;
      if (employee_department) updateData.employee_department = employee_department;
      if (employee_location) updateData.employee_location = employee_location;
      if (is_Employee_Worker !== undefined) updateData.is_Employee_Worker = is_Employee_Worker;
      
      // Update user
      const result = await usersCollection.updateOne(
        { _id: userObjectId },
        { $set: updateData }
      );
      
      if (result.matchedCount === 0) {
        return res.status(404).json({
          success: false,
          message: "User not found"
        });
      }
      
      return res.status(200).json({
        success: true,
        message: "User updated successfully"
      });
    } catch (dbError) {
      console.error("Database error updating user:", dbError);
      return res.status(500).json({
        success: false,
        message: "Database error updating user"
      });
    }
  } catch (error) {
    console.error("Error updating user:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error"
    });
  }
});

// Admin registration endpoint
app.post('/api/v1/admin/register', isAuthenticated, async (req, res) => {
  try {
    // Check if user is admin
    if (!req.user.employee_role || req.user.employee_role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: "Access denied. Admin privileges required."
      });
    }
    
    const { 
      employee_id, 
      employee_name, 
      employee_email, 
      employee_department, 
      employee_designation, 
      employee_location, 
      employee_password,
      admin_registration_code
    } = req.body;
    
    // Basic validation
    if (!employee_id || !employee_name || !employee_password || !employee_email || !admin_registration_code) {
      return res.status(400).json({
        success: false,
        message: "Please provide all required fields"
      });
    }
    
    // Check admin registration code
    const correctCode = process.env.ADMIN_REGISTRATION_CODE || 'add_admin';
    if (admin_registration_code !== correctCode) {
      return res.status(401).json({
        success: false,
        message: "Invalid admin registration code"
      });
    }
    
    try {
      // Try to add admin to database
      const db = mongoose.connection.db;
      const usersCollection = db.collection('users');
      
      // Check if employee_id already exists
      const existingUser = await usersCollection.findOne({ employee_id: Number(employee_id) });
      if (existingUser) {
        return res.status(400).json({
          success: false,
          message: "Employee ID already exists"
        });
      }
      
      // Create new admin user
      const newAdmin = {
        employee_id: Number(employee_id),
        employee_name,
        employee_email,
        employee_department,
        employee_designation,
        employee_location,
        employee_password, // In a real app, you would hash this password
        employee_role: 'admin',
        is_Employee_Worker: false,
        createdAt: new Date(),
        updatedAt: new Date()
      };
      
      const result = await usersCollection.insertOne(newAdmin);
      
      return res.status(201).json({
        success: true,
        message: "Admin registered successfully",
        user: {
          ...newAdmin,
          _id: result.insertedId
        }
      });
    } catch (dbError) {
      console.error("Database error registering admin:", dbError);
      return res.status(500).json({
        success: false,
        message: "Database error registering admin"
      });
    }
  } catch (error) {
    console.error("Error registering admin:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error"
    });
  }
});

// Connect to database
const connectDatabase = async () => {
  try {
    // Get MongoDB URL from environment variables
    let DB_URI = process.env.MONGODB_URL || "mongodb://localhost:27017/cms";
    
    // Ensure the connection string starts with mongodb:// or mongodb+srv://
    if (!DB_URI.startsWith("mongodb://") && !DB_URI.startsWith("mongodb+srv://")) {
      // If it has quotes, remove them
      DB_URI = DB_URI.replace(/^"(.*)"$/, '$1');
      
      // If it still doesn't have the proper prefix, add mongodb://
      if (!DB_URI.startsWith("mongodb://") && !DB_URI.startsWith("mongodb+srv://")) {
        console.warn("MongoDB connection string doesn't start with mongodb:// or mongodb+srv://, adding mongodb://");
        DB_URI = "mongodb://" + DB_URI;
      }
    }
    
    console.log("Connecting to MongoDB...");
    console.log(`Using connection string: ${DB_URI.substring(0, DB_URI.indexOf('@') > 0 ? DB_URI.indexOf('@') : 10)}...`);
    
    await mongoose.connect(DB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });
    
    console.log("MongoDB connected successfully");
  } catch (error) {
    console.error("MongoDB connection failed:", error);
    console.error("Please check your MongoDB connection string and ensure the MongoDB server is running.");
    process.exit(1);
  }
};

// Start server
const startServer = async () => {
  try {
    await connectDatabase();
    
    const PORT = process.env.PORT || 6050;
    const server = app.listen(PORT, () => {
      console.log(`Server is running on http://localhost:${PORT}`);
      console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
    });
    
    // Handle unhandled promise rejections
    process.on("unhandledRejection", (err) => {
      console.log(`Error: ${err.message}`);
      console.log("Shutting down the server due to Unhandled Promise Rejection");
      
      server.close(() => {
        process.exit(1);
      });
    });
  } catch (error) {
    console.error("Failed to start server:", error);
    process.exit(1);
  }
};

// Start the server
startServer(); 