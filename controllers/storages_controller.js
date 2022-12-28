const ModelsManager = require('../models/models_manager')
const FormattedResponse = require('../views/response')

const { Storage } = ModelsManager.models

const getAll = async (req, res) => {
    try {
        const result = await Storage.findAll({ where: { user_id: req.user.id } })

        return FormattedResponse.ok(res, { data: result })

    } catch (err) {
        return FormattedResponse.internalServerError(res, err.message)
    }
}

const get = async (req, res) => {
    const { storage_id } = req.params

    try {
        const result = await Storage.findByPk(storage_id)
        return FormattedResponse.ok(res, { data: result })

    } catch (err) {
        return FormattedResponse.internalServerError(res, err.message)
    }
}

module.exports = {
    getAll,
    get
}