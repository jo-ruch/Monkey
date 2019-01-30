app.controller('MainCtrl', ['$scope', "$http", "$location", function ($scope, $http, $location) {

    $scope.key = "";
    $scope.model = {};
    $scope.success = false;

    $scope.createMonky = function () {
        $http.get("keys/generate").then(function (res) {
            console.log(res.data);
            $scope.model = res.data;
            $scope.key = $scope.model._id;

            $scope.success = true;
        });
    };

    $scope.editModel = function() {
        console.log($scope.key);
        $location.path('editor/'+$scope.key);
    };
}]);