const bcrypt = require('bcryptjs')
const passport = require('passport')
const sequelize = require('sequelize')
const User = require('../models/index').sequelize.models.User

const testCreate = (req, res) => {
    User.create({ name: 'Yukimura Chizuru', password: '123456' })
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
                        User.create({ name: name, password: hash }).then((user) => {
                            res.json({ success: true, data: user, message: 'User created' })
                        })
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

    passport.authenticate('local', (err, user, info) => {
        if (err) {
            return res.json({ success: false, error: err, message: 'Can not authenticate' })
        }

        if (!user) {
            return res.json({ success: false, message: 'Wrong user name' })
        }

        req.logIn(user, (err) => {
            if (err) {
                return res.json({ success: false, error: err, message: 'Can not login' })
            }

            res.json({ success: true, message: 'User authenticated' })
        })
    })(req, res)
}

const testLogin = (req, res) => {
    // a middleware is used to check unauthenticated access
    res.json({ sucess: true, message: 'Logged-in' })
}

module.exports = { testCreate, registerUser, loginUser, testLogin }