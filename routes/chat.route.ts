import { Express } from 'express';
import chatController from '../controllers/chat.controller';


export default class ChatRoute {
    sendChat(app: Express) {
        app.post('/v1/sendchat', chatController.sendChat);
    }

    getChats(app: Express) {
        app.post('/v1/getchats', chatController.getChats);
    }

    chatRoute(app: Express) {
        this.sendChat(app);
        this.getChats(app);
    }
}