const ModelsManager = require('../models/models_manager')
const FormattedResponse = require('../views/response')
const ControllerUtil = require('./controller_utils')
const LotShippingHandler = require('./lot_shipping_handler')
const GetterBuilder = require('./getter_builder')

const { Shipping } = ModelsManager.models

const send = async (req, res) => {
    const from = req.user.id
    const { to, lot_number } = req.body

    if (ControllerUtil.checkExistingFields(from, to, lot_number)) {
        const handler = new LotShippingHandler(req, res)
        return await handler
            .setFrom(from)
            .setTo(to)
            .setLotNumber(lot_number)
            .send()
    }

    return FormattedResponse.badRequest(res, 'Fill empty field')
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
    getShippings
}