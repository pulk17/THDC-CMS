import mongoose, { Document, Schema, Model } from 'mongoose';
import { IUser } from './userModel';

// Define the Complaint interface
export interface IComplaint extends Document {
    employee_location: string;
    complaint_asset: string;
    complaint_id: string;
    employee_phoneNo: number;
    complain_details: string;
    employee_id: mongoose.Types.ObjectId | IUser;
    status: 'Opened' | 'Processing' | 'Closed';
    attended_by: {
        id?: mongoose.Types.ObjectId;
        name?: string;
    };
    closed_date: Date | null;
    created_date: Date;
    __v: number;
}

const ComplaintSchema = new Schema<IComplaint>({
    employee_location: {
        type: String,
        required: [true, "Please enter your Location"]
    },
    complaint_asset: {
        type: String,
        required: [true, "Please enter your Asset"]
    },
    complaint_id: {
        type: String,
    },
    employee_phoneNo: {
        type: Number,
        required: [true, "Please enter your Phone Number"],
        minLength: [10, "Please Enter valid Phone No"],
        maxLength: [10, "Please Enter valid Phone No"]
    },
    complain_details: {
        type: String,
        required: [true, "Please Enter the details"]
    },
    employee_id: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    status: {
        type: String,
        default: "Opened"
    },
    attended_by: {
        type: Object,
        default: {}
    },
    closed_date: {
        type: Date,
        default: null
    },
    created_date: {
        type: Date,
        default: Date.now
    },
    __v: {
        type: Number,
        default: 0
    }
}, { timestamps: false });

const Complaint: Model<IComplaint> = mongoose.model<IComplaint>('Complaints', ComplaintSchema);

export default Complaint; 