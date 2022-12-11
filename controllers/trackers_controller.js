const { Tracker } = require('../models/index').models

/**
 * Add new tracker that tracks status of a particular product
 * @param {Request} req - Must contains product_id, status 
 * @param {Response} res 
 * @returns 
 */
const create = (req, res) => {
    const { product_id, status } = req.body

    if (!product_id || !status) {
        return res.status(400).json({ message: 'Fill empty field' })
    }

    Tracker.create({ product_id: product_id, status: status })
        .then(result => res.status(201).json({ tracker: result }))
        .catch(err => res.status(500).json({ error: err }))
}

/**
 * Get all trackers of all products
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


    Tracker.findAll({ limit: limit, offset: offset })
        .then(result => res.status(200).json({ trackers: result }))
        .catch(err => res.status(500).json({ error: err }))
}

module.exports = {
    create,
    getAll
}