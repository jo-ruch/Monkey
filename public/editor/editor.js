app.controller("EditorCtrl", ["$scope", "$http", "$routeParams", function ($scope, $http, $routeParams) {
    $scope.key = "";
    $scope.monkyKey = {};
    $scope.activeModel = {};
    $scope.preview = {};

    $scope.types = {
        id: {
            meta: [{name: "start", default: 0}]
        },
        boolean: {
            meta: [{name:'rate', default:0.5}]
        },
        static: {
            meta: [{name: 'content', default: ''}]
        },
        string: {
            meta: [{name: "min", default: 1}, {name: 'max', default: 10}]
        },
        image: {
            meta: [{name: "height", default: 800}, {name: 'width', default: 600}]
        },

        number: {
            meta: [{name: 'start', default: 0}, {name: 'end', default: 100}, {name: 'decimals', default: 2}]
        },

        name: {
            meta: []
        },

        city: {
            meta: []
        },
        object: {
            meta: [{name: "name", default: ""}]
        },
        array: {
            meta: [{name: 'type', default: 'string'}, {name: 'length', default: 10}]
        }
    };

    $scope.loadKey = function (key) {
        $http.get("keys/" + key).then(function (res) {
            $scope.monkyKey = res.data;
            $scope.key = $scope.monkyKey._id;
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
        model.content.push({name: "Item", type: "string", meta: []}); // Meta filled in by angular
    };

    $scope.updateModel = function (model) {
        // Post new model and update view
        $http.post("api/" + $scope.key + "/" + model.name, model.content).then(function () {
            $scope.loadPreview($scope.key, model.name);
        });
    };

    $scope.loadPreview = function (key, model) {
        $http.get("api/" + key + "/" + model + "/0").then(function (res) {
            $scope.preview = res.data; // Update preview
        });
    };

    $scope.findMetaByName = function (meta, name) {
        return meta.find(function (elem) {
            return elem.name === name;
        });
    };

    $scope.changeType = function (field) {
        field.meta = cleanMeta(field.type, field.meta); // Clean unused meta elements
    };

    function initMeta(type, meta) {
        // Initialize missing meta fields
        $scope.types[type].meta.forEach(function (_meta) {
            if (!$scope.findMetaByName(meta, _meta.name)) { // If element does not exist yet
                meta.push({name: _meta.name, value: _meta.default}); // Initialize default item
            }
        });
    }

    function cleanMeta(type, meta) {
        let res = [];
        let source = $scope.types[type].meta;

        // Copy over elements that belong to this type
        for (let i = 0; i < source.length; i++) {

            let elem = meta.find(function (_elem) {
                return _elem.name === source[i].name;
            });

            if (elem) {
                res.push(elem);
            }
        }
        return res;
    }

    $scope.getFieldMeta = function (field) {

        // Initialize missing meta fields
        initMeta(field.type, field.meta);

        // Append array meta
        if (field.type === "array") {
            initMeta($scope.findMetaByName(field.meta, 'type').value, field.meta);
        }
        return field.meta;
    }

}]);
