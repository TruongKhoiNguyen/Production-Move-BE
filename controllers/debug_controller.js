const Logistics = require("../models/logistics/logistics")
const ModelsManager = require('../models/models_manager')
const DistributionAgent = require("../models/roles/distribution_agent")
const Inventory = require("../models/storage/inventory")

const { User, Storage } = ModelsManager.models

const test = async (req, res) => {
    const delivery_id = 1
    const storage_id = 2

    const user = await User.findByPk(3)
    const distributionAgent = new DistributionAgent(user)

    try {
        await distributionAgent.receive(delivery_id, storage_id)
        return res.status(200).json({ message: 'ok' })
    } catch (err) {
        return res.status(500).json({ err: err.message })
    }

}

module.exports = {
    test
}