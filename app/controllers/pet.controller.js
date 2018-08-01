var config = require('../configs/config');
var utils = require('../libs/helpers/utils');
var mysql = require('../db/function/mysql');
var crypto = require("crypto");

var Pet = {

    /**
     * @dev create new token by admin
     */
    createToken: async (req, res) => {
        logger.trace('pet.controller::createToken');
        
        var owner = req.body.owner;
        var name = req.body.name;

        if (!owner) {
            logger.error('pet.controller::createToken::error: `owner` is null');

            return res.send({
                status: 'failed',
                data: 'owner field is not null'
            })
        }

        if (!name) {
            logger.error('pet.controller::createToken::error: `name` is null');

            return res.send({
                status: 'failed',
                data: 'name field is not null'
            })
        }

        if (!utils.isAddress(owner)) {
            logger.error('pet.controller::createToken::error: `owner` is not Ethereum address');

            return res.send({
                status: 'failed',
                data: 'owner field is not ethereum address'
            })
        }

        var instance = await global.MainContract.at(global.MainAddress);

        try {
            global.web3.personal.unlockAccount(global.AdminAddress, config.smartcontract.passpharse, 1000);
            try {
                var dna = crypto.randomBytes(5).toString('hex');
                var txId = await instance.createToken(owner, name, dna, { 
                    from: global.AdminAddress, 
                    gas: 300000 
                });
                logger.trace('pet.controller::createToken::tx:' + txId);
                return res.send({
                    status: 'success',
                    data: txId
                })
            } catch (err) {
                logger.trace('pet.controller::createToken::error:' + err);
                return res.send({
                    status: 'failed',
                    data: err
                });
            }
        } catch (err) {
            logger.error("pet.controller::createToken::unlockAccount::error: " + err);
        }
           
    },

    /**
     * @dev get all pet tokens
     */
    getPetToken: async (req, res) => {
        logger.trace('pet.controller::getPetToken');

        var limit = req.body.limit;
        var offset = req.body.offset;

        if (!limit) {
            logger.error('pet.controller::getPetToken::error: `limit` is null');

            return res.send({
                status: 'failed',
                data: 'limit field is not null'
            })
        }

        if (!offset) {
            logger.error('pet.controller::getPetToken::error: `offset` is null');

            return res.send({
                status: 'failed',
                data: 'offset field is not null'
            })
        }

        let result = await mysql.getTokens({ offset: parseInt(offset), limit: parseInt(limit) });
        let count = await mysql.count();

        var data = [];
        for (var i = 0; i < result.length; i++) {
            data.push(result[i].dataValues);
        }

        return res.send({
            status: 'success',
            count: count,
            data: data
        })
    },

    /**
     * @dev get pet tokens by user
     */
    getPetByUser: async (req, res) => {
        logger.trace('pet.controller::getPetByUser');
        
        var owner = req.body.address;
        var limit = req.body.limit;
        var offset = req.body.offset;

        if (!owner) {
            logger.error('pet.controller::getPetByUser::error: `owner` is null');

            return res.send({
                status: 'failed',
                data: 'owner field is not null'
            })
        }

        if (!utils.isAddress(owner)) {
            logger.error('pet.controller::getPetByUser::error: `owner` is not Ethereum address');

            return res.send({
                status: 'failed',
                data: 'owner field is not ethereum address'
            })
        }

        if (!limit) {
            logger.error('pet.controller::getPetByUser::error: `limit` is null');

            return res.send({
                status: 'failed',
                data: 'limit field is not null'
            })
        }

        if (!offset) {
            logger.error('pet.controller::getPetByUser::error: `offset` is null');

            return res.send({
                status: 'failed',
                data: 'offset field is not null'
            })
        }

        let result = await mysql.getTokensByUser({ address: owner, limit: parseInt(limit), offset: parseInt(offset) });
        let count = await mysql.countTokenByUser({ address: owner });
    
        return res.send({
            status: 'success',
            count: count,
            data: result
        })
    },

    /**
     * @dev get all selling pets
     */
    getAllSellingPets: async (req, res) => {
        logger.trace('pet.controller::getAllSellingPets');

        var limit = req.body.limit;
        var offset = req.body.offset;
        var address = req.body.address;

        if (!limit) {
            logger.error('pet.controller::getPetToken::error: `limit` is null');

            return res.send({
                status: 'failed',
                data: 'limit field is not null'
            })
        }

        if (!offset) {
            logger.error('pet.controller::getPetToken::error: `offset` is null');

            return res.send({
                status: 'failed',
                data: 'offset field is not null'
            })
        }

        let result = await mysql.getAllSellingPets({ offset: parseInt(offset), limit: parseInt(limit), address: address });
        let count = await mysql.countSellingPets();

        var data = [];
        for (let i = 0; i < result.length; i++) {
            let sellingAt = await utils.getTimestamp(result[i].dataValues.blockNumber);
            result[i].dataValues['sellingAt'] = sellingAt;
            data.push(result[i].dataValues);
        }

        return res.send({
            status: 'success',
            count: count,
            data: data
        })
    }
};

module.exports = Pet;