import {Express} from 'express';
import notificationController from '../controllers/notification.controller';

export default class NotificationRoute {
    getNotifications(app: Express) {
        app.get('/v1/notifications', notificationController.getNotifications);
    }

    notificationRoute(app: Express) {
        this.getNotifications(app);
    }
}