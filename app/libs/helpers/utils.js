
var Utils = function () {}

Utils.isAddress = (address) => {
    try {
        return web3.isAddress(address);
    } catch (err) {
        return false;
    }
}

Utils.getTimestamp = async (blockNumber) => {
    let info = await web3.eth.getBlock(blockNumber);
    let timestamp = info.timestamp;

    return timestamp;
}

module.exports = Utils;