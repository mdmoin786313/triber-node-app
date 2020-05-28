import { ObjectId } from "mongodb";
import upload from "../config/multer.config";
import Chat from "../models/chat.model";
let jwt = require('jsonwebtoken');

class ChatController {
    getChats(req: any, res: any) {
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
                        senderId: tokenResult.id,
                        recieverId: req.body.recieverId
                    }
                    Chat.aggregate([
                        {
                            '$lookup': {
                                'from': 'chats',
                                // 'let': {
                                //     senderId: '$tokenResult.id',
                                //     recieverId: '$req.body.recieverId'
                                // },
                                'pipeline': [{
                                    '$match': {
                                        '$expr': {
                                            '$and':
                                                [
                                                    {
                                                        '$eq': ['$senderId', tokenResult.id]
                                                    },
                                                    {
                                                        '$eq': ['$recieverId', req.body.recieverId]
                                                    },
                                                ]

                                        }
                                    }
                                }],
                                'as': 'send'
                            }
                        },
                        // {
                        //     $lookup: {
                        //         'from': 'chats',
                        //         'pipeline': [{
                        //             '$match': {
                        //                 '$expr': {
                        //                     '$and':
                        //                         [
                        //                             {
                        //                                 '$eq': ['$senderId', req.body.recieverId]
                        //                             },
                        //                             {
                        //                                 '$eq': ['$recieverId', tokenResult.id]
                        //                             },
                        //                         ]

                        //                 }
                        //             }
                        //         }],
                        //         'as': 'recieved'
                        //     }
                        // },
                        {
                            '$unwind': {
                                path: '$send'
                            }
                        },
                        // {
                        //     '$unwind': {
                        //         path: '$recieved'
                        //     }
                        // }
                    ], (error: any, result: any) => {
                        if (error) {
                            res.send({
                                error: error
                            })
                        } else {
                            res.send({
                                message: 'Chats',
                                result: result
                            })
                        }
                    })
                }
            })
        }
    }

    sendChat(req: any, res: any) {
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
                        senderId: tokenResult.id,
                        recieverId: req.body.recieverId,
                        message: req.body.message,
                        timestamp: Date.now()
                    }
                    Chat.create(schema, (error: any, result: any) => {
                        if (error) {
                            res.send({
                                error: error
                            })
                        } else {
                            res.send({
                                message: 'Message Sent',
                                result: result
                            })
                        }
                    })
                }
            })
        }
    }
}

const chatController = new ChatController();
export default chatController;