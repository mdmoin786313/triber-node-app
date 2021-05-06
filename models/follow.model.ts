import { ObjectId } from "bson";

const mongoose = require('mongoose');

const followSchema = mongoose.Schema({
    userId: {
        type: ObjectId
    },
    responderId: {
        type: ObjectId
    },
    followStatus: {
        type: Number
    },
    timestamp: {
        type: Date
    },
    blockStatus: {
        type: Boolean
    }
})

const Follow = mongoose.model('follow', followSchema);
export default Follow;