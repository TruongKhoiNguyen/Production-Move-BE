const { Request } = require('../models/_index').models

const create = async (req, res) => {
    const { distribution, manufacturing, model } = req.body

    if (!distribution || !manufacturing || !model) {
        return res.status(400).json({ message: 'Fill emtpy field' })
    }

    Request.create({ distribution_agent_id: distribution, manufacturing_factory_id: manufacturing, model })
        .then(result => res.status(201).json({ request: result }))
        .catch(err => res.status(500).json({ error: err }))
}

const getAll = async (req, res) => {
    let limit = 10
    let offset = 0

    try {
        limit = parseInt(req.query.limit) || limit
        offset = (parseInt(req.query.page) - 1) * limit || offset
    } catch (err) {
        return res.status(400).json({ error: err })
    }

    Request.findAll({ limit: limit, offset: offset })
        .then(result => res.status(200).json({ requests: result }))
        .catch(err => res.status(500).json({ error: err }))
}

module.exports = {
    create,
    getAll
}