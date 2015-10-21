module.exports = function ($scope, $modalInstance) {
  $scope.modal = {}

  $scope.deleteList = function () {
    $modalInstance.close(false)
  }

  $scope.deleteDisc = function () {
    $modalInstance.close(true)
  }

  $scope.cancel = function () {
    $modalInstance.dismiss('cancel')
  }
}
