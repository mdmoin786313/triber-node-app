import { ObjectId } from "mongodb";

const mongoose = require('mongoose');

const notificationSchema = mongoose.Schema({
    userId: {
        type: ObjectId
    },
    message: {
        type: String
    },
    respondentId: {
        type: ObjectId
    },
    type: {
        type: Number
    },
    timestamp: {
        type: Date
    }
})

const Notification = mongoose.model('notification', notificationSchema);
export default Notification;