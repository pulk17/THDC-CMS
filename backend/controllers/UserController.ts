import { Request, Response, NextFunction } from 'express';
import User from '../models/userModel';
// @ts-ignore
import ErrorHandler from '../utils/errorhandler';
// @ts-ignore
import sendToken from '../utils/jwtToken';
// @ts-ignore
import catchAsyncError from '../middleware/catchAsyncError';

interface UserRequest extends Request {
  user?: {
    id: string;
  };
}

// Register a user
export const registerUser = catchAsyncError(async (req: Request, res: Response, next: NextFunction) => {
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

  // Check if user already exists
  const [existingUser, existingEmail] = await Promise.all([
    User.findOne({ employee_id }),
    User.findOne({ employee_email })
  ]);

  if (existingUser) {
    return next(new ErrorHandler("Employee ID already registered!", 400));
  }

  if (existingEmail) {
    return next(new ErrorHandler("Email already registered!", 400));
  }

  // Create user
  const user = await User.create({
    employee_id,
    employee_name,
    employee_designation,
    employee_department,
    employee_location,
    employee_password,
    employee_email,
    employee_role: employee_role || "employee" // Default to employee if not specified
  });

  sendToken(user, 201, res);
});

// Login user
export const loginUser = catchAsyncError(async (req: Request, res: Response, next: NextFunction) => {
  const { employee_id, employee_password, use_unencrypted } = req.body;

  // Validate inputs
  if (!employee_id || !employee_password) {
    return next(new ErrorHandler("Please enter Employee ID and Password", 400));
  }

  // Find user
  const user = await User.findOne({ employee_id }).select("+employee_password");

  if (!user) {
    return next(new ErrorHandler("Invalid Employee ID or Password", 401));
  }

  let isAuthenticated = false;

  // First try normal password comparison (bcrypt)
  const isPasswordMatched = await user.comparePassword(employee_password);
  
  if (isPasswordMatched) {
    isAuthenticated = true;
  } 
  // If normal authentication fails and unencrypted flag is set, try direct comparison
  else if (use_unencrypted) {
    // TEMPORARY: Direct string comparison for unencrypted passwords
    if (user.employee_password === employee_password) {
      isAuthenticated = true;
      console.log("WARNING: Authenticated with unencrypted password");
      
      // Update the user's password to be encrypted for future logins
      user.employee_password = employee_password; // This will be hashed by the pre-save hook
      await user.save();
      console.log("User password has been encrypted for future logins");
    }
  }

  if (!isAuthenticated) {
    return next(new ErrorHandler("Invalid Employee ID or Password", 401));
  }

  sendToken(user, 200, res);
});

// Logout user
export const logoutUser = catchAsyncError(async (req: Request, res: Response, next: NextFunction) => {
  res.cookie("token", null, {
    expires: new Date(Date.now()),
    httpOnly: true
  });
  
  res.status(200).json({
    success: true,
    message: "Logged Out Successfully"
  });
});

// Get user details
export const getUserDetails = catchAsyncError(async (req: UserRequest, res: Response, next: NextFunction) => {
  if (!req.user || !req.user.id) {
    return next(new ErrorHandler("User not authenticated", 401));
  }

  const user = await User.findById(req.user.id);
  
  if (!user) {
    return next(new ErrorHandler("User not found", 404));
  }
  
  res.status(200).json({
    success: true,
    user
  });
});

// Register an admin (secure method)
export const registerAdmin = catchAsyncError(async (req: Request, res: Response, next: NextFunction) => {
  try {
    const {
      employee_id,
      employee_name,
      employee_designation,
      employee_department,
      employee_location,
      employee_password,
      employee_email,
      admin_registration_code
    } = req.body;

    // Log registration attempt (without sensitive data)
    console.log(`Admin registration attempt for employee_id: ${employee_id}, email: ${employee_email}`);
    
    // Check for missing required fields
    if (!employee_id || !employee_name || !employee_designation || 
        !employee_department || !employee_location || !employee_password || 
        !employee_email || !admin_registration_code) {
      return next(new ErrorHandler("All fields are required for admin registration", 400));
    }

    // Verify admin registration code
    const validRegistrationCode = process.env.ADMIN_REGISTRATION_CODE;
    
    if (!validRegistrationCode) {
      console.error("ADMIN_REGISTRATION_CODE not set in environment variables");
      return next(new ErrorHandler("Server configuration error: Admin registration is not properly configured", 500));
    }
    
    if (admin_registration_code !== validRegistrationCode) {
      console.log(`Invalid admin registration code provided: ${admin_registration_code}`);
      return next(new ErrorHandler("Invalid admin registration code", 401));
    }

    // Check if user already exists
    const [existingUser, existingEmail] = await Promise.all([
      User.findOne({ employee_id }),
      User.findOne({ employee_email })
    ]);

    if (existingUser) {
      return next(new ErrorHandler("Employee ID already registered!", 400));
    }

    if (existingEmail) {
      return next(new ErrorHandler("Email already registered!", 400));
    }

    // Create admin user
    const user = await User.create({
      employee_id,
      employee_name,
      employee_designation,
      employee_department,
      employee_location,
      employee_password,
      employee_email,
      employee_role: "admin" // Set role to admin
    });

    console.log(`Admin user created successfully: ${employee_id}, ${employee_email}`);
    sendToken(user, 201, res);
  } catch (error) {
    console.error("Error in registerAdmin:", error);
    return next(new ErrorHandler("Failed to register admin user", 500));
  }
});

// Get all users (admin only)
export const getAllUsers = catchAsyncError(async (req: Request, res: Response, next: NextFunction) => {
  const users = await User.find();
  
  res.status(200).json({
    success: true,
    users
  });
});

// Delete a user (admin only)
export const deleteUser = catchAsyncError(async (req: Request, res: Response, next: NextFunction) => {
  const user = await User.findById(req.params.id);
  
  if (!user) {
    return next(new ErrorHandler("User not found", 404));
  }
  
  await User.findByIdAndDelete(req.params.id);
  
  res.status(200).json({
    success: true,
    message: "User deleted successfully"
  });
});

// Update user details (admin only)
export const updateUser = catchAsyncError(async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { 
      userId,
      employee_name,
      employee_designation,
      employee_department,
      employee_location,
      is_Employee_Worker
    } = req.body;
    
    // Check if user exists
    const user = await User.findById(userId);
    
    if (!user) {
      return next(new ErrorHandler("User not found", 404));
    }
    
    // Update user fields
    if (employee_name) user.employee_name = employee_name;
    if (employee_designation) user.employee_designation = employee_designation;
    if (employee_department) user.employee_department = employee_department;
    if (employee_location) user.employee_location = employee_location;
    
    // Update worker status if provided
    if (is_Employee_Worker !== undefined) {
      user.is_Employee_Worker = is_Employee_Worker;
    }
    
    await user.save();
    
    res.status(200).json({
      success: true,
      message: "User updated successfully",
      user
    });
  } catch (error) {
    console.error("Error in updateUser:", error);
    return next(new ErrorHandler("Failed to update user", 500));
  }
}); 