const express = require('express')
const passport = require('passport')
const session = require('express-session')

const app = express()

const { loginCheck } = require('./auth/passport')

loginCheck(passport)

// middlewares
app.use(express.json())
app.use(express.urlencoded({ extended: false }))

app.use(session({
    secret: 'oneboy',
    saveUninitialized: true,
    resave: true
}))

app.use(passport.initialize())
app.use(passport.session())

// routing
app.use('/users', require('./routes/user'))

const PORT = process.env.PORT || 4111
app.listen(PORT, () => { console.log('Server start on port ' + PORT) })