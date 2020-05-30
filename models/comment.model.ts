import { ObjectId } from "mongodb";

const mongoose = require('mongoose');

const commentSchema = mongoose.Schema({
    userId: {
        type: ObjectId
    },
    postId: {
        type: ObjectId
    },
    comment: {
        type: String
    },
    likes: {
        type: Number
    },
    ownerLike: {
        type: ObjectId
    },
    replies: {
        type: Number
    },
    timestamp: {
        type: Date
    }
})

const Comment = mongoose.model('comment', commentSchema);
export default Comment;