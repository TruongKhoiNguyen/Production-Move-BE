const express = require('express')
const passport = require('passport')

const { loginCheck } = require('./auth/passport')
loginCheck(passport)

const app = express()

// middlewares
app.use(express.json())
app.use(express.urlencoded({ extended: false }))
app.use(passport.initialize())

// routing
app.use('/api/v1', require('./routes/api'))

// error handler
app.use((err, req, res, next) => {
    console.log(err.stack)
    res.status(500).json({ error: err })
})

const PORT = process.env.PORT || 4111
app.listen(PORT, () => { console.log('Server start on port ' + PORT) })