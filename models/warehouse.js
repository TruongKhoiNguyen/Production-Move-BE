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
    Warehouse.hasMany(Manufacturing, { foreignKey: 'warehouse_id' })
    Warehouse.hasMany(Distributing, { foreignKey: 'warehouse_id' })
    Warehouse.hasMany(Repairing, { foreignKey: 'distribution_agent_warehouse_id' })
    Warehouse.hasMany(Repairing, { foreignKey: 'warranty_center_warehouse_id' })
    Warehouse.hasMany(Defect, { foreignKey: 'warehouse_id' })
}


Warehouse.sync()

module.exports = Warehouse