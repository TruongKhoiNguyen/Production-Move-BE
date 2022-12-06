const { DataTypes } = require('sequelize')
const sequelize = require('../database/models').sequelize

const Distributing = sequelize.define('Distributing', {
    tracker_id: DataTypes.INTEGER,
    warehouse_id: DataTypes.INTEGER
}, {
    tableName: 'distributing'
})

Distributing.setup = (models) => {
    Distributing.belongsTo(models.Tracker, { foreignKey: 'tracker_id' })
    Distributing.belongsTo(models.Warehouse, { foreignKey: 'warehouse_id' })
}

module.exports = Distributing