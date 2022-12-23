const { User, Warehouse } = require('../models/models_manager').models
const Response = require('../views/response')
const ControllerUtil = require('./controller_utils')

const getWarehousesByUser = async (req, res) => {
    const { userId } = req.params

    const user = await User.findByPk(userId)

    if (!user) {
        return Response.badRequest(res, 'This user does not exists')
    }

    console.log(user)

    const warehouses = await user.getWarehouses()

    Response.ok(res, { data: warehouses })
}

const getAll = async (req, res) => {

    const { limit, offset } = ControllerUtil.pagination(req)
    const { id, role } = req.user

    try {
        if (role === 'executive') {
            const result = await Warehouse.findAll({ limit: limit, offset: offset })

            return Response.ok(res, { data: formatResult(result) })
        }

        const result = await Warehouse.findAll({ limit: limit, offset: offset, where: { user_id: id } })

        return Response.ok(res, { data: formatResult(result) })

    } catch (err) {
        return Response.internalServerError(res, err.message)
    }
}

const formatResult = (result) => result.map(warehouse => ({ id: warehouse.id, location: warehouse.location }))

module.exports = {
    getWarehousesByUser,
    getAll
}