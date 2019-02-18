app.controller("EditorCtrl", ["$scope", "$http", "$routeParams", function ($scope, $http, $routeParams) {
    $scope.key = "";
    $scope.monkyKey = {};
    $scope.activeModel = {};
    $scope.preview = {};

    $scope.types = {};
    $scope.types.available = ['id', 'string', 'image'];

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

    $scope.newModel = function () {
        let modelName = window.prompt("Name for your new model");
        if (modelName) {
            let model = {
                name: modelName,
                content: []
            };
            $scope.monkyKey.profiles.push(model);
            $scope.activeModel = model;

            $http.post("api/" + $scope.key + "/models", {name: modelName}).then(function (res) {

            });
        }
    };

    $scope.editModel = function (model) {
        $scope.activeModel = model;
        $scope.loadPreview($scope.key, model.name);
    };

    $scope.addField = function (model) {
        // $http.post('api/' $scope.key + "/" + model.name, )
        console.log(model);
        model.content.push({name: "Item", type: "string"});
    };

    $scope.updateModel = function (model) {
        $http.post("api/" + $scope.key + "/" + model.name, model.content).then(function () {
            $scope.loadPreview($scope.key, model.name);
        });
    };

    $scope.loadPreview = function (key, model) {
        $http.get("api/" + key + "/" + model + "/0").then(function (res) {
            console.log(JSON.stringify(res.data));
            $scope.preview = res.data;
        });
    }

}]);
