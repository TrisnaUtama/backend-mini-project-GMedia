/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = async (knex) => {
    await knex.raw('CREATE EXTENSION IF NOT EXISTS "uuid-ossp"');
    await knex.schema.createTable('transaction_items', (table) => {
        table.uuid('id').primary().defaultTo(knex.raw('uuid_generate_v4()'))
        table.uuid('transaction_id')
            .references('id')
            .inTable('transactions')
            .onDelete('CASCADE')
            .onUpdate('CASCADE')
        table.uuid('product_id')
            .references('id')
            .inTable('products')
            .onDelete('CASCADE')
            .onUpdate('CASCADE')
        table.integer('quantity').notNullable().defaultTo(1)
        table.decimal('price', 10, 2).notNullable()
        table.timestamp('created_at').defaultTo(knex.fn.now());
    })
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = async (knex) => {
    return knex.schema.dropTable('transaction_items')
};
