app.controller("EditorCtrl", ["$scope", "$http", "$routeParams", function ($scope, $http, $routeParams) {
    $scope.key = "";
    $scope.monkyKey = {};
    $scope.activeModel = {};
    $scope.preview = {};

    $scope.types = {
        id: {
            meta: [{name: "start", default: 0}]
        },
        string: {
            meta: [{name: "words", default: 10}]
        },
        image: {
            meta: [{name: "height", default: 800}, {name: 'width', default: 600}]
        }
    };
    // $scope.types.available = ['id', 'string', 'image'];
    // $scope.types.meta = {}

    $scope.loadKey = function (key) {
        $http.get("keys/" + key).then(function (res) {
            $scope.monkyKey = res.data;
            $scope.key = $scope.monkyKey._id;

            // console.log($scope.monkyKey);
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
        model.content.push({name: "Item", type: "string", meta:[]});
    };

    $scope.updateModel = function (model) {
        $http.post("api/" + $scope.key + "/" + model.name, model.content).then(function () {
            $scope.loadPreview($scope.key, model.name);
        });
    };

    $scope.loadPreview = function (key, model) {
        $http.get("api/" + key + "/" + model + "/0").then(function (res) {
            $scope.preview = res.data;
        });
    };

    $scope.findMetaByName = function (meta, name) {
        return meta.find(function (elem) {
            return elem.name === name;
        });
    };

    $scope.getMeta = function (field, name) {

        let target = $scope.findMetaByName(field.meta, name);

        if (target === undefined) {
            target = {
                name: name,
                value: $scope.findMetaByName($scope.types[field.type].meta, name).default
            };
            field.meta.push(target);
        }

        return target;
    };

}]);
