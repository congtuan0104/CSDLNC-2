const { Router } = require('express');
const express = require('express');
const route = express.Router();

const adminController = require('../controllers/AdminController');

route.get('/orders',adminController.allOrders);
route.get('/search', adminController.search);
route.get('/turnover', adminController.showTurnover);
route.get('/warehouse',adminController.warehouseEntryHistory);
route.post('/addDiscount', adminController.addDiscount);
route.post('/updateDiscount', adminController.updateDiscount);
route.post('/removeDiscount', adminController.removeDiscount);
route.get('/products/:productID',adminController.productDetail);
route.post('/updateProduct',adminController.updateProduct);
route.get('/removeProduct',adminController.removeProduct);
route.post('/addProduct',adminController.addProduct);
route.get('/statistic', adminController.statistic);
route.get('/products',adminController.allProducts);
route.get('/',adminController.showDashboard);

module.exports = route;