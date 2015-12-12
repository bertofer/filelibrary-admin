'use strict'
let mongoose = require('mongoose')
//let config = require('../config')
let debug = require('debug')('database')
require('./models')() // Initialize mongoose models

mongoose.connect(process.env.DB_PATH)

mongoose.connection.on('connected', () => {
  debug('Connected to mongodb on ' + process.env.DB_PATH)
})

mongoose.connection.on('error', err => {
  debug('Mongoose connection error: ' + err)
})

// When the connection is disconnected
mongoose.connection.on('disconnected', () => {
  debug('Mongoose connection disconnected')
})

// If the Node process ends, close the Mongoose connection
process.on('SIGINT', () => {
  mongoose.connection.close(() => {
    debug('Connection closed due to SIGINT')
    process.exit(0)
  })
})
