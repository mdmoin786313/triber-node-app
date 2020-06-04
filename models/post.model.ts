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
        type: Number
    },
    superLikes: {
        type: Number
    },
    comments: {
        type: Number
    },
    shares: {
        type: Number
    },
    bookmarks: {
        type: Number
    },
    timestamp: {
        type: Date
    },
    deleted: {
        type: Boolean
    },
    archived: {
        type: Boolean
    },
    data: {
        type: String
    },
    img: {
        data: { type: Buffer },
        contentType: { type: String }
    }
})

const Post = mongoose.model('post', postSchema);
export default Post;