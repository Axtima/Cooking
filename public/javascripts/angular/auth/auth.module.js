var app = angular.module('cooking.auth', [
    'ngRoute',
    'cooking.constant'
]);

app.config(['$routeProvider', 'constants', function ($routeProvider, constants) {
        $routeProvider.when('/login', {
            templateUrl: constants.angularDirectory + '/auth/templates/login.html',
            controller: 'AuthCtrl'
        }).when('/register', {
            templateUrl: constants.angularDirectory + '/auth/templates/register.html',
            controller: 'AuthCtrl'
        });
    }]);

app.controller('AuthCtrl', [
    '$scope',
    '$location',
    'auth',
    function ($scope, $location, auth) {
        $scope.user = {};

        $scope.register = function () {
            auth.register($scope.user).error(function (error) {
                $scope.error = error;
            }).then(function () {
                $location.path('/home');
            });
        };

        $scope.logIn = function () {
            auth.logIn($scope.user).error(function (error) {
                $scope.error = error;
            }).then(function () {
                $location.path('/home');
            });
        };
    }]);