const { Model } = require('objection');
const db = require('../../config/db');
Model.knex(db);

class Category extends Model {
    static get tableName() {
        return 'categories';
    }

    static get idColumn() {
        return 'id';
    }

    static get jsonSchema() {
        return {
            type: 'object',
            required: ['name'],
            properties: {
                id: { type: 'string', format: 'uuid' },
                name: { type: 'string', maxLength: 100 },
                description: { type: ['string', 'null'] },
                created_at: { type: 'string', format: 'date-time' },
                updated_at: { type: ['string', 'null'], format: 'date-time' },
                deleted_at: { type: ['string', 'null'], format: 'date-time' },
            },
        };
    }

    static get relationMappings() {
        const Product = require('./product.model');

        return {
            products: {
                relation: Model.HasManyRelation,
                modelClass: Product,
                join: {
                    from: 'categories.id',
                    to: 'products.category_id',
                },
            },
        };
    }

    $beforeInsert() {
        const now = new Date().toISOString();
        this.created_at = now;
        this.updated_at = now;
    }

    $beforeUpdate() {
        this.updated_at = new Date().toISOString();
    }
}

module.exports = Category;
