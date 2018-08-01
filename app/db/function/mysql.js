var Admin = require('../models/Admin');
var Token = require('../models/Token');
var TradeHistory = require('../models/TradeHistory');

var DB = function () {}

/**
 * Constants
 */
var INSERTION_ERROR = new Error('Insertion error.');
var CREATION_ERROR = new Error('Table creation error.');
var NO_RECORD_ERROR = new Error('Has no record.');

/**
 * =======================================
 * Initial function
 * =======================================
 */
DB.init = async () => {
    try {
        await Admin.sync({ force: false });
    } catch (err) {
        logger.error('mysql::Admin::sync::error: ' + err);
    }

    try {
        await Token.sync({ force: false });
    } catch (err) {
        logger.error('mysql::Token::sync::error: ' + err);
    }

    try {
        await TradeHistory.sync({ force: false });
    } catch (err) {
        logger.error('mysql::TradeHistory::sync::error: ' + err);
    }
}

/**
 * =======================================
 * Group functions of Token table
 * =======================================
 */
DB.insertToken = async (data) => {
    try {
        await Token.create(data);
    } catch (err) {
        logger.error('mysql::Token::insertToken::error: ' + err);
    }  
}

DB.getTokens = async (data) => {
    try {
        let result = await Token.findAll({
            limit: data.limit, 
            offset: data.offset
        })
        return result;
    } catch(err) {
        logger.error('mysql::Token::getTokens::error: ' + err);
    }
}

DB.count = async () => {
    try {
        let result = await Token.count();
        return result;
    } catch (err) {
        logger.error('mysql::Token::count::error: ' + err);
    }
}

DB.countTokenByUser = async (data) => {
    try {
        let result = await Token.count({
            where: {
                address: data.address
            }
        })
        return result;
    } catch (err) {
        logger.error('mysql::Token::getTokenByUser::error ' + err);
    }
}

DB.getTokensByUser = async (data) => {
    try {
        let result = await Token.findAll({
            limit: data.limit,
            offset: data.offset,
            where: {
                address: data.address
            }
        })
        return result;
    } catch (err) {
        logger.error('mysql::Token::getTokensByUser::error: ' + err);
    }
}

DB.updateSellingStatusToTrue = async (data) => {
    try {
        await Token.update({
            isSelling: true,
            price: data.price,
            blockNumber: data.blockNumber
        }, {
            where: {
                tokenId: data.tokenId
            }
        });
    } catch (err) {
        logger.error('mysql::Token::updateSellingStatus::error: ' + err);
    }
}

DB.updateSellingStatusToFalse = async (data) => {
    try {
        await Token.update({
            isSelling: false,
            blockNumber: data.blockNumber
        }, {
            where: {
                tokenId: data.tokenId
            }
        });
    } catch (err) {
        logger.error('mysql::Token::updateSellingStatus::error: ' + err);
    }
}

DB.getAllSellingPets = async (data) => {
    try {   
        let result = await Token.findAll({
            limit: data.limit,
            offset: data.offset,
            where: {
                isSelling: true,
                address: { $ne: [data.address] }
            }
        })
        return result;
    } catch (err) {
        logger.error('mysql::Token::getAllSellingPets::error: ' + err);
    }
}

DB.countSellingPets = async () => {
    try {
        let result = await Token.count({
            where: {
                isSelling: true
            }
        })
        return result;
    } catch (err) {
        logger.error('mysql::Token::countSellingPets::error: ' + err);
    }
}

DB.updateTokenAfterBuying = async (data) => {
    try {
        await Token.update({
            isSelling: false,
            address: data.buyer
        }, {
            where: {
                tokenId: data.tokenId
            }
        });
    } catch (err) {
        logger.error('mysql::Token::updateTokenAfterBuying::error: ' + err);
    }
}

DB.getBlockNumberAtSell = async (data) => {
    try {
        let result = await Token.findAll({
            where: {
                tokenId: data.tokenId,
            },
            attributes: ['blockNumber']
        });
        return result;
    } catch (err) {
        logger.error('mysql::Token::getBlockNumberAtSell::error: ' + err);
    }
}

DB.changePetName = async (data) => {
    try {
        await Token.update({
            name: data.newName
        }, {
            where: {
                tokenId: data.tokenId
            }
        })
    } catch (err) {
        logger.error('mysql::Token::changePetName::error: ' + err);
    }
}

/**
 * =======================================
 * Group functions of Trade table
 * =======================================
 */
DB.insertIntoTrade = async (data) => {
    try {
        await TradeHistory.create(data);
    } catch (err) {
        logger.error('mysql::Token::insertIntoTrade::error: ' + err);
    }
}

module.exports = DB;