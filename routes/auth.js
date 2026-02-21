const express = require('express');
const {validateSchema} = require('../middlewares/');
const {userRegisterSchema, userLoginSchema} = require('../validations/auth.js');

const router = express.Router();
const {authControllers} = require('../controllers');

router.get('/me/test', async (req, res, next) => {
  try {
    res.status(201).json({result: 'Connection Ok'});
  } catch (err) {
    next(err);
  }
});

router.post('/register', validateSchema(userRegisterSchema), async (req, res, next) => {
  try {
    const result = await authControllers.userRegister(req.body);
    res.status(201).json(result);
  } catch (err) {
    next(err);
  }
});

router.post('/verify-email', async (req, res, next) => {
  try {
    const {verificationCode} = req.body;
    const isVerified = await authControllers.verifyEmail(verificationCode);
    res.status(200).json(isVerified);
  } catch (error) {
    next(error);
  }
});

router.post('/login', validateSchema(userLoginSchema), async (req, res, next) => {
  try {
    const result = await authControllers.userLogin(req.body);
    res.status(200).json(result);
  } catch (err) {
    next(err);
  }
});

router.post('/logout', async (req, res, next) => {
  try {
    const payload = {refreshToken: req.body.refreshToken, userId: req.body.userId};
    const result = await authControllers.userLogout(payload);
    res.clearCookie && res.clearCookie('refreshToken');
    res.status(200).json(result);
  } catch (err) {
    next(err);
  }
});

router.post('/refresh', async (req, res, next) => {
  try {
    const {refreshToken} = req.body;
    const tokens = await authControllers.refreshTokens({refreshToken});
    res.status(200).json(tokens);
  } catch (err) {
    next(err);
  }
});

module.exports = router;
