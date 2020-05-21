import { ObjectId } from "mongodb";

const mongoose = require('mongoose');

const tagSchema = mongoose.Schema({
    userId: {
        type: ObjectId
    },
    postId: {
        type: ObjectId
    },
    taggedId: {
        type: ObjectId
    },
    timestamp: {
        type: Date
    }
})

const Tag = mongoose.model('tag', tagSchema);
export default Tag;