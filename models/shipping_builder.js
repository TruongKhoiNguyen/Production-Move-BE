const { User, Shipping, LotShipping } = require('./models_manager').models
const StatesManager = require('./states_manager')

class ShippingBuilder {
    #senderId
    #receiverId
    #lotNumber
    #previousState

    setSender(userId) {
        this.#senderId = userId
        return this
    }

    setReceiver(userId) {
        this.#receiverId = userId
        return this
    }

    setLot(lot_number) {
        this.#lotNumber = lot_number
        return this
    }

    setPreviousState(previous_state) {
        this.#previousState = previous_state
        return this
    }

    async build() {
        const sender = await User.findByPk(this.#senderId)
        const receiver = await User.findByPk(this.#receiverId)

        if (sender.role !== 'production' || receiver.role !== 'distribution') {
            throw Error('Sending to this user is not allowed')
        }

        const shipping = await Shipping.create({ previous_state: this.#previousState, from: this.#senderId, to: this.#receiverId })
        await LotShipping.create({ shipping_id: shipping.id, lot_number: this.#lotNumber })

        StatesManager.onShipping(this)

        return shipping.id
    }

    get previousState() {
        return this.#previousState
    }

    get lotNumber() {
        return this.#lotNumber
    }
}

module.exports = ShippingBuilder