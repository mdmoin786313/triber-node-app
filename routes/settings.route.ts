import { Express } from 'express';
import settingsController from '../controllers/settings.controller';

export default class SettingsRoute {
    archivedPosts(app: Express) {
        app.post('/v1/archived', settingsController.archivedPosts);
    }

    savedPosts(app: Express) {
        app.post('/v1/saved', settingsController.savedPosts);
    }

    settingsRoute(app:Express) {
        this.archivedPosts(app);
        this.savedPosts(app);
    }
}