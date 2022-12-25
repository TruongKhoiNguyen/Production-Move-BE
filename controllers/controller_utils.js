class ControllerUtil {
    static checkEmptyFields(...fields) {
        let result = false

        for (let field in fields) {
            result = result || !field
        }

        return result
    }

    static checkExistingFields(...fields) {
        return fields.reduce((a, b) => a && b)
    }

    static pagination(req) {
        let limit = 10
        let offset = 0

        try {
            limit = parseInt(req.query.limit) || limit
            offset = (parseInt(req.query.page) - 1) * limit || offset
        } catch (err) { }

        return { limit: limit, offset: offset }
    }
}

module.exports = ControllerUtil