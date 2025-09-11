const { Model } = require('objection');
const db = require('../../config/db');
Model.knex(db);

class Product extends Model {
    static get tableName() {
        return 'products';
    }

    static get idColumn() {
        return 'id';
    }

    static get jsonSchema() {
        return {
            type: 'object',
            required: ['category_id', 'name', 'image', 'price', 'stock'],
            properties: {
                id: { type: 'string', format: 'uuid' },
                category_id: { type: 'string', format: 'uuid' },
                name: { type: 'string', maxLength: 100 },
                image: { type: 'string' },
                description: { type: ['string', 'null'] },
                price: { type: 'number' },
                stock: { type: 'integer' },
                created_at: { type: 'string', format: 'date-time' },
                updated_at: { type: ['string', 'null'], format: 'date-time' },
                deleted_at: { type: ['string', 'null'], format: 'date-time' },
            },
        };
    }

    static get relationMappings() {
        const Category = require('./category.model');

        return {
            category: {
                relation: Model.BelongsToOneRelation,
                modelClass: Category,
                join: {
                    from: 'products.category_id',
                    to: 'categories.id',
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

module.exports = Product;
