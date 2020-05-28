import { ObjectId } from "mongodb";

const mongoose = require('mongoose');

const likeSchema = mongoose.Schema({
    userId: {
        type: ObjectId
    },
    postId: {
        type: ObjectId
    },
    like: {
        type: Boolean
    },
    superLike: {
        type: Boolean
    },
    timestamp: {
        type: Date
    }
})

const Like = mongoose.model('like', likeSchema);
export default Like;