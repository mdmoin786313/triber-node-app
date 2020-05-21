const mongoose = require('mongoose');

const likeSchema = mongoose.Schema({
    userId: {
        type: String
    },
    postId: {
        type: String
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