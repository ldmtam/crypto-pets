var DataTypes = require('sequelize');

var Admin = global.db_connection.define('Admin', {
    username: {
        type: DataTypes.STRING
    },
    password: {
        type: DataTypes.STRING
    }
});

module.exports = Admin;