const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const ms = require('ms');
const logger = require("../../library/logger");
const clearAuthCookies = require("../../library/clearAuthCookie");
const { success, badRequest, internalServerError, unauthorized } = require("../../library/response");
const User = require("../model/user.model");
const { LoginResponseDTO, RegisterResponseDTO, UserResponseDTO } = require("../dtos/auth.dto");

const register = async (req, res) => {
    try {
        const { name, email, password } = req.body;

        const existingUser = await User.query().findOne({ name });
        if (existingUser) {
            logger.warn(`Attempt to register with existing username: ${name}`);
            return badRequest(res, "Username already exists");
        }

        // const hashedPassword = await bcrypt.hash(password, 10);

        const newUser = await User.query().insert({
            name,
            email,
            password,
        });

        logger.info(`New user registered: ${email}`);
        return success(res, new RegisterResponseDTO(newUser), "User registered successfully", 201);

    } catch (err) {
        logger.error(`Register error: ${err.message}`, err);
        return internalServerError(res, "Internal server error");
    }
};

const login = async (req, res) => {
    try {
        const { name, password } = req.body;

        const user = await User.query().findOne({ name });
        if (!user) {
            logger.warn(`Login failed - username not found: ${name}`);
            return unauthorized(res, "Invalid credentials");
        }

        const validPassword = await bcrypt.compare(password, user.password);
        if (!validPassword) {
            logger.warn(`Login failed - wrong password for username: ${name}`);
            return unauthorized(res, "Invalid credentials");
        }

        const access_token = jwt.sign(
            { id: user.id, email: user.email },
            process.env.ACCESS_TOKEN_SECRET,
            { expiresIn: process.env.ACCESS_TOKEN_LIFE }
        );
        const refresh_token = jwt.sign(
            { id: user.id, email: user.email },
            process.env.REFRESH_TOKEN_SECRET,
            { expiresIn: process.env.REFRESH_TOKEN_LIFE }
        );

        await User.query().findById(user.id).patch({ refresh_token });
        const refreshExpiry = new Date(Date.now() + ms(process.env.REFRESH_TOKEN_LIFE));
        const accessExpiry = new Date(Date.now() + ms(process.env.ACCESS_TOKEN_LIFE));

        res.cookie('refresh_token', refresh_token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict',
            path: '/',
            expires: refreshExpiry
        });

        res.cookie('access_token', access_token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict',
            path: '/',
            expires: accessExpiry
        });

        logger.info(`User logged in: ${name}`);
        logger.info(`Access token expires at (Jakarta): ${accessExpiry.toLocaleString("id-ID", { timeZone: "Asia/Jakarta" })}`);
        logger.info(`Refresh token expires at (Jakarta): ${refreshExpiry.toLocaleString("id-ID", { timeZone: "Asia/Jakarta" })}`);

        logger.info(`User logged in: ${name}`);
        return success(res, new LoginResponseDTO(user), "Login successful");

    } catch (err) {
        logger.error(`Login error: ${err.message}`, err);
        return internalServerError(res, "Internal server error");
    }
};

const refresh = async (req, res) => {
    try {
        const token = req.cookies.refresh_token;
        if (!token) {
            logger.warn('Refresh token not found in cookies');
            throw new Error('No refresh token');
        }
        const user = await User.query().findOne({ refresh_token: token });
        if (!user) {
            logger.warn('Invalid refresh token');
            throw new Error('Invalid token');
        }
        jwt.verify(token, process.env.REFRESH_TOKEN_SECRET);

        const newAccessToken = jwt.sign(
            { id: user.id, email: user.email },
            process.env.ACCESS_TOKEN_SECRET,
            { expiresIn: process.env.ACCESS_TOKEN_LIFE }
        );

        const accessExpiry = new Date(Date.now() + ms(process.env.ACCESS_TOKEN_LIFE));
        res.cookie('access_token', newAccessToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict',
            path: '/',
            expires: accessExpiry
        });

        logger.info(`Access token expires at (Jakarta): ${accessExpiry.toLocaleString("id-ID", { timeZone: "Asia/Jakarta" })}`);

        logger.info(`Access token refreshed for user: ${user.name}`);
        return success(res, {}, "Access token refreshed");
    } catch (err) {
        logger.warn(`Refresh token failed: ${err.message}`);
        return unauthorized(res, "Unauthorized");
    }
};

const logout = async (req, res) => {
    try {
        const refresh_token = req.cookies.refresh_token;
        if (!refresh_token) {
            return res.sendStatus(204);
        }

        const user = await User.query().findOne({ refresh_token });
        if (!user) {
            clearAuthCookies(res);
            return res.sendStatus(204)
        }
        await User.query().findById(user.id).patch({ refresh_token: null });
        clearAuthCookies(res);
        return success(res, {}, "No content", 204);
    } catch (err) {
        logger.error(`Logout error: ${err.message}`, err);
        return internalServerError(res, "Internal server error");
    }
}

const me = async (req, res) => {
    try {
        const userId = req.user.id;
        const user = await User.query().findById(userId);
        if (!user) {
            return unauthorized(res, "User not found");
        }
        logger.info(`User profile fetched: ${user.name}`);
        return success(res, new UserResponseDTO(user), "User profile fetched successfully");
    } catch (err) {
        logger.error(`Fetch profile error: ${err.message}`, err);
        return internalServerError(res, "Internal server error");
    }
}

module.exports = { register, login, logout, refresh, me };
