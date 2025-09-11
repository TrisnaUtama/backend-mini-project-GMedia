const { Model } = require('objection');
const db = require('../../config/db');
Model.knex(db);

class TransactionItem extends Model {
    static get tableName() {
        return 'transaction_items';
    }

    static get idColumn() {
        return 'id';
    }

    static get jsonSchema() {
        return {
            type: 'object',
            required: ['transaction_id', 'product_id', 'quantity', 'price'],
            properties: {
                id: { type: 'string', format: 'uuid' },
                transaction_id: { type: 'string', format: 'uuid' },
                product_id: { type: 'string', format: 'uuid' },
                quantity: { type: 'integer', minimum: 1 },
                price: { type: 'number' },
                subtotal: { type: 'number' },
                created_at: { type: 'string', format: 'date-time' },
                updated_at: { type: ['string', 'null'], format: 'date-time' }
            }
        };
    }

    static get relationMappings() {
        const Transaction = require('./transaction.model');
        const Product = require('./product.model');

        return {
            transaction: {
                relation: Model.BelongsToOneRelation,
                modelClass: Transaction,
                join: {
                    from: 'transaction_items.transaction_id',
                    to: 'transactions.id',
                },
            },
            product: {
                relation: Model.BelongsToOneRelation,
                modelClass: Product,
                join: {
                    from: 'transaction_items.product_id',
                    to: 'products.id',
                },
            },
        };
    }

    $beforeInsert() {
        const now = new Date().toISOString();
        this.created_at = now;
        this.subtotal = this.price * this.quantity;
    }

    $beforeUpdate() {
        this.subtotal = this.price * this.quantity;
    }
}

module.exports = TransactionItem;
