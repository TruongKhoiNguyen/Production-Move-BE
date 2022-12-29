const { QueryTypes } = require('sequelize')

const ModelsManager = require('../models/models_manager')
const FormattedResponse = require('../views/response')
const DistributionAgent = require('../models/roles/distribution_agent')
const WarrantyCenter = require('../models/roles/warranty_center')
const ProductionFactory = require('../models/roles/production_factory')

const { Shipping, User, Product } = ModelsManager.models
const sequelize = ModelsManager.connection

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

const get = async (req, res) => {
    const { product_id } = req.params
    try {
        const query = 'SELECT Products.id, Products.status, Products.lot_number, ProductModels.product_line, ProductModels.name as model from Products join Lots on Products.lot_number = Lots.id join ProductModels on Lots.model = ProductModels.id where Products.id = :product_id'
        const result = await sequelize.query(query, {
            replacements: { product_id: parseInt(product_id) },
            type: QueryTypes.SELECT
        })

        return FormattedResponse.ok(res, { data: result })
    } catch (err) {
        return FormattedResponse.internalServerError(res, err.message)
    }
}

module.exports = {
    getAll,
    get
}