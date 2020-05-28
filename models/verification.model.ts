import { ObjectId } from "mongodb";

const mongoose = require('mongoose');

const verificaitionSchema = mongoose.Schema({
    userId: {
        type: ObjectId
    },
    fullname: {
        type: String
    },
    dob: {
        type: Date
    },
    reason: {
        type: String
    },
    file: {
        type: String
    },
    accepted: {
        type: Boolean
    },
    timestamp: {
        type: Date
    }
})

const Verification = mongoose.model('verification', verificaitionSchema);
export default Verification;