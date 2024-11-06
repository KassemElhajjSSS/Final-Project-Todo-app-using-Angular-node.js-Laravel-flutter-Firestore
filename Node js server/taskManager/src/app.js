const express = require('express')
const cors = require('cors')

const app = express()

require('dotenv').config()

const corsOptions = {
    origin: ['http://localhost:4200', "flutter_App"],
    optionsSuccessStatus: 200
}

app.use(express.json())  // to recieve json files
app.use(express.urlencoded({ extended: true })); //to recieve form-data
app.use(cors(corsOptions))

const Task = require('./routes/taskRoute')
app.use('/tasks', Task)

module.exports = app