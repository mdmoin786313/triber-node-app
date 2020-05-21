const mongoose = require('mongoose');

const commentLikeSchema = mongoose.Schema({
    userId: {
        type: String
    },
    postId: {
        type: String
    },
    commendId: {
        type: String
    },
    like: {
        type: Boolean
    },
    timestamp: {
        type: Date
    }
})

const CommentLikes = mongoose.model('comment_like', commentLikeSchema);
export default CommentLikes;