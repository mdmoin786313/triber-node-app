import Post from '../models/post.model';
import Auth from '../models/auth.model';
import Mute from '../models/mute.model';
import Like from '../models/like.model';
import Comment from '../models/comment.model';
import Bookmark from '../models/bookmark.model';
import Follow from '../models/follow.model';
import { ObjectId } from 'mongodb';
import uploadMulter from '../config/multer.config';
import Notification from '../models/notification.model';
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
                    message: 'File Not Found!',
                    responseCode: 2
                })
            } else {
                var token = req.headers.token;
                if (!token) {
                    res.send({
                        message: 'No Token Found'
                    })
                } else {
                    // var img = fs.readFileSync(req.file.path);
                    // var finalImg = {
                    //     contentType: 'image/jpg',
                    //     data: new Buffer(img).toString('base64')
                    // }
                    jwt.verify(token, 'moin1234', (error: any, tokenResult: any) => {
                        if (error) throw error;
                        console.log(req.file);
                        const schema = {
                            userId: tokenResult.id,
                            postImage: req.file.filename,
                            caption: req.body.caption,
                            location: req.body.location,
                            data: req.body.data,
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
                                Auth.findOne({ _id: new ObjectId(tokenResult.id) }, (error: any, result: any) => {
                                    if (error) {
                                        res.send({
                                            error: error
                                        })
                                    } else {
                                        Auth.findOneAndUpdate({ _id: new ObjectId(tokenResult.id) }, { postCount: result.postCount + 1 }, { new: true }, (error: any, result: any) => {
                                            if (error) {
                                                res.send({
                                                    error: error
                                                })
                                            } else {
                                                res.send({
                                                    message: 'Post Created!',
                                                    post: post,
                                                    result: result,
                                                    file: req.file,
                                                    responseCode: 1
                                                })
                                            }
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
                                'mute': false
                            }
                        },
                        {
                            '$lookup': {
                                'from': 'auths',
                                'localField': 'userId',
                                'foreignField': '_id',
                                'as': 'self'
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
                                path: '$self'
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

    selfPosts(req: any, res: any) {
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
                    Post.find({ userId: new ObjectId(req.body.userId), deleted: false, archived: false }, (error: any, result: any) => {
                        if (error) {
                            res.send({
                                error: error
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

    singlePost(req: any, res: any) {
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
                    Post.aggregate([
                        {
                            '$match': {
                                '_id': new ObjectId(req.body.postId)
                            }
                        },
                        {
                            '$lookup': {
                                'from': 'auths',
                                'localField': 'userId',
                                'foreignField': '_id',
                                'as': 'user'
                            }
                        },
                        {
                            '$unwind': {
                                path: '$user'
                            }
                        },
                    ], (error: any, result: any) => {
                        if (error) {
                            res.send({
                                error: error
                            })
                        } else {
                            res.send({
                                message: 'Post',
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
                    Follow.findOne({ responderId: req.body.responderId, userId: tokenResult.id }, (error: any, result: any) => {
                        // var resp = Buffer.from(result);
                        // var len = resp.length;
                        if (error) {
                            res.send({
                                error: error
                            })
                        } else if (result == null) {
                            var schema = {
                                responderId: req.body.responderId,
                                userId: tokenResult.id,
                                mute: true,
                                block: false,
                                timestamp: Date.now()
                            }
                            Follow.create(schema, (error: any, result: any) => {
                                if (error) {
                                    res.send({
                                        error: error
                                    })
                                } else {
                                    res.send({
                                        message: 'Muted',
                                        result: result,
                                        responseCode: 1
                                    })
                                }
                            })
                        } else {
                            Follow.findOneAndUpdate({ responderId: req.body.responderId, userId: tokenResult.id }, { mute: !result.mute, timestamp: Date.now() }, { new: true }, (error: any, result: any) => {
                                if (error) {
                                    res.send({
                                        error: error
                                    })
                                } else {
                                    res.send({
                                        message: 'Muted',
                                        result: result,
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
                                                    Notification.findOneAndUpdate({
                                                        userId: new ObjectId(tokenResult.id),
                                                        respondentId: result.userId,
                                                        postId: result._id,
                                                        message: ' liked your post',
                                                        type: 1
                                                    }, { timestamp: Date.now() }, { upsert: true, new: true, setDefaultsOnInsert: true }, (error: any, notify: any) => {
                                                        res.send({
                                                            message: 'Liked',
                                                            result: result,
                                                            like: like,
                                                            responseCode: 1
                                                        })
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
                                                        Notification.findOneAndUpdate({
                                                            userId: new ObjectId(tokenResult.id),
                                                            respondentId: result.userId,
                                                            postId: result._id,
                                                            message: ' liked your post',
                                                            type: 1
                                                        }, { timestamp: Date.now() }, { upsert: true, new: true, setDefaultsOnInsert: true }, (error: any, notify: any) => {
                                                            res.send({
                                                                message: 'Liked',
                                                                result: result,
                                                                like: like,
                                                                responseCode: 1
                                                            })
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
                                                        Notification.findOneAndUpdate({
                                                            userId: new ObjectId(tokenResult.id),
                                                            respondentId: result.userId,
                                                            postId: result._id,
                                                            message: ' liked your post',
                                                            type: 1
                                                        }, { timestamp: Date.now() }, { upsert: true, new: true, setDefaultsOnInsert: true }, (error: any, notify: any) => {
                                                            res.send({
                                                                message: 'Liked',
                                                                result: result,
                                                                like: like,
                                                                responseCode: 1
                                                            })
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
                                            Post.findOneAndUpdate({ _id: req.body.postId }, { superLikes: result.superLikes + 1 }, { new: true }, (error: any, result: any) => {
                                                if (error) {
                                                    res.send({
                                                        error: error
                                                    })
                                                } else {
                                                    Notification.findOneAndUpdate({
                                                        userId: new ObjectId(tokenResult.id),
                                                        respondentId: result.userId,
                                                        postId: result._id,
                                                        message: ' superliked your post',
                                                        type: 1
                                                    }, { timestamp: Date.now() }, { upsert: true, new: true, setDefaultsOnInsert: true }, (error: any, notify: any) => {
                                                        res.send({
                                                            message: 'SuperLiked',
                                                            result: result,
                                                            superLike: superLike,
                                                            responseCode: 1
                                                        })
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
                                                Post.findOneAndUpdate({ _id: req.body.postId }, { superLikes: result.superLikes + 1 }, { new: true }, (error: any, result: any) => {
                                                    if (error) {
                                                        res.send({
                                                            error: error
                                                        })
                                                    } else {
                                                        Notification.findOneAndUpdate({
                                                            userId: new ObjectId(tokenResult.id),
                                                            respondentId: result.userId,
                                                            postId: result._id,
                                                            message: ' superliked your post',
                                                            type: 1
                                                        }, { timestamp: Date.now() }, { upsert: true, new: true, setDefaultsOnInsert: true }, (error: any, notify: any) => {
                                                            res.send({
                                                                message: 'SuperLiked',
                                                                result: result,
                                                                superLike: superLike,
                                                                responseCode: 1
                                                            })
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
                                                Post.findOneAndUpdate({ _id: req.body.postId }, { superLikes: result.superLikes - 1 }, { new: true }, (error: any, result: any) => {
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
                                                Post.findOneAndUpdate({ _id: req.body.postId }, { superLikes: result.superLikes + 1 }, { new: true }, (error: any, result: any) => {
                                                    if (error) {
                                                        res.send({
                                                            error: error
                                                        })
                                                    } else {
                                                        Notification.findOneAndUpdate({
                                                            userId: new ObjectId(tokenResult.id),
                                                            respondentId: result.userId,
                                                            postId: result._id,
                                                            message: ' superliked your post',
                                                            type: 1
                                                        }, { timestamp: Date.now() }, { upsert: true, new: true, setDefaultsOnInsert: true }, (error: any, notify: any) => {
                                                            res.send({
                                                                message: 'SuperLiked',
                                                                result: result,
                                                                superLike: superLike,
                                                                responseCode: 1
                                                            })
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
                        likes: 0,
                        replies: 0,
                        timestamp: Date.now()
                    }
                    Comment.create(schema, (error: any, comment: any) => {
                        if (error) {
                            res.send({
                                error: error
                            })
                        } else {
                            Post.findOne({ _id: comment.postId }, (error: any, result: any) => {
                                if (error) {
                                    res.send({
                                        error: error
                                    })
                                } else {
                                    Post.findOneAndUpdate({ _id: comment.postId }, { comments: result.comments + 1 }, { new: true }, (error: any, result: any) => {
                                        if (error) {
                                            res.send({
                                                error: error
                                            })
                                        } else {
                                            Notification.findOneAndUpdate({
                                                userId: new ObjectId(tokenResult.id),
                                                respondentId: result.userId,
                                                postId: result._id,
                                                message: ' commented on your post: ',
                                                comment: comment.comment,
                                                type: 2
                                            }, { timestamp: Date.now() }, { upsert: true, new: true, setDefaultsOnInsert: true }, (error: any, notify: any) => {
                                                res.send({
                                                    message: 'Commented',
                                                    comment: comment,
                                                    result: result,
                                                    responseCode: 1
                                                })
                                            })

                                        }
                                    })
                                }
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
                                            Post.findOneAndUpdate({ _id: result._id }, { bookmarks: result.bookmarks + 1 }, { new: true }, (error: any, result: any) => {
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
                                Bookmark.findOneAndUpdate({ postId: req.body.postId, userId: tokenResult.id }, { bookmark: !result.bookmark, timestamp: Date.now() }, { new: true }, (error: any, bookmark: any) => {
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
                                                Post.findOneAndUpdate({ _id: result._id }, { bookmarks: result.bookmarks + 1 }, { new: true }, (error: any, result: any) => {
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
                                Bookmark.findOneAndUpdate({ postId: req.body.postId, userId: tokenResult.id }, { bookmark: !result.bookmark, timestamp: Date.now() }, { new: true }, (error: any, bookmark: any) => {
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
                                                Post.findOneAndUpdate({ _id: result._id }, { bookmarks: result.bookmarks - 1 }, { new: true }, (error: any, result: any) => {
                                                    if (error) {
                                                        res.send({
                                                            error: error
                                                        })
                                                    } else {
                                                        res.send({
                                                            message: 'UnBookmarked',
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
                                'postId': new ObjectId(req.body.postId)
                            }
                        },
                        {
                            '$lookup': {
                                'from': 'auths',
                                'localField': 'userId',
                                'foreignField': '_id',
                                'as': 'user'
                            },
                        },
                        {
                            '$sort': {
                                'timestamp': -1
                            }
                        }
                    ], (error: any, result: any) => {
                        if (error) {
                            res.send({
                                error: error
                            })
                        } else {
                            res.send({
                                message: 'Comments',
                                result: result,
                                responseCode: 1
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