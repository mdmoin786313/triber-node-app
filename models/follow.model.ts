const mongoose = require('mongoose');

const followSchema = mongoose.Schema({
    userId: {
        type: String
    },
    responderId: {
        type: String
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