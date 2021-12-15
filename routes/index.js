const newsRouter = require('./news');
const siteRoute = require('./site');

function route(app) {
    app.use('/news', newsRouter);
    app.use('/', siteRoute);
}
module.exports = route;
