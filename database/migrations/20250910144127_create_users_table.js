/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = async (knex) => {
    await knex.raw('CREATE EXTENSION IF NOT EXISTS "uuid-ossp"');
    await knex.schema.createTable("users", (table) => {
        table
            .uuid("id")
            .primary()
            .defaultTo(knex.raw("uuid_generate_v4()"));
        table.string("name", 100).notNullable();
        table.string("email", 100).unique().notNullable();
        table.string("password", 255).notNullable();
        table.text('refresh_token').nullable();
        table.timestamp("created_at").defaultTo(knex.fn.now());
        table.timestamp("updated_at").nullable();
        table.timestamp("deleted_at").nullable();
    });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = (knex) => knex.schema.dropTable('users');
