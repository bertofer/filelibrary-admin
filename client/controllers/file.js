module.exports = function ($stateParams, filesFactory, $scope, $state, $uibModal,
  $rootScope) {
  var self = this
  self._id = $stateParams.id

  filesFactory.getFileInfo(this._id).then(function (file) {
    if (file) self.file = file
    else $state.go('list')
  })

  self.saveChanges = function () {
    $scope.editDescription = false
  }

  self.downloadTorrent = function () {
    filesFactory.downloadTorrent(self._id)
  }

  this.delete = function () {
    var modalInstance = $uibModal.open({
      animation: true,
      templateUrl: '../templates/modals/delete_file.html',
      controller: require('./modals/delete_file'),
      size: 'sm'
    })

    modalInstance.result.then(function (deleteFromDisc) {
      // If true, we delete the file also from the disc
      filesFactory.deleteTorrent(self._id, deleteFromDisc).then(function (data) {
        $rootScope.$broadcast('reload-files')
        $state.go('list')
      })
    })
  }
}
