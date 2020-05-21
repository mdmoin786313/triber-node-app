const mongoose = require('mongoose');

const commentRepliesSchema = mongoose.Schema({
    userId: {
        type: String
    },
    postId: {
        type: String
    },
    commentId: {
        type: String
    },
    reply: {
        type: String
    },
    likes: {
        type: Number
    },
    timestamp: {
        type: Date
    }
})

const CommentReplies = mongoose.model('comment_replies', commentRepliesSchema);
export default CommentReplies;