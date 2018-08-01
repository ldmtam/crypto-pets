var CryptoPets = artifacts.require('./CryptoPets');
var Trade = artifacts.require('./Trade');
var crypto = require("crypto");

contract('Trade', async (accounts) => {
    let admin = accounts[0];
    let operator = accounts[0];
    let user1 = accounts[1];
    let user2 = accounts[2];
    let dna1 = crypto.randomBytes(5).toString('hex');
    let dna2 = crypto.randomBytes(5).toString('hex');
    let dna3 = crypto.randomBytes(5).toString('hex');

    it('user can sell token', async () => {
        let cryptoPets = await CryptoPets.deployed();
        let trade = await Trade.deployed();

        await cryptoPets.createToken(user1, 'Lam Oc Cho', dna1, { from: admin });
        await cryptoPets.approve(trade.address, 0, { from: user1 });

        await trade.sellToken(user1, 0, web3.toWei(0.5, 'ether'));

        let seller = await trade.getSellerAddressByTokenId(0);
        let price = await trade.getPriceByTokenId(0);
        assert.equal(user1, seller);
        assert.equal(web3.toWei(0.5, 'ether'), price);
    });

    it('user can cancel selling token', async () => {
        let cryptoPets = await CryptoPets.deployed();
        let trade = await Trade.deployed();

        await cryptoPets.createToken(user1, 'Lam Oc Cut', dna2, { from: operator });
        await cryptoPets.approve(trade.address, 1, { from: user1 });

        await trade.sellToken(user1, 1, web3.toWei(1, 'ether'));
        await trade.cancelSellingToken(user1, 1);
        let result = await trade.getListOfTokenBySeller(user1);
        assert.equal(1, result.length);
    });

    it('user can buy a token', async () => {
        let cryptoPets = await CryptoPets.deployed();
        let trade = await Trade.deployed();

        await cryptoPets.approve(trade.address, 1, { from: user1 });

        await trade.sellToken(user1, 1, web3.toWei(1, 'ether'));
        await trade.buyToken(user2, 1, { value: web3.toWei(1, 'ether') });

        let user1Balance = await cryptoPets.balanceOf(user1);
        let user2Balance = await cryptoPets.balanceOf(user2);
        assert.equal(0, parseInt(user1Balance));
        assert.equal(1, parseInt(user2Balance));
    });

    it('user spends less than required amount of ether to buy token', async () => {
        let cryptoPets = await CryptoPets.deployed();
        let trade = await Trade.deployed();

        await cryptoPets.createToken(user1, 'Lam Oc Kec', dna3, { from: admin });
        await cryptoPets.approve(trade.address, 2, { from: user1 });

        await trade.sellToken(user1, 2, web3.toWei(1, 'ether'));

        try {
            await trade.buyToken(user2, 2, { value: web3.toWei(0.5, 'ether') });
            assert(false);
        } catch (err) {
            assert(true);
        }
    });

    it('gets selling price of a token', async () => {
        let trade = await Trade.deployed();

        let result = await trade.getPriceByTokenId(2);
        assert.equal(web3.toWei(1, 'ether'), result);
    });

    it('gets selling status of a token', async () => {
        let trade = await Trade.deployed();

        let result = await trade.getSellingStatusByTokenId(2);
        let result2 = await trade.getSellingStatusByTokenId(1);
        assert.equal(false, result);
        assert.equal(true, result2);
    });

    it('gets seller address of a token', async () => {
        let trade = await Trade.deployed()

        let result = await trade.getSellerAddressByTokenId(2);
        assert.equal(user1, result);
    });
});