import { ObjectId } from "mongodb";

const mongoose = require('mongoose');

const postSchema = mongoose.Schema({
    userId: {
        type: ObjectId
    },
    postImage: {
        type: String
    },
    caption: {
        type: String
    },
    location: {
        type: String
    },
    tags: {
        type: Object
    },
    likes: {
        type: Number,
        default: 0,
        required: true,
    },
    superLikes: {
        type: Number,
        default: 0,
        required: true,
    },
    comments: {
        type: Number,
        default: 0,
        required: true,
    },
    shares: {
        type: Number,
        default: 0,
        required: true,
    },
    bookmarks: {
        type: Number,
        default: 0,
        required: true,
    },
    timestamp: {
        type: Date,
        default: Date.now(),
        required: true,
    },
    deleted: {
        type: Boolean,
        default: false,
        required: true,
    },
    archived: {
        type: Boolean,
        default: false,
        required: true,
    }
})

const Post = mongoose.model('post', postSchema);
export default Post;