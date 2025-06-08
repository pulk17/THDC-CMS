import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import User from '../models/userModel';
// @ts-ignore
import ErrorHandler from '../utils/errorhandler';
// @ts-ignore
import catchAsyncError from './catchAsyncError';

// Load environment variables
dotenv.config({ path: "config.env" });

// Extend Request type to include user property
interface AuthenticatedRequest extends Request {
  user?: any;
  cookies: {
    token?: string;
  };
  headers: {
    authorization?: string;
    [key: string]: any;
  };
}

export const isAuthenticatedUser = catchAsyncError(async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  let token;
  
  // Check for token in cookies
  if (req.cookies.token) {
    token = req.cookies.token;
  } 
  // Check for token in Authorization header
  else if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1];
  }
  
  // Log the authentication attempt for debugging
  console.log(`Auth attempt: Cookie token: ${!!req.cookies.token}, Auth header: ${!!req.headers.authorization}`);
  
  if (!token) {
    return next(new ErrorHandler("Please Login to access this feature", 401));
  }
  
  try {
    const JWT_SECRET = process.env.JWT_SECRET || "KJGFSDJKGJFDLKGJHFOIAHJSFKAJHKAJ";
    const decodedData = jwt.verify(token, JWT_SECRET) as { id: string };
    
    const user = await User.findById(decodedData.id);
    
    if (!user) {
      return next(new ErrorHandler("User not found with this token", 401));
    }
    
    req.user = user;
    
    // Log successful authentication
    console.log(`User authenticated: ${user.employee_id} (${user.employee_role})`);
    
    next();
  } catch (error) {
    console.error("Token verification error:", error);
    return next(new ErrorHandler("Invalid or expired token", 401));
  }
});

export const authorizeRoles = (...roles: string[]) => {
  return (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    if (!req.user) {
      return next(new ErrorHandler("User not authenticated", 401));
    }
    
    if (!roles.includes(req.user.employee_role)) {
      console.log(`Role authorization failed: User role is ${req.user.employee_role}, required roles: ${roles.join(', ')}`);
      return next(
        new ErrorHandler(
          `Role: ${req.user.employee_role} is not allowed to use this resource`,
          403
        )
      );
    }
    
    console.log(`Role authorized: ${req.user.employee_role}`);
    next();
  };
}; 