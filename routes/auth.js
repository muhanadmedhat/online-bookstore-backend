const express = require('express');
const {validateSchema, verifyToken} = require('../middlewares/');
const {userRegisterSchema, userLoginSchema} = require('../validations/auth.js');

const router = express.Router();
const {authControllers} = require('../controllers');

/**
 * @swagger
 * /auth/me/test:
 *   get:
 *     summary: Test the API connection
 *     tags: [Auth]
 *     responses:
 *       201:
 *         description: Connection successful
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 result:
 *                   type: string
 *                   example: Connection Ok
 */
router.get('/me/test', async (req, res, next) => {
  try {
    res.status(201).json({result: 'Connection Ok'});
  } catch (err) {
    next(err);
  }
});

/**
 * @swagger
 * /auth/register:
 *   post:
 *     summary: Register a new user
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *               - name
 *             properties:
 *               name:
 *                 type: string
 *               email:
 *                 type: string
 *                 format: email
 *               password:
 *                 type: string
 *                 format: password
 *     responses:
 *       201:
 *         description: User registered successfully
 *       400:
 *         description: Validation error
 */
router.post('/register', validateSchema(userRegisterSchema), async (req, res, next) => {
  try {
    const result = await authControllers.userRegister(req.body);
    res.status(201).json(result);
  } catch (err) {
    next(err);
  }
});

/**
 * @swagger
 * /auth/verify-email:
 *   post:
 *     summary: Verify a user's email address
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - verificationCode
 *             properties:
 *               verificationCode:
 *                 type: string
 *     responses:
 *       200:
 *         description: Email verified successfully
 *       400:
 *         description: Invalid or expired code
 */
router.post('/verify-email', async (req, res, next) => {
  try {
    const {verificationCode} = req.body;
    const isVerified = await authControllers.verifyEmail(verificationCode);
    res.status(200).json(isVerified);
  } catch (error) {
    next(error);
  }
});

/**
 * @swagger
 * /auth/login:
 *   post:
 *     summary: Log in a user
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *               password:
 *                 type: string
 *                 format: password
 *     responses:
 *       200:
 *         description: Login successful
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 tokens:
 *                   type: object
 *                   properties:
 *                     accessToken:
 *                       type: string
 *                     refreshToken:
 *                       type: string
 *       401:
 *         description: Invalid credentials
 *       403:
 *         description: Email not verified
 */
router.post('/login', validateSchema(userLoginSchema), async (req, res, next) => {
  try {
    const result = await authControllers.userLogin(req.body);
    res.status(200).json(result);
  } catch (err) {
    next(err);
  }
});

/**
 * @swagger
 * /auth/logout:
 *   post:
 *     summary: Log out a user
 *     tags: [Auth]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: false
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               refreshToken:
 *                 type: string
 *     responses:
 *       200:
 *         description: Logged out successfully
 *       401:
 *         description: Authentication required
 */
router.post('/logout', verifyToken, async (req, res, next) => {
  try {
    const payload = {refreshToken: req.body.refreshToken, userId: req.user.id};
    const result = await authControllers.userLogout(payload);
    res.clearCookie && res.clearCookie('refreshToken');
    res.status(200).json(result);
  } catch (err) {
    next(err);
  }
});

/**
 * @swagger
 * /auth/refresh:
 *   post:
 *     summary: Refresh access token
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - refreshToken
 *             properties:
 *               refreshToken:
 *                 type: string
 *     responses:
 *       200:
 *         description: New tokens generated
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 accessToken:
 *                   type: string
 *                 refreshToken:
 *                   type: string
 *       401:
 *         description: Invalid refresh token
 */
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
