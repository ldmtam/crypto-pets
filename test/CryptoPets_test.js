var CryptoPets = artifacts.require('./CryptoPets');
var crypto = require("crypto");

contract('CryptoPets', async (accounts) => {
    let admin = accounts[0];
    let operator = accounts[0];
    let user1 = accounts[1];
    let user2 = accounts[2];
    let dna1 = crypto.randomBytes(5).toString('hex');
    let dna2 = crypto.randomBytes(5).toString('hex');
    let dna3 = crypto.randomBytes(5).toString('hex');

    it('admin can create a token and assign to user', async () => {
        let instance = await CryptoPets.deployed();
        await instance.createToken(user1, 'Lam Oc Cho', dna1, { from: admin });
        let result = await instance.ownerOf(0);
        assert.equal(result, user1); 
    });

    it('operator can create a token and assign to user', async () => {
        let instance = await CryptoPets.deployed();
        await instance.createToken(user1, 'Lam Oc Cut', dna2, { from: operator });
        let result = await instance.ownerOf(1);
        assert.equal(result, user1); 
    });

    it('user pays less than required amount of ether', async () => {
        let instance = await CryptoPets.deployed();
        try {
            await instance.payForToken('Lam Oc Ket', { from: user1, value: web3.toWei('0.01', 'ether') });
            assert(false);
        } catch (err) {
            assert(true);
        }
    });

    it('user can pay ether and get a token', async () => {
        let instance = await CryptoPets.deployed();
        await instance.payForToken('Lam Oc Kec', dna3, { from: user1, value: web3.toWei('0.5', 'ether') });
        let result = await instance.ownerOf(2);
        assert.equal(result, user1);
    });

    it('gets token by tokenId', async () => {
        let instance = await CryptoPets.deployed();
        let result = await instance.getToken(0);
        assert.equal(user1, result[0]);
        assert.equal('Lam Oc Cho', result[1]);
    });

    it('gets list of tokens belong to a user', async () => {
        let instance = await CryptoPets.deployed();
        let result = await instance.getTokenList(user1);
        assert.equal(3, result.length);
        assert.equal(0, result[0]);
        assert.equal(1, result[1]);
        assert.equal(2, result[2]);
    });
    
    it('gets balance of a user', async () => {
        let instance = await CryptoPets.deployed();
        let result = await instance.balanceOf(user1);
        assert.equal(3, result);
    });

    it('approves other users to own a token', async () => {
        let instance = await CryptoPets.deployed();
        await instance.approve(user2, 0, { from: user1 });
        let result = await instance.getApproved(0);
        let user2Balance = await instance.balanceOf(user2);
        assert.equal(user2, result);
    });

    it('transfers a token to another user', async () => {
        let instance = await CryptoPets.deployed();
        await instance.safeTransferFrom(user1, user2, 0, { from: user1 });
        let result = await instance.balanceOf(user2);
        let result2 = await instance.ownerOf(0);
        assert.equal(1, parseInt(result));
        assert.equal(user2, result2);
    });
});