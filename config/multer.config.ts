let multer = require('multer');
let path = require('path');

const storage = multer.diskStorage({
    destination: (req: any, file: any, cb: any) => {
        cb(null, './images/');
    },
    filename: (req: any, file: any, cb: any) => {
        cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
    }
})

const storageVerification = multer.diskStorage({
    destination: (req: any, file: any, cb: any) => {
        cb(null, './verificationDocs/');
    },
    filename: (req: any, file: any, cb: any) => {
        cb(null, file.fieldname + '-' + Date.now())
    }
})

var upload = multer({ storage: storage }).single('postImage');
var uploadVDoc = multer({ storage: storageVerification }).single('verificationDoc');
var uploadMulter = {
    upload,
    uploadVDoc
}
export default uploadMulter;