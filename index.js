const express = require('express')
const passport = require('passport')
const session = require('express-session')

const app = express()

const { loginCheck } = require('./auth/passport')

// middlewares
app.use(express.json())
app.use(express.urlencoded({ extended: false }))

loginCheck(passport)

app.use(passport.initialize())

// routing
app.use('/users', require('./routes/user'))

const PORT = process.env.PORT || 4111
app.listen(PORT, () => { console.log('Server start on port ' + PORT) })