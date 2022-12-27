const { Lot, Product, LocationTracker, User } = require("../models/models_manager").models
const sequelize = require('../models/models_manager').connection
const Manufacture = require("../models/production/manufacture")
const ProductionFactory = require("../models/roles/production_factory")
const Response = require("../views/response")
const ControllerUtil = require("./controller_utils")

const manufacture = async (req, res) => {
    const { model, amount, warehouse_id } = req.body
    const userId = req.user.id

    if (ControllerUtil.checkEmptyFields(model, amount, warehouse_id)) {
        return Response.badRequest(res, 'Fill empty field')
    }

    try {
        const factory = await User.findByPk(userId)
        const manufacture = new Manufacture(factory)
        manufacture.execute(model, amount, warehouse_id)

        return Response.ok(res, { message: 'Products manufactured' })

    } catch (err) {
        Response.internalServerError(res, err.message)
    }
}

const receiveReturn = async (req, res) => {
    const { delivery_id, storage_id } = req.body

    if (ControllerUtil.checkEmptyFields(delivery_id, storage_id)) {
        return Response.badRequest(res, 'Fill empty field')
    }

    try {
        const user = await User.findByPk(req.user.id)
        const production = new ProductionFactory(user)
        await production.receive(delivery_id, storage_id)
        return Response.ok(res, 'Returned')
    } catch (err) {
        return Response.internalServerError(res, err.message)
    }
}

module.exports = {
    manufacture,
    receiveReturn
}