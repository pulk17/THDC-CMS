const catchAsyncError = require('../middleware/catchAsyncError.js');
const Complaints = require('../models/complaintModel.js')
const User = require('../models/userModel.js')
const mongoose = require('mongoose');
const ErrorHandler = require('../utils/errorhandler.js');
const sendToken = require('../utils/jwtToken.js');

// register a complaint:-
exports.registerComplaint = catchAsyncError(async (req, res, next) => {
    req.body.employee_id = req.user.id;
    const complaint = await Complaints.create(req.body);
    res.status(201).json({
       success: true,
       complaint
    });
});

//get the detail of complaint
exports.getComplaintDetails = catchAsyncError(async(req,res,next)=>{
    const complaint = await Complaints.findById(req.params.id)
    if(!complaint){
        return next(new ErrorHandler("Such Complaint", 404));
    }
    res.status(200).json({
        success:true,
        complaint
    })
})


// status of own complaint:-(both user and admin)
exports.getAllComplaintOfEmployee = catchAsyncError(async(req,res,next)=>{
    const allComplaints = await Complaints.find({'employee_id': req.user.id});
    
    if (!allComplaints) {
        return next(new ErrorHandler("No complaints found for this employee", 404));
    }
    
    res.status(200).json({
        success: true,
        allComplaints: allComplaints
    });
});



// get new Complaints(--admin can access this feature)
exports.getNewComplaints = catchAsyncError(async(req, res, next) => {
    const allComplaints = await Complaints.find({ 'status': "Opened" });
    
    if (allComplaints.length === 0) {
        return next(new ErrorHandler("No new complaints found", 404));
    }
    
    res.status(200).json({
        success: true,
        allComplaints: allComplaints
    });
});

// get pending Complaints(--admin can access this feature)
exports.getPendingComplaints = catchAsyncError(async(req, res, next) => {
    const allComplaints = await Complaints.find({ 'status': "Incomplete" });
    
    res.status(200).json({
        success: true,
        allComplaints: allComplaints
    });
});



//get all workers : admin
exports.getAllWorkers = catchAsyncError(async (req, res, next) => {
    const workers = await User.find({ is_Employee_Worker: true }).select('employee_id employee_name');

    if (!workers || workers.length === 0) {
        return next(new ErrorHandler("No workers found", 404));
    }

    res.status(200).json({
        success: true,
        workers: workers
    });
});



