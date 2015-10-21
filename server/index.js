'use strict'
let express = require('express')
require('./database')
let routes = require('./routes')
let config = require('./config')

let app = express()

let env = process.env.NODE_ENV || 'development'

if (env === 'development') {
  app.use(require('cors')())
}
app.use(require('body-parser').json())

app.get('/torrents', routes.getFilesInfo)
app.post('/upload', routes.uploadFile())
app.get('/torrents/:_id', routes.getTorrentFile)
app.post('/torrents/:_id', routes.modifyTorrent)
app.delete('/torrents/:_id', routes.deleteFile)

app.listen(config.app_port)
