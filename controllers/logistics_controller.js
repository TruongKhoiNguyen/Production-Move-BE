const { QueryTypes } = require('sequelize')

const ModelsManager = require('../models/models_manager')
const ProductionFactory = require('../models/roles/production_factory')
const DistributionAgent = require('../models/roles/distribution_agent')
const WarrantyCenter = require('../models/roles/warranty_center')
const ControllerUtil = require('./controller_utils')
const FormattedResponse = require('../views/response')
const GetterBuilder = require('./getter_builder')

const { User, Logistics, LotLogistics, IndividualLogistics } = ModelsManager.models
const sequelize = ModelsManager.connection

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

const send = async (req, res) => {
    const { to, lot_number, product_id } = req.body

    try {
        const user = await User.findByPk(req.user.id)

        let sender, id
        if (user.role === 'production') {
            sender = new ProductionFactory(user)
            id = lot_number
        } else if (user.role === 'distribution') {
            sender = new DistributionAgent(user)
            id = product_id
        } else if (user.role === 'warranty') {
            sender = new WarrantyCenter(user)
            id = product_id
        } else {
            return FormattedResponse.badRequest(res, 'This role is not supported')
        }

        if (ControllerUtil.checkEmptyFields(id, to)) {
            return FormattedResponse.badRequest(res, 'Fill empty field')
        }

        const result = await sender.send(id, to)

        return FormattedResponse.ok(res, { data: result, message: 'Product sent' })

    } catch (err) {
        return FormattedResponse.internalServerError(res, err.message)
    }

}

const getInbox = async (req, res) => {
    try {
        const query = "SELECT Logistics.id, Logistics.[from], Logistics.[to], Logistics.received, Logistics.[type], ProductModels.product_line, ProductModels.name AS model, count(Products.id) AS amount FROM Logistics JOIN LotLogistics ON Logistics.id = LotLogistics.delivery_id JOIN Lots ON Lots.id = LotLogistics.lot_number JOIN ProductModels ON Lots.model = ProductModels.id JOIN Products ON Lots.id = Products.lot_number WHERE Logistics.[to] = :user_id GROUP BY Logistics.id UNION SELECT Logistics.id, Logistics.[from], Logistics.[to], Logistics.received, Logistics.[type], ProductModels.product_line, ProductModels.name AS model, count(Products.id) AS amount FROM Logistics JOIN IndividualLogistics ON IndividualLogistics.delivery_id = Logistics.id JOIN Products ON IndividualLogistics.product_id = Products.id JOIN Lots ON Lots.id = Products.lot_number JOIN ProductModels ON Lots.model = ProductModels.id WHERE Logistics.[to] = :user_id GROUP BY Logistics.id"
        const result = await sequelize.query(query, {
            replacements: { user_id: req.user.id },
            type: QueryTypes.SELECT
        })
        return FormattedResponse.ok(res, { data: result })
    } catch (err) {
        return FormattedResponse.internalServerError(res, err.message)
    }
}

const getSent = async (req, res) => {
    try {
        const query = "SELECT Logistics.id, Logistics.[from], Logistics.[to], Logistics.received, Logistics.[type], ProductModels.product_line, ProductModels.name AS model, count(Products.id) AS amount FROM Logistics JOIN LotLogistics ON Logistics.id = LotLogistics.delivery_id JOIN Lots ON Lots.id = LotLogistics.lot_number JOIN ProductModels ON Lots.model = ProductModels.id JOIN Products ON Lots.id = Products.lot_number WHERE Logistics.[from] = :user_id GROUP BY Logistics.id UNION SELECT Logistics.id, Logistics.[from], Logistics.[to], Logistics.received, Logistics.[type], ProductModels.product_line, ProductModels.name AS model, count(Products.id) AS amount FROM Logistics JOIN IndividualLogistics ON IndividualLogistics.delivery_id = Logistics.id JOIN Products ON IndividualLogistics.product_id = Products.id JOIN Lots ON Lots.id = Products.lot_number JOIN ProductModels ON Lots.model = ProductModels.id WHERE Logistics.[from] = :user_id GROUP BY Logistics.id"
        const result = await sequelize.query(query, {
            replacements: { user_id: req.user.id },
            type: QueryTypes.SELECT
        })
        return FormattedResponse.ok(res, { data: result })
    } catch (err) {
        return FormattedResponse.internalServerError(res, err.message)
    }
}

const get = async (req, res) => {
    const { delivery_id } = req.params

    try {
        const order = await Logistics.findByPk(delivery_id)

        let result
        if (order.type === 'lot') {
            result = await LotLogistics.findOne({ delivery_id: delivery_id })
        } else if (order.type === 'individual') {
            result = await IndividualLogistics.findOne({ delivery_id: delivery_id })
        }

        return FormattedResponse.ok(res, { data: result })

    } catch (err) {
        return FormattedResponse.internalServerError(res, err.message)
    }
}

module.exports = {
    receive,
    send,
    getInbox,
    getSent,
    get
}