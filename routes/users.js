const express = require('express');
const {userControllers} = require('../controllers');
const {verifyToken, authorize, validateSchema} = require('../middlewares/');
const {userUpdateProfileSchema, userUpdatePasswordSchema} = require('../validations/users.js');

const router = express.Router();
router.use(verifyToken);

router.get('/me/test', async (req, res, next) => {
  try {
    res.status(201).json({result: 'Connection Ok'});
  } catch (err) {
    next(err);
  }
});

router.get('/me', async (req, res, next) => {
  try {
    const result = await userControllers.getUserProfile(req.user.id);
    res.status(201).json(result);
  } catch (err) {
    next(err);
  }
});

router.put('/me', validateSchema(userUpdateProfileSchema), async (req, res, next) => {
  try {
    const result = await userControllers.updateUserProfile(req.user.id, req.body);
    res.status(201).json(result);
  } catch (err) {
    next(err);
  }
});

router.put('/me/passwords', validateSchema(userUpdatePasswordSchema), async (req, res, next) => {
  try {
    const result = await userControllers.updateUserPassword(req.user.id, req.body);
    res.status(201).json(result);
  } catch (err) {
    next(err);
  }
});

router.get('/', authorize('admin'), async (req, res, next) => {
  try {
    const result = await userControllers.getUsersProfiles(req.query);
    res.status(201).json(result);
  } catch (err) {
    next(err);
  }
});

router.delete('/:id', authorize('admin'), async (req, res, next) => {
  try {
    const result = await userControllers.deleteUserProfile(req.params.id);
    res.status(201).json(result);
  } catch (err) {
    next(err);
  }
});

module.exports = router;
