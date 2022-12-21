class Response {
    static async ok(response, data) {
        return response.status(200).json(data)
    }

    static async created(response, data) {
        return response.status(201).json(data)
    }

    static async badRequest(response, err) {
        return response.status(400).json({ err: err })
    }

    static async unauthorized(response, err) {
        return response.status(401).json({ err: err })
    }

    static async notFound(response, err) {
        return response.status(404).json({ err: err })
    }

    static async internalServerError(response, err) {
        return response.status(500).json({ err: err })
    }
}

module.exports = Response