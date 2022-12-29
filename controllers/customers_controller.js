const ModelsManager = require('../models/models_manager')
const GetterBuilder = require('./getter_builder')
const FormattedResponse = require('../views/response')

const { Customer } = ModelsManager.models

const getAll = GetterBuilder.of()
    .setCondition(Customer)
    .build()

const create = async (req, res) => {
    const { email } = req.body

    try {
        const result = await Customer.create({ email: email })
        return FormattedResponse.ok(res, { data: result, message: 'New customer created' })
    } catch (err) {
        return FormattedResponse.internalServerError(res, err.message)
    }
}

module.exports = {
    getAll,
    create
}