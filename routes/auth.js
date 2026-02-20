const express = require('express');
const router = express.Router();

const {authControllers} = require('../controllers');
const {authMiddlewares} = require('../middlewares');


router.get('/me/test', async (req, res) => {
    try {
        res.status(201).json({result: "Connection Ok"});
    } catch (err) {
        const status = err.status || 500;
        res.status(status).json({ error: err.message });
    }
});


router.post('/register', authMiddlewares.validateUserRegister, async (req, res) => {
    try {
        const result = await authControllers.userRegister(req.body);
        res.status(201).json(result);
    } catch (err) {
        const status = err.status || 500;
        res.status(status).json({ error: err.message });
    }
});


router.post('/login', authMiddlewares.validateUserLogin, async (req, res) => {
    try {
        const result = await authControllers.userLogin(req.body);
        res.status(200).json(result);
    } catch (err) {
        const status = err.status || 500;
        res.status(status).json({ error: err.message });
    }
});


router.post('/logout', async (req, res) => {
    try {
        const payload = { refreshToken: req.body.refreshToken, userId: req.body.userId };
        console.log(payload);
        const result = await authControllers.userLogout(payload);
        res.clearCookie && res.clearCookie('refreshToken');
        res.status(200).json(result);
    } catch (err) {
        const status = err.status || 500;
        res.status(status).json({ error: err.message });
    }
});


router.post('/refresh', async (req, res) => {
    try {
        const { refreshToken } = req.body;
        const tokens = await authControllers.refreshTokens({ refreshToken });
        // optionally set cookie: res.cookie('refreshToken', tokens.refreshToken, { httpOnly: true, secure: true });
        res.status(200).json(tokens);
    } catch (err) {
        const status = err.status || 500;
        res.status(status).json({ error: err.message });
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
