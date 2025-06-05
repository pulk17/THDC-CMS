const mongoose = require('mongoose');

const { Schema } = mongoose;

const ComplaintSchema = new Schema({
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
        type: mongoose.Schema.ObjectId,
        ref: "User",
        required: true
    },
    created_date: {
        type: Date,
        default: Date.now,
    },
    feedback: {
        type: String,
        default: "",
    },
    status: {
        type: String,
        default: "Opened"
    },
    attended_by:{
        id : {
          type: mongoose.Schema.ObjectId,
          ref: "User",
          default:null
        },
        name : {
            type : String,
            default:""
        }
    },
    closed_date:{
        type : Date,
        default:null
    }
});

module.exports = mongoose.model('Complaints', ComplaintSchema);
