const express = require('express');
const router = express.Router();

const { register, login, logout, me, refresh } = require('../app/controller/auth.controller');
const authValidator = require('../app/validator/auth.validator');
const logger = require('../library/logger');
const authMiddleware = require('../middleware/auth.middleware');

/**
 * @openapi
 * /api/v1/auth/register:
 *   post:
 *     tags:
 *       - Auth
 *     summary: Register a new user
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - email
 *               - password
 *             properties:
 *               name:
 *                 type: string
 *                 example: John Doe
 *               email:
 *                 type: string
 *                 example: john@mail.com
 *               password:
 *                 type: string
 *                 example: password123
 *     responses:
 *       201:
 *         description: User registered successfully
 *       400:
 *         description: Email already exists
 *       422:
 *         description: Validation Error
 *       500:
 *         description: Internal Server Error
 */
router.post('/auth/register', authValidator.register, async (req, res) => {
    try {
        await register(req, res);
    } catch (err) {
        logger.error('Register route error', { stack: err.stack });
        return res.status(500).json({ message: 'Internal Server Error' });
    }
});

/**
 * @openapi
 * /api/v1/auth/login:
 *   post:
 *     tags:
 *       - Auth
 *     summary: Login
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - password
 *             properties:
 *               name:
 *                 type: string
 *                 example: John Doe
 *               password:
 *                 type: string
 *                 example: password123
 *     responses:
 *       200:
 *         description: Login successful
 *       400:
 *         description: Invalid credentials
 *       422:
 *         description: Validation Error
 *       500:
 *         description: Internal Server Error
 */
router.post('/auth/login', authValidator.login, async (req, res) => {
    try {
        await login(req, res);
    } catch (err) {
        logger.error('Login route error', { stack: err.stack });
        return res.status(500).json({ message: 'Internal Server Error' });
    }
});

/**
 * @openapi
 * /api/v1/auth/logout:
 *   post:
 *     tags:
 *       - Auth
 *     summary: Logout
 *     responses:
 *       204:
 *         description: Logout successful
 *       500:
 *         description: Internal Server Error
 */
router.post('/auth/logout', async (req, res) => {
    try {
        logger.info('Logout route called');
        await logout(req, res);
    } catch (err) {
        logger.error('Logout route error', { stack: err.stack });
        return res.status(500).json({ message: 'Internal Server Error' });
    }
});

/**
 * @openapi
 * /api/v1/auth/me:
 *   get:
 *     tags:
 *       - Auth
 *     summary: Profile of logged in user
 *     security:
 *       - cookieAuth: []
 *     responses:
 *       200:
 *         description: User profile retrieved successfully
 *       401:
 *         description: Unauthorized - Invalid or missing token
 *       500:
 *         description: Internal Server Error
 */
router.get('/auth/me', authMiddleware, async (req, res) => {
    try {
        await me(req, res);
    } catch (err) {
        logger.error('Me route error', { stack: err.stack });
        return res.status(500).json({ message: 'Internal Server Error' });
    }
});

/**
 * @openapi
 * /api/v1/auth/refresh-token:
 *   post:
 *     tags:
 *       - Auth
 *     summary: Refresh access token using refresh token
 *     responses:
 *       200:
 *         description: Access token refreshed successfully
 *       401:
 *         description: Unauthorized - Invalid or missing refresh token
 *       500:
 *         description: Internal Server Error
 */
router.post('/auth/refresh-token', authMiddleware, async (req, res) => {
    try {
        await refresh(req, res);
    } catch (err) {
        logger.error('Refresh token route error', { stack: err.stack });
        return res.status(500).json({ message: 'Internal Server Error' });
    }
});

module.exports = router;
