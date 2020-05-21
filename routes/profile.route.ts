import { Express } from 'express';
import profileController from '../controllers/profile.controller';


export default class ProfileROute {
    profile(app: Express) {
        app.post('/v1/profile', profileController.profile);
    }

    profileRoute(app: Express) {
        this.profile(app);
    }
}