import { ObjectId } from "mongodb";

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
    block: {
        type: Boolean
    },
    mute: {
        type: Boolean
    }
})

const Follow = mongoose.model('follow', followSchema);
export default Follow;