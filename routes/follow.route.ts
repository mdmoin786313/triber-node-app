import { Express } from 'express';
import followController from '../controllers/follow.controller';

export default class FollowRoute {
    getFollowers(app: Express) {
        app.post('/v1/followers', followController.getFollowers);
    }

    getFollowing(app: Express) {
        app.post('/v1/following', followController.getFollowing);
    }

    follow(app: Express) {
        app.post('/v1/follow', followController.follow);
    }

    followRoute(app: Express) {
        this.getFollowers(app);
        this.getFollowing(app);
        this.follow(app);
    }
}