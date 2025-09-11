const AuthRouter = require('./auth.route');
const CategoryRouter = require('./categories.route');
const ProductRouter = require('./product.route');
const TransactionRouter = require('./transaction.route');

const routes = (app, prefix) => {
    app.use(prefix, AuthRouter);
    app.use(prefix, CategoryRouter);
    app.use(prefix, ProductRouter);
    app.use(prefix, TransactionRouter);
};

module.exports = routes;
