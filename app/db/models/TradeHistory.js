var DataTypes = require('sequelize');

var TradeHistory = global.db_connection.define('TradeHistory', {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    tokenId: {
        type: DataTypes.STRING,
        allowNull: false
    },
    seller: {
        type: DataTypes.STRING,
        allowNull: false
    },
    buyer: {
        type: DataTypes.STRING,
        allowNull: false
    },
    price: {
        type: DataTypes.STRING,
        allowNull: false    
    },
    blockNumberAtSell: {
        type: DataTypes.STRING,
        allowNull: false
    },
    blockNumberAtBuy: {
        type: DataTypes.STRING,
        allowNull: false
    }
}, {
    indexes: [
        {
            unique: true,
            fields: ['tokenId', 'blockNumberAtBuy']
        }
    ]
});

module.exports = TradeHistory;