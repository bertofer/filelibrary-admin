'use strict'
//let config = require('./config')
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
  hostname: process.env.TRACKER_ADDRESS,
  port: process.env.TRACKER_PORT
}

module.exports = {
  getFilesInfo: getFilesInfo,
  uploadFile: uploadFile,
  deleteFile: deleteFile,
  modifyTorrent: modifyTorrent,
  getTorrentFile: getTorrentFile
}

function deleteFile (req, res, next) {
  File.findOne({_id: req.params._id}, (err, doc) => {
    if (err) next(err)
    debug('params', req.params)
    debug('query', req.query)
    if (req.query.disk) {
      fs.unlink(path.join(process.env.FINAL_DIR,doc.name), (err) => {
        if (err) next(err)
        else doc.remove((err) => {
          if (err) next(err)
          debug('doc removed from mongoose')
          res.sendStatus(200)
        })
        debug('File removed from disc')
      })
    } else {
      doc.remove((err) => {
        if (err) next(err)
        debug('doc removed from mongoose')
        res.sendStatus(200)
      })
    }
  })
}

function modifyTorrent (req, res, next) {
  File.findOne({_id: req.params._id}, (err, doc) => {
    if (err) next(err)
    debug('req.body', req.body)
    doc.description = req.body.description || doc.description
    doc.save((err) => {
      if (err) next(err)
      res.send(200)
    })
  })
}

function getTorrentFile (req, res, next) {
  File.findOne({_id: req.params._id}, (err, doc) => {
    if (err) next(err)
    res.send(doc.torrent)
  })
}

function getFilesInfo (req, res, next) {
  File.find({}, (err, docs) => {
    if (err) next(err)
    res.send(docs)
  })
}

function uploadFile () {
  return compose()
    .use((req,res,next) => {
      _createDirIfNotExists(process.env.TEMP_DIR, next)
    })
    .use(multiparty({uploadDir: process.env.TEMP_DIR}))
    .use((req,res,next) => {
      _createDirIfNotExists(process.env.FINAL_DIR, next)
    })
    .use(_moveFile)
    .use(_createTorrent)
    .use(_saveTorrent)
    .use((req, res, next) => {
      debug('sending response, why not receiving it')
      res.send(req.createdTorrent)
    })
}

/**
 * Function that creates a directory if it not exists
 */
function _createDirIfNotExists (dir, cb) {
  fs.access(dir, fs.R_OK | fs.W_OK, (err) => {
    // If error, then create folder
    if(!err) cb()
    else if(err.code === 'ENOENT') {
      fs.mkdir(dir, () => {
        cb()
      })
    } else cb(err)
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
  req.filename = req.files.file.name
  req.filetemppath = req.files.file.path
  req.filepath = path.join(process.env.FINAL_DIR, req.filename)

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
    hostname: process.env.WEBSEED_ADRRESS,
    port: process.env.WEBSEED_PORT,
    pathname: path.join('/' + req.filename)
  }

  var opts = {
    name: req.filename,
    createdBy: process.env.AUTHOR,
    creationDate: Date.now(),
    private: true,
    announceList: [[url.format(tracker_url)]],
    urlList: url.format(download_url)
  }
  createTorrent(path.join(process.env.FINAL_DIR, req.filename), opts,
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
