const mongoose = require('mongoose');

const commentSchema = mongoose.Schema({
    userId: {
        type: String
    },
    postId: {
        type: String
    },
    comment: {
        type: String
    },
    likes: {
        type: Number
    },
    replies: {
        type: Number
    },
    timestamp: {
        type: Date
    }
})

const Comment = mongoose.model('comment', commentSchema);
export default Comment;