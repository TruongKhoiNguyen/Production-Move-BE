const { DataTypes } = require('sequelize')
const sequelize = require('../database/models').sequelize

const Repairing = sequelize.define('Repairing', {
    tracker_id: DataTypes.INTEGER,
    distribution_agent_warehouse_id: DataTypes.INTEGER,
    warranty_center_warehouse_id: DataTypes.INTEGER
}, {
    tableName: 'repairing'
})

Repairing.setup = (models) => {
    Repairing.belongsTo(models.Tracker, { foreignKey: 'tracker_id' })
    Repairing.belongsTo(models.Warehouse, { as: 'distribution', foreignKey: 'distribution_agent_warehouse_id' })
    Repairing.belongsTo(models.Warehouse, { as: 'warranty', foreignKey: 'warranty_center_warehouse_id' })
}

Repairing.sync()

module.exports = Repairing