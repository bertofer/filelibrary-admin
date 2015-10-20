require('ng-file-upload')
var fileExtension = require('file-extension')
var debug = require('debug')('listFiles')
var prettysize = require('prettysize')

module.exports = function (Upload, filesFactory, $scope, $timeout, ngProgressFactory) {
  this.data = filesFactory.data
  $scope.ngprogress = ngProgressFactory.createInstance()
  $scope.ngprogress.setParent(document.getElementById('list-container'))
  $scope.ngprogress.setAbsolute()
  $scope.ngprogress.setColor('#bd2308')
  $timeout(loadFiles())

  function loadFiles () {
    $scope.ngprogress.start()
    filesFactory.getTorrents().then(function () {
      $scope.ngprogress.complete()
      debug('loaded files')
    }, function () {
      $scope.ngprogress.complete()
      debug('error getting files')
    })
  }

  this.getDataType = function (file) {
    return fileExtension(file.name)
  }

  this.getPrettySize = function (size) {
    return prettysize(size)
  }

  // Event handlers
  $scope.$on('reload-files', function () {
    loadFiles()
  })
}
