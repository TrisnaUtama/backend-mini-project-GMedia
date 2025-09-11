const { check, param, validationResult } = require('express-validator');
const logger = require('../../library/logger');
const { validationError } = require('../../library/response');

const store = [
    check('name').notEmpty().withMessage('Name is required').isLength({ min: 3, max: 100 }).withMessage('Name must be between 3 and 100 characters').trim(),
    (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            logger.warn('Validation failed for category store', { errors: errors.array(), body: req.body });
            return validationError(res, errors.array());
        }
        next();
    }
];

const findById = [
    param('id').isUUID().withMessage('Valid category ID is required'),
    (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            logger.warn('Validation failed for category delete', { errors: errors.array(), body: req.body });
            return validationError(res, errors.array());
        }
        next();
    }
];


module.exports = {
    store,
    findById
};

