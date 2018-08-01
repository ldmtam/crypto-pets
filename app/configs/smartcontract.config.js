var env = process.env.NODE_ENV;

/**
 * Development configuration
 */
var development = {
    AdminIndex: 0,
    OperatorIndex: 1,
    MainContractAddress: '0x345cA3e014Aaf5dcA488057592ee47305D9B3e10'
}

var staging = {
    AdminIndex: 0,
    OperatorIndex: 0,
    MainContractAddress: '0x24e2f71273025ec55bf5fdfd9191889a07403f20',
    passpharse: 'sieugioi'
}

var final = {
    AdminIndex: 0,
    OperatorIndex: 0,
    MainContractAddress: '0x737710cececb7ea7916fd31c094de22fb929651f',
    passpharse: 'sieugioi'
}

/**
 * Export module
 */
var config = {
    development: development,
    staging: staging,
    final: final
}

module.exports = {
    smartcontract: config[env]
}