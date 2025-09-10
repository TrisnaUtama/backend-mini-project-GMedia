require("dotenv").config();
const knexLib = require("knex");
const { attachPaginate } = require("knex-paginate");

const knex = knexLib({
    client: process.env.DB_CONNECTION,
    connection: {
        host: process.env.DB_HOST || "localhost",
        user: process.env.DB_USER || "postgres",
        password: process.env.DB_PASS || "postgres",
        database: process.env.DB_NAME || "postgres",
        port: process.env.DB_PORT || 5432,
    },
    pool: { min: 2, max: 10 },
});

attachPaginate();

module.exports = knex;
