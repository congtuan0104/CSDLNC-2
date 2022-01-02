const { Router } = require('express');
const express = require('express');
const route = express.Router();

const ordersController = require('../controllers/OrdersController');

route.get('/confirmOrder',ordersController.confirmOrder);
route.get('/cancelOrder',ordersController.cancelOrder);
route.get('/:orderID',ordersController.detail);
route.get('/',ordersController.showAllOrder);

module.exports = route;