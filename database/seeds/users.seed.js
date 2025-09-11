const bcrypt = require("bcrypt");

exports.seed = async (knex) => {
    await knex("users").del();

    await knex("users").insert([
        {
            id: knex.raw("uuid_generate_v4()"),
            name: "Admin",
            email: "admin@example.com",
            password: await bcrypt.hash("password", 10),
        },
    ]);
}
