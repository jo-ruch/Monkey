app.controller('MainCtrl', ['$scope', "$http", "$location", function ($scope, $http, $location) {

    $scope.key = "";
    $scope.model = {};
    $scope.success = false;
    $scope.validKey = true;
    $scope.existingKey = true;

    $scope.$watch("key", function (newKey) {
        if (newKey !== "") {
            $scope.validKey = $scope.existingKey = $scope.isValidKey(newKey);

            if ($scope.validKey) {
                $http.get("keys/" + newKey).then(res => {
                    $scope.existingKey = true;
                    $scope.model = res.data;
                }).catch(err => {
                    $scope.existingKey = false;
                });
            }
        }
    });

    $scope.isValidKey = function (key) {
        let exp = /^[0-9a-fA-F]{24}$/;
        return key.match(exp);
    };

    $scope.createMonky = function () {
        $http.get("keys/generate").then(function (res) {
            // console.log(res.data);
            $scope.model = res.data;
            $scope.key = $scope.model._id;

            $scope.success = true;
        });
    };

    $scope.editModel = function () {
        console.log($scope.key);
        $location.path('editor/' + $scope.key);
    };
}]);
