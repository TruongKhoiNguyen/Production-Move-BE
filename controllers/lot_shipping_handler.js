const FormattedResponse = require('../views/response')
const LotShippingManager = require('../models/lot_shipping_manager')
const ModelsManager = require('../models/models_manager')

const { User, Lot, Product, LocationTracker } = ModelsManager.models

class LotShippingHandler {
    #req
    #res

    #from
    #to
    #lot_number

    constructor(req, res) {
        this.#req = req
        this.#res = res
    }

    setFrom(sender) {
        this.#from = sender
        return this
    }

    setTo(receiver) {
        this.#to = receiver
        return this
    }

    setLotNumber(lot_number) {
        this.#lot_number = lot_number
        return this
    }

    async send() {
        try {
            if (this.#checkCondition()) {
                await LotShippingManager.send(this.#from, this.#to, this.#lot_number)
                return FormattedResponse.ok(this.#res, { message: 'Lot sent' })
            }

            return FormattedResponse.badRequest(this.#res, 'These users cannot perform lot shipping')

        } catch (err) {
            return FormattedResponse.internalServerError(this.#res, err.message)
        }
    }

    async #checkCondition() {
        const sender = await User.findByPk(this.#from)
        const receiver = await User.findByPk(this.#to)

        if (!(sender.role === 'production') || !(receiver.role === 'distribution')) {
            return false
        }

        const lot = await Lot.findByPk(this.#lot_number)
        const products = await Product.findOne({ where: { lot_number: this.#lot_number } })

        if (products.status !== 1) {
            return false
        }

        const locationTracker = await LocationTracker.findOne(
            {
                where: { lot_number: this.#lot_number },
                order: [['createdAt', 'DESC']]
            }
        )

        const userId = await locationTracker.getWarehouse().getUser().id

        if (userId !== this.#from) {
            return false
        }

        return true
    }
}

module.exports = LotShippingHandler