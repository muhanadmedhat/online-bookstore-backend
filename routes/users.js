const express = require('express');
const {userControllers} = require('../controllers');
const {verifyToken, authorize, validateSchema} = require('../middlewares/');
const {userUpdateProfileSchema, userUpdatePasswordSchema} = require('../validations/users.js');

const router = express.Router();
router.use(verifyToken);

/**
 * @swagger
 * /users/me:
 *   get:
 *     summary: Get the current logged-in user's profile
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Logged in user profile data
 *       401:
 *         description: Authentication required
 */
router.get('/me', async (req, res, next) => {
  try {
    const result = await userControllers.getUserProfile(req.user.id);
    res.status(201).json(result);
  } catch (err) {
    next(err);
  }
});

/**
 * @swagger
 * /users/me:
 *   put:
 *     summary: Update the current logged-in user's profile
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               address:
 *                 type: string
 *               phone:
 *                 type: string
 *     responses:
 *       200:
 *         description: User profile updated successfully
 *       400:
 *         description: Validation error
 *       401:
 *         description: Authentication required
 */
router.put('/me', validateSchema(userUpdateProfileSchema), async (req, res, next) => {
  try {
    const result = await userControllers.updateUserProfile(req.user.id, req.body);
    res.status(201).json(result);
  } catch (err) {
    next(err);
  }
});

/**
 * @swagger
 * /users/me/passwords:
 *   put:
 *     summary: Update the current logged-in user's password
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - currentPassword
 *               - newPassword
 *             properties:
 *               currentPassword:
 *                 type: string
 *                 format: password
 *               newPassword:
 *                 type: string
 *                 format: password
 *     responses:
 *       200:
 *         description: Password updated successfully
 *       400:
 *         description: Validation error
 *       401:
 *         description: Authentication required or wrong current password
 */
router.put('/me/passwords', validateSchema(userUpdatePasswordSchema), async (req, res, next) => {
  try {
    const result = await userControllers.updateUserPassword(req.user.id, req.body);
    res.status(201).json(result);
  } catch (err) {
    next(err);
  }
});

/**
 * @swagger
 * /users:
 *   get:
 *     summary: Get all user profiles (Admin only)
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: A list of users
 *       401:
 *         description: Authentication required
 *       403:
 *         description: Permission denied (Admin only)
 */
router.get('/', authorize('admin'), async (req, res, next) => {
  try {
    const result = await userControllers.getUsersProfiles(req.query);
    res.status(201).json(result);
  } catch (err) {
    next(err);
  }
});

/**
 * @swagger
 * /users/{id}:
 *   delete:
 *     summary: Delete a user profile (Admin only)
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: User ID
 *     responses:
 *       200:
 *         description: User deleted successfully
 *       401:
 *         description: Authentication required
 *       403:
 *         description: Permission denied (Admin only)
 *       404:
 *         description: User not found
 */
router.delete('/:id', authorize('admin'), async (req, res, next) => {
  try {
    const result = await userControllers.deleteUserProfile(req.params.id);
    res.status(201).json(result);
  } catch (err) {
    next(err);
  }
});

module.exports = router;
