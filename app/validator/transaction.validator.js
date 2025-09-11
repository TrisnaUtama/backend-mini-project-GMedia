const { check, param, validationResult } = require('express-validator');
const logger = require('../../library/logger');
const { validationError } = require('../../library/response');

const store = [
    check('items').isArray({ min: 1 }).withMessage('Items are required'),
    check('items.*.product_id').isUUID().withMessage('Valid product ID is required'),
    check('items.*.quantity').isInt({ gt: 0 }).withMessage('Quantity must be greater than 0'),

    (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            logger.warn('Validation failed for transaction store', { errors: errors.array(), body: req.body });
            return validationError(res, errors.array());
        }
        next();
    }
];

const findById = [
    param('id').isUUID().withMessage('Valid transaction ID is required'),
    (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            logger.warn('Validation failed for transaction findById', { errors: errors.array(), body: req.body });
            return validationError(res, errors.array());
        }
        next();
    }
];

module.exports = { store, findById };
