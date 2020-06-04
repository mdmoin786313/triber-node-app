import Auth from '../models/auth.model';
import OTP from '../models/otp.model';
let jwt = require('jsonwebtoken');
let bcrypt = require('bcrypt')

export default class AuthController {
    usernameCheck(req: any, res: any) {
        Auth.findOne({ 'username': req.body.username }, (error: any, result: any) => {
            if (error) {
                res.send({
                    message: "Record Error!",
                    error: error
                })
            } else if (result == null) {
                res.send({
                    message: "Username Available",
                    result: result,
                    responseCode: 1
                })
            } else {
                res.send({
                    message: "Username already taken",
                    result: result,
                    responseCode: 0
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
                    message: "Phone already Registered",
                    result: result,
                    responseCode: 0
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
                            email: req.body.email,
                            public: true,
                            verified: false,
                            authenticated: false,
                            followersCount: 0,
                            followingCount: 0,
                            postCount: 0,
                            // profileImage: 'https://assets.medcampus.io/assets/images/default-avatar.png',
                            timestamp: Date.now()
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
                                    followersCount: resultUser.followerCount,
                                    followingCount: resultUser.followingCount,
                                    postCount: resultUser.postCount,
                                    public: resultUser.public,
                                    verified: resultUser.verified,
                                    timestamp: resultUser.timestamp,
                                    profileImage: resultUser.profileImage
                                }
                                jwt.sign(jwtSchema, 'moin1234', (error: any, result: any) => {
                                    if (error) throw error;
                                    var num = Math.floor(Math.random() * 90000) + 10000;
                                    OTP.create({ userId: resultUser._id, otp: num, timestamp: Date.now() }, (error: any, otp: any) => {
                                        if (error) {
                                            res.send({
                                                message: 'Error',
                                                error: error
                                            })
                                        } else {
                                            res.send({
                                                message: 'User Created',
                                                token: result,
                                                user: resultUser,
                                                otp: otp,
                                                responseCode: 1
                                            })
                                        }
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
            } else if (result == null) {
                res.send({
                    message: 'No User Found',
                    responseCode: 2
                })
            } else {
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
                            bio: result.bio,
                            public: result.public,
                            verified: result.verified,
                            timestamp: result.timestamp,
                        }
                        jwt.sign(jwtSchema, 'moin1234', (error: any, token: any) => {
                            if (error) throw error;
                            if (result.verified == true) {
                                res.send({
                                    message: 'User Logged In',
                                    token: token,
                                    user: result,
                                    responseCode: 1
                                })
                            } else if (result.verified == false) {
                                res.send({
                                    message: 'User Not Verified',
                                    token: token,
                                    user: result,
                                    responseCode: 3
                                })
                            }
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

    logout(req: any, res: any) {
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
                    
                }
            })
        }
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

    userInfo(req: any, res: any, next: any) {
        Auth.find({}, (error: any, result: any) => {
            if (error) {
                res.send({
                    message: "Record Error!",
                    result: error
                })
            } else {
                res.send({
                    message: "Record Created!",
                    result: result
                })
            }
        })
    }
}

export const authController = new AuthController();