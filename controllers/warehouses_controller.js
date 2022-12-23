const { User } = require('../models/models_manager').models
const Response = require('../views/response')

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

module.exports = {
    getWarehousesByUser
}