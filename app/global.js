var config = require('./configs/config');

/**
 * Smart contract
 */

var Main = artifacts.require('./Main.sol');
var MainABI = require('../build/contracts/Main.json').abi;
var MainContract = web3.eth.contract(MainABI);
var MainAddress = config.smartcontract.MainContractAddress;

/**
 * Accounts
 */
var accounts = web3.eth.accounts;
var AdminAddress = accounts[config.smartcontract.AdminIndex];
var OperatorAddress = accounts[config.smartcontract.OperatorIndex];

/**
 * Declare class
 * @class Global
 */
var Global = function () {}

/**
 * Globalize vars
 * @function globalize
 * @param {string} name - (Optional) Name of variable
 * @param {any} data - (Optional) Value of variable
 */
Global.globalize = (name, data) => {

    /**
     * Globalize optional vars manually
     */
    if (name && data) {
        global[name] = data;
        return;
    }

    /**
     * globalize smart contract
     */
    global.Main = Main;
    global.MainABI = MainABI;
    global.MainContract = MainContract;
    global.MainAddress = MainAddress;

    /**
     * globalize accounts
     */
    global.AdminAddress = AdminAddress;
    global.OperatorAddress = OperatorAddress;
}

module.exports = Global;