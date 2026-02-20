const express = require('express');
const router = express.Router();

const {userControllers} = require('../controllers');

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
        const result = await userControllers.getUserProfile(req.body);
        res.status(201).json(result);
    } catch (err) {
        const status = err.status || 500;
        res.status(status).json({ error: err.message });
    }
});

router.put('/me', async (req, res) => {
    try {
        const result = await userControllers.updateUserProfile(req.body);
        res.status(201).json(result);
    } catch (err) {
        const status = err.status || 500;
        res.status(status).json({ error: err.message });
    }
});

router.put('/me/passwords', async (req, res) => {
    try {
        const result = await userControllers.updateUserPassword(req.body);
        res.status(201).json(result);
    } catch (err) {
        const status = err.status || 500;
        res.status(status).json({ error: err.message });
    }
});

router.get('/', async (req, res) => {
    try {
        const result = await userControllers.getUsersProfiles(req.body);
        res.status(201).json(result);
    } catch (err) {
        const status = err.status || 500;
        res.status(status).json({ error: err.message });
    }
});

router.delete('/:id', async (req, res) => {
    try {
        const result = await userControllers.deleteUserProfile(req.body);
        res.status(201).json(result);
    } catch (err) {
        const status = err.status || 500;
        res.status(status).json({ error: err.message });
    }
});

module.exports = router;
