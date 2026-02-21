const upload = require('../config/multer');
const CustomError = require('../helpers/CustomError');

function uploadCover(req, res, next) {
  upload.single('coverImage')(req, res, (err) => {
    if (err) return next(new CustomError(err.message, 400, 'UPLOAD_FAILED'));
    next();
  });
}

module.exports = uploadCover;
