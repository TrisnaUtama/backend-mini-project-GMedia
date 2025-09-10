require("dotenv").config();

module.exports = {
    development: {
        client: process.env.DB_CONNECTION || "pg",
        connection: {
            host: process.env.DB_HOST || "localhost",
            user: process.env.DB_USER || "postgres",
            password: process.env.DB_PASS || "postgres",
            database: process.env.DB_NAME || "postgres",
            port: process.env.DB_PORT || 5432,
        },
        pool: { min: 2, max: 10 },
        migrations: {
            directory: "./database/migrations",
            tableName: "knex_migrations",
        },
        seeds: {
            directory: "./database/seeds",
        },
    },
};
