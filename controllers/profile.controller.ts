import Auth from "../models/auth.model";
import { ObjectId } from "mongodb";
import upload from "../config/multer.config";

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
                        {
                            $lookup: {
                                from: 'follow',
                                localField: '_id',
                                foreignField: 'responderId',
                                as: 'followStat'
                            }
                        }
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
                                res.send({
                                    message: 'Profile',
                                    result: result,
                                    responseCode: 2
                                })
                            }
                        }
                    }).limit(1);
                }
            })
        }
    }

    editProfile(req: any, res: any) {
        upload(req, res, (err: any) => {
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
                            const schema = {
                                username: req.body.username,
                                fullname: req.body.fullname,
                                bio: req.body.bio,
                                email: req.body.email,
                                phone: req.body.phone
                            }
                            Auth.findOneAndUpdate({ _id: tokenResult.id }, schema, (error: any, result: any) => {
                                if (error) {
                                    res.send({
                                        error: error
                                    })
                                } else {
                                    res.send({
                                        message: 'Updated',
                                        result: result
                                    })
                                }
                            })
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
                            const schema = {
                                username: req.body.username,
                                fullname: req.body.fullname,
                                bio: req.body.bio,
                                profileImage: req.file.path,
                                email: req.body.email,
                                phone: req.body.phone
                            }
                            Auth.findOneAndUpdate({ _id: tokenResult.id }, schema, (error: any, result: any) => {
                                if (error) {
                                    res.send({
                                        error: error
                                    })
                                } else {
                                    res.send({
                                        message: 'Updated',
                                        result: result
                                    })
                                }
                            })
                        }
                    })
                }
            }
        });
    }
}

const profileController = new ProfileController();
export default profileController