import { ObjectId } from 'mongodb';
import Notification from '../models/notification.model';
let jwt = require('jsonwebtoken');

class NotificationController {
    getNotifications(req:any, res:any) {
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
                        respondentId: new ObjectId(tokenResult.id)
                    }
                    Notification.aggregate([
                        {
                            '$match': schema
                        },
                        {
                            '$lookup': {
                                'from': 'posts',
                                'localField': 'postId',
                                'foreignField': '_id',
                                'as': 'posts'
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
                    ], (error:any, result:any) => {
                        if (error) {
                            res.send({
                                error: error
                            })
                        } else {
                            res.send({
                                message: 'Notifications',
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

const notificationController = new NotificationController();
export default notificationController;