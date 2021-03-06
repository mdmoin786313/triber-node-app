import Auth from '../models/auth.model';
let jwt = require('jsonwebtoken');
let bcrypt = require('bcrypt')
import mongoose from 'mongoose';
import postController from './post.controller';

export default class AuthController {
    usernameCheck(req: any, res: any) {
        Auth.find({ 'username': req.body.username }, (error: any, result: any) => {
            var rest = Buffer.from(result);
            var len = rest.length;
            if (error) {
                res.send({
                    message: "Record Error!",
                    error: error
                })
            } else if (len > 0) {
                res.send({
                    message: "Username already taken",
                    result: result
                })
            }
        })
    }

    userAuthCreate(req: any, res: any, next: any) {
        Auth.find({ $or: [{ 'phone': req.body.phone }, { 'username': req.body.username }] }, (error: any, result: any) => {
            var rest = Buffer.from(result);
            var len = rest.length;
            if (error) {
                res.send({
                    message: "Record Error!",
                    error: error
                })
            } else if (len > 0) {
                res.send({
                    message: "Username/Phone already Registered",
                    result: result,
                    responseCode: 2001
                })
            } else {
                bcrypt.hash(req.body.password, 10, (error: any, hash: any) => {
                    if (error) {
                        throw error;
                    } else {
                        var userPass = hash;
                        const schema: any = {
                            username: req.body.username,
                            password: userPass,
                            fullname: req.body.fullname,
                            phone: req.body.phone,
                            profileImage: 'https://cdn.imgbin.com/6/25/24/imgbin-user-profile-computer-icons-user-interface-mystique-aBhn3R8cmqmP4ECky4DA3V88y.jpg'
                        }
                        Auth.create(schema, (error: any, resultUser: any) => {
                            if (error) {
                                res.send({
                                    message: 'Error',
                                    error: error
                                })
                            } else {
                                const jwtSchema = {
                                    id: resultUser._id,
                                    username: resultUser.username,
                                    fullname: resultUser.fullname,
                                    phone: resultUser.phone,
                                    password: resultUser.password,
                                    profileImage: 'https://cdn.imgbin.com/6/25/24/imgbin-user-profile-computer-icons-user-interface-mystique-aBhn3R8cmqmP4ECky4DA3V88y.jpg'
                                }
                                jwt.sign(jwtSchema, 'moin1234', (error: any, result: any) => {
                                    if (error) throw error;
                                    res.send({
                                        message: 'User Created',
                                        token: result,
                                        user: resultUser,
                                        responseCode: 2000
                                    })
                                })
                            }
                        })
                    }
                })
            }
        })
    }

    userAuthLogin(req: any, res: any) {
        Auth.findOne({ $or: [{ 'username': req.body.username }] }, (error: any, result: any) => {
            if (error) {
                res.send({
                    message: 'Error',
                    error: error
                })
            } else {
                if (result == null) {
                    return res.send({
                        message: 'Invalid Credentials',
                        responseCode: 0
                    })
                }
                bcrypt.compare(req.body.password, result.password, (error: any, match: any) => {
                    if (error) throw error;
                    if (match) {
                        const jwtSchema = {
                            id: result._id,
                            username: result.username,
                            fullname: result.fullname,
                            phone: result.phone,
                            email: result.email,
                            password: result.password,
                            profileImage: result.profileImage,
                            followersCount: result.followersCount,
                            followingCount: result.followingCount,
                            postCount: result.postCount,
                            bio: result.bio
                        }
                        jwt.sign(jwtSchema, 'moin1234', (error: any, token: any) => {
                            if (error) throw error;
                            res.send({
                                message: 'User Logged In',
                                token: token,
                                user: result,
                                responseCode: 1
                            })
                        })
                    } else {
                        res.send({
                            message: 'Invalid Credentials',
                            responseCode: 0
                        })
                    }
                }
                )
            }
        })
    }

    verifyToken(req: any, res: any) {
        var token = req.headers.token;
        if (!token) {
            res.send({
                message: 'No Token Found'
            })
        } else {
            jwt.verify(token, 'moin1234', (error: any, decoded: any) => {
                if (error) throw error;
                res.send({
                    message: 'Decoded',
                    decoded: decoded
                })
            })
        }
    }

    updateProfile(req: any, res: any) {
        var token = req.headers.token;
        if (!token) {
            res.send({
                message: 'No Token Found'
            })
        } else {
            jwt.verify(token, 'moin1234', (error: any, decoded: any) => {
                if (error) throw error;
                else {
                    if (req.body.oldPassword != (undefined || null || '') && req.body.newPassword != (undefined || null || '')) {
                        Auth.findOne({ _id: decoded.id }, (error: any, result: any) => {
                            if (error) throw error;
                            else {
                                bcrypt.compare(req.body.oldPassword, result.password, (error: any, match: any) => {
                                    if (error) throw error;
                                    if (match) {
                                        bcrypt.hash(req.body.newPassword, 10, (error: any, hash: any) => {
                                            if (error) {
                                                throw error;
                                            } else {
                                                Object.assign(req.body.data, { password: hash })
                                                Auth.findOneAndUpdate({ _id: mongoose.Types.ObjectId(decoded.id) }, req.body.data, { new: true, returnOriginal: false }, (error: any, result: any) => {
                                                    if (error) throw error;
                                                    else {
                                                        res.send({
                                                            message: 'Updated',
                                                            result: result
                                                        })
                                                    }
                                                })
                                            }
                                        })
                                    } else {
                                        res.send({
                                            message: 'Password Mismatch',
                                            result: result
                                        })
                                    }
                                }
                                )
                            }
                        })
                    } else {
                        Auth.findOneAndUpdate({ _id: mongoose.Types.ObjectId(decoded.id) }, req.body.data, { new: true, returnOriginal: false }, (error: any, result: any) => {
                            if (error) throw error;
                            else {
                                res.send({
                                    message: 'Updated',
                                    result: result
                                })
                            }
                        })
                    }
                }
            })
        }
    }

    userInfo(req: any, res: any, next: any) {
        var token = req.headers.token;
        if (!token) {
            res.send({
                message: 'No Token Found'
            })
        } else {
            jwt.verify(token, 'moin1234', (error: any, decoded: any) => {
                if (error) throw error;
                else {
                    Auth.aggregate([
                        {
                            $match: {
                                _id: mongoose.Types.ObjectId(req.body.id)
                            }
                        },
                        {
                            $lookup: {
                                from: 'posts',
                                as: 'posts',
                                localField: '_id',
                                foreignField: 'postId',
                            }
                        }
                    ], (error: any, result: any) => {
                        if (error) {
                            res.send({
                                message: "Record Error!",
                                result: error
                            })
                        } else {
                            res.send({
                                message: "Record Fetched!",
                                result: result
                            })
                        }
                    })
                }
            })
        }
    }
}

export const authController = new AuthController();