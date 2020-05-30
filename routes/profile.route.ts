import { Express } from 'express';
import profileController from '../controllers/profile.controller';


export default class ProfileROute {
    profile(app: Express) {
        app.post('/v1/profile', profileController.profile);
    }

    editProfile(app: Express) {
        app.post('/v1/edit', profileController.editProfile);
    }

    getProfile(app: Express) {
        app.get('/v1/getprofile', profileController.getProfile);
    }

    profileRoute(app: Express) {
        this.profile(app);
        this.editProfile(app);
        this.getProfile(app);
    }
}