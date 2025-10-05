const multer = require('multer');
const fs = require('fs');
const path = require('path');
const dotenv = require('dotenv');
dotenv.config();


const UPLOAD_DIR = process.env.UPLOAD_DIR || 'uploads';


const storage = multer.diskStorage({
destination: (req, file, cb) => {
const uid = req.params.uid;
const dir = path.join(UPLOAD_DIR, uid);
if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
cb(null, dir);
},
filename: (req, file, cb) => {
const type = req.params.type || 'file';
const ext = path.extname(file.originalname);
const fileName = `${type}_${Date.now()}${ext}`;
cb(null, fileName);
}
});


const fileFilter = (req, file, cb) => {
// accept images only
if (!file.mimetype.startsWith('image/')) {
return cb(new Error('Only image files are allowed!'), false);
}
cb(null, true);
};


const upload = multer({ storage, fileFilter, limits: { fileSize: 5 * 1024 * 1024 } });


module.exports = upload;