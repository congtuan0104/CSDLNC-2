const { Router } = require('express');
const express = require('express');
const route = express.Router();

const managerController = require('../controllers/ManagerController');

route.get('/search', managerController.search);
route.get('/orders',managerController.allOrders);
route.get('/turnover', managerController.showTurnover);
route.get('/orders/:orderID',managerController.orderDetail);
route.post('/updateQuantity',managerController.updateQuantity);
route.get('/products/:productID',managerController.productDetail);
route.get('/warehouse',managerController.warehouseEntryHistory);
route.get('/statistic', managerController.statistic);
route.get('/products',managerController.allProducts);
route.get('/sendOrder',managerController.sendOrder);
route.get('/staff/:staffID',managerController.staffDetail);
route.get('/staff',managerController.staff);
route.get('/',managerController.showDashboard);

module.exports = route;