const User = require('./user')
const Warehouse = require('./warehouse')
const Customer = require('./customer')
const Product = require('./product')
const Tracker = require('./tracker')

const Manufacturing = require('./manufacturing')
const Distributing = require('./distributing')
const Sold = require('./sold')
const Repairing = require('./repairing')

User.hasMany(Warehouse, { foreignKey: 'user_id' })
Warehouse.belongsTo(User, { foreignKey: 'user_id' })

Product.hasMany(Tracker, { foreignKey: 'product_id' })
Tracker.belongsTo(Product, { foreignKey: 'product_id' })

Tracker.hasOne(Manufacturing, { foreignKey: 'tracker_id' })
Manufacturing.belongsTo(Tracker, { foreignKey: 'tracker_id' })
Warehouse.hasOne(Manufacturing, { foreignKey: 'warehouse_id' })
Manufacturing.belongsTo(Warehouse, { foreignKey: 'warehouse_id' })

Tracker.hasOne(Distributing, { foreignKey: 'tracker_id' })
Distributing.belongsTo(Tracker, { foreignKey: 'tracker_id' })
Warehouse.hasOne(Distributing, { foreignKey: 'warehouse_id' })
Distributing.belongsTo(Warehouse, { foreignKey: 'warehouse_id' })

Tracker.hasOne(Sold, { foreignKey: 'tracker_id' })
Sold.belongsTo(Tracker, { foreignKey: 'tracker_id' })
Customer.hasOne(Sold, { foreignKey: 'customer_id' })
Sold.belongsTo(Customer, { foreignKey: 'customer_id' })

Tracker.hasOne(Repairing, { foreignKey: 'tracker_id' })
Repairing.belongsTo(Tracker, { foreignKey: 'tracker_id' })
Warehouse.hasOne(Repairing, { foreignKey: 'distribution_agent_warehouse_id' })
Repairing.belongsTo(Warehouse, { as: 'distribution', foreignKey: 'distribution_agent_warehouse_id' })
Warehouse.hasOne(Repairing, { foreignKey: 'warranty_center_warehouse_id' })
Repairing.belongsTo(Warehouse, { as: 'warranty', foreignKey: 'warranty_center_warehouse_id' })

module.exports = {
    User,
    Warehouse,
    Customer,
    Product,
    Tracker,
    Manufacturing,
    Distributing,
    Sold,
    Repairing
}