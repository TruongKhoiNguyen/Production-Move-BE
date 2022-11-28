const User = require('./user')
const Warehouse = require('./warehouse')
const Customer = require('./customer')
const Product = require('./product')
const Tracker = require('./tracker')

User.hasMany(Warehouse, { foreignKey: 'user_id' })
Warehouse.belongsTo(User, { foreignKey: 'user_id' })

Product.hasMany(Tracker, { foreignKey: 'product_id' })
Tracker.belongsTo(Product, { foreignKey: 'product_id' })

module.exports = {
    User,
    Warehouse,
    Customer,
    Product,
    Tracker
}