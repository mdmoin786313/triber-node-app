import { Express } from 'express';
import postController from '../controllers/post.controller';
import upload from '../config/multer.config';


export default class PostRoute {
    postImage(app: Express) {
        app.post('/v1/postimage', postController.postImage);
    }

    like(app: Express) {
        app.post('/v1/like', postController.likePost);
    }

    bookmark(app: Express) {
        app.post('/v1/bookmark', postController.bookmarkPost);
    }

    getPosts(app: Express) {
        app.get('/v1/posts', postController.getPosts);
    }

    getBookmarks(app: Express) {
        app.get('/v1/bookmarks', postController.getBookmarks);
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
        this.getPosts(app);
        this.deletePost(app);
        this.archivePost(app);
        this.mutePost(app);
        this.like(app);
        this.bookmark(app);
        this.getBookmarks(app);
    }
}