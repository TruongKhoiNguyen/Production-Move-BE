const { DataTypes } = require('sequelize')
const sequelize = require('../database/models').sequelize

const Sold = sequelize.define('Sold', {
    tracker_id: DataTypes.INTEGER,
    customer_id: DataTypes.INTEGER
}, {
    tableName: 'sold'
})

Sold.sync()

module.exports = Sold