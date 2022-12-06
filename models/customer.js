const { DataTypes } = require('sequelize')
const sequelize = require('../database/models').sequelize

const Customer = sequelize.define('Customer', {
    name: DataTypes.STRING,
    email: {
        type: DataTypes.STRING,
        validate: {
            isEmail: true
        }
    },
    phone_number: {
        type: DataTypes.STRING,
        validate: {
            is: /\(?([0-9]{3})\)?([ .-]?)([0-9]{3})\2([0-9]{4})/
        }
    }
}, {
    tableName: 'customers'
})

Customer.setup = (models) => {
    Customer.hasMany(models.Sold, { foreign_key: 'customer_id' })
}

Customer.sync()

module.exports = Customer