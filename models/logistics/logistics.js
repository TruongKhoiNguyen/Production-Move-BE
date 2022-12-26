const ModelsManager = require('../models_manager')

const { Logistics: PersistentLogistics, LotLogistics: PersistentLotLogistics, Product } = ModelsManager.models

class Logistics {
    client

    constructor(client) {
        this.client = client
    }

    async get(shipping_id) {
        const order = await PersistentLogistics.findByPk(shipping_id)

        if (order.received) {
            throw new Error('This order has been received')
        }

        if (this.client.id !== order.to) {
            throw new Error('This client is not the receiver')
        }

        let result = []
        if (order.type === 'lot') {
            const lotNumber = (await PersistentLotLogistics.findOne({ where: { delivery_id: shipping_id } })).lot_number
            const products = await Product.findAll({ where: { lot_number: lotNumber } })
            result = products.map(product => product.id)
        }

        order.received = true
        order.save()

        return result
    }
}

module.exports = Logistics