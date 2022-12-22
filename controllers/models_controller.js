const Response = require('../views/response')

const ProductModel = require('../models/models_manager').models.ProductModel

const getAll = async (req, res) => {
    let limit = 10
    let offset = 0

    try {
        limit = parseInt(req.query.limit) || limit
        offset = (parseInt(req.query.page) - 1) * limit || offset
    } catch (err) {
        return Response.badRequest(res, err)
    }

    ProductModel.findAll({ limit: limit, offset: offset })
        .then(result => Response.ok(res, { data: result }))
        .catch(err => Response.internalServerError(res, err))
}

const create = async (req, res) => {
    const { product_line, name } = req.body

    if (!product_line || !name) {
        return Response.badRequest(res, 'Fill emtpy field')
    }

    ProductModel.create({ product_line: product_line, name: name })
        .then(result => Response.ok(res, { data: result }))
        .catch(err => Response.internalServerError(res, err))
}

module.exports = {
    getAll,
    create
}