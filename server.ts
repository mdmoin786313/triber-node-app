import express from "express";
import AuthRoute from './routes/auth.route';
import FollowRoute from "./routes/follow.route";
import PostRoute from "./routes/post.route";
import ProfileROute from "./routes/profile.route";
import SearchRoute from "./routes/search.route";

const app = express();
var port = process.env.PORT || 3000;

var bodyParser = require("body-parser");
var cookieParser = require("cookie-parser");
var mongoose = require('./config/mongoose.config');
var swagger = require('./routes/swagger.route');

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

app.use('/', swagger);

app.listen(port, () => console.log(`Listening on port ${port}`));

module.exports = app;