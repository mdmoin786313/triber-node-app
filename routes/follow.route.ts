import { Express } from 'express';
import followController from '../controllers/follow.controller';


export default class FollowRoute {
    follow(app: Express) {
        app.post('/v1/follow', followController.follow);
    }

    block(app: Express) {
        app.post('/v1/block', followController.block);
    }

    acceptRequest(app: Express) {
        app.post('/v1/acceptrequest', followController.acceptRequest);
    }

    followerList(app: Express) {
        app.get('/v1/followers', followController.followerList);
    }

    followingList(app: Express) {
        app.get('/v1/following', followController.followingList);
    }

    followRoute(app: Express) {
        this.follow(app);
        this.block(app);
        this.acceptRequest(app);
        this.followerList(app);
        this.followingList(app);
    }
}