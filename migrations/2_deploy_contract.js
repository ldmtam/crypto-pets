var Main = artifacts.require('./Main.sol');

module.exports = function(deployer) {
    deployer.deploy(
        Main, 
        "0x627306090abaB3A6e1400e9345bC60c78a8BEf57",
        "0x627306090abaB3A6e1400e9345bC60c78a8BEf57"
    );
};
