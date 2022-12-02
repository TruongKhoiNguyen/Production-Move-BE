const { Manufacturing } = require('../models/index')

/**
 * Add new information about a product that has just been produced and not yet distributing
 * @param {Request} req - Must contains tracker_id, warehouse_id
 * @param {Response} res 
 * @returns 
 */
const create = (req, res) => {
    const { tracker_id, warehouse_id } = req.body

    if (!tracker_id || !warehouse_id) {
        return res.status(400).json({ message: 'Fill emtpy field' })
    }

    Manufacturing.create({ tracker_id: tracker_id, warehouse_id: warehouse_id })
        .then(result => res.status(201).json({ manufacturing: result }))
        .catch(err => res.status(500).json({ error: err }))
}

/**
 * Get all information about products that have just been produced and not yet distributing
 * @param {Request} req 
 * @param {Response} res 
 */
const getAll = (req, res) => {
    Manufacturing.findAll()
        .then(result => res.status(200).json({ manufacturing: result }))
        .catch(err => res.status(500).json({ error: err }))
}

module.exports = {
    create,
    getAll
}