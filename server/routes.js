'use strict'
let config = require('./config')
let compose = require('composable-middleware')
let multiparty = require('connect-multiparty')
let createTorrent = require('create-torrent')
let path = require('path')
let fs = require('fs')
let debug = require('debug')('routes')
let File = require('mongoose').model('File')
let url = require('url')

const tracker_url = {
  protocol: 'http',
  hostname: config.server_address,
  port: config.tracker_port,
  pathname: '/tracker/'
}

module.exports = {
  getTorrents: getTorrents,
  uploadFile: uploadFile,
  deleteFile: deleteFile,
  modifyTorrent: modifyTorrent
}

function deleteFile (req, res, next) {
  File.findOne({_id: req.params._id}, (err, doc) => {
    if (err) next(err)
    doc.remove()
  })
}

function modifyTorrent (req, res, next) {
  File.findOne({_id: req.params._id}, (err, doc) => {
    if (err) next(err)
    doc.name = req.body.name || doc.name
    doc.description = req.body.description || doc.description
    doc.save((err) => {
      if (err) next(err)
      res.send(200)
    })
  })
}

function getTorrents (req, res, next) {
  File.find({}, (err, docs) => {
    if (err) next(err)
    res.send(docs)
  })
}

function uploadFile () {
  return compose()
    .use(multiparty({uploadDir: config.temp_dir}))
    .use(_moveFile)
    .use(_createTorrent)
    .use(_saveTorrent)
    .use((req, res, next) => {
      debug('sending response, why not receiving it')
      res.send(req.createdTorrent)
    })
}

/**
 * internal middleware that gets the file on the temp folder and moves it to
 * its destination folder
 * @param  {[type]}   req  express request
 * @param  {[type]}   res  express response
 * @param  {Function} next express next
 * @return {[type]}        undefined
 */

function _moveFile (req, res, next) {
  debug(req.files.file)
  debug(req.body)
  req.filename = req.files.file.name
  req.filetemppath = req.files.file.path
  req.filepath = path.join(config.final_dir, req.filename)

  let source = fs.createReadStream(req.filetemppath)
  let dest = fs.createWriteStream(req.filepath)

  source.pipe(dest)
  source.on('end', () => {
    fs.unlink(req.filetemppath, (err) => {
      if (err) next(err)
      debug('File removed from temp dest')
      next()
    })
  })
  source.on('error', (err) => {
    next(err)
  })
}

/**
 * Function that creates a torrent from recently uploaded file
 * @param  {[type]}   req  express req
 * @param  {[type]}   res  express res
 * @param  {Function} next express next
 * @return {[type]}        undefined
 */
function _createTorrent (req, res, next) {
  let download_url = {
    protocol: 'http',
    hostname: config.server_address,
    port: config.webseed_port,
    pathname: path.join('/downloads/' + req.filename)
  }

  var opts = {
    name: req.filename,
    createdBy: config.author,
    creationDate: Date.now(),
    private: true,
    announceList: [[url.format(tracker_url)]],
    urlList: download_url
  }
  debug(path.join(config.final_dir + req.filename))
  debug(req.filepath)
  createTorrent(path.join(config.final_dir + req.filename), opts,
  (err, torrent) => {
    if (err) next(err)
    req.torrentFile = torrent
    debug('Torrent file created')
    next()
  })
}

/**
 * Function that uploads the torrent file inside request to database
 * @param  {[type]}   req  express req
 * @param  {[type]}   res  express res
 * @param  {Function} next express next
 * @return {[type]}        undefined
 */
function _saveTorrent (req, res, next) {
  let file = new File({
    name: req.filename,
    size: req.files.file.size,
    torrent: req.torrentFile,
    description: req.body.description
  })
  file.save(() => {
    debug('Torrent file saved on mongo')
    next()
  })
}
