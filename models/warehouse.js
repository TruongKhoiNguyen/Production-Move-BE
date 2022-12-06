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

}

Warehouse.setup = (models) => {
    Warehouse.belongsTo(models.User, { foreign_key: 'user_id' })
    Warehouse.hasMany(models.Manufacturing, { foreignKey: 'warehouse_id' })
    Warehouse.hasMany(models.Distributing, { foreignKey: 'warehouse_id' })
    Warehouse.hasMany(models.Repairing, { foreignKey: 'distribution_agent_warehouse_id' })
    Warehouse.hasMany(models.Repairing, { foreignKey: 'warranty_center_warehouse_id' })
    Warehouse.hasMany(models.Defect, { foreignKey: 'warehouse_id' })
}

module.exports = Warehouse