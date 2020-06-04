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
    postId: {
        type: ObjectId
    },
    type: {
        type: Number
    },
    comment: {
        type: String
    },
    timestamp: {
        type: Date
    }
})

const Notification = mongoose.model('notification', notificationSchema);
export default Notification;