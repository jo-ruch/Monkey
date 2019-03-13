app.controller('MainCtrl', ['$scope', "$http", "$location", "$window", function ($scope, $http, $location, $window) {

    $scope.key = "";
    $scope.model = {};
    $scope.success = false;
    $scope.validKey = true;
    $scope.existingKey = true;
    $scope.savedKeys = [];

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
            $scope.model = res.data;
            $scope.key = $scope.model._id;
            $scope.success = true;
        });
    };

    $scope.editModel = function (key) {
        $location.path('editor/' + key);
    };

    $scope.getSavedKeys = function () {
        return JSON.parse($window.localStorage.getItem("keys"));
    };

    $scope.storeKeys = function (keys) {
        $window.localStorage.setItem("keys", JSON.stringify(keys));
    };

    $scope.saveKey = function () {
        let name = prompt("Name for your key");
        if (!name) {
            return;
        }
        let keys = $scope.getSavedKeys();
        if (!keys) {
            keys = [];
        }
        keys.push({name:name, key:$scope.key});
        $scope.savedKeys = keys; // Update view
        $scope.storeKeys(keys);
    };

    $scope.removeSavedKey = function (offset) {
        let keys = $scope.getSavedKeys();
        keys.splice(offset, 1);
        $scope.savedKeys = keys; // Update view
        $scope.storeKeys(keys);
    };

    $scope.savedKeys = $scope.getSavedKeys(); // Init saved keys list

}]);
