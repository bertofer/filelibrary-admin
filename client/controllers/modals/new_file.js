module.exports = function ($scope, $modalInstance) {
  $scope.modal = {}

  $scope.ok = function () {
    if ($scope.modal.file) $modalInstance.close($scope.modal)
  }

  $scope.cancel = function () {
    $modalInstance.dismiss('cancel')
  }
}
