const mongoose = require('mongoose');

const muteSchema = mongoose.Schema({
    userId: {
        type: String
    },
    subjectId: {
        type: String
    },
    type: {
        type: Number
    },
    mute: {
        type: Boolean
    }
})

const Mute = mongoose.model('mute', muteSchema);
export default Mute;