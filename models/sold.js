const { DataTypes } = require('sequelize')
const sequelize = require('../database/models').sequelize

const Sold = sequelize.define('Sold', {
    tracker_id: DataTypes.INTEGER,
    customer_id: DataTypes.INTEGER
}, {
    tableName: 'sold'
})

Sold.setup = (models) => {
    Sold.belongsTo(models.Tracker, { foreignKey: 'tracker_id' })
    Sold.belongsTo(models.Customer, { foreignKey: 'customer_id' })
}

module.exports = Sold