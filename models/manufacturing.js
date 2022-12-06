const { DataTypes } = require('sequelize')
const sequelize = require('../database/models').sequelize

const Manufacturing = sequelize.define('Manufacturing', {
    tracker_id: DataTypes.INTEGER,
    warehouse_id: DataTypes.INTEGER
}, {
    tableName: 'manufacturing'
})

Manufacturing.setup = (models) => {
    Manufacturing.belongsTo(models.Tracker, { foreignKey: 'tracker_id' })
    Manufacturing.belongsTo(models.Warehouse, { foreignKey: 'warehouse_id' })
}

Manufacturing.sync()

module.exports = Manufacturing