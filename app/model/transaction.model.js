const { Model } = require('objection');
const db = require('../../config/db');
Model.knex(db);

class Transaction extends Model {
    static get tableName() {
        return 'transactions';
    }

    static get idColumn() {
        return 'id';
    }

    static get jsonSchema() {
        return {
            type: 'object',
            required: ['user_id', 'total'],
            properties: {
                id: { type: 'string', format: 'uuid' },
                user_id: { type: 'string', format: 'uuid' },
                total: { type: 'number' },
                created_at: { type: 'string', format: 'date-time' },
                updated_at: { type: ['string', 'null'], format: 'date-time' }
            }
        };
    }

    static get relationMappings() {
        const User = require('./user.model');
        const TransactionItem = require('./transaction_item.model');

        return {
            user: {
                relation: Model.BelongsToOneRelation,
                modelClass: User,
                join: {
                    from: 'transactions.user_id',
                    to: 'users.id',
                },
            },
            items: {
                relation: Model.HasManyRelation,
                modelClass: TransactionItem,
                join: {
                    from: 'transactions.id',
                    to: 'transaction_items.transaction_id',
                },
            },
        };
    }

    $beforeInsert() {
        const now = new Date().toISOString();
        this.created_at = now;
    }
}

module.exports = Transaction;
