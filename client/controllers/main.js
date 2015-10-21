module.exports = function ($state, $scope, $uibModal, filesFactory) {
  /**
   * This functions are to determine if we must show or not some elements
   * that depends on the state of our application
   * The first 2 are workarounds for good design
   * The third one is for the rounded button that we only want to show on File
   * and List
   */

  var fullSizeCSS = 'col-lg-12 col-md-12 col-xs-12'
  var partSizeCSS = 'col-lg-6 col-md-6 hidden-sm hidden-xs partSize1'

  this.getListClasses = function () {
    if ($state.current.name === 'list.file') return partSizeCSS
    else return fullSizeCSS
  }

  this.shouldShowNewButton = function () {
    return $state.current.name === 'list.file' || $state.current.name === 'list'
  }

  // Dialog functions of new File

  this.uploadingFiles = []

  var self = this

  this.openNewFileDialog = function () {
    var modalInstance = $uibModal.open({
      animation: true,
      templateUrl: '../templates/modals/new_file.html',
      controller: require('./modals/new_file')
    })

    modalInstance.result.then(function (obj) {
      var promise = filesFactory.uploadFile(obj)
      var uploadingFile = {
        name: obj.file.name || obj.filename,
        progress: 0
      }
      self.uploadingFiles.push(uploadingFile)
      promise.then(function () {
        self.uploadingFiles.splice(self.uploadingFiles.indexOf(uploadingFile), 1)
        $scope.$broadcast('reload-files')
      }, function () {

      })
      promise.progress(function (progress) {
        uploadingFile.progress = progress
      })
    }, function () {
      console.log('canceled')
    })
  }
}
