const jwt = require('jsonwebtoken');
const User = require('../app/model/user.model');
const logger = require('../library/logger');
const { unauthorized } = require('../library/response');

const authMiddleware = async (req, res, next) => {
    try {
        const token = req.cookies.access_token;
        if (!token) {
            logger.warn('Access token not found in cookies');
            return unauthorized(res, "Unauthorized");
        }

        const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);

        const user = await User.query().findById(decoded.id);
        if (!user) {
            logger.warn(`User not found for ID: ${decoded.id}`);
            return unauthorized(res, "Unauthorized");
        }

        logger.info(`Authenticated user: ${user.name}`);
        req.user = user;
        next();

    } catch (err) {
        if (err.name === "TokenExpiredError") {
            logger.warn("Access token expired");
            return unauthorized(res, "Token expired");
        }
        if (err.name === "JsonWebTokenError") {
            logger.warn("Invalid access token");
            return unauthorized(res, "Invalid token");
        }

        logger.error(`Auth middleware error: ${err.message}`, err);
        return unauthorized(res, "Unauthorized");
    }
};

module.exports = authMiddleware;
