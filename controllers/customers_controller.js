const ModelsManager = require('../models/models_manager')
const GetterBuilder = require('./getter_builder')

const { Customer } = ModelsManager.models

const getAll = GetterBuilder.of()
    .setCondition(Customer)
    .build()

module.exports = {
    getAll
}