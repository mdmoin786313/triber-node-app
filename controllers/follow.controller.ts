import Follow from "../models/follow.model";
import Auth from "../models/auth.model";
const mongoose = require('mongoose');
let jwt = require('jsonwebtoken');

class FollowController {
    getFollowers(req: any, res: any) {
        var token = req.headers.token;

        jwt.verify(token, 'moin1234', (err: any, user: any) => {
            if (err) {
                res.send({
                    message: "Unauthorized Access!",
                    status: "400",
                    error: err,
                    responseCode: 500
                })
            } else {
                Follow.aggregate([
                    { $match: { userId: mongoose.Types.ObjectId(req.body.userId), status: 2 } },
                    {
                        $lookup: {
                            from: 'auths',
                            localField: 'responderId',
                            foreignField: '_id',
                            as: 'user'
                        }
                    },
                ],
                    (error: any, result: any) => {
                        if (error) {
                            res.send({
                                message: "Undefined DB Error",
                                error: error,
                                status: 200,
                                responseCode: 700
                            })
                        } else {
                            var user: any = [];
                            result.forEach((activity: any) => {
                                // var status = activity.status.find(
                                //     (s: any) => {

                                //         return (JSON.stringify(s.userId)) === (JSON.stringify(activity.reqID));
                                //     }
                                // );
                                // activity.user[0].status = status;
                                user.push(activity.user[0]);
                            });
                            res.send({
                                message: "Follower Count",
                                status: 200,
                                responseCode: 2000,
                                length: user.length,
                                result: user,
                            })
                        }
                    })
            }
        })
    }

    getFollowing(req: any, res: any) {
        var token = req.headers.token;

        jwt.verify(token, 'moin1234', (err: any, user: any) => {
            if (err) {
                res.send({
                    message: "Unauthorized Access!",
                    status: "400",
                    error: err,
                    responseCode: 500
                })
            } else {

                Follow.aggregate([{ $match: { responderId: mongoose.Types.ObjectId(req.body.userId), status: 2 } },
                {
                    $lookup: {
                        from: 'auths',
                        localField: 'userId',
                        foreignField: '_id',
                        as: 'user'
                    }
                },
                    // {
                    //     $lookup: {
                    //         from: 'follows',
                    //         let: {
                    //             userId: "$userId",
                    //             reqID: "$reqID"
                    //         },
                    //         pipeline: [
                    //             {
                    //                 $match: {
                    //                     $expr: {
                    //                         $and: [
                    //                             { $eq: ["$reqID", mongoose.Types.ObjectId(user._id)] },
                    //                         ]
                    //                     }
                    //                 }
                    //             }
                    //         ],
                    //         as: "status"
                    //     }
                    // },
                ],
                    (error: any, result: any) => {
                        if (error) {
                            res.send({
                                message: "Undefined DB Error",
                                error: error,
                                status: 200,
                                responseCode: 700
                            })
                        } else {
                            var user: any = [];
                            result.forEach((activity: any) => {
                                // var status = activity.status.find(
                                //     (s: any) => {

                                //         return (JSON.stringify(s.userId)) === (JSON.stringify(activity.userId));
                                //     }
                                // );
                                // activity.user[0].status = status;
                                user.push(activity.user[0]);
                            });
                            res.send({
                                message: "Follower Count",
                                status: 200,
                                responseCode: 2000,
                                length: user.length,
                                result: user
                            })
                        }
                    })
            }
        })
    }

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
                    Follow.findOne({ userId: mongoose.Types.ObjectId(schema.userId), responderId: mongoose.Types.ObjectId(schema.responderId) }, (error: any, result: any) => {
                        if (error) {
                            res.send({
                                error: error
                            })
                        } else if (result == null) {
                            Auth.findOne({ _id: mongoose.Types.ObjectId(schema.responderId) }, (error: any, user: any) => {
                                if (error) {
                                    res.send({
                                        error: error
                                    })
                                } else {
                                    var schema = {
                                        userId: mongoose.Types.ObjectId(tokenResult.id),
                                        responderId: mongoose.Types.ObjectId(req.body.responderId),
                                        followStatus: 2,
                                        timestamp: Date.now()
                                    }
                                    Follow.create(schema, (error: any, result: any) => {
                                        if (error) {
                                            res.send({
                                                error: error
                                            })
                                        } else {
                                            Auth.findOneAndUpdate({ _id: mongoose.Types.ObjectId(schema.responderId) }, { followersCount: user.followersCount + 1 }, (error: any, result: any) => {
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
                                            })
                                        }
                                    })
                                }
                            })
                        } else {
                            if (result.isPrivate == true && result.followStatus == 0) {
                                Follow.findOneAndUpdate({ userId: mongoose.Types.ObjectId(schema.userId), responderId: mongoose.Types.ObjectId(schema.responderId) }, { followStatus: 1, timestamp: Date.now() }, (error: any, result: any) => {
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
                                })
                            } else if (result.isPrivate == false && result.followStatus == 0) {
                                Follow.findOneAndUpdate({ userId: mongoose.Types.ObjectId(schema.userId), responderId: mongoose.Types.ObjectId(schema.responderId) }, { followStatus: 2, timestamp: Date.now() }, (error: any, result: any) => {
                                    if (error) {
                                        res.send({
                                            error: error
                                        })
                                    } else {
                                        Auth.findOne({ _id: mongoose.Types.ObjectId(schema.responderId) }, (error: any, result: any) => {
                                            if (error) {
                                                res.send({
                                                    error: error
                                                })
                                            } else {
                                                Auth.findOneAndUpdate({ _id: mongoose.Types.ObjectId(schema.responderId) }, { followersCount: result.followersCount + 1 }, (error: any, result: any) => {
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
                                                })
                                            }
                                        })
                                    }
                                })
                            } else if (result.isPrivate == true && result.followStatus == 1) {
                                Follow.findOneAndUpdate({ userId: mongoose.Types.ObjectId(schema.userId), responderId: mongoose.Types.ObjectId(schema.responderId) }, { followStatus: 0, timestamp: Date.now() }, (error: any, result: any) => {
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
                                })
                            } else if (result.isPrivate == false && result.followStatus == 2) {
                                Follow.findOneAndUpdate({ userId: mongoose.Types.ObjectId(schema.userId), responderId: mongoose.Types.ObjectId(schema.responderId) }, { followStatus: 0, timestamp: Date.now() }, (error: any, result: any) => {
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
                                                Auth.findOneAndUpdate({ _id: mongoose.Types.ObjectId(schema.responderId) }, { followersCount: result.followersCount - 1 }, (error: any, result: any) => {
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
                        userId: tokenResult.id,
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
                        responderId: tokenResult.id,
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
                                            res.send({
                                                message: 'User Accepted',
                                                result: result
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
}

const followController = new FollowController();
export default followController;