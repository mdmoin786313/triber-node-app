import Auth from "../models/auth.model";

let jwt = require('jsonwebtoken');

class SearchController {
    searchUser(req: any, res: any) {
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
                    var search = req.body.search;
                    Auth.find({ $or: [{ username: { $ne: tokenResult.username, $regex: search, $options: '$i' } }, { fullname: { $ne: tokenResult.fullname, $regex: search, $options: '$i' } }] }, (error: any, result: any) => {
                        var resp = Buffer.from(result);
                        var len = resp.length;
                        if (error) {
                            res.send({
                                error: error,
                            })
                        } else if (len == 0) {
                            res.send({
                                message: 'No Search Result',
                                responseCode: 0
                            })
                        } else {
                            res.send({
                                message: 'Search Result',
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

const searchController = new SearchController();
export default searchController;