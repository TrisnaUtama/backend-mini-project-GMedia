const { check, param, validationResult } = require('express-validator');
const logger = require('../../library/logger');
const { validationError } = require('../../library/response');

const store = [
    check('category_id').isUUID().withMessage('Category is required'),
    check('name')
        .notEmpty().withMessage('Name is required')
        .isLength({ min: 3, max: 100 }).withMessage('Name must be between 3 and 100 characters')
        .trim(),
    check('price')
        .notEmpty().withMessage('Price is required')
        .isFloat({ gt: 0 }).withMessage('Price must be a number greater than 0'),
    check('stock')
        .notEmpty().withMessage('Stock is required')
        .isInt({ gt: -1 }).withMessage('Stock must be an integer 0 or greater'),
    (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            logger.warn('Validation failed for product store', { errors: errors.array(), body: req.body });
            return validationError(res, errors.array());
        }
        next();
    }
];

const findById = [
    param('id').isUUID().withMessage('Valid product ID is required'),
    (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            logger.warn('Validation failed for product findById', { errors: errors.array(), body: req.body });
            return validationError(res, errors.array());
        }
        next();
    }
];

module.exports = {
    store,
    findById
};
