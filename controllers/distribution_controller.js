const ControllerUtil = require('./controller_utils')
const FormattedResponse = require('../views/response')
const ModelsManager = require('../models/models_manager')
const DistributionAgent = require('../models/roles/distribution_agent')

const { User } = ModelsManager.models

const sendForRepair = async (req, res) => {
    const { product_id, to } = req.body

    if (ControllerUtil.checkEmptyFields(product_id, to)) {
        return FormattedResponse.badRequest(res, 'Fill empty field')
    }

    const userId = req.user.id
    const user = await User.findByPk(userId)

    try {
        const distributionAgent = new DistributionAgent(user)
        const result = await distributionAgent.send(product_id, to)
        return FormattedResponse.ok(res, { data: result })

    } catch (err) {
        return FormattedResponse.internalServerError(res, err.message)
    }
}

const returnToFactory = async (req, res) => {
    const { to } = req.body

    if (!to) {
        return FormattedResponse.badRequest(res, 'Fill empty field')
    }

    const user = await User.findByPk(req.user.id)

    try {
        const distribution = new DistributionAgent(user)
        await distribution.returnToFactory(to)
        return FormattedResponse.ok(res, 'Returned')
    } catch (err) {
        return FormattedResponse.internalServerError(res, err.message)
    }
}

module.exports = {
    sendForRepair,
    returnToFactory
}