import express from "express";
import AuthRoute from './routes/auth.route';
import PostRoute from "./routes/post.route";
import ProfileROute from "./routes/profile.route";
import SearchRoute from "./routes/search.route";
import FollowRoute from './routes/follow.route';
import ChatRoute from "./routes/chat.route";
import SettingsRoute from "./routes/settings.route";
import OTPRoute from "./routes/otp.route";
import NotificationRoute from "./routes/notification.route";

const app = express();
var port = process.env.PORT || 3000;

var bodyParser = require("body-parser");
var cookieParser = require("cookie-parser");
var mongoose = require('./config/mongoose.config');
var swagger = require('./routes/swagger.route');

const server = require('http').createServer(app)
var io = require("socket.io").listen(server);

app.use(express.static('public'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());

const authRoute = new AuthRoute();
authRoute.authRoute(app);
const postRoute = new PostRoute();
postRoute.postRoute(app);
const profileRoute = new ProfileROute();
profileRoute.profileRoute(app);
const searchRoute = new SearchRoute();
searchRoute.search(app);
const followRoute = new FollowRoute();
followRoute.followRoute(app);
const chatRoute = new ChatRoute();
chatRoute.chatRoute(app);
const settingsRoute = new SettingsRoute();
settingsRoute.settingsRoute(app);
const otpRoute = new OTPRoute();
otpRoute.otpRoute(app);
const notificationRoute = new NotificationRoute();
notificationRoute.notificationRoute(app);

io.on('connection', (socket: any) => {
    console.log('a user connected');
    socket.on('send chat', (message: any) => {
        console.log(message);
        io.emit('send chat', message);
    })

    socket.on('disconnect', () => {
        console.log('User Left');
        io.emit('disconnect');
    })

    
})

app.use('/', swagger);

// io.on("connection", (socket: any) => s

server.listen(port, () => console.log(`Listening on port ${port}`));

module.exports = app;