const ModelsManager = require('../models/models_manager')
const FormattedResponse = require('../views/response')

const { Lot, ProductModel } = ModelsManager.models

const get = async (req, res) => {
    const { lot_number } = req.params

    try {
        const result = await Lot.findByPk(lot_number, { include: ProductModel })
        return FormattedResponse.ok(res, { data: result })

    } catch (err) {
        return FormattedResponse.internalServerError(res, err.message)
    }
}

module.exports = {
    get
}