const { Sequelize } = require('sequelize')

const connection = new Sequelize({
    dialect: 'sqlite',
    storage: './database/dev.sqlite'
})

connection.sync()

module.exports = connection