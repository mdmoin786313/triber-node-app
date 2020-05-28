import {Express} from 'express';
import otpController from '../controllers/otp.controller';

export default class OTPRoute {
    otp(app: Express) {
        app.post('/v1/otp', otpController.otp);
    }

    otpResend(app: Express) {
        app.post('/v1/resendotp', otpController.otpResend);
    }

    otpRoute(app: Express) {
        this.otp(app);
        this.otpResend(app);
    }
}