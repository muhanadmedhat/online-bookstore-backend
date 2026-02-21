const upload = require('../config/multer');
const CustomError = require('../helpers/CustomError');

function uploadCover(req, res, next) {
  upload.single('coverImage')(req, res, (err) => {
    if (err) return next(new CustomError({statusCode: 400, message: err.message, code: 'UPLOAD_FAILED'}));
    next();
  });
}

module.exports = uploadCover;
