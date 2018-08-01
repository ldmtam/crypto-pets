var mysql = require('../db/function/mysql');
var petUtils = require('../libs/helpers/petUtils');
var utils = require('../libs/helpers/utils');
var base64Img = require('base64-img');

var Handlers = function() {}

Handlers.handleTokenCreated = async (data) => {
    logger.trace('pet.watcher::handler::handleTokenCreated');

    let petType = parseInt(data.dna.substring(0, 2), 16);

    let realDna = '0x00' + data.dna.slice(2, petType.length);

    let image = petUtils.generatePetImage(petType, realDna, 15);

    let filepath = base64Img.imgSync(image, 'app/public/images', parseInt(data.id));

    let petBirth = await utils.getTimestamp(data.blockNumber);

    try {
        mysql.insertToken({
            tokenId: parseInt(data.id),
            name: data.name,
            dna: data.dna,
            address: data.owner,
            petBirth: petBirth,
            isSelling: false,
            price: global.web3.toWei('0.05', 'ether'),
            blockNumber: '0'
        });
        logger.trace(`pet.watcher::handler::handleTokenCreated::insertToken::success::tokenId: ${parseInt(data.id)}`);
    } catch (err) {}
    
}

Handlers.handleTokenSell = (data) => {
    logger.trace(`pet.watcher::handler::handleTokenSell::tokenId: ${parseInt(data._tokenId)}`);

    var tokenId = parseInt(data._tokenId);
    var price = parseInt(data._price);
    var blockNumber = parseInt(data._blockNumber);
    var seller = data._seller;

    try {
        mysql.updateSellingStatusToTrue({ tokenId, price, blockNumber });
    } catch (err) {}
}

Handlers.handleCancelSellingToken = (data) => {
    logger.trace(`pet.watcher::handler::handleCancelSellingToken::tokenId: ${parseInt(data._tokenId)}`);

    var seller = data._seller;
    var tokenId = parseInt(data._tokenId);
    var blockNumber = parseInt(data._blockNumber);
    
    try {
        mysql.updateSellingStatusToFalse({ tokenId, blockNumber });
    } catch (err) {}
}

Handlers.handleBuyToken = async (data) => {
    logger.trace(`pet.watcher::handler::handleBuyToken::tokenId: ${parseInt(data._tokenId)}`);

    let buyer = data._buyer;
    let seller = data._seller;
    let tokenId = parseInt(data._tokenId);
    let price = parseInt(data._price);
    let blockNumber = parseInt(data._blockNumber);
    let blockNumberAtSell = await mysql.getBlockNumberAtSell({ tokenId });

    try {
        await mysql.updateTokenAfterBuying({ buyer, tokenId });
        await mysql.insertIntoTrade({ tokenId, seller, buyer, price, blockNumberAtBuy: blockNumber, blockNumberAtSell: blockNumberAtSell[0].dataValues.blockNumber });
    } catch (err) {}

}

Handlers.handleChangePetName = (data) => {
    logger.trace(`pet.watcher::handler::handleChangePetname::tokenId: ${parseInt(data.tokenId)}`);

    let tokenId = parseInt(data.tokenId);
    let newName = data.newName;

    try {
        mysql.changePetName({ tokenId, newName });
    } catch (err) {}
}

var PetWatcher = {
    watchEvents: () => {
        var mainInstance = global.MainContract.at(global.MainAddress);

        mainInstance.allEvents({ fromBlock: 0, toBlock: 'latest' }, function(er, re) {
            if (er) {
                logger.trace('pet.watcher::watchEvents::error: ', er);
            }
            if (re.event === 'TokenCreated') {
                Handlers.handleTokenCreated(re.args);
            }
            if (re.event === 'SellToken') {
                Handlers.handleTokenSell(re.args);
            }
            if (re.event === 'CancelOrder') {
                Handlers.handleCancelSellingToken(re.args);
            }
            if (re.event === 'BuyToken') {
                Handlers.handleBuyToken(re.args);
            }
            if (re.event === 'PetNameChanged') {
                Handlers.handleChangePetName(re.args);
            }
        });
    }
}

module.exports = PetWatcher;