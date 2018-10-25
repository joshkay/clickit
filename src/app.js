const express = require('express');

const routeConfig = require('./config/route-config');

const app = express();

routeConfig.init(app);

module.exports = app;