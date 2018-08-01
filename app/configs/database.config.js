var env = process.env.NODE_ENV;

/**
 * Development configuration
 */
var development = {
    username: 'root',
    password: '123456',
    dbName: 'cryptopet1',
    host: 'localhost',
    port: '27017'
}

/**
 * Staging configuration
 */
var staging = {
    username: 'root',
    password: '123456',
    dbName: 'cryptopet2',
    host: 'localhost',
    port: '27017'
}

var final = {
    username: 'root',
    password: 'Sieugioi123',
    dbName: 'cryptopet',
    host: 'localhost',
    port: '27017'
}

var config = {
    development: development,
    staging: staging,
    final: final
}

module.exports = {
    mysql: config[env]
}