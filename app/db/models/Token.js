var DataTypes = require('sequelize');

var Token = global.db_connection.define('Token', {
    tokenId: {
        type: DataTypes.STRING,
        primaryKey: true
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false
    },
    dna: {
        type: DataTypes.STRING,
        allowNull: false
    },
    petBirth: {
        type: DataTypes.STRING,
        allowNull: false
    },
    address: {
        type: DataTypes.STRING,
        allowNull: false
    },
    price: {
        type: DataTypes.STRING,
        allowNull: false
    },
    blockNumber: {
        type: DataTypes.STRING,
        allowNull: false
    },
    isSelling: {
        type: DataTypes.BOOLEAN,
        allowNull: false    
    }
});

module.exports = Token;