'use strict'
let express = require('express')
require('./database')
let routes = require('./routes')
let config = require('./config')

let app = express()

let env = process.env.NODE_ENV || 'development'
console.log(process.env.NODE_ENV)
if (env === 'development') {
  app.use(require('cors')())
}

app.get('/torrents', routes.getFilesInfo)
app.post('/upload', routes.uploadFile())
app.get('/torrents/:_id', routes.getTorrentFile)
app.post('/torrents/:_id', routes.modifyTorrent)
app.delete('/torrents/:_id', routes.deleteFile)

app.listen(config.app_port)
