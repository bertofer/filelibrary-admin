var _ = require('lodash')
var fileExtension = require('file-extension')

module.exports = function (Upload, SERVER_URL, $q, $http) {
  var data = {
    files: []
  }

  // Used to know if the files list is being loaded
  var filesLoading = null

  return {
    uploadFile: uploadFile,
    getTorrents: getTorrents,
    deleteTorrent: deleteTorrent,
    modifyTorrent: modifyTorrent,
    downloadTorrent: downloadTorrent,
    getFileInfo: getFileInfo,
    data: data
  }

  function downloadTorrent (id) {
    // TODO
  }

  function getFileInfo (id) {
    var q = $q.defer()
    if (filesLoading) {
      filesLoading.then(function () {
        q.resolve(_getFromList(id))
      }, function () {
        q.reject()
      })
    } else {
      q.resolve(_getFromList(id))
    }
    return q.promise
  }

  function uploadFile (opts) {
    var uploadPath = 'upload'
    if (opts.filename) {
      opts.file = Upload.rename(opts.file,
        opts.filename + '.' + fileExtension(opts.file.name))
    }
    var deferred = $q.defer()
    var promise = deferred.promise
    Upload.upload({
      url: SERVER_URL + uploadPath,
      method: 'POST',
      file: opts.file,
      data: {
        description: opts.description
      }
    }).success(function (data, status, headers, config) {
      deferred.resolve()
    })
    .error(function (data, status, headers, config) {
      deferred.reject()
    }).progress(function (evt) {
      deferred.progress(parseInt(100.0 * evt.loaded / evt.total, 10))
    })

    promise.progress = function (fn) {
      deferred.progress = fn
    }

    return promise
  }

  function getTorrents () {
    var getPath = 'torrents'
    var deferred = $q.defer()
    filesLoading = $http.get(SERVER_URL + getPath)
    filesLoading.then(function (response) {
      deferred.resolve()
      data.files = response.data
      filesLoading = null
    }, function () {
      deferred.reject()
      filesLoading = null
    })

    return deferred.promise
  }

  function modifyTorrent (id, obj) {

  }

  function deleteTorrent (id) {

  }

  function _getFromList (id) {
    return _.findWhere(data.files, {_id: id})
  }
}
