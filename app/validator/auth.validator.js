const { check, validationResult } = require('express-validator');
const logger = require('../../library/logger');
const { validationError } = require('../../library/response');

const register = [
    check('name').notEmpty().withMessage('Name is required'),
    check('email').isEmail().withMessage('Valid email is required'),
    check('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters long'),
    (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            logger.warn('Validation failed for register', { errors: errors.array(), body: req.body });
            return validationError(res, errors.array());
        }
        next();
    }
];

const login = [
    check('name').notEmpty().withMessage('Valid name is required'),
    check('password').notEmpty().withMessage('Password is required'),
    (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            logger.warn('Validation failed for login', { errors: errors.array(), body: req.body });
            return validationError(res, errors.array());
        }
        next();
    }
];

module.exports = {
    register,
    login
};
