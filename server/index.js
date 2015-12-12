'use strict'
let express = require('express')
require('./database')
let routes = require('./routes')
//let config = require('./config')

let app = express()

let env = process.env.NODE_ENV || 'development'

if (env === 'development') {
  app.use(require('cors')())
}
app.use(require('body-parser').json())

app.use('/', express.static(__dirname + '/../client'));
//console.log(__dirname + '/../client');

app.get('/api/torrents', routes.getFilesInfo)
app.post('/api/upload', routes.uploadFile())
app.get('/api/torrents/:_id', routes.getTorrentFile)
app.post('/api/torrents/:_id', routes.modifyTorrent)
app.delete('/api/torrents/:_id', routes.deleteFile)

app.listen(process.env.APP_PORT)
