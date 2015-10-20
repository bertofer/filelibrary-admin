module.exports = function ($stateParams, filesFactory, $scope, $state) {
  var self = this
  self._id = $stateParams.id

  filesFactory.getFileInfo(this._id).then(function (file) {
    if (file) self.file = file
    else $state.go('list')
  })

  self.saveChanges = function () {
    $scope.editDescription = false
  }
}
