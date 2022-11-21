const jwt = require('jsonwebtoken')

const protectRoute = (req, res, next) => {
    if (req.isAuthenticated()) {
        return next()
    }

    res.json({ success: false, message: 'User not authenticated' })
}

const authenticateToken = (req, res, next) => {
    const authHeader = req.headers.authorization
    const token = authHeader && authHeader.split(' ')[1]

    if (!token) {
        return res.status(401).json({ success: false, message: 'No token' })
    }

    jwt.verify(token, 'a', (err, user) => {
        if (err) {
            return res.status(403).json({ success: false, message: 'User not authenticated' })
        }

        req.user = user

        next()
    })
}

module.exports = {
    protectRoute,
    authenticateToken
}