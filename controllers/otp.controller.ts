import OTP from "../models/otp.model";
import Auth from "../models/auth.model";

let jwt = require('jsonwebtoken');

class OTPController {
    otp(req: any, res: any) {
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
                    OTP.findOne({ userId: tokenResult.id, otp: req.body.otp }, (error: any, result: any) => {
                        if (error) {
                            res.send({
                                error: error
                            })
                        } else if (result == null) {
                            res.send({
                                message: 'No OTP Found',
                                responseCode: 0
                            })
                        } else {
                            Auth.findOneAndUpdate({ _id: tokenResult.id }, { verified: true }, (error: any, verified: any) => {
                                if (error) {
                                    res.send({
                                        error: error
                                    })
                                } else {
                                    res.send({
                                        message: 'OTP',
                                        result: result,
                                        // userVerified: verified,
                                        responseCode: 1
                                    })
                                }
                            })
                        }
                    })
                }
            })
        }
    }

    otpResend(req: any, res: any) {
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
                    var num = Math.floor(Math.random() * 90000) + 10000;
                    OTP.findOneAndUpdate({ userId: tokenResult.id }, { otp: num }, (error: any, result: any) => {
                        if (error) {
                            res.send({
                                error: error
                            })
                        } else {
                            res.send({
                                message: 'OTP Resend',
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

const otpController = new OTPController();
export default otpController;