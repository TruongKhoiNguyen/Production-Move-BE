const { Defect } = require('../models/_index').models

/**
 * Save new information about a product that is defective and has been returned to production factory
 * @param {Request} req - Must contain tracker_id, warehouse_id
 * @param {Response} res 
 * @returns 
 */
const create = (req, res) => {
    const { tracker_id, warehouse_id } = req.body

    if (!tracker_id || !warehouse_id) {
        return res.status(400).json({ message: 'Fill emtpy field' })
    }

    Defect.create({ tracker_id: tracker_id, warehouse_id: warehouse_id })
        .then(result => res.status(201).json({ defect: result }))
        .catch(err => res.status(500).json({ error: err }))
}

/**
 * Get all information about defective products 
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

    Defect.findAll({ limit: limit, offset: offset })
        .then(result => res.status(200).json({ defects: result }))
        .catch(err => res.status(500).json({ error: err }))
}

module.exports = {
    create,
    getAll
}