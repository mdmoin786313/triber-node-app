import Follow from "../models/follow.model";
import Auth from "../models/auth.model";
import Notification from "../models/notification.model";
import { ObjectId } from "mongodb";

let jwt = require('jsonwebtoken');

class FollowController {
    follow(req: any, res: any) {
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
                        responderId: req.body.responderId,
                        followStatus: 1,
                        timestamp: Date.now()
                    }
                    Follow.findOne({ userId: schema.userId, responderId: schema.responderId }, (error: any, result: any) => {
                        if (error) {
                            res.send({
                                error: error
                            })
                        } else if (result == null) {
                            Auth.findOne({ _id: schema.responderId }, (error: any, user: any) => {
                                if (error) {
                                    res.send({
                                        error: error
                                    })
                                } else if (tokenResult.public == false) {
                                    Follow.create(schema, (error: any, result: any) => {
                                        if (error) {
                                            res.send({
                                                error: error
                                            })
                                        } else {
                                            var notifySchema = {
                                                userId: tokenResult.id,
                                                message: tokenResult.username + ' has requested to follow you.',
                                                respondentId: schema.responderId,
                                                type: 1,
                                                timestamp: Date.now()
                                            }
                                            Notification.create(notifySchema, (error: any, result: any) => {
                                                if (error) {
                                                    res.send({
                                                        error: error
                                                    })
                                                } else {
                                                    res.send({
                                                        message: 'User Requested',
                                                        result: result
                                                    })
                                                }
                                            });
                                        }
                                    })
                                } else {
                                    var schema = {
                                        userId: tokenResult.id,
                                        responderId: req.body.responderId,
                                        followStatus: 2,
                                        timestamp: Date.now()
                                    }
                                    Follow.create(schema, (error: any, result: any) => {
                                        if (error) {
                                            res.send({
                                                error: error
                                            })
                                        } else {
                                            Auth.findOneAndUpdate({ _id: schema.responderId }, { followersCount: user.followersCount + 1 }, (error: any, result: any) => {
                                                if (error) {
                                                    res.send({
                                                        error: error
                                                    })
                                                } else {
                                                    var notifySchema = {
                                                        userId: tokenResult.id,
                                                        message: tokenResult.username + ' has started following you.',
                                                        respondentId: schema.responderId,
                                                        type: 2,
                                                        timestamp: Date.now()
                                                    }
                                                    Notification.create(notifySchema, (error: any, result: any) => {
                                                        if (error) {
                                                            res.send({
                                                                error: error
                                                            })
                                                        } else {
                                                            res.send({
                                                                message: 'User Followed',
                                                                result: result
                                                            })
                                                        }
                                                    });
                                                }
                                            })
                                        }
                                    })
                                }
                            })
                        } else {
                            if (tokenResult.public == false && result.followStatus == 0) {
                                Follow.findOneAndUpdate({ userId: schema.userId, responderId: schema.responderId }, { followStatus: 1, timestamp: Date.now() }, (error: any, result: any) => {
                                    if (error) {
                                        res.send({
                                            error: error
                                        })
                                    } else {
                                        var notifySchema = {
                                            userId: tokenResult.id,
                                            message: tokenResult.username + ' has requested to follow you.',
                                            respondentId: schema.responderId,
                                            type: 1,
                                            timestamp: Date.now()
                                        }
                                        Notification.create(notifySchema, (error: any, result: any) => {
                                            if (error) {
                                                res.send({
                                                    error: error
                                                })
                                            } else {
                                                res.send({
                                                    message: 'User Requested',
                                                    result: result
                                                })
                                            }
                                        });
                                    }
                                })
                            } else if (tokenResult.public == true && result.followStatus == 0) {
                                Follow.findOneAndUpdate({ userId: schema.userId, responderId: schema.responderId }, { followStatus: 2, timestamp: Date.now() }, (error: any, result: any) => {
                                    if (error) {
                                        res.send({
                                            error: error
                                        })
                                    } else {
                                        Auth.findOne({ _id: schema.responderId }, (error: any, result: any) => {
                                            if (error) {
                                                res.send({
                                                    error: error
                                                })
                                            } else {
                                                Auth.findOneAndUpdate({ _id: schema.responderId }, { followersCount: result.followersCount + 1 }, (error: any, result: any) => {
                                                    if (error) {
                                                        res.send({
                                                            error: error
                                                        })
                                                    } else {
                                                        var notifySchema = {
                                                            userId: tokenResult.id,
                                                            message: tokenResult.username + ' has started following you.',
                                                            respondentId: schema.responderId,
                                                            type: 2,
                                                            timestamp: Date.now()
                                                        }
                                                        Notification.create(notifySchema, (error: any, result: any) => {
                                                            if (error) {
                                                                res.send({
                                                                    error: error
                                                                })
                                                            } else {
                                                                res.send({
                                                                    message: 'User Followed',
                                                                    result: result
                                                                })
                                                            }
                                                        });
                                                    }
                                                })
                                            }
                                        })
                                    }
                                })
                            } else if (tokenResult.public == false && result.followStatus == 1) {
                                Follow.findOneAndUpdate({ userId: schema.userId, responderId: schema.responderId }, { followStatus: 0, timestamp: Date.now() }, (error: any, result: any) => {
                                    if (error) {
                                        res.send({
                                            error: error
                                        })
                                    } else {
                                        res.send({
                                            message: 'User Request Cancelled',
                                            result: result
                                        })
                                    }
                                })
                            } else if (tokenResult.public == true && result.followStatus == 2) {
                                Follow.findOneAndUpdate({ userId: schema.userId, responderId: schema.responderId }, { followStatus: 0, timestamp: Date.now() }, (error: any, result: any) => {
                                    if (error) {
                                        res.send({
                                            error: error
                                        })
                                    } else {
                                        Auth.findOne({ _id: schema.responderId }, (error: any, result: any) => {
                                            if (error) {
                                                res.send({
                                                    error: error
                                                })
                                            } else {
                                                Auth.findOneAndUpdate({ _id: schema.responderId }, { followersCount: result.followersCount - 1 }, (error: any, result: any) => {
                                                    if (error) {
                                                        res.send({
                                                            error: error
                                                        })
                                                    } else {
                                                        res.send({
                                                            message: 'User Unfollowed',
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

    block(req: any, res: any) {
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
                        responderId: req.body.responderId,
                        block: true,
                        timestamp: Date.now()
                    }
                    Follow.findOne({ userId: schema.userId, responderId: schema.responderId }, (error: any, result: any) => {
                        if (error) {
                            res.send({
                                error: error
                            })
                        } else if (result == 0) {
                            Follow.create(schema, (error: any, result: any) => {
                                if (error) {
                                    res.send({
                                        error: error
                                    })
                                } else {
                                    res.send({
                                        message: 'Blocked',
                                        result: result
                                    })
                                }
                            })
                        } else {
                            Follow.findOneAndUpdate({ userId: schema.userId, responderId: schema.responderId }, { block: !result.block }, (error: any, result: any) => {
                                if (error) {
                                    res.send({
                                        error: error
                                    })
                                } else {
                                    res.send({
                                        message: 'Blocked',
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

    acceptRequest(req: any, res: any) {
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
                        userId: req.body.userId,
                        responderId: tokenResult._id,
                        followStatus: 1
                    }
                    Follow.findOneAndUpdate(schema, { followStatus: 2, timestamp: Date.now() }, (error: any, result: any) => {
                        if (error) {
                            res.send({
                                error: error
                            })
                        } else {
                            Auth.findOne({ _id: schema.responderId }, (error: any, result: any) => {
                                if (error) {
                                    res.send({
                                        error: error
                                    })
                                } else {
                                    Auth.findOneAndUpdate({ _id: schema.responderId }, { followersCount: result.followersCount + 1 }, (error: any, result: any) => {
                                        if (error) {
                                            res.send({
                                                error: error
                                            })
                                        } else {
                                            var notifySchema = {
                                                userId: tokenResult.id,
                                                message: tokenResult.username + ' has accepted your follow request.',
                                                respondentId: schema.responderId,
                                                type: 3,
                                                timestamp: Date.now()
                                            }
                                            Notification.create(notifySchema, (error: any, result: any) => {
                                                if (error) {
                                                    res.send({
                                                        error: error
                                                    })
                                                } else {
                                                    res.send({
                                                        message: 'User Accepted',
                                                        result: result
                                                    })
                                                }
                                            });
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

    declineRequest(req: any, res: any) {
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
                        userId: req.body.userId,
                        responderId: tokenResult._id,
                        followStatus: 1
                    }
                    Follow.findOneAndUpdate(schema, { followStatus: 0, timestamp: Date.now() }, (error: any, result: any) => {
                        if (error) {
                            res.send({
                                error: error
                            })
                        } else {
                            res.send({
                                message: 'User Declined',
                                result: result
                            })
                        }
                    })
                }
            })
        }
    }

    followerList(req: any, res: any) {
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
                                'responderId': new ObjectId(tokenResult.id),
                                'followStatus': 2
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
                        }
                    ], (error: any, result: any) => {
                        var resp = Buffer.from(result);
                        var len = resp.length;
                        if (error) {
                            res.send({
                                error: error
                            })
                        } else if (len == 0) {
                            res.send({
                                message: 'No Followers Yet',
                                responseCode: 0
                            })
                        } else {
                            res.send({
                                message: 'Followers',
                                result: result,
                                responseCode: 1
                            })
                        }
                    })
                }
            })
        }
    }

    followingList(req: any, res: any) {
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
                                'followStatus': 2
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
                            '$unwind': {
                                path: '$user'
                            }
                        }
                    ], (error: any, result: any) => {
                        var resp = Buffer.from(result);
                        var len = resp.length;
                        if (error) {
                            res.send({
                                error: error
                            })
                        } else if (len == 0) {
                            res.send({
                                message: 'No Following Yet',
                                responseCode: 0
                            })
                        } else {
                            res.send({
                                message: 'Following',
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

const followController = new FollowController();
export default followController;