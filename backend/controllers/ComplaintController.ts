import { Request, Response, NextFunction } from 'express';
import mongoose from 'mongoose';
import Complaint from '../models/complaintModel';
import User from '../models/userModel';
// @ts-ignore
import ErrorHandler from '../utils/errorhandler';
// @ts-ignore
import catchAsyncError from '../middleware/catchAsyncError';

// Define interfaces
interface FilterOptions {
  status?: string;
  employee_id?: mongoose.Types.ObjectId | string;
  "attended_by.id"?: mongoose.Types.ObjectId | string;
  created_date?: { $gte: Date, $lte: Date };
}

interface ComplaintRequest extends Request {
  user?: {
    id: string;
    role: string;
  };
}

// Define interfaces for models
interface IEmployee {
  _id: mongoose.Types.ObjectId;
  employee_name: string;
}

interface IComplaint extends mongoose.Document {
  complaint_id: string;
  employee_id: string | { employee_id: string; employee_name: string; employee_department: string };
  complaint_asset: string;
  complain_details: string;
  employee_phoneNo: string;
  employee_location: string;
  status: string;
  created_date: Date;
  closed_date?: Date;
  attended_by?: {
    id?: mongoose.Types.ObjectId;
    name?: string;
  };
  feedback?: string;
}

// Helper function to handle not found errors
const handleNotFound = (message: string, next: NextFunction): void => {
  next(new ErrorHandler(message, 404));
};

// Helper function to get complaints with filter
const getFilteredComplaints = async (
  filter: FilterOptions, 
  populateOptions = { path: "employee_id", select: "employee_id employee_name employee_department" }
) => {
  return await Complaint.find(filter).populate(populateOptions);
};

// register a complaint
export const registerComplaint = catchAsyncError(async (req: ComplaintRequest, res: Response, next: NextFunction) => {
  const allComplaints = await Complaint.find();
  const complaintCount = allComplaints.length;
  
  const complaintData = {
    ...req.body,
    employee_id: req.user?.id,
    complaint_id: `C${complaintCount + 1}`
  };
  
  const complaint = await Complaint.create(complaintData);
  
  res.status(201).json({
    success: true,
    complaint,
  });
});

// get complaint by ID
export const getComplaintDetails = catchAsyncError(async (req: ComplaintRequest, res: Response, next: NextFunction) => {
  const complaint = await Complaint.findById(req.params.id);
  
  if (!complaint) {
    return handleNotFound("Complaint not found", next);
  }
  
  res.status(200).json({
    success: true,
    complaint,
  });
});

// Get complaints with a unified approach based on filters
export const getComplaints = catchAsyncError(async (req: ComplaintRequest, res: Response, next: NextFunction) => {
  const { status, mine, assigned } = req.query;
  let filter: FilterOptions = {};
  
  // Apply filters based on query parameters
  if (status) {
    filter.status = status as string;
  }
  
  if (mine === 'true' && req.user) {
    filter.employee_id = req.user.id;
  }
  
  if (assigned === 'true' && req.user) {
    filter["attended_by.id"] = req.user.id;
  }
  
  const complaints = await getFilteredComplaints(filter);
  
  if (!complaints.length) {
    return res.status(200).json({
      success: true,
      message: "No complaints found matching the criteria",
      complaints: []
    });
  }
  
  res.status(200).json({
    success: true,
    complaints,
  });
});

// Get all workers (admin only)
export const getAllWorkers = catchAsyncError(async (req: Request, res: Response, next: NextFunction) => {
  const workers = await User.find({ is_Employee_Worker: true }).select("employee_id employee_name");
  
  if (!workers.length) {
    return handleNotFound("No workers found", next);
  }
  
  res.status(200).json({
    success: true,
    workers,
  });
});

// Assign complaint to worker (admin only)
export const assignComplaintToWorkers = catchAsyncError(async (req: Request, res: Response, next: NextFunction) => {
  const { complaint_id, employee_id } = req.body;
  
  const complaint = await Complaint.findById(complaint_id);
  const employee = await User.findById(employee_id);
  
  if (!complaint) {
    return handleNotFound("Complaint not found", next);
  }
  
  if (!employee) {
    return handleNotFound("Employee not found", next);
  }
  
  // Use type assertion to handle the type mismatch
  (complaint as any).attended_by = {
    id: employee._id,
    name: employee.employee_name,
  };
  
  complaint.status = "Processing";
  
  await complaint.save();
  
  res.status(200).json({
    success: true,
    message: "Complaint assigned successfully",
    complaint,
  });
});

// Change status of complaint (mark as completed)
export const changeStatusOfComplaint = catchAsyncError(async (req: Request, res: Response, next: NextFunction) => {
  const { complaint_id, isCompleted, isFeedback } = req.body;
  
  const complaint = await Complaint.findById(complaint_id).populate({
    path: "employee_id",
    select: "employee_id employee_name",
  });
  
  if (!complaint) {
    return handleNotFound("Complaint not found", next);
  }
  
  if (isCompleted) {
    complaint.status = "Closed";
    // Use type assertion for feedback property
    (complaint as any).feedback = isFeedback;
    (complaint as any).closed_date = new Date();
  }
  
  await complaint.save();
  
  res.status(200).json({
    success: true,
    message: "Complaint status updated successfully",
    complaint,
  });
});

// Parse date from DD/MM/YY format
const parseDate = (dateStr: string): Date => {
  const [day, month, year] = dateStr.split('/').map(Number);
  const fullYear = year >= 100 ? year : 2000 + year;
  return new Date(fullYear, month - 1, day);
};

// Filter complaints by date range and status
export const filterComplaint = catchAsyncError(async (req: Request, res: Response, next: NextFunction) => {
  const { startDate, endDate, status } = req.body;
  
  if (!startDate || !endDate) {
    return next(new ErrorHandler("Start date and end date are required", 400));
  }
  
  const start = parseDate(startDate);
  const end = parseDate(endDate);
  
  if (start > end) {
    return next(new ErrorHandler("Start date must be before end date", 400));
  }
  
  const filter: FilterOptions = {
    created_date: { $gte: start, $lte: end }
  };
  
  if (status) {
    filter.status = status;
  }
  
  const complaints = await Complaint.find(filter);
  
  res.status(200).json({
    success: true,
    message: "Complaints fetched successfully",
    complaints
  });
}); 