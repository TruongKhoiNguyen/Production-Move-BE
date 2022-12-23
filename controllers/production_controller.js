const { Lot, Product, LocationTracker } = require("../models/models_manager").models
const sequelize = require('../models/models_manager').connection
const Response = require("../views/response")
const ControllerUtil = require("./controller_utils")

const manufacture = async (req, res) => {
    const { model, amount, warehouse_id } = req.body

    if (ControllerUtil.checkEmptyFields(model, amount, warehouse_id)) {
        return Response.badRequest(res, 'Fill empty field')
    }

    try {
        await sequelize.transaction(async (t) => {
            const lot = await Lot.create({ model: model }, { transaction: t })

            await LocationTracker.create({ lot_number: lot.id, warehouse_id: warehouse_id }, { transaction: t })

            for (let i = 0; i < amount; i++) {
                await Product.create({ lot_number: lot.id, status: 1 }, { transaction: t })
            }
        })

        Response.ok(res, { message: 'Success' })

    } catch (err) {
        Response.internalServerError(res, err.message)
    }
}

module.exports = {
    manufacture
}