const { Router } = require('express');
const express = require('express');
const route = express.Router();

const siteController = require('../controllers/SiteController');

route.get('/log-out',siteController.logout);
route.get('/cart',siteController.cart);
route.get('/sign-up',siteController.signup);
route.get('/sign-in',siteController.singin);
route.post('/addCustomer',siteController.addCustomer);
route.post('/verifyCustomer',siteController.verifyCustomer);
route.post('/verifyStaff',siteController.verifyStaff);
route.get('/',siteController.home);

module.exports = route;
