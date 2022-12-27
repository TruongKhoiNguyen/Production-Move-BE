const ModelsManager = require('../models/models_manager')
const FormattedResponse = require('../views/response')
const DistributionAgent = require('../models/roles/distribution_agent')
const WarrantyCenter = require('../models/roles/warranty_center')
const ProductionFactory = require('../models/roles/production_factory')

const { Shipping, User, Product } = ModelsManager.models

const getAll = async (req, res) => {
    const user = await User.findByPk(req.user.id)

    try {
        let getter
        if (user.role === 'production') {
            getter = new ProductionFactory(user)
        } else if (user.role === 'distribution') {
            getter = new DistributionAgent(user)
        } else if (user.role === 'warranty') {
            getter = new WarrantyCenter(user)
        } else {
            return FormattedResponse.badRequest(res, 'This role is not supported')
        }

        const result = await getter.getProduct()
        return FormattedResponse.ok(res, { data: result })

    } catch (err) {
        return FormattedResponse.internalServerError(res, err.message)
    }
}

module.exports = {
    getAll
}