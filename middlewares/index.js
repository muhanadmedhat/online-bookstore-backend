const {verifyToken, authorize} = require('./auth');
const uploadCover = require('./upload');
const validateSchema = require('./validate');

module.exports = {validateSchema, verifyToken, authorize, uploadCover};
