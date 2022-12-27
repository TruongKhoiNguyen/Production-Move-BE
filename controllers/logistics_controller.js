const ModelsManager = require('../models/models_manager')
const ProductionFactory = require('../models/roles/production_factory')
const DistributionAgent = require('../models/roles/distribution_agent')
const WarrantyCenter = require('../models/roles/warranty_center')
const ControllerUtil = require('./controller_utils')
const FormattedResponse = require('../views/response')

const { User } = ModelsManager.models

const receive = async (req, res) => {
    const { storage_id } = req.body
    const { delivery_id } = req.params

    if (ControllerUtil.checkEmptyFields(storage_id, delivery_id)) {
        return FormattedResponse.badRequest(res, 'Fill empty field')
    }

    try {
        const user = await User.findByPk(req.user.id)
        let receiver

        if (user.role === 'production') {
            receiver = new ProductionFactory(user)
        } else if (user.role === 'distribution') {
            receiver = new DistributionAgent(user)
        } else if (user.role === 'warranty') {
            receiver = new WarrantyCenter(user)
        } else {
            return FormattedResponse.badRequest(res, 'This role is not supported')
        }

        await receiver.receive(delivery_id, storage_id)

        return FormattedResponse.ok(res, { message: 'Product received' })

    } catch (err) {
        return FormattedResponse.internalServerError(res, err.message)
    }
}

module.exports = {
    receive
}