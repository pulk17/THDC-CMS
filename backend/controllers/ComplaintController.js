const catchAsyncError = require("../middleware/catchAsyncError.js");
const Complaints = require("../models/complaintModel.js");
const User = require("../models/userModel.js");
const mongoose = require("mongoose");
const ErrorHandler = require("../utils/errorhandler.js");
const sendToken = require("../utils/jwtToken.js");

// register a complaint:-
exports.registerComplaint = catchAsyncError(async (req, res, next) => {
  const allComplaints = await Complaints.find();
  const len = allComplaints.length;
  req.body.employee_id = req.user.id;
  req.body.complaint_id = "C" + String(len + 1);
  const complaint = await Complaints.create(req.body);
  res.status(201).json({
    success: true,
    complaint,
  });
});

//get the detail of complaint
exports.getComplaintDetails = catchAsyncError(async (req, res, next) => {
  const complaint = await Complaints.findById(req.params.id);
  if (!complaint) {
    return next(new ErrorHandler("Such Complaint", 404));
  }
  res.status(200).json({
    success: true,
    complaint,
  });
});

// status of own complaint:-(both user and admin)
exports.getAllComplaintOfEmployee = catchAsyncError(async (req, res, next) => {
  const allComplaints = await Complaints.find({ employee_id: req.user.id });

  if (!allComplaints) {
    return next(new ErrorHandler("No complaints found for this employee", 404));
  }

  res.status(200).json({
    success: true,
    allComplaints: allComplaints,
  });
});

// get new Complaints(--admin can access this feature)
exports.getNewComplaints = catchAsyncError(async (req, res, next) => {
  const allComplaints = await Complaints.find({ status: "Opened" });

  if (allComplaints.length === 0) {
    return next(new ErrorHandler("No new complaints found", 404));
  }

  res.status(200).json({
    success: true,
    allComplaints: allComplaints,
  });
});

// get pending Complaints(--admin can access this feature)
exports.getPendingComplaints = catchAsyncError(async (req, res, next) => {
  const allComplaints = await Complaints.find({ status: "Incomplete" });

  res.status(200).json({
    success: true,
    allComplaints: allComplaints,
  });
});

//get all workers : admin
exports.getAllWorkers = catchAsyncError(async (req, res, next) => {
  const workers = await User.find({ is_Employee_Worker: true }).select(
    "employee_id employee_name"
  );

  if (!workers || workers.length === 0) {
    return next(new ErrorHandler("No workers found", 404));
  }

  res.status(200).json({
    success: true,
    workers: workers,
  });
});

//get all complaints in system:-
exports.getAllComplaints = catchAsyncError(async (req, res, next) => {
  const allComplaints = await Complaints.find().populate({
    path: "employee_id",
    select: "employee_id employee_name", // Specify the fields you want to include
  });

  res.status(200).json({
    success: true,
    allComplaints: allComplaints,
  });
});

//assign task to workers:-
exports.assignComplaintToWorkers = catchAsyncError(async (req, res, next) => {
  const { complaint_id, employee_id } = req.body;
  const complaint = await Complaints.findById(complaint_id);

  if (!complaint) {
    return next(new ErrorHandler("Complaint Not Found !", 401));
  }

  const employee = await User.findById(employee_id);

  if (!employee) {
    return next(new ErrorHandler("Employee Not Found!", 404));
  }

  complaint.attended_by = {
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


// find all arrived complaints of users:-
exports.findArrivedComplaint = catchAsyncError(async (req, res, next) => {
  
  const complaints = await Complaints.find({"attended_by.id" : req.user.id}).populate({
    path: "employee_id",
    select: "employee_id employee_name", // Specify the fields you want to include
  });
;

  if (!complaints) {
    return next(new ErrorHandler("No complaint for you", 401));
  }

  res.status(200).json({
    success: true,
    complaints,
  });
});


//change the status of work mark it as completed:-
exports.changeStatusOfComplaint = catchAsyncError(async (req, res, next) => {

  const {complaint_id , isCompleted} = req.body
  
  const complaint = await Complaints.findById(complaint_id);

  if (!complaint) {
    return next(new ErrorHandler("Wrong complaint id", 401));
  }

  if(isCompleted){
     complaint.status = "Closed"
     complaint.closed_date = Date.now()
  }

  await complaint.save()

  res.status(200).json({
    success: true,
    message : "Complaint Closed Successfully",
    complaint,
  });
});
