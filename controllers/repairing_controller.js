const { Repairing } = require('../models/_index').models

/**
 * Add new information about a product that is having problem and need repairing
 * @param {Request} req - Must contains tracker_id, distribution_agent_warehouse_id, warranty_center_warehouse_id 
 * @param {Response} res 
 * @returns 
 */
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

/**
 * Get all information about products that is having problem and need repairing
 * 
 * Add limit param to limit the number of result (default 10)
 * Add page param to change page (default 1)
 * @param {Request} req 
 * @param {Response} res 
 */
const getAll = (req, res) => {
    let limit = 10
    let offset = 0

    try {
        limit = parseInt(req.query.limit) || limit
        offset = (parseInt(req.query.page) - 1) * limit || offset
    } catch (err) {
        return res.status(400).json({ error: err })
    }


    Repairing.findAll({ limit: limit, offset: offset })
        .then(result => res.status(200).json({ repairing: result }))
        .catch(err => res.status(500).json({ error: err }))
}

module.exports = {
    create,
    getAll
}