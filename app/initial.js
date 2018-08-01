var mysql = require('./db/function/mysql');
var PetWatcher = require('./watchers/pet.watcher');

var Initial = function () {}

Initial.initialize = async () => {
    try {
        await mysql.init();
    } catch (err) {}

    try {
        await PetWatcher.watchEvents();
    } catch (err) {
        logger.error(err);
    }
};

module.exports = Initial;