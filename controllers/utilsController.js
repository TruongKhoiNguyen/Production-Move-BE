const jsonErrorHandler = (err, req, res, next) => {
    res.status(err.statusCode).json({ error: err })
}

module.exports = { jsonErrorHandler }