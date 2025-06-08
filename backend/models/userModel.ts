import mongoose, { Document, Schema, Model } from "mongoose";
import validator from "validator";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";

// Load environment variables
dotenv.config({ path: "config.env" });

// Define the User interface
export interface IUser extends Document {
    employee_id: number;
    employee_role: 'admin' | 'employee';
    is_Employee_Worker: boolean;
    employee_name: string;
    employee_designation: string;
    employee_department: string;
    employee_location: string;
    employee_password: string;
    employee_email: string;
    createdAt: Date;
    __v: number;
    getJWTToken(): string;
    comparePassword(enteredPassword: string): Promise<boolean>;
}

const userSchema = new Schema<IUser>({
    employee_id: {
        type: Number,
        required: [true, "Please Enter Your id"]
    },
    employee_role: {
        type: String,
        default: "employee", // Example default role
        select: true // whether to show or not 
    },
    is_Employee_Worker: {
        type: Boolean,
        default: false,
    },
    employee_name: {
        type: String,
        required: [true, "Please Enter Your Name"]
    },
    employee_designation: {
        type: String,
        required: [true, "Please Enter Your Designation"]
    },
    employee_department: {
        type: String,
        required: [true, "Please Enter Your Department"]
    },
    employee_location: {
        type: String,
        required: [true, "Please Enter Your Location"]
    },
    employee_password: {
        type: String,
        required: [true, "Please Enter Your Password"],
    },
    employee_email: {
        type: String,
        required: [true, "Please Enter Your Email"],
        validate: [validator.isEmail, "Please Enter a valid Email"],
    },
    createdAt: {
        type: Date,
        default: Date.now(),
    },
    __v: {
        type: Number,
        default: 0
    }
}, { timestamps: true });

// Hash password before saving
userSchema.pre("save", async function(this: IUser, next) {
    if (!this.isModified('employee_password')) {
        return next();
    }
    this.employee_password = await bcrypt.hash(this.employee_password, 10);
    next();
});

// JWT TOKEN with 2-day expiry
userSchema.methods.getJWTToken = function(this: IUser): string {
    return jwt.sign(
        { id: this._id }, 
        process.env.JWT_SECRET || "KJGFSDJKGJFDLKGJHFOIAHJSFKAJHKAJ", // Fallback to a default secret
        {
            expiresIn: "2d" // Token expires after 2 days
        }
    );
};

// Compare password with hashed password in database
userSchema.methods.comparePassword = async function(this: IUser, enteredPassword: string): Promise<boolean> {
    return await bcrypt.compare(enteredPassword, this.employee_password);
};

const User: Model<IUser> = mongoose.model<IUser>("User", userSchema);

export default User; 