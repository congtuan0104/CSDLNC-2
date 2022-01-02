
const siteRoute = require('./site');
const productsRouter = require('./products');
const ordersRoute = require('./orders');
const adminRoute = require('./admin');

function route(app) {
    app.use('/admin', adminRoute);
    app.use('/my-orders', ordersRoute);
    app.use('/products', productsRouter);
    app.use('/', siteRoute);
}
module.exports = route;
