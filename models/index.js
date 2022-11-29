const User = require('./user')
const Warehouse = require('./warehouse')
const Customer = require('./customer')
const Product = require('./product')
const Tracker = require('./tracker')

const Manufacturing = require('./manufacturing')

User.hasMany(Warehouse, { foreignKey: 'user_id' })
Warehouse.belongsTo(User, { foreignKey: 'user_id' })

Product.hasMany(Tracker, { foreignKey: 'product_id' })
Tracker.belongsTo(Product, { foreignKey: 'product_id' })

Tracker.hasOne(Manufacturing, { foreignKey: 'tracker_id' })
Manufacturing.belongsTo(Tracker, { foreignKey: 'tracker_id' })
Warehouse.hasOne(Manufacturing, { foreignKey: 'warehouse_id' })
Manufacturing.belongsTo(Warehouse, { foreignKey: 'warehouse_id' })

module.exports = {
    User,
    Warehouse,
    Customer,
    Product,
    Tracker,
    status: {
        Manufacturing
    }
}