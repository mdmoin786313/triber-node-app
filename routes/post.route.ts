import { Express } from 'express';
import postController from '../controllers/post.controller';
import upload from '../config/multer.config';


export default class PostRoute {
    postImage(app: Express) {
        app.post('/v1/postimage', postController.postImage);
    }

    deletePost(app: Express) {
        app.post('/v1/deletepost', postController.deletePost);
    }

    archivePost(app: Express) {
        app.post('/v1/archivepost', postController.archivePost);
    }

    mutePost(app: Express) {
        app.post('/v1/mutepost', postController.mutePost);
    }

    postRoute(app: Express) {
        this.postImage(app);
        this.deletePost(app);
        this.archivePost(app);
        this.mutePost(app);
    }
}