//var HDWalletProvider = require("truffle-hdwallet-provider");
//var mnemonic = "pledge disagree across faint jaguar moral yard scorpion artist then skull margin"

module.exports = {
  networks: {
    testrpc: {
      host: "127.0.0.1",
      port: 8545,
      network_id: "*", // Match any network id
      gasLimit: 6721975,
			gasPrice: 30000000000
    },
    rinkeby: {
      host: "167.99.74.114",
      port: 8545,
      network_id: "*", // Match any network id
      gas: 3000000,
			gasPrice: 30000000000
    }   
  }
};