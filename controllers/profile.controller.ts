import Auth from "../models/auth.model";
import { ObjectId } from "mongodb";
import uploadMulter from "../config/multer.config";
import Follow from "../models/follow.model";
let bcrypt = require('bcrypt');

let jwt = require('jsonwebtoken');

class ProfileController {
    profile(req: any, res: any) {
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
                    const id = req.body._id;
                    Auth.aggregate([
                        {
                            $match: {
                                _id: new ObjectId(id)
                            }
                        },
                        {
                            $lookup: {
                                from: 'posts',
                                localField: '_id',
                                foreignField: 'userId',
                                as: 'posts'
                            },
                        },
                        {
                            $lookup: {
                                from: 'tags',
                                localField: '_id',
                                foreignField: 'taggedId',
                                as: 'tags'
                            }
                        },
                        // {
                        //     $lookup: {
                        //         from: 'follows',
                        //         'let': {
                        //             responderId: '$_id'
                        //         },
                        //         'pipeline': [{
                        //             '$match': {
                        //                 '$expr': {
                        //                     '$and':
                        //                         [
                        //                             {
                        //                                 '$eq': ['$userId', '$tokenResult.id']
                        //                             },
                        //                             {
                        //                                 '$eq': ['$responderId', '$$responderId']
                        //                             }
                        //                         ]
                        //                 }
                        //             }
                        //         }],
                        //         as: 'followStat'
                        //     }
                        // }
                    ], (error: any, result: any) => {
                        if (error) {
                            res.send({
                                error: error,
                                responseCode: 0
                            })
                        } else {
                            if (tokenResult.id == result[0]._id) {
                                res.send({
                                    message: 'Self Profile',
                                    result: result,
                                    responseCode: 1
                                })
                            } else {
                                Follow.findOne({ userId: tokenResult.id, responderId: id }, (error: any, followStatus: any) => {
                                    if (error) {
                                        res.send({
                                            error: error,
                                            responseCode: 0
                                        })
                                    } else {
                                        Follow.findOne({ userId: id, responderId: tokenResult.id }, (error: any, blockStatus: any) => {
                                            if (error) {
                                                res.send({
                                                    error: error,
                                                    responseCode: 0
                                                })
                                            } else {
                                                res.send({
                                                    message: 'Profile',
                                                    result: result,
                                                    followStatus: followStatus,
                                                    blockStatus: blockStatus,
                                                    responseCode: 2
                                                })
                                            }
                                        })

                                    }
                                })
                            }
                        }
                    }).limit(1);
                }
            })
        }
    }

    getProfile(req: any, res: any) {
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
                    Auth.findOne({ _id: tokenResult.id }, (error: any, result: any) => {
                        if (error) {
                            res.send({
                                error: error
                            })
                        } else {
                            res.send({
                                message: 'Profile Details',
                                result: result,
                                responseCode: 1
                            })
                        }
                    })
                }
            })
        }
    }

    editProfile(req: any, res: any) {
        uploadMulter.upload(req, res, (err: any) => {
            if (err) {
                res.send({
                    error: err
                })
            } else if (!req.file) {
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
                            if (req.body.oldPassword != null && req.body.newPassword != null) {
                                Auth.findOne({ _id: tokenResult.id }, (error: any, user: any) => {
                                    if (error) {
                                        res.send({
                                            error: error
                                        })
                                    } else {
                                        bcrypt.compare(req.body.oldPassword, user.password, (error: any, match: any) => {
                                            if (error) throw error;
                                            if (match) {
                                                bcrypt.hash(req.body.newPassword, 10, (error: any, hash: any) => {
                                                    if (error) {
                                                        throw error;
                                                    } else {
                                                        const schema = {
                                                            username: req.body.username,
                                                            fullname: req.body.fullname,
                                                            bio: req.body.bio,
                                                            password: hash
                                                        }
                                                        Auth.findOneAndUpdate({ _id: tokenResult.id }, schema, {new: true}, (error: any, result: any) => {
                                                            if (error) {
                                                                res.send({
                                                                    error: error
                                                                })
                                                            } else {
                                                                res.send({
                                                                    message: 'Updated',
                                                                    result: result,
                                                                    responseCode: 1
                                                                })
                                                            }
                                                        })
                                                    }
                                                })
                                            } else {
                                                res.send({
                                                    message: 'Password Mismatch',
                                                    responseCode: 2
                                                })
                                            }
                                        })
                                    }
                                })
                            } else {
                                const schema = {
                                    username: req.body.username,
                                    fullname: req.body.fullname,
                                    bio: req.body.bio,
                                }
                                Auth.findOneAndUpdate({ _id: tokenResult.id }, schema, (error: any, result: any) => {
                                    if (error) {
                                        res.send({
                                            error: error
                                        })
                                    } else {
                                        res.send({
                                            message: 'Updated',
                                            result: result,
                                            responseCode: 1
                                        })
                                    }
                                })
                            }
                        }
                    })
                }
            } else {
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
                            if (req.body.oldPassword != null && req.body.newPassword != null) {
                                Auth.findOne({ _id: tokenResult.id }, (error: any, user: any) => {
                                    if (error) {
                                        res.send({
                                            error: error
                                        })
                                    } else {
                                        bcrypt.compare(req.body.oldPassword, user.password, (error: any, match: any) => {
                                            if (error) throw error;
                                            if (match) {
                                                bcrypt.hash(req.body.newPassword, 10, (error: any, hash: any) => {
                                                    if (error) {
                                                        throw error;
                                                    } else {
                                                        const schema = {
                                                            username: req.body.username,
                                                            fullname: req.body.fullname,
                                                            bio: req.body.bio,
                                                            profileImage: req.body.profileImage,                                                            
                                                            password: hash
                                                        }
                                                        Auth.findOneAndUpdate({ _id: tokenResult.id }, schema, (error: any, result: any) => {
                                                            if (error) {
                                                                res.send({
                                                                    error: error
                                                                })
                                                            } else {
                                                                res.send({
                                                                    message: 'Updated',
                                                                    result: result,
                                                                    responseCode: 1
                                                                })
                                                            }
                                                        })
                                                    }
                                                })
                                            } else {
                                                res.send({
                                                    message: 'Password Mismatch',
                                                    responseCode: 2
                                                })
                                            }
                                        })
                                    }
                                })
                            } else {
                                const schema = {
                                    username: req.body.username,
                                    fullname: req.body.fullname,
                                    bio: req.body.bio,
                                    profileImage: req.body.profileImage,
                                }
                                Auth.findOneAndUpdate({ _id: tokenResult.id }, schema, (error: any, result: any) => {
                                    if (error) {
                                        res.send({
                                            error: error
                                        })
                                    } else {
                                        res.send({
                                            message: 'Updated',
                                            result: result,
                                            responseCode: 1
                                        })
                                    }
                                })
                            }
                        }
                    })
                }
            }
        });
    }
}

const profileController = new ProfileController();
export default profileController