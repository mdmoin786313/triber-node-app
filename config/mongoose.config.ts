import mongoose from 'mongoose';

let dev_db_url = 'mongodb+srv://ghadiyali:Moin@123!@cluster0.fmdl6.mongodb.net/dev?retryWrites=true&w=majority';

let mongoDB = process.env.MONGODB_URI || dev_db_url;
mongoose.connect(mongoDB, { useNewUrlParser: true }).then(() => {
    console.log("Connected to Database");
});

let db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));
module.exports.mongoose;