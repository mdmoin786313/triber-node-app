let multer = require('multer');
var path = require('path');

const storage = multer.diskStorage({
    destination: (req: any, file: any, cb: any) => {
        cb(null, '../../React-Native/triber/public/');
    },
    filename: (req: any, file: any, cb: any) => {
        cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname))
    }
})

var upload = multer({ storage: storage }).single('image');
export default upload;