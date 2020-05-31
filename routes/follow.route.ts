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
        app.post('/v1/accept', followController.acceptRequest);
    }

    declineRequest(app: Express) {
        app.post('/v1/decline', followController.declineRequest);
    }

    followerList(app: Express) {
        app.post('/v1/followers', followController.followerList);
    }

    followingList(app: Express) {
        app.post('/v1/following', followController.followingList);
    }

    followRequests(app: Express) {
        app.get('/v1/requests', followController.followRequests);
    }

    followRoute(app: Express) {
        this.follow(app);
        this.block(app);
        this.acceptRequest(app);
        this.followerList(app);
        this.followingList(app);
        this.followRequests(app);
        this.declineRequest(app);
    }
}