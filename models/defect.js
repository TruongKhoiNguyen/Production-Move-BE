const { DataTypes } = require('sequelize')
const sequelize = require('../database/models').sequelize

const Defect = sequelize.define('Defect', {
    tracker_id: DataTypes.INTEGER,
    warehouse_id: DataTypes.INTEGER
}, {
    tableName: 'defects'
})

Defect.sync()

module.exports = Defect