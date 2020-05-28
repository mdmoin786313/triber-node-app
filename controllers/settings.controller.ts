import Post from "../models/post.model";
import Bookmark from "../models/bookmark.model";
import uploadMulter from "../config/multer.config";
import Verification from "../models/verification.model";
import Auth from "../models/auth.model";

let jwt = require('jsonwebtoken');

class SettingsController {
    archivedPosts(req: any, res: any) {
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
                        archived: true,
                        deleted: false
                    }
                    Post.find(schema, (error: any, result: any) => {
                        if (error) {
                            res.send({
                                error: error
                            })
                        } else {
                            res.send({
                                message: 'Archived Posts',
                                result: result
                            })
                        }
                    })
                }
            })
        }
    }

    savedPosts(req: any, res: any) {
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
                        bookmark: true
                    }
                    Bookmark.find(schema, (error: any, result: any) => {
                        if (error) {
                            res.send({
                                error: error
                            })
                        } else {
                            res.send({
                                message: 'Saved Posts',
                                result: result
                            })
                        }
                    })
                }
            })
        }
    }

    requestVerification(req: any, res: any) {
        uploadMulter.uploadVDoc(req, res, (err: any) => {
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
                        if (error) {
                            res.send({
                                error: error
                            })
                        } else {
                            var schema = {
                                userId: tokenResult.id,
                                fullname: req.body.fullname,
                                dob: req.body.dob,
                                reason: req.body.reason,
                                file: req.file.path,
                                timestamp: Date.now()
                            }
                            Verification.find({ userId: tokenResult.id }, (error: any, result: any) => {
                                if (error) {
                                    res.send({
                                        error: error
                                    })
                                } else if (result == null) {
                                    Verification.create(schema, (error: any, result: any) => {
                                        if (error) {
                                            res.send({
                                                error: error
                                            })
                                        } else {
                                            res.send({
                                                message: 'Verification Applied',
                                                result: result
                                            })
                                        }
                                    })
                                } else {
                                    res.send({
                                        message: 'Verification Already Applied'
                                    })
                                }
                            })
                        }
                    })
                }
            }
        })
    }

    accountStatus(req: any, res: any) {
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
                                message: 'Public Status',
                                result: result
                            })
                        }
                    })
                }
            })
        }
    }

    accountStatusChange(req: any, res: any) {
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
                    Auth.findOneAndUpdate({ _id: tokenResult.id }, { public: req.body.public }, (error: any, result: any) => {
                        if (error) {
                            res.send({
                                error: error
                            })
                        } else {
                            res.send({
                                message: 'Status Changed',
                                result: result
                            })
                        }
                    })
                }
            })
        }
    }

    
}

const settingsController = new SettingsController();
export default settingsController;