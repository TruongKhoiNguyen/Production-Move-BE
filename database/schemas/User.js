const sequelize = require('sequelize')
const connection = require('../connection')

const User = connection.define('User', {
    id: {
        type: sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    name: {
        type: sequelize.STRING
    }
})

module.exports = User