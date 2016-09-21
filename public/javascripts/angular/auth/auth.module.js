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
    'authService',
    function ($scope, $location, authService) {
        $scope.user = {};

        $scope.register = function () {
            authService.register($scope.user).error(function (error) {
                $scope.error = error;
            }).then(function () {
                $location.path('/home');
            });
        };

        $scope.logIn = function () {
            authService.logIn({
                username: $scope.user.email,
                password: $scope.user.password
            }).error(function (error) {
                $scope.error = error;
            }).then(function () {
                $location.path('/home');
            });
        };
    }]);