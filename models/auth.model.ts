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
        type: Number,
        required: true,
        default: 0
    },
    followingCount: {
        type: Number,
        required: true,
        default: 0
    },
    postCount: {
        type: Number,
        required: true,
        default: 0
    },
    bio: {
        type: String,
        default: 'Hey there! I am using Triber!',
        required: true,
    },
    profileLikes: {
        type: Number,
        default: 0
    },
    publicProfile: {
        type: Boolean,
        default: true
    },
    profileVerified: {
        type: Boolean,
        default: false
    },
    timestamp: {
        type: Date,
        required: true,
        default: Date.now()
    }
})

const Auth = mongoose.model('auth', authSchema);
export default Auth;