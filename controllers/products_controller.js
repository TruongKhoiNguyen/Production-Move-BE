const ControllerUtil = require('./controller_utils')
const FormattedResponse = require('../views/response')
const ShippingBuilder = require('../models/shipping_builder')

const send = async (req, res) => {
    const { to, lot_number } = req.body

    if (ControllerUtil.checkEmptyFields(to, lot_number)) {
        return FormattedResponse.badRequest(res, 'Fill empty field')
    }

    try {
        const builder = new ShippingBuilder()
        const shippingId = await builder.setSender(req.user.id)
            .setReceiver(to)
            .setPreviousState(1)
            .setLot(lot_number)
            .build()

        if (shippingId) {
            return FormattedResponse.ok(res, { message: 'Lot sent' })
        }

        return FormattedResponse.internalServerError(res, 'Something went wrong')

    } catch (err) {
        return FormattedResponse.internalServerError(res, err.message)
    }
}

module.exports = {
    send
}