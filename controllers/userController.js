const bcrypt = require('bcryptjs')
const passport = require('passport')

const User = require("../models/User")

const testCreate = (req, res) => {
    User.find('Chizuru Yukimura').then((result) => {
        if (result) {
            res.json(result)
        } else {
            res.json({ success: false, message: 'This user does not exist' })
        }
    })
}

const registerUser = (req, res) => {
    const { name, password, confirm } = req.body

    if (!name || !password || !confirm) {
        res.json({ success: false, message: 'Fill empty field' })
        return
    }

    if (password !== confirm) {
        res.json({ success: false, message: 'Password must match' })
        return
    }

    User.checkDuplicated(name).then((isDuplicated) => {
        if (isDuplicated) {
            res.json({ success: false, message: 'User already existed' })
        } else {
            // hashing password
            bcrypt.genSalt(10, (err, salt) => {
                bcrypt.hash(password, salt, (err, hash) => {
                    if (err) {
                        res.json({ success: false, error: err })
                    } else {
                        const newUser = new User(name, hash)
                        newUser.create().then(result => res.json(result))
                    }
                })
            })
        }
    })
}

const loginUser = (req, res) => {
    const { name, password } = req.body

    if (!name || !password) {
        res.json({ success: false, message: 'Empty field' })
        return
    }

    passport.authenticate('local', { successRedirect: '/users/login/test', failureRedirect: '/users/login/test' })(req, res)
}

const testLogin = (req, res) => {
    // a middleware is used to check unauthenticated access
    res.json({ sucess: true, message: 'Logged-in' })
}

module.exports = { testCreate, registerUser, loginUser, testLogin }