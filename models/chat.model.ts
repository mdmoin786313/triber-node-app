import { ObjectId } from "mongodb";

const mongoose = require('mongoose');

const chatSchema = mongoose.Schema({
    senderId: {
        type: ObjectId
    },
    recieverId: {
        type: ObjectId
    },
    message: {
        type: String
    },
    file: {
        type: String
    },
    postId: {
        type: ObjectId
    },
    profileId: {
        type: ObjectId
    },
    starred: {
        type: Boolean
    },
    deleted: {
        type: Boolean
    },
    type: {
        type: Number
    },
    timestamp: {
        type: Date
    }
});

const Chat = mongoose.model('chat', chatSchema);
export default Chat;