const mongoose = require('mongoose');

const bookmarkSchema = mongoose.Schema({
    userId: {
        type: String
    },
    postId: {
        type: String
    },
    bookmark: {
        type: Boolean
    },
    timestamp: {
        type: Date
    }
})

const Bookmark = mongoose.model('bookmark', bookmarkSchema);
export default Bookmark;