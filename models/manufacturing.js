const { DataTypes } = require('sequelize')
const sequelize = require('../database/models').sequelize

const Manufacturing = sequelize.define('Manufacturing', {
    tracker_id: DataTypes.INTEGER,
    warehouse_id: DataTypes.INTEGER
}, {
    tableName: 'manufacturing'
})

Manufacturing.sync()

module.exports = Manufacturing