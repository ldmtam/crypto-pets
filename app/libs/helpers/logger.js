var log4js = require('log4js');
var env = process.env.NODE_ENV;

/**
 * Constructor
 */
var Logger = function (fileName, isPrintConsole) {

    // Write log to file
    var DateFile = {
        type: 'dateFile',
        filename: fileName,
        layout: {
            type: 'pattern',
            pattern: '[%d] %-5p% - %m'
        }
    }

    // Write log to console
    var ConsoleLog = {
        type: 'console',
        layout: {
            type: 'pattern',
            pattern: '%[[%d] %-5p%] - %m'
        }
    }

    log4js.configure({
        appenders: {
            DateFile: DateFile,
            ConsoleLog: ConsoleLog
        },
        categories: {
            default: {
                appenders: ['DateFile', 'ConsoleLog'],
                level: 'all'
            },
            development: {
                appenders: ['ConsoleLog'],
                level: 'all'
            },
            production: {
                appenders: ['DateFile', 'ConsoleLog'],
                level: 'all'
            }
        }
    });

    var mode = null;
    if (env == 'development') mode = 'development';
    else mode = 'production';
    this.logger = log4js.getLogger(mode);
}

/**
 * Trace
 */
Logger.prototype.trace = function (content) {
    this.logger.trace(content);
}

/**
 * Debug
 */
Logger.prototype.debug = function (content) {
    this.logger.debug(content);
}

/**
 * Info
 */
Logger.prototype.info = function (content) {
    this.logger.info(content);
}

/**
 * Warning
 */
Logger.prototype.warn = function (content) {
    this.logger.warn(content);
}

/**
 * Error
 */
Logger.prototype.error = function (content) {
    this.logger.error(content);
}

/**
 * Fatal
 */
Logger.prototype.fatal = function (content) {
    this.logger.fatal(content);
}

module.exports = new Logger('./logs/rb.log', true);