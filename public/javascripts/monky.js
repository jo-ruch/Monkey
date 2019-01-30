let app = angular.module('monky', ['ngRoute']);

app.config(function($routeProvider) {
   $routeProvider.when("/", {
       templateUrl : 'home/main.html',
       controller : "MainCtrl"
   }).when('/editor/:key', {
       templateUrl : 'editor/editor.html',
       controller : "EditorCtrl"
   }).when('/editor/', {
       templateUrl : 'editor/editor.html',
       controller : "EditorCtrl"
   });
});