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
    console.log(payload);
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

// TO BE IMPLEMENTED BY MR ASAAAAAAAAAD
// router.get('/verify-email/:token', async (req, res) => {
//     try {
//         const result = await authControllers.verifyEmail(req.params.token);
//         res.status(201).json(result);
//     } catch (err) {
//         const status = err.status || 500;
//         res.status(status).json({ error: err.message });
//     }
// });
//
//
// router.post('/resend-verification', async (req, res) => {
//     try {
//         const result = await authControllers.resendVerification(req.body);
//         res.status(201).json(result);
//     } catch (err) {
//         const status = err.status || 500;
//         res.status(status).json({ error: err.message });
//     }
// });

module.exports = router;
