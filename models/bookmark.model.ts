import { ObjectId } from "mongodb";

const mongoose = require('mongoose');

const bookmarkSchema = mongoose.Schema({
    userId: {
        type: ObjectId
    },
    postId: {
        type: ObjectId
    },
    bookmark: {
        type: Boolean,
        default: true
    },
    timestamp: {
        type: Date
    }
})

const Bookmark = mongoose.model('bookmark', bookmarkSchema);
export default Bookmark;