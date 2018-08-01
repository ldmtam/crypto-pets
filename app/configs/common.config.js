var env = process.env.NODE_ENV;

/**
 * Development configuration
 */
var development = {
    server: {
        host: '',
        port: 3000
    }
}

var staging = {
    server: {
        host: '',
        port: 3000
    }
}

var final = {
    server: {
        host: '',
        port: 3000
    }
}

var config = {
    development: development,
    staging: staging,
    final: final
}

module.exports = config[env];