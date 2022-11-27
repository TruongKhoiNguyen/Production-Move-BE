const { DataTypes } = require('sequelize')
const User = require('./user')
const sequelize = require('../database/models/index').sequelize

const Warehouse = sequelize.define('Warehouse', {
    location: DataTypes.STRING,
    user_id: DataTypes.INTEGER
}, {
    tableName: 'warehouses'
})

Warehouse.associate = (models) => {
    Warehouse.belongsTo(models.User, { foreign_key: 'user_id' })
}


Warehouse.sync()

module.exports = Warehouse