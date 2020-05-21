const mongoose = require('mongoose');

const searchSchema = mongoose.Schema({
    userId: {
        type: String
    },
    search: {
        type: String
    },
    timestamp: {
        type: Date
    }
})

const Search = mongoose.model('like', searchSchema);
export default Search;