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
        
        $scope.forgotPassword = function () {
            authService.forgotPassword({
                email: $scope.email
            }).error(function (error) {
                $scope.error = error;
            }).then(function () {
                $scope.success = "Un email avec lien de réinitialisation du mot de passe vous a été envoyé";
            });
        };
        
        $scope.resetPassword = function () {
            authService.resetPassword({
                email: $scope.user.email,
                password: $scope.password,
                password2: $scope.password2
            }).error(function (error) {
                $scope.error = error;
            }).then(function () {
                $scope.success = "Votre mot de passe a été modifié avec succès";
            });
        };
    }]);