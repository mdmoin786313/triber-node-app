const mongoose = require('mongoose');

const chatSchema = mongoose.Schema({
    
    timestamp: {
        type: Date
    }
});

const Chat = mongoose.model('chat', chatSchema);
export default Chat;