const express = require('express')
const cors = require('cors')

// route imports
const posts = require('./routes/posts')

// app
const app = express()

// middleware
app.use(express.json())
app.use(cors())

// routes
app.use('/api', posts)

module.exports = app;
