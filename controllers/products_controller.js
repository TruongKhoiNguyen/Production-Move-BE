const ModelsManager = require('../models/models_manager')
const FormattedResponse = require('../views/response')
const ControllerUtil = require('./controller_utils')
const LotShippingHandler = require('./lot_shipping_handler')
const GetterBuilder = require('./getter_builder')
const ProductionLogistics = require('../models/logistics/production_logistics')
const DistributionAgent = require('../models/roles/distribution_agent')

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

const receiveOrder = async (req, res) => {
    const userId = req.user.id
    const { storage_id } = req.body
    const { delivery_id } = req.params

    if (ControllerUtil.checkEmptyFields(userId, storage_id, delivery_id)) {
        return FormattedResponse.badRequest(res, 'Fill empty field')
    }

    const user = await User.findByPk(userId)

    try {
        if (user.role === 'distribution') {
            const distributionAgent = new DistributionAgent(user)
            await distributionAgent.receive(delivery_id, storage_id)
            return FormattedResponse.ok(res, { message: 'Product received' })
        } else {
            return FormattedResponse.badRequest(res, 'This role is not supported')
        }

    } catch (err) {
        return FormattedResponse.internalServerError(res, err.message)
    }
}

const sell = async (req, res) => {
    const userId = req.user.id

    const { product_id, customer_id } = req.body

    if (ControllerUtil.checkEmptyFields(product_id, customer_id)) {
        return FormattedResponse.badRequest(res, 'Fill empty field')
    }

    const user = await User.findByPk(userId)

    try {
        const distributionAgent = new DistributionAgent(user)
        const result = await distributionAgent.sell(product_id, customer_id)
        return FormattedResponse.ok(res, { data: result })
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
    receiveOrder,
    sell
}