const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const {Schema} = mongoose

const userSchema = new Schema({
    employee_id :{
        type : Number,
        required :[true , "Please Enter Your id"]
    },
    employee_role: {
        type: String,
        default: "employee", // Example default role
        select: true // whether to show or not 
    },
    is_Employee_Worker:{
         type:Boolean,
         default:false,
    },
    employee_name:{
        type : String,
        required : [true , "Please Enter Your Name"]
    },
    employee_designation:{
        type:String,
        required : [true , "Please Enter Your Designation"]
    },
    employee_department:{
        type:String,
        required : [true , "Please Enter Your Department"]
    },
    employee_location:{
        type:String,
        required : [true , "Please Enter Your Location"]
    },
    employee_password:{
            type: String,
            required: [true, "Please Enter Your Password"],
    },
    employee_email:{
        type: String,
        required: [true, "Please Enter Your Email"],
        validate: [validator.isEmail, "Please Enter a valid Email"],
    },
    createdAt: {
        type: Date,
        default: Date.now(),
      },
})


//for converting password
//userSchema.pre("save",async function(next){
//    if(!this.isModified('employee_password')){
//        next();
//    }
//    this.employee_password = await bcrypt.hash(this.employee_password , 10);
//})

//JWT TOKEN:-
const JWT_SECRET = "KJGFSDJKGJFDLKGJHFOIAHJSFKAJHKAJ";
const JWT_EXPIRE = "5d";

userSchema.methods.getJWTToken = function(){
    return jwt.sign({id : this._id} , JWT_SECRET , {
        expiresIn : JWT_EXPIRE,
    })
}

//compare password
//userSchema.methods.comparePassword = async function (enteredPassword, next) {
//    return await bcrypt.compare(enteredPassword, this.employee_password);
//  };

// Compare password without hashing
userSchema.methods.comparePassword = async function(enteredPassword) {
    return enteredPassword === this.employee_password; // Direct comparison
};

module.exports = mongoose.model("User" , userSchema) 

