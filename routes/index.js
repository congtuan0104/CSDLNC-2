
const siteRoute = require('./site');
const productsRouter = require('./products');

function route(app) {

    app.use('/products', productsRouter);
    app.use('/', siteRoute);
}
module.exports = route;
