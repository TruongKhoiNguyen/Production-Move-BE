const { Repairing } = require('../models/index')

const create = (req, res) => {
    const { tracker_id, distribution_agent_warehouse_id, warranty_center_warehouse_id } = req.body

    if (!tracker_id || !distribution_agent_warehouse_id || !warranty_center_warehouse_id) {
        return res.status(400).json({ message: 'Fill empty field' })
    }

    Repairing.create(
        {
            tracker_id: tracker_id,
            distribution_agent_warehouse_id: distribution_agent_warehouse_id,
            warranty_center_warehouse_id: warranty_center_warehouse_id
        }
    )
        .then(result => res.status(201).json({ repairing: result }))
        .catch(err => res.status(500).json({ error: err }))
}

const getAll = (req, res) => {
    Repairing.findAll()
        .then(result => res.status(200).json({ repairing: result }))
        .catch(err => res.status(500).json({ error: err }))
}

module.exports = {
    create,
    getAll
}