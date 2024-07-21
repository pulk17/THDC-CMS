const catchAsyncError = require('../middleware/catchAsyncError.js')
const User = require('../models/userModel.js')
const ErrorHandler = require('../utils/errorhandler.js')
const sendToken = require('../utils/jwtToken.js')


//register a employee
exports.registerEmployee = catchAsyncError(async(req,res,next)=>{
     const {employee_id ,employee_name, employee_designation ,
        employee_department,employee_location,employee_password ,employee_email} = req.body

        const newUser = await User.findOne({"employee_id" : employee_id})
        if(newUser){
            return next(new ErrorHandler("Employee Already Registered !",401));
        }

        const user = await User.create({
            employee_id ,employee_name, employee_designation ,
        employee_department,employee_location,employee_password ,employee_email
        })

        res.status(200).json({
            success : true,
            user : user
        })
})


//login as a employee
exports.loginUserAsEmployee = catchAsyncError(async(req,res,next)=>{
    const {employee_id , employee_password} = req.body;

    if(!employee_id && !employee_password){
        return next(new ErrorHandler("Invalid Id and Password",401))
    }

    const user = await User.findOne({ "employee_id": employee_id }).select("+employee_role +employee_password");

   

    if(!user){
        return next(new ErrorHandler("User Not Registered",401))
    }

    if(user.employee_role  != "employee"){
        return next(new ErrorHandler("This Id is registered as Admin !",401))
    }

    const isPasswordMatched = await user.comparePassword(employee_password)
    if(!isPasswordMatched){
        return (next(new ErrorHandler("Invalid Id and password",401)));
    }
    sendToken(user , 200 , res)
})

//login as a ADMIN
exports.loginUserAsAdmin = catchAsyncError(async(req,res,next)=>{
    const {employee_id , employee_password} = req.body;

    if(!employee_id && !employee_password){
        return next(new ErrorHandler("Invalid Id and Password",401))
    }

    const user = await User.findOne({"employee_id" : employee_id}).select("+employee_role  +employee_password");

   

    if(!user){
        return next(new ErrorHandler("User Not Registered",401))
    }

    if(user.employee_role  != "admin"){
        return next(new ErrorHandler("This Id is Not registered as Admin !",401))
    }

    const isPasswordMatched = await user.comparePassword(employee_password)
    if(!isPasswordMatched){
        return (next(new ErrorHandler("Invalid Id and password",401)));
    }
    sendToken(user , 200 , res)
})

//Logout a User:-
exports.LogoutUser = catchAsyncError(async(req,res,next)=>{
    await res.cookie("token",null,{
         expires: new Date(Date.now()),
         httpOnly : true
     })
     res.status(200).json({
         success:true,
         message:"LOGGED OUT SUCCESSFULLY !"
     })
 })

