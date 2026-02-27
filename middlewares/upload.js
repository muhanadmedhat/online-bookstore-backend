const createUpload = require('../config/multer');
const CustomError = require('../helpers/CustomError');

function createUploadMiddleware(folder, fieldName) {
  const upload = createUpload(folder);
  return function (req, res, next) {
    upload.single(fieldName)(req, res, (err) => {
      if (err) return next(new CustomError({statusCode: 400, message: err.message, code: 'UPLOAD_FAILED'}));
      next();
    });
  };
}

const uploadCover = createUploadMiddleware('bookstore/book-covers', 'coverImage');
const uploadAuthorImage = createUploadMiddleware('bookstore/authors', 'authorImage');
const uploadCategoryImage = createUploadMiddleware('bookstore/categories', 'categoryImage');

module.exports = {uploadCover, uploadAuthorImage, uploadCategoryImage};
