const { DataTypes } = require('sequelize')
const sequelize = require('../database/models').sequelize

const Product = sequelize.define('Product', {
    product_line: {
        type: DataTypes.STRING,
        validate: {
            isIn: [['iphone', 'ipad', 'mac']]
        }
    },
    model: DataTypes.STRING,
    lot_number: DataTypes.STRING,
    serial_number: DataTypes.STRING
}, {
    tableName: 'products'
})

Product.setup = (models) => {
    Product.hasMany(models.Tracker, { foreignKey: 'product_id' })
}


module.exports = Product