let multer = require('multer');

const storage = multer.diskStorage({
    destination: (req: any, file: any, cb: any) => {
        cb(null, './images/');
    },
    filename: (req: any, file: any, cb: any) => {
        cb(null, file.fieldname + '-' + Date.now())
    }
})

var upload = multer({ storage: storage }).single('image');
export default upload;