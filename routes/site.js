const { Router } = require('express');
const express = require('express');
const route = express.Router();

const siteController = require('../controllers/SiteController');


route.use('/',siteController.home);

module.exports = route;
