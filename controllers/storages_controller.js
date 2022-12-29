const ModelsManager = require('../models/models_manager')
const FormattedResponse = require('../views/response')
const ControllerUtil = require('./controller_utils')

const { Storage, User } = ModelsManager.models

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

const create = async (req, res) => {
    const { user_id, location } = req.body

    if (!user_id || !location) {
        return FormattedResponse.badRequest(res, 'Fill empty field')
    }

    const user = await User.findByPk(user_id)

    if (user.role === 'executive') {
        return FormattedResponse.badRequest(res, 'Storages can not be assigned to this user')
    }

    try {
        const result = await Storage.create({ user_id: user_id, location: location })
        return FormattedResponse.ok(res, { data: result, message: 'Storage created' })

    } catch (err) {
        return FormattedResponse.internalServerError(res, err.message)
    }
}

module.exports = {
    getAll,
    get,
    create
}