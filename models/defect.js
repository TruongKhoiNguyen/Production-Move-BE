const { DataTypes } = require('sequelize')
const sequelize = require('../database/models').sequelize

const Defect = sequelize.define('Defect', {
    tracker_id: DataTypes.INTEGER,
    warehouse_id: DataTypes.INTEGER
}, {
    tableName: 'defects'
})

Defect.setup = (models) => {
    Defect.belongsTo(models.Tracker, { foreignKey: 'tracker_id' })
    Defect.belongsTo(models.Warehouse, { foreignKey: 'warehouse_id' })
}

Defect.sync()

module.exports = Defect