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
        }).when('/forgot', {
            templateUrl: constants.angularDirectory + '/auth/templates/forgot.html',
            controller: 'AuthCtrl'
        }).when('/reset/:token', {
            templateUrl: constants.angularDirectory + '/auth/templates/reset.html',
            controller: 'AuthCtrl'
        });
    }]);

app.controller('AuthCtrl', [
    '$scope',
    '$location',
    '$route',
    'authService',
    function ($scope, $location, $route, authService) {
        $scope.user = {};
        $scope.resetToken = $route.current.params.token;
        
        if ($scope.resetToken) {
            authService.loadResetToken($scope.resetToken).error(function (error) {
                $scope.error = error;
            }).then(function (user) {
                $scope.user = user.data;
            });
        }
        
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
                $scope.success = {message: "Un email avec lien de réinitialisation du mot de passe vous a été envoyé"};
            });
        };
        
        $scope.resetPassword = function () {
            authService.resetPassword({
                email: $scope.user.email,
                password: $scope.user.password,
                password2: $scope.user.password2
            }, $scope.resetToken).error(function (error) {
                $scope.error = error;
            }).then(function () {
                $scope.success = {message: "Votre mot de passe a été modifié avec succès"};
            });
        };
    }]);