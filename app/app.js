var express = require('express');
var cors = require('cors');
var sequelize = require('sequelize');
var bodyParser = require('body-parser');
var path = require('path');

/**
 * Constructors
 */
var app = express();
var env = app.get('env') || 'development';
app.use(express.static('public'))

var config = require('./configs/config');
var logger = require('./libs/helpers/logger');

app.use(express.static(path.join(__dirname, 'build')));

app.get('/', function (req, res) {
  res.sendFile(path.join(__dirname, 'build', 'index.html'));
});

/**
 * Database connection
 */
var _ = config.mysql;
var db_connection = new sequelize(`mysql://${_.username}:${_.password}@${_.host}/${_.dbName}`, {
    logging: false,
    define: {
        charset: 'utf8',
        collate: 'utf8_general_ci'
    }
});

/**
 * Global variables
 */
global.artifacts = artifacts;
global.web3 = web3;
global.env = env;
global.logger = logger;
global.db_connection = db_connection;
require('./global').globalize();

/**
 * Initialize database
 */
require('./initial').initialize();

/**
 * Middlewares
 */
app.use(cors());
app.use('/', express.static('public'))
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: true
}));

/**
 * Routers
 */
var router = require('./routers/router');
app.use('/', router);

app.listen(config.server.port, function() {
    logger.info('Mode: ' + env);
    logger.info('Server is listening on port: ' + config.server.port);
});

module.exports = function (deployer) {}