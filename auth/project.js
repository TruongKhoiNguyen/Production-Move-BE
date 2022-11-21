const protectRoute = (req, res, next) => {
    if (req.isAuthenticated()) {
        return next()
    }

    res.json({ success: false, message: 'User not authenticated' })
}

module.exports = {
    protectRoute
}