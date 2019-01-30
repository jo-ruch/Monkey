app.controller("EditorCtrl", ["$scope", "$http", "$routeParams", function ($scope, $http, $routeParams) {
    $scope.key = "";
    $scope.monkyKey = {};
    $scope.activeModel = {};
    $scope.preview = {};

    $scope.loadKey = function (key) {
        $http.get("keys/" + key).then(function (res) {
            $scope.monkyKey = res.data;
            $scope.key = $scope.monkyKey._id;

            console.log($scope.monkyKey);
        }).catch(function (err) {
            $scope.key = "Not a valid key";
        });
    };

    if ($routeParams.key) {
        $scope.loadKey($routeParams.key);
    }

    $scope.editModel = function (model) {
        $scope.activeModel = model;
        $scope.loadPreview($scope.key, model.name);
    };

    $scope.loadPreview = function (key, model) {
        $http.get("api/" + key + "/" + model).then(function(res) {
            console.log(JSON.stringify(res.data));
            // $scope.preview = JSON.stringify(res.data, null, "  ");
            $scope.preview = res.data;
        });
    }

}]);