const User = require("../database/schemas/User")

const testCreate = (req, res) => {
    const testUser = {
        name: 'Yukimura Chizuru',
    }

    User.create(testUser)
        .then((data) => {
            res.json({ success: true, data: data, message: 'created successful' })
        })
        .catch((err) => {
            res.json({ success: false, error: err })
        })
}

module.exports = { testCreate }