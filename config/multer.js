const multer = require('multer');
const {CloudinaryStorage} = require('multer-storage-cloudinary');
const cloudinary = require('./cloudinary');

const storage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: 'bookstore/book-covers',
    allowed_formats: ['jpg', 'jpeg', 'png', 'webp'],
    transformation: [{width: 500, height: 700, crop: 'limit'}],
    public_id: (req, file) => {
      const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
      const originalName = file.originalname.split('.')[0];
      return `${originalName}-${uniqueSuffix}`;
    }
  }
});

const upload = multer({
  storage,
  limits: {fileSize: 2 * 1024 * 1024},
  fileFilter: (req, file, cb) => {
    const allowed = ['image/jpeg', 'image/png', 'image/webp'];
    if (!allowed.includes(file.mimetype)) {
      return cb(new Error('Invalid file type. Only jpg, png, webp allowed'));
    }
    cb(null, true);
  }
});

module.exports = upload;
