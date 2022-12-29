const ModelsManager = require('../models_manager')

const { Logistics: PersistentLogistics, LotLogistics: PersistentLotLogistics, Product, IndividualLogistics } = ModelsManager.models

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
        } else if (order.type === 'individual') {
            const productId = (await IndividualLogistics.findOne({ where: { delivery_id: shipping_id } })).product_id
            const product = await Product.findByPk(productId)
            result.push(product.id)
        }

        order.received = true
        order.save()

        return result
    }

    async ioGet(delivery_id) {
        const order = await PersistentLogistics.findByPk(delivery_id)

        if (order.received) {
            throw new Error('This order has been received')
        }

        if (this.client.id !== order.to) {
            throw new Error('This client is not the receiver')
        }

        let action

        if (order.type === 'lot') {
            action = async () => {
                const lotNumber = (await PersistentLotLogistics.findOne({ where: { delivery_id: delivery_id } })).lot_number
                const products = await Product.findAll({ where: { lot_number: lotNumber } })
                const result = products.map(product => product.id)
                return result
            }
        } else if (order.type === 'individual') {
            action = async () => {
                const productId = (await IndividualLogistics.findOne({ where: { delivery_id: delivery_id } })).product_id
                const product = await Product.findByPk(productId)
                const result = [product.id]
                return result
            }
        }

        return (async (transaction) => {
            await PersistentLogistics.update({ received: true }, { where: { id: order.id }, transaction: transaction })
            return await action()
        })
    }
}

module.exports = Logistics