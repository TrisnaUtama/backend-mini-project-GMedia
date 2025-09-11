const AuthRouter = require('./auth.route');
const CategoryRouter = require('./categories.route');
const ProductRouter = require('./product.route');

const routes = (app, prefix) => {
    app.use(prefix, AuthRouter);
    app.use(prefix, CategoryRouter);
    app.use(prefix, ProductRouter);
};

module.exports = routes;
