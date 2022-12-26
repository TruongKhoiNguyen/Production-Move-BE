const Logistics = require("../models/logistics/logistics")
const ModelsManager = require('../models/models_manager')
const DistributionAgent = require("../models/roles/distribution_agent")
const Inventory = require("../models/storage/inventory")

const { User, Storage } = ModelsManager.models

const test = async (req, res) => {
    const product_id = 1
    const customer_id = 1

    const user = await User.findByPk(3)

    try {
        const distribution_agent = new DistributionAgent(user)

        const result = await distribution_agent.sell(product_id, customer_id)
        return res.status(200).json({ data: result })

    } catch (err) {
        return res.status(500).json({ err: err.message })
    }
}

module.exports = {
    test
}