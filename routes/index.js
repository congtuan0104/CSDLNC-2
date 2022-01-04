
const siteRoute = require('./site');
const productsRouter = require('./products');
const ordersRoute = require('./orders');
const adminRoute = require('./admin');
const managerRoute = require('./manager');

function route(app) {
    app.use('/manager', managerRoute);
    app.use('/admin', adminRoute);
    app.use('/my-orders', ordersRoute);
    app.use('/products', productsRouter);
    app.use('/', siteRoute);
}
module.exports = route;
