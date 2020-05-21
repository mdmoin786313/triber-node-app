import Post from '../models/post.model';
import Auth from '../models/auth.model';
import upload from '../config/multer.config';
import Mute from '../models/mute.model';
import Like from '../models/like.model';
import Comment from '../models/comment.model';
import Bookmark from '../models/bookmark.model';
let jwt = require('jsonwebtoken');
var fs = require('fs');
var path = require('path');

class PostController {
    postImage(req: any, res: any) {
        upload(req, res, (err: any) => {
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
                            postImage: req.file.path,
                            caption: req.body.caption,
                            location: req.body.location,
                            tags: req.body.tags,
                            timestamp: Date.now()
                        };
                        Post.create(schema, (error: any, post: any) => {
                            if (error) {
                                res.send({
                                    error: error
                                })
                            } else {
                                Auth.findOneAndUpdate({ _id: tokenResult._id }, { posts: tokenResult.posts + 1 }, (error: any, result: any) => {
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
                    Post.findOneAndUpdate({ _id: req.body.postId, userId: tokenResult._id }, { deleted: true }, (error: any, result: any) => {
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
                    Post.findOneAndUpdate({ _id: req.body.postId, userId: tokenResult._id }, { archived: true }, (error: any, result: any) => {
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
                            Mute.create({ subjectId: req.body.postId, userId: tokenResult._id, mute: true, type: 1 }, (error: any, result: any) => {
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
                            Mute.findOneAndUpdate({ subjectId: req.body.postId, userId: tokenResult._id }, { mute: !result.mute }, (error: any, result: any) => {
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
                    Like.findOneAndUpdate({ postId: req.body.postId, userId: tokenResult._id }, (error: any, result: any) => {
                        if (error) {
                            res.send({
                                error: error
                            })
                        } else if (result == 0) {
                            const schema = {
                                userId: tokenResult._id,
                                postId: req.body.postId,
                                like: true,
                                likeTimestamp: Date.now()
                            }
                            Like.create(schema, (error: any, result: any) => {
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
                                            Post.findOneAndUpdate({ _id: req.body.postId }, { likes: result.likes + 1 }, (error: any, result: any) => {
                                                if (error) {
                                                    res.send({
                                                        error: error
                                                    })
                                                } else {
                                                    res.send({
                                                        message: 'Liked',
                                                        result: result
                                                    })
                                                }
                                            })
                                        }
                                    })
                                }
                            })
                        } else {
                            if (result.like == false) {
                                Like.findOneAndUpdate({ postId: req.body.postId, userId: tokenResult._id }, { like: !result.like, likeTimestamp: Date.now() }, { new: true }, (error: any, result: any) => {
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
                                                Post.findOneAndUpdate({ _id: req.body.postId }, { likes: result.likes + 1 }, (error: any, result: any) => {
                                                    if (error) {
                                                        res.send({
                                                            error: error
                                                        })
                                                    } else {
                                                        res.send({
                                                            message: 'Liked',
                                                            result: result
                                                        })
                                                    }
                                                })
                                            }
                                        })
                                    }
                                })
                            } else {
                                Like.findOneAndUpdate({ postId: req.body.postId, userId: tokenResult._id }, { like: !result.like, likeTimestamp: Date.now() }, { new: true }, (error: any, result: any) => {
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
                                                Post.findOneAndUpdate({ _id: req.body.postId }, { likes: result.likes - 1 }, (error: any, result: any) => {
                                                    if (error) {
                                                        res.send({
                                                            error: error
                                                        })
                                                    } else {
                                                        res.send({
                                                            message: 'Unliked',
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
                    Like.findOneAndUpdate({ postId: req.body.postId, userId: tokenResult._id }, (error: any, result: any) => {
                        if (error) {
                            res.send({
                                error: error
                            })
                        } else if (result == 0) {
                            const schema = {
                                userId: tokenResult._id,
                                postId: req.body.postId,
                                superLike: true,
                                superLikeTimestamp: Date.now()
                            }
                            Like.create(schema, (error: any, result: any) => {
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
                                            Post.findOneAndUpdate({ _id: req.body.postId }, { superLikes: result.superLikes + 1 }, (error: any, result: any) => {
                                                if (error) {
                                                    res.send({
                                                        error: error
                                                    })
                                                } else {
                                                    res.send({
                                                        message: 'Liked',
                                                        result: result
                                                    })
                                                }
                                            })
                                        }
                                    })
                                }
                            })
                        } else {
                            if (result.like == false) {
                                Like.findOneAndUpdate({ postId: req.body.postId, userId: tokenResult._id }, { superLike: !result.superLike, superLikeTimestamp: Date.now() }, { new: true }, (error: any, result: any) => {
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
                                                Post.findOneAndUpdate({ _id: req.body.postId }, { superLikes: result.superLikes + 1 }, (error: any, result: any) => {
                                                    if (error) {
                                                        res.send({
                                                            error: error
                                                        })
                                                    } else {
                                                        res.send({
                                                            message: 'Liked',
                                                            result: result
                                                        })
                                                    }
                                                })
                                            }
                                        })
                                    }
                                })
                            } else {
                                Like.findOneAndUpdate({ postId: req.body.postId, userId: tokenResult._id }, { superLike: !result.superLike, superLikeTimestamp: Date.now() }, { new: true }, (error: any, result: any) => {
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
                                                Post.findOneAndUpdate({ _id: req.body.postId }, { superLikes: result.superLikes - 1 }, (error: any, result: any) => {
                                                    if (error) {
                                                        res.send({
                                                            error: error
                                                        })
                                                    } else {
                                                        res.send({
                                                            message: 'Unliked',
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
                        userId: tokenResult._id,
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
                        } else if (result == 0) {
                            var schema = {
                                userId: tokenResult._id,
                                postId: req.body.postId,
                                bookmark: true,
                                timestamp: Date.now()
                            }
                            Bookmark.create(schema, (error: any, result: any) => {
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
                                            Post.findOneAndUpdate({ _id: result._id }, { bookmarks: result.bookmarks + 1 }, (error: any, result: any) => {
                                                if (error) {
                                                    res.send({
                                                        error: error
                                                    })
                                                } else {
                                                    res.send({
                                                        message: 'Bookmarked',
                                                        result: result
                                                    })
                                                }
                                            })
                                        }
                                    })
                                }
                            })
                        } else {
                            if (result.bookmark == false) {
                                Bookmark.findOneAndUpdate({ postId: req.body.postId, userId: tokenResult._id }, { bookmark: !result.bookmark, timestamp: Date.now() }, (error: any, result: any) => {
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
                                                Post.findOneAndUpdate({ _id: result._id }, { bookmarks: result.bookmarks + 1 }, (error: any, result: any) => {
                                                    if (error) {
                                                        res.send({
                                                            error: error
                                                        })
                                                    } else {
                                                        res.send({
                                                            message: 'Bookmarked',
                                                            result: result
                                                        })
                                                    }
                                                })
                                            }
                                        })
                                    }
                                })
                            } else {
                                Bookmark.findOneAndUpdate({ postId: req.body.postId, userId: tokenResult._id }, { bookmark: !result.bookmark, timestamp: Date.now() }, (error: any, result: any) => {
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
                                                Post.findOneAndUpdate({ _id: result._id }, { bookmarks: result.bookmarks - 1 }, (error: any, result: any) => {
                                                    if (error) {
                                                        res.send({
                                                            error: error
                                                        })
                                                    } else {
                                                        res.send({
                                                            message: 'Bookmarked',
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
                        {
                            '$lookup': {
                                'from': 'auths',
                                'localField': 'userId',
                                'foreignField': '_id',
                                'as': 'commentedUsers'
                            },
                        }
                    ])
                }
            })
        }
    }
}

var postController = new PostController();
export default postController;