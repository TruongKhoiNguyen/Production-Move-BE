const { User } = require("../models/models_manager").models
const ProductionFactory = require("../models/roles/production_factory")
const Response = require("../views/response")
const ControllerUtil = require("./controller_utils")

const manufacture = async (req, res) => {
    const { model, amount, storage_id } = req.body

    if (ControllerUtil.checkEmptyFields(model, amount, storage_id)) {
        return Response.badRequest(res, 'Fill empty field')
    }

    try {
        const user = await User.findByPk(req.user.id)
        const production = new ProductionFactory(user)
        const result = await production.manufacture(model, amount, storage_id)

        return Response.ok(res, { data: result, message: 'Products manufactured' })

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