const { QueryTypes } = require('sequelize')

const ControllerUtil = require('./controller_utils')
const FormattedResponse = require('../views/response')
const ModelsManager = require('../models/models_manager')
const DistributionAgent = require('../models/roles/distribution_agent')
const GetterBuilder = require('./getter_builder')

const { User, Product, Sale } = ModelsManager.models
const sequelize = ModelsManager.connection

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
        return FormattedResponse.ok(res, 'Products returned')
    } catch (err) {
        return FormattedResponse.internalServerError(res, err.message)
    }
}

const sell = async (req, res) => {
    const { product_id, customer_id } = req.body

    if (ControllerUtil.checkEmptyFields(product_id, customer_id)) {
        return FormattedResponse.badRequest(res, 'Fill empty field')
    }

    const user = await User.findByPk(req.user.id)

    try {
        const distributionAgent = new DistributionAgent(user)
        const result = await distributionAgent.sell(product_id, customer_id)

        return FormattedResponse.ok(res, { data: result, message: 'Product sold' })
    } catch (err) {
        return FormattedResponse.internalServerError(res, err.message)
    }
}

const returnToCustomer = async (req, res) => {
    const { product_id } = req.body

    if (!product_id) {
        return FormattedResponse.badRequest(res, 'Fill empty field')
    }

    const user = await User.findByPk(req.user.id)

    try {
        const distributionAgent = new DistributionAgent(user)
        const result = await distributionAgent.returnToCustomer(product_id)

        return FormattedResponse.ok(res, { data: result, message: 'Product returned' })
    } catch (err) {
        return FormattedResponse.internalServerError(res, err.message)
    }
}

const receiveProduct = async (req, res) => {
    const { product_id, storage_id } = req.body

    if (ControllerUtil.checkEmptyFields(product_id, storage_id)) {
        return FormattedResponse.badRequest(res, 'Fill empty field')
    }

    const userId = req.user.id
    const user = await User.findByPk(userId)

    try {
        const distributionAgent = new DistributionAgent(user)
        const result = await distributionAgent.receiveProduct(product_id, storage_id)
        return FormattedResponse.ok(res, { message: 'Product received' })
    } catch (err) {
        return FormattedResponse.internalServerError(res, err.message)
    }
}

const recall = async (req, res) => {
    const { lot_number } = req.body

    if (!lot_number) {
        return FormattedResponse.badRequest(res, 'Fill empty field')
    }

    const user = await User.findByPk(req.user.id)

    try {
        const distributionAgent = new DistributionAgent(user)
        await distributionAgent.recall(lot_number)
        return FormattedResponse.ok(res, { message: 'Recalling' })
    } catch (err) {
        return FormattedResponse.internalServerError(res, err.message)
    }
}

const getSale = async (req, res) => {
    const query = 'select Sales.id, Sales.customer_id, Sales.product_id, Products.status, ProductModels.product_line, ProductModels.name as model, Sales.createdAt as sale_date from Sales join Products on Sales.product_id = Products.id join Lots on Lots.id = Products.lot_number join ProductModels on ProductModels.id = Lots.model'

    try {
        const result = await sequelize.query(query, {
            replacements: { user_id: req.user.id },
            type: QueryTypes.SELECT
        })

        return FormattedResponse.ok(res, { data: result })
    } catch (err) {
        return FormattedResponse.internalServerError(res, err.message)
    }
}

module.exports = {
    sendForRepair,
    returnToFactory,
    sell,
    returnToCustomer,
    receiveProduct,
    recall,
    getSale
}