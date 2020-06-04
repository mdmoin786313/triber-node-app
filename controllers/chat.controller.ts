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
                    var schema1 = {
                        senderId: tokenResult.id,
                        recieverId: req.body.recieverId
                    }
                    var schema2 = {
                        senderId: req.body.recieverId,
                        recieverId: tokenResult.id
                    }
                    Chat.aggregate([
                        {
                            '$match': {
                                'senderId': new ObjectId(tokenResult.id),
                                'recieverId': new ObjectId(req.body.recieverId)
                            }
                        },
                        // {
                        //     '$lookup': {
                        //         'from': 'chats',
                        //         'let': {
                        //             senderId: '$recieverId',
                        //             recieverId: '$senderId'
                        //         },
                        //         'pipeline': [{
                        //             '$match': {
                        //                 '$expr': {
                        //                     '$and':
                        //                         [
                        //                             {
                        //                                 '$eq': ['$senderId', '$$senderId']
                        //                             },
                        //                             {
                        //                                 '$eq': ['$recieverId', '$$recieverId']
                        //                             }
                        //                         ]
                        //                 }
                        //             }
                        //         }],
                        //         'as': 'recieved'
                        //     }
                        // },
                        // {
                        //     '$unwind': {
                        //         path: '$recieved'
                        //     }
                        // },
                        // {
                        //     '$project': {
                        //         'send': '$result',
                        //         'recieved': '$recieved'
                        //     }
                        // }
                    ], (error: any, result: any) => {
                        if (error) {
                            res.send({
                                error: error
                            })
                        } else {
                            res.send({
                                message: 'messages',
                                result: result,
                                responseCode: 1
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

const chatController = new ChatController();
export default chatController;