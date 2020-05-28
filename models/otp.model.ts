import { ObjectId } from "mongodb";

const mongoose = require('mongoose');

const otpSchema = mongoose.Schema({
    userId: {
        type: ObjectId
    },
    otp: {
        type: Number
    },
    timestamp: {
        type: Date
    }
})

const OTP = mongoose.model('otp', otpSchema);
export default OTP;