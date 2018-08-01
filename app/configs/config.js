var smartcontract = require('./smartcontract.config');
var mysql = require('./database.config');
var common = require('./common.config');

var config = Object.assign(smartcontract, common, mysql);

module.exports = config;