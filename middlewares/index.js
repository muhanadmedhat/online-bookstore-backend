const {verifyToken, authorize} = require('./auth');
const {uploadCover, uploadAuthorImage, uploadCategoryImage} = require('./upload');
const validateSchema = require('./validate');

module.exports = {validateSchema, verifyToken, authorize, uploadCover, uploadAuthorImage, uploadCategoryImage};
