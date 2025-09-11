require("dotenv").config();
const knexLib = require("knex");
const { attachPaginate } = require("knex-paginate");

const knexConfigOptions = require("../knexfile"); 

const environment = process.env.NODE_ENV || "development";
const knexConfig = knexConfigOptions[environment];

const knex = knexLib(knexConfig);

attachPaginate();

module.exports = knex;
