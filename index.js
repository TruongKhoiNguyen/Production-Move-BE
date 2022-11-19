const express = require('express')
const app = express()

// connect to database
const connection = require('./database/connection')
connection.authenticate()
    .then(() => console.log('Connection established successfully'))
    .catch((err) => console.log('Unable to connect to the database: ', err))

// routing
app.use('/users', require('./routes/user'))

const PORT = process.env.PORT || 4111
app.listen(PORT, () => { console.log('Server start on port ' + PORT) })