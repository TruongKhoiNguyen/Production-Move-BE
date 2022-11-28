const User = require('./user')
const Warehouse = require('./warehouse')
const Customer = require('./customer')
const Product = require('./product')

User.hasMany(Warehouse, { foreignKey: 'user_id' })
Warehouse.belongsTo(User, { foreignKey: 'user_id' })

module.exports = {
    User,
    Warehouse,
    Customer,
    Product
}