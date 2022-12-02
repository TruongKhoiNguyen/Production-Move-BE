const { Defect } = require('../models/index')

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
 * @param {Request} req 
 * @param {Response} res 
 */
const getAll = (req, res) => {
    Defect.findAll()
        .then(result => res.status(200).json({ defects: result }))
        .catch(err => res.status(500).json({ error: err }))
}

module.exports = {
    create,
    getAll
}