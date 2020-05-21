import Follow from "../models/follow.model";
import Auth from "../models/auth.model";

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
                        userId: tokenResult._id,
                        responderId: req.body.responderId,
                        followStatus: 1,
                        timestamp: Date.now()
                    }
                    Follow.findOne({ userId: schema.userId, responderId: schema.responderId }, (error: any, result: any) => {
                        if (error) {
                            res.send({
                                error: error
                            })
                        } else if (result == 0) {
                            Auth.findOne({ _id: schema.responderId }, (error: any, user: any) => {
                                if (error) {
                                    res.send({
                                        error: error
                                    })
                                } else if (result.isPrivate == true) {
                                    Follow.create(schema, (error: any, result: any) => {
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
                                } else {
                                    var schema = {
                                        userId: tokenResult._id,
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
                                Follow.findOneAndUpdate({ userId: schema.userId, responderId: schema.responderId }, { followStatus: 1, timestamp: Date.now() }, (error: any, result: any) => {
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
                                Follow.findOneAndUpdate({ userId: schema.userId, responderId: schema.responderId }, { followStatus: 0, timestamp: Date.now() }, (error: any, result: any) => {
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