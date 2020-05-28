import Post from '../models/post.model';
import Auth from '../models/auth.model';
import Mute from '../models/mute.model';
import Like from '../models/like.model';
import Comment from '../models/comment.model';
import Bookmark from '../models/bookmark.model';
import Follow from '../models/follow.model';
import { ObjectId } from 'mongodb';
import uploadMulter from '../config/multer.config';
let jwt = require('jsonwebtoken');
var fs = require('fs');
var path = require('path');

class PostController {
    postImage(req: any, res: any) {
        uploadMulter.upload(req, res, (err: any) => {
            if (err) {
                res.send({
                    error: err
                })
            } else if (!req.file) {
                res.send({
                    message: 'File Not Found!'
                })
            } else {
                var token = req.headers.token;
                if (!token) {
                    res.send({
                        message: 'No Token Found'
                    })
                } else {
                    jwt.verify(token, 'moin1234', (error: any, tokenResult: any) => {
                        if (error) throw error;
                        console.log(req.file);
                        const schema = {
                            userId: tokenResult.id,
                            postImage: req.file.filename,
                            caption: req.body.caption,
                            location: req.body.location,
                            tags: req.body.tags,
                            likes: 0,
                            superLikes: 0,
                            comments: 0,
                            shares: 0,
                            bookmarks: 0,
                            deleted: false,
                            archived: false,
                            timestamp: Date.now()
                        };
                        Post.create(schema, (error: any, post: any) => {
                            if (error) {
                                res.send({
                                    error: error
                                })
                            } else {
                                Auth.findOneAndUpdate({ _id: tokenResult.id }, { posts: tokenResult.postCount + 1 }, (error: any, result: any) => {
                                    if (error) {
                                        res.send({
                                            error: error
                                        })
                                    } else {
                                        res.send({
                                            message: 'Post Created!',
                                            post: post,
                                            result: result,
                                            file: req.file
                                        })
                                    }
                                })
                            }
                        })
                    })
                }
            }
        }
        )
    }

    getPosts(req: any, res: any) {
        var token = req.headers.token;
        if (!token) {
            res.send({
                message: 'No Token Found'
            })
        } else {
            jwt.verify(token, 'moin1234', (error: any, tokenResult: any) => {
                if (error) {
                    res.send({
                        error: error
                    })
                } else {
                    Follow.aggregate([
                        {
                            '$match': {
                                'userId': new ObjectId(tokenResult.id),
                                'followStatus': 2,
                            }
                        },
                        {
                            '$lookup': {
                                'from': 'auths',
                                'localField': 'responderId',
                                'foreignField': '_id',
                                'as': 'user'
                            }
                        },
                        {
                            '$lookup': {
                                'from': 'posts',
                                'let': {
                                    responderId: '$responderId'
                                },
                                'pipeline': [{
                                    '$match': {
                                        '$expr': {
                                            '$and':
                                                [
                                                    {
                                                        '$eq': ['$userId', '$$responderId']
                                                    },
                                                    {
                                                        '$eq': ['$deleted', false]
                                                    },
                                                    {
                                                        '$eq': ['$archived', false]
                                                    },
                                                ]

                                        }
                                    }
                                }],
                                'as': 'posts'
                            }
                        },

                        {
                            '$unwind': {
                                path: '$user'
                            }
                        },
                        {
                            '$unwind': {
                                path: '$posts'
                            }
                        },
                        {
                            '$lookup': {
                                'from': 'likes',
                                'let': {
                                    userId: '$userId',
                                    post: '$posts._id'
                                },
                                'pipeline': [{
                                    '$match': {
                                        '$expr': {
                                            '$and':
                                                [
                                                    {
                                                        '$eq': ['$userId', '$$userId']
                                                    },
                                                    {
                                                        '$eq': ['$postId', '$$post']
                                                    }
                                                ]
                                        }
                                    }
                                }],
                                'as': 'like'
                            }
                        },
                        {
                            '$lookup': {
                                'from': 'bookmarks',
                                'let': {
                                    userId: '$userId',
                                    post: '$posts._id'
                                },
                                'pipeline': [{
                                    '$match': {
                                        '$expr': {
                                            '$and':
                                                [
                                                    {
                                                        '$eq': ['$userId', '$$userId']
                                                    },
                                                    {
                                                        '$eq': ['$postId', '$$post']
                                                    }
                                                ]
                                        }
                                    }
                                }],
                                'as': 'bookmark'
                            }
                        },
                        // {
                        //     '$unwind': {
                        //         path: '$like'
                        //     }
                        // },
                        {
                            '$sort': {
                                'posts.timestamp': -1
                            }
                        },
                    ], (error: any, result: any) => {
                        if (error) {
                            res.send({
                                error: error,
                                responseCode: 0
                            })
                        } else {
                            res.send({
                                message: 'Posts',
                                result: result,
                                responseCode: 1
                            })
                        }
                    })
                }
            })
        }
    }

    deletePost(req: any, res: any) {
        var token = req.headers.token;
        if (!token) {
            res.send({
                message: 'No Token Found'
            })
        } else {
            jwt.verify(token, 'moin1234', (error: any, tokenResult: any) => {
                if (error) {
                    res.send({
                        error: error
                    })
                } else {
                    Post.findOneAndUpdate({ _id: req.body.postId, userId: tokenResult.id }, { deleted: true }, (error: any, result: any) => {
                        if (error) {
                            res.send({
                                error: error
                            })
                        } else {
                            res.send({
                                message: 'Post Deleted',
                                result: result
                            })
                        }
                    })
                }
            })
        }
    }

    archivePost(req: any, res: any) {
        var token = req.headers.token;
        if (!token) {
            res.send({
                message: 'No Token Found'
            })
        } else {
            jwt.verify(token, 'moin1234', (error: any, tokenResult: any) => {
                if (error) {
                    res.send({
                        error: error
                    })
                } else {
                    Post.findOneAndUpdate({ _id: req.body.postId, userId: tokenResult.id }, { archived: true }, (error: any, result: any) => {
                        if (error) {
                            res.send({
                                error: error
                            })
                        } else {
                            res.send({
                                message: 'Post Deleted',
                                result: result
                            })
                        }
                    })
                }
            })
        }
    }

    mutePost(req: any, res: any) {
        var token = req.headers.token;
        if (!token) {
            res.send({
                message: 'No Token Found'
            })
        } else {
            jwt.verify(token, 'moin1234', (error: any, tokenResult: any) => {
                if (error) {
                    res.send({
                        error: error
                    })
                } else {
                    Mute.findOne({ subjectId: req.body.postId }, (error: any, result: any) => {
                        // var resp = Buffer.from(result);
                        // var len = resp.length;
                        if (error) {
                            res.send({
                                error: error
                            })
                        } else if (result == 0) {
                            Mute.create({ subjectId: req.body.postId, userId: tokenResult.id, mute: true, type: 1 }, (error: any, result: any) => {
                                if (error) {
                                    res.send({
                                        error: error
                                    })
                                } else {
                                    res.send({
                                        message: 'Muted',
                                        result: result
                                    })
                                }
                            })
                        } else {
                            Mute.findOneAndUpdate({ subjectId: req.body.postId, userId: tokenResult.id }, { mute: !result.mute }, (error: any, result: any) => {
                                if (error) {
                                    res.send({
                                        error: error
                                    })
                                } else {
                                    res.send({
                                        message: 'Muted',
                                        result: result
                                    })
                                }
                            })
                        }
                    })
                }
            })
        }
    }

    likePost(req: any, res: any) {
        var token = req.headers.token;
        if (!token) {
            res.send({
                message: 'No Token Found'
            })
        } else {
            jwt.verify(token, 'moin1234', (error: any, tokenResult: any) => {
                if (error) {
                    res.send({
                        error: error
                    })
                } else {
                    Like.findOne({ postId: req.body.postId, userId: tokenResult.id }, (error: any, result: any) => {
                        if (error) {
                            res.send({
                                error: error
                            })
                        } else if (result == null) {
                            const schema = {
                                userId: tokenResult.id,
                                postId: req.body.postId,
                                like: true,
                                likeTimestamp: Date.now()
                            }
                            Like.create(schema, (error: any, like: any) => {
                                if (error) {
                                    res.send({
                                        error: error
                                    })
                                } else {
                                    Post.findOne({ _id: req.body.postId }, (error: any, result: any) => {
                                        if (error) {
                                            res.send({
                                                error: error
                                            })
                                        } else {
                                            Post.findOneAndUpdate({ _id: req.body.postId }, { likes: result.likes + 1 }, { new: true }, (error: any, result: any) => {
                                                if (error) {
                                                    res.send({
                                                        error: error
                                                    })
                                                } else {
                                                    res.send({
                                                        message: 'Liked',
                                                        result: result,
                                                        like: like,
                                                        responseCode: 1
                                                    })
                                                }
                                            })
                                        }
                                    })
                                }
                            })
                        } else {
                            if (result.like == false && result.like != null) {
                                Like.findOneAndUpdate({ postId: req.body.postId, userId: tokenResult.id }, { like: !result.like, likeTimestamp: Date.now() }, { new: true }, (error: any, like: any) => {
                                    if (error) {
                                        res.send({
                                            error: error
                                        })
                                    } else {
                                        Post.findOne({ _id: req.body.postId }, (error: any, result: any) => {
                                            if (error) {
                                                res.send({
                                                    error: error
                                                })
                                            } else {
                                                Post.findOneAndUpdate({ _id: req.body.postId }, { likes: result.likes + 1 }, { new: true }, (error: any, result: any) => {
                                                    if (error) {
                                                        res.send({
                                                            error: error
                                                        })
                                                    } else {
                                                        res.send({
                                                            message: 'Liked',
                                                            result: result,
                                                            like: like,
                                                            responseCode: 1
                                                        })
                                                    }
                                                })
                                            }
                                        })
                                    }
                                })
                            } else if (result.like == true && result.like != null) {
                                Like.findOneAndUpdate({ postId: req.body.postId, userId: tokenResult.id }, { like: !result.like, likeTimestamp: Date.now() }, { new: true }, (error: any, like: any) => {
                                    if (error) {
                                        res.send({
                                            error: error
                                        })
                                    } else {
                                        Post.findOne({ _id: req.body.postId }, (error: any, result: any) => {
                                            if (error) {
                                                res.send({
                                                    error: error
                                                })
                                            } else {
                                                Post.findOneAndUpdate({ _id: req.body.postId }, { likes: result.likes - 1 }, { new: true }, (error: any, result: any) => {
                                                    if (error) {
                                                        res.send({
                                                            error: error
                                                        })
                                                    } else {
                                                        res.send({
                                                            message: 'Unliked',
                                                            result: result,
                                                            like: like,
                                                            responseCode: 1
                                                        })
                                                    }
                                                })
                                            }
                                        })
                                    }
                                })
                            } else {
                                Like.findOneAndUpdate({ postId: req.body.postId, userId: tokenResult.id }, { like: true, likeTimestamp: Date.now() }, { new: true }, (error: any, like: any) => {
                                    if (error) {
                                        res.send({
                                            error: error
                                        })
                                    } else {
                                        Post.findOne({ _id: req.body.postId }, (error: any, result: any) => {
                                            if (error) {
                                                res.send({
                                                    error: error
                                                })
                                            } else {
                                                Post.findOneAndUpdate({ _id: req.body.postId }, { likes: result.likes + 1 }, { new: true }, (error: any, result: any) => {
                                                    if (error) {
                                                        res.send({
                                                            error: error
                                                        })
                                                    } else {
                                                        res.send({
                                                            message: 'Liked',
                                                            result: result,
                                                            like: like,
                                                            responseCode: 1
                                                        })
                                                    }
                                                })
                                            }
                                        })
                                    }
                                })
                            }
                        }
                    })
                }
            })
        }
    }

    superLikePost(req: any, res: any) {
        var token = req.headers.token;
        if (!token) {
            res.send({
                message: 'No Token Found'
            })
        } else {
            jwt.verify(token, 'moin1234', (error: any, tokenResult: any) => {
                if (error) {
                    res.send({
                        error: error
                    })
                } else {
                    Like.findOne({ postId: req.body.postId, userId: tokenResult.id }, (error: any, result: any) => {
                        if (error) {
                            res.send({
                                error: error
                            })
                        } else if (result == null) {
                            const schema = {
                                userId: tokenResult.id,
                                postId: req.body.postId,
                                superLike: true,
                                superLikeTimestamp: Date.now()
                            }
                            Like.create(schema, (error: any, superLike: any) => {
                                if (error) {
                                    res.send({
                                        error: error
                                    })
                                } else {
                                    Post.findOne({ _id: req.body.postId }, (error: any, result: any) => {
                                        if (error) {
                                            res.send({
                                                error: error
                                            })
                                        } else {
                                            Post.findOneAndUpdate({ _id: req.body.postId }, { superLikes: result.superLikes + 1 }, {new: true}, (error: any, result: any) => {
                                                if (error) {
                                                    res.send({
                                                        error: error
                                                    })
                                                } else {
                                                    res.send({
                                                        message: 'SuperLiked',
                                                        result: result,
                                                        superLike: superLike,
                                                        responseCode: 1
                                                    })
                                                }
                                            })
                                        }
                                    })
                                }
                            })
                        } else {
                            if (result.superLike == false && result.superLike != null) {
                                Like.findOneAndUpdate({ postId: req.body.postId, userId: tokenResult.id }, { superLike: !result.superLike, superLikeTimestamp: Date.now() }, { new: true }, (error: any, superLike: any) => {
                                    if (error) {
                                        res.send({
                                            error: error
                                        })
                                    } else {
                                        Post.findOne({ _id: req.body.postId }, (error: any, result: any) => {
                                            if (error) {
                                                res.send({
                                                    error: error
                                                })
                                            } else {
                                                Post.findOneAndUpdate({ _id: req.body.postId }, { superLikes: result.superLikes + 1 }, {new: true}, (error: any, result: any) => {
                                                    if (error) {
                                                        res.send({
                                                            error: error
                                                        })
                                                    } else {
                                                        res.send({
                                                            message: 'SuperLiked',
                                                            result: result,
                                                            superLike: superLike,
                                                            responseCode: 1
                                                        })
                                                    }
                                                })
                                            }
                                        })
                                    }
                                })
                            } else if (result.superLike == true && result.superLike != null) {
                                Like.findOneAndUpdate({ postId: req.body.postId, userId: tokenResult.id }, { superLike: !result.superLike, superLikeTimestamp: Date.now() }, { new: true }, (error: any, superLike: any) => {
                                    if (error) {
                                        res.send({
                                            error: error
                                        })
                                    } else {
                                        Post.findOne({ _id: req.body.postId }, (error: any, result: any) => {
                                            if (error) {
                                                res.send({
                                                    error: error
                                                })
                                            } else {
                                                Post.findOneAndUpdate({ _id: req.body.postId }, { superLikes: result.superLikes - 1 }, {new: true}, (error: any, result: any) => {
                                                    if (error) {
                                                        res.send({
                                                            error: error
                                                        })
                                                    } else {
                                                        res.send({
                                                            message: 'Unliked',
                                                            result: result,
                                                            superLike: superLike,
                                                            responseCode: 1
                                                        })
                                                    }
                                                })
                                            }
                                        })
                                    }
                                })
                            } else {
                                Like.findOneAndUpdate({ postId: req.body.postId, userId: tokenResult.id }, { superLike: true, superLikeTimestamp: Date.now() }, { new: true }, (error: any, superLike: any) => {
                                    if (error) {
                                        res.send({
                                            error: error
                                        })
                                    } else {
                                        Post.findOne({ _id: req.body.postId }, (error: any, result: any) => {
                                            if (error) {
                                                res.send({
                                                    error: error
                                                })
                                            } else {
                                                Post.findOneAndUpdate({ _id: req.body.postId }, { superLikes: result.superLikes + 1 }, {new: true}, (error: any, result: any) => {
                                                    if (error) {
                                                        res.send({
                                                            error: error
                                                        })
                                                    } else {
                                                        res.send({
                                                            message: 'SuperLiked',
                                                            result: result,
                                                            superLike: superLike,
                                                            responseCode: 1
                                                        })
                                                    }
                                                })
                                            }
                                        })
                                    }
                                })
                            }
                        }
                    })
                }
            })
        }
    }

    commentPost(req: any, res: any) {
        var token = req.headers.token;
        if (!token) {
            res.send({
                message: 'No Token Found'
            })
        } else {
            jwt.verify(token, 'moin1234', (error: any, tokenResult: any) => {
                if (error) {
                    res.send({
                        error: error
                    })
                } else {
                    var schema = {
                        userId: tokenResult.id,
                        postId: req.body.postId,
                        comment: req.body.comment,
                        timestamp: Date.now()
                    }
                    Comment.create(schema, (error: any, result: any) => {
                        if (error) {
                            res.send({
                                error: error
                            })
                        } else {
                            res.send({
                                message: 'Commented',
                                result: result
                            })
                        }
                    })
                }
            })
        }
    }

    bookmarkPost(req: any, res: any) {
        var token = req.headers.token;
        if (!token) {
            res.send({
                message: 'No Token Found'
            })
        } else {
            jwt.verify(token, 'moin1234', (error: any, tokenResult: any) => {
                if (error) {
                    res.send({
                        error: error
                    })
                } else {
                    Bookmark.findOne({ postId: req.body.postId }, (error: any, result: any) => {
                        if (error) {
                            res.send({
                                error: error
                            })
                        } else if (result == null) {
                            var schema = {
                                userId: tokenResult.id,
                                postId: req.body.postId,
                                bookmark: true,
                                timestamp: Date.now()
                            }
                            Bookmark.create(schema, (error: any, bookmark: any) => {
                                if (error) {
                                    res.send({
                                        error: error
                                    })
                                } else {
                                    Post.findOne({ _id: req.body.postId }, (error: any, result: any) => {
                                        if (error) {
                                            res.send({
                                                error: error
                                            })
                                        } else {
                                            Post.findOneAndUpdate({ _id: result._id }, { bookmarks: result.bookmarks + 1 }, {new: true}, (error: any, result: any) => {
                                                if (error) {
                                                    res.send({
                                                        error: error
                                                    })
                                                } else {
                                                    res.send({
                                                        message: 'Bookmarked',
                                                        result: result,
                                                        bookmark: bookmark,
                                                        responseCode: 1
                                                    })
                                                }
                                            })
                                        }
                                    })
                                }
                            })
                        } else {
                            if (result.bookmark == false) {
                                Bookmark.findOneAndUpdate({ postId: req.body.postId, userId: tokenResult.id }, { bookmark: !result.bookmark, timestamp: Date.now() }, {new: true}, (error: any, bookmark: any) => {
                                    if (error) {
                                        res.send({
                                            error: error
                                        })
                                    } else {
                                        Post.findOne({ _id: req.body.postId }, (error: any, result: any) => {
                                            if (error) {
                                                res.send({
                                                    error: error
                                                })
                                            } else {
                                                Post.findOneAndUpdate({ _id: result._id }, { bookmarks: result.bookmarks + 1 }, {new: true}, (error: any, result: any) => {
                                                    if (error) {
                                                        res.send({
                                                            error: error
                                                        })
                                                    } else {
                                                        res.send({
                                                            message: 'Bookmarked',
                                                            result: result,
                                                            bookmark: bookmark,
                                                            responseCode: 1
                                                        })
                                                    }
                                                })
                                            }
                                        })
                                    }
                                })
                            } else {
                                Bookmark.findOneAndUpdate({ postId: req.body.postId, userId: tokenResult.id }, { bookmark: !result.bookmark, timestamp: Date.now() }, {new: true}, (error: any, bookmark: any) => {
                                    if (error) {
                                        res.send({
                                            error: error
                                        })
                                    } else {
                                        Post.findOne({ _id: req.body.postId }, (error: any, result: any) => {
                                            if (error) {
                                                res.send({
                                                    error: error
                                                })
                                            } else {
                                                Post.findOneAndUpdate({ _id: result._id }, { bookmarks: result.bookmarks - 1 }, {new: true}, (error: any, result: any) => {
                                                    if (error) {
                                                        res.send({
                                                            error: error
                                                        })
                                                    } else {
                                                        res.send({
                                                            message: 'Bookmarked',
                                                            result: result,
                                                            bookmark: bookmark,
                                                            responseCode: 1
                                                        })
                                                    }
                                                })
                                            }
                                        })
                                    }
                                })
                            }
                        }
                    })
                }
            })
        }
    }

    commentsOnPost(req: any, res: any) {
        var token = req.headers.token;
        if (!token) {
            res.send({
                message: 'No Token Found'
            })
        } else {
            jwt.verify(token, 'moin1234', (error: any, tokenResult: any) => {
                if (error) {
                    res.send({
                        error: error
                    })
                } else {
                    Comment.aggregate([
                        {
                            '$match': {
                                'postId': req.body.postId
                            }
                        },
                        {
                            '$lookup': {
                                'from': 'auths',
                                'localField': 'userId',
                                'foreignField': '_id',
                                'as': 'commentedUsers'
                            },
                        },
                    ], (error: any, result: any) => {
                        if (error) {
                            res.send({
                                error: error
                            })
                        } else {
                            res.send({
                                message: 'Comments',
                                result: result
                            })
                        }
                    })
                }
            })
        }
    }
}

var postController = new PostController();
export default postController;