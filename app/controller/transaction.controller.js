const Transaction = require('../model/transaction.model');
const Product = require('../model/product.model');
const logger = require('../../library/logger');
const { success, badRequest, internalServerError } = require('../../library/response');
const db = require('../../config/db');
const TransactionDTO = require('../dtos/transaction.dto');

const createTransaction = async (req, res) => {
    const knexTrx = await db.transaction();

    try {
        const { items } = req.body;
        const userId = req.user.id;

        let totalAmount = 0;
        const trxItems = [];

        for (const item of items) {
            const product = await Product.query(knexTrx).findById(item.product_id);

            if (!product) {
                await knexTrx.rollback();
                logger.warn(`Product not found for ID: ${item.product_id}`);
                return badRequest(res, `Product not found for ID: ${item.product_id}`);
            }

            if (product.stock < item.quantity) {
                await knexTrx.rollback();
                logger.warn(`Insufficient stock for Product ID: ${item.product_id}`);
                return badRequest(res, `Insufficient stock for Product ID: ${item.product_id}`);
            }

            await Product.query(knexTrx).findById(item.product_id).patch({
                stock: product.stock - item.quantity
            });

            const subtotal = product.price * item.quantity;
            totalAmount += subtotal;

            trxItems.push({
                product_id: item.product_id,
                quantity: item.quantity,
                price: Number(product.price),  
                subtotal: Number(subtotal)
            });
        }

        const trx = await Transaction.query(knexTrx).insertGraphAndFetch({
            user_id: userId,
            total: totalAmount,
            items: trxItems
        });

        await knexTrx.commit();

        logger.info(`Transaction created: ID ${trx.id} by User ${req.user.name}`);
        return success(res, new TransactionDTO(trx), "Transaction created successfully", 201);
    } catch (err) {
        await knexTrx.rollback();
        logger.error(`Create transaction error: ${err.message}`, err);
        return internalServerError(res, "Internal server error");
    }
};

const getTransactionById = async (req, res) => {
    try {
        const { id } = req.params;
        const trx = await Transaction.query()
            .findById(id)
            .withGraphFetched('items.product');

        if (!trx) {
            logger.warn(`Transaction not found: ID ${id}`);
            return badRequest(res, "Transaction not found");
        }

        return success(res, new TransactionDTO(trx), "Transaction fetched successfully");
    } catch (err) {
        logger.error(`Get transaction error: ${err.message}`, err);
        return internalServerError(res, "Internal server error");
    }
};

module.exports = { createTransaction, getTransactionById };
