'use strict'
let mongoose = require('mongoose')
let Schema = mongoose.Schema

module.exports = function () {
  let FileSchema = new Schema({
    name: {type: String, required: true},
    size: {type: Number, required: true},
    torrent: {type: Buffer, required: true},
    description: {type: String},
    created: {type: Date, default: Date.now}
  })

  mongoose.model('File', FileSchema)
}
