const { DataTypes } = require('sequelize')
const sequelize = require('../database/models').sequelize

const Request = sequelize.define('Request', {
    distribution_agent_id: DataTypes.INTEGER,
    manufacturing_factory_id: DataTypes.INTEGER,
    model: DataTypes.STRING,
    amount: {
        type: DataTypes.INTEGER,
        validate: {
            min: 1
        }
    }
}, {
    tableName: 'requests'
})

Request.setup = (models) => {
    Request.belongsTo(models.User, { as: 'distribution', foreignKey: 'distribution_agent_id' })
    Request.belongsTo(models.User, { as: 'manufacturing', foreignKey: 'manufacturing_factory_id' })
}

module.exports = Request