const {userControllers} = require('../controllers');
const {authMiddlewares} = require('../middlewares');
const {usersMiddlewares} = require('../middlewares');

const express = require('express');
const router = express.Router();
router.use(authMiddlewares.verifyToken);

router.get('/me/test', async (req, res) => {
    try {
        res.status(201).json({result: "Connection Ok"});
    } catch (err) {
        const status = err.status || 500;
        res.status(status).json({ error: err.message });
    }
});

router.get('/me', async (req, res) => {
    try {
        const result = await userControllers.getUserProfile(req.user.id);
        res.status(201).json(result);
    } catch (err) {
        const status = err.status || 500;
        res.status(status).json({ error: err.message });
    }
});

router.put('/me', usersMiddlewares.validateUserProfileUpdate, async (req, res) => {
    try {
        const result = await userControllers.updateUserProfile(req.user.id, req.body);
        res.status(201).json(result);
    } catch (err) {
        const status = err.status || 500;
        res.status(status).json({ error: err.message });
    }
});

router.put('/me/passwords', usersMiddlewares.validateUserPasswordUpdate, async (req, res) => {
    try {
        const result = await userControllers.updateUserPassword(req.user.id, req.body);
        res.status(201).json(result);
    } catch (err) {
        const status = err.status || 500;
        res.status(status).json({ error: err.message });
    }
});

router.get('/', authMiddlewares.authorize('admin'), async (req, res) => {
    try {
        const result = await userControllers.getUsersProfiles(req.query);
        res.status(201).json(result);
    } catch (err) {
        const status = err.status || 500;
        res.status(status).json({ error: err.message });
    }
});

router.delete('/:id', authMiddlewares.authorize('admin'), async (req, res) => {
    try {
        const result = await userControllers.deleteUserProfile(req.params.id);
        res.status(201).json(result);
    } catch (err) {
        const status = err.status || 500;
        res.status(status).json({ error: err.message });
    }
});

module.exports = router;
