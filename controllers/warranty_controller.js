const ControllerUtil = require("./controller_utils")
const FormattedResponse = require('../views/response')
const ModelsManager = require('../models/models_manager')
const WarrantyCenter = require("../models/roles/warranty_center")

const { User } = ModelsManager.models

const send = async (req, res) => {
    const { product_id, to } = req.body

    if (ControllerUtil.checkEmptyFields(product_id, to)) {
        return FormattedResponse.badRequest(res, 'Fill emtpty field')
    }

    const userId = req.user.id
    const user = await User.findByPk(userId)

    try {
        const warrantyCenter = new WarrantyCenter(user)
        const result = await warrantyCenter.send(product_id, to)
        return FormattedResponse.ok(res, { data: result })

    } catch (err) {
        return FormattedResponse.internalServerError(res, err.message)
    }
}

const returnToFactory = async (req, res) => {
    const { product_id } = req.body

    if (!product_id) {
        return FormattedResponse.badRequest(res, 'Fill emtpty field')
    }

    const user = await User.findByPk(req.user.id)

    try {
        const warrantyCenter = new WarrantyCenter(user)
        await warrantyCenter.returnToFactory(product_id)
        return FormattedResponse.ok(res, { message: 'Product returned' })

    } catch (err) {
        return FormattedResponse.internalServerError(res, err.message)
    }
}

module.exports = {
    send,
    returnToFactory
}