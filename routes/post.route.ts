import { Express } from 'express';
import postController from '../controllers/post.controller';
import upload from '../config/multer.config';


export default class PostRoute {
    postImage(app: Express) {
        app.post('/v1/postimage', postController.postImage);
    }

    getPosts(app: Express) {
        app.post('/v1/posts', postController.getPosts);
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

    likePost(app: Express) {
        app.post('/v1/like', postController.likePost);
    }

    bookmarkPost(app: Express) {
        app.post('/v1/bookmark', postController.bookmarkPost);
    }

    superLikePost(app: Express) {
        app.post('/v1/superlike', postController.superLikePost);
    }

    commentPost(app: Express) {
        app.post('/v1/comment', postController.commentPost);
    }

    commentsOnPost(app: Express) {
        app.post('/v1/commentsonpost', postController.commentsOnPost)
    }

    postRoute(app: Express) {
        this.postImage(app);
        this.deletePost(app);
        this.archivePost(app);
        this.mutePost(app);
        this.getPosts(app);
        this.likePost(app);
        this.superLikePost(app);
        this.commentPost(app);
        this.commentsOnPost(app);
        this.bookmarkPost(app);
    }
}