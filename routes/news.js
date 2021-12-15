const { Router } = require('express');
const express = require('express');
const route = express.Router();

const newsController = require('../controllers/NewsController');

route.get('/:slug',newsController.show);
route.get('/',newsController.index);

module.exports = route;
