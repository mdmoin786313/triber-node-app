const mongoose = require('mongoose');

const authSchema = mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true,
    },
    fullname: {
        type: String,
        required: true,
    },
    phone: {
        type: Number,
        required: true,
    },
    email: {
        type: String,
    },
    profileImage: {
        type: String,
    },
    followersCount: {
        type: Number
    },
    followingCount: {
        type: Number
    },
    postCount: {
        type: Number
    },
    bio: {
        type: String
    },
    profileLikes: {
        type: Number
    },
    public: {
        type: Boolean
    },
    verified: {
        type: Boolean
    },
    timestamp: {
        type: Date
    }
})

const Auth = mongoose.model('auth', authSchema);
export default Auth;