const { DataTypes } = require('sequelize')
const sequelize = require('../database/models').sequelize

const Distributing = sequelize.define('Distributing', {
    tracker_id: DataTypes.INTEGER,
    warehouse_id: DataTypes.INTEGER
}, {
    tableName: 'distributing'
})

Distributing.sync()

module.exports = Distributing