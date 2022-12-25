const { Lot, Product, LocationTracker, User } = require("../models/models_manager").models
const sequelize = require('../models/models_manager').connection
const Manufacture = require("../models/production/manufacture")
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

module.exports = {
    manufacture
}