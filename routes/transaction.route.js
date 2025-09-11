const express = require('express');
const router = express.Router();

const { createTransaction, getTransactionById } = require('../app/controller/transaction.controller');
const transactionValidator = require('../app/validator/transaction.validator');
const logger = require('../library/logger');
const authMiddleware = require('../middleware/auth.middleware');

/**
 * @openapi
 * /api/v1/transactions:
 *   post:
 *     tags:
 *       - Transactions
 *     summary: Create a new transaction
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - items
 *             properties:
 *               items:
 *                 type: array
 *                 example:
 *                   - product_id: "8f57f0c2-7c21-4db0-a8b9-13f7e5a9ab00"
 *                     quantity: 2
 *                   - product_id: "b4a1bb23-2345-41f3-932a-117bcae8ee91"
 *                     quantity: 1
 *     responses:
 *       201:
 *         description: Transaction created successfully
 *       400:
 *         description: Invalid input (e.g., product not found, insufficient stock)
 *       422:
 *         description: Validation Error
 *       500:
 *         description: Internal Server Error
 */
router.post('/transactions', authMiddleware, transactionValidator.store, async (req, res) => {
    try {
        await createTransaction(req, res);
    } catch (err) {
        logger.error('Create transaction route error', { stack: err.stack });
        return res.status(500).json({ message: 'Internal Server Error' });
    }
});

/**
 * @openapi
 * /api/v1/transactions/{id}:
 *   get:
 *     tags:
 *       - Transactions
 *     summary: Get a transaction by ID
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: UUID of the transaction
 *     responses:
 *       200:
 *         description: Transaction fetched successfully
 *       400:
 *         description: Transaction not found
 *       500:
 *         description: Internal Server Error
 */
router.get('/transactions/:id', authMiddleware, transactionValidator.findById, async (req, res) => {
    try {
        await getTransactionById(req, res);
    } catch (err) {
        logger.error('Get transaction route error', { stack: err.stack });
        return res.status(500).json({ message: 'Internal Server Error' });
    }
});

module.exports = router;
