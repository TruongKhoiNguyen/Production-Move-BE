const ModelsManager = require('../models/models_manager')
const FormattedResponse = require('../views/response')
const ControllerUtil = require('./controller_utils')
const LotShippingHandler = require('./lot_shipping_handler')
const GetterBuilder = require('./getter_builder')
const ProductionLogistics = require('../models/logistics/production_logistics')

const { Shipping, User } = ModelsManager.models

const send = async (req, res) => {
    const from = req.user.id

    const { to, lot_number } = req.body

    const user = await User.findByPk(from)

    if (user.role !== 'production') {
        FormattedResponse.badRequest(res, 'Can not send')
    }

    const logistics = new ProductionLogistics(user)
    try {
        const id = await logistics.send(lot_number, to)

        return FormattedResponse.ok(res, { data: id })
    } catch (err) {
        return FormattedResponse.internalServerError(res, err.message)
    }

}

const getShippings = GetterBuilder
    .of()
    .setVariables((req, vars) => {
        vars.userId = req.user.id
    })
    .setCondition(Shipping, (vars) => ({ to: vars.userId }))
    .build()

module.exports = {
    send,
    getShippings,
}