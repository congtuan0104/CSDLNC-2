const { Router } = require('express');
const express = require('express');
const route = express.Router();

const managerController = require('../controllers/ManagerController');

route.get('/search', managerController.search);
route.get('/orders',managerController.allOrders);
route.get('/turnover', managerController.showTurnover);
route.post('/updateQuantity',managerController.updateQuantity);
route.get('/products/:productID',managerController.productDetail);
route.get('/warehouse',managerController.warehouseEntryHistory);
route.get('/statistic', managerController.statistic);
route.get('/products',managerController.allProducts);
route.get('/',managerController.showDashboard);

module.exports = route;