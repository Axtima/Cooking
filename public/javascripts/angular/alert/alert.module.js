var app = angular.module('cooking.alert', [
    'cooking.auth',
    'ngRoute',
    'cooking.constant'
]);

app.config(['$routeProvider', 'constants', function ($routeProvider, constants) {
        $routeProvider.when('/alert', {
            templateUrl: constants.angularDirectory + 'alert/templates/list.html',
            controller: 'AlertCtrl',
            resolve: {
                alerts: ['$route', 'alertService', function ($route, alertService) {
                        return alertService.getAll();
                    }],
                recipe: function () {
                    return {};
                }
            }
        }).when('/alert/form', {
            templateUrl: constants.angularDirectory + 'alert/templates/form.html',
            controller: 'AlertCtrl',
            resolve: {
                alerts: function () {
                    return [{}];
                },
                recipe: ['$route', 'recipeService', function ($route, recipeService) {
                        return recipeService.get($route.current.params.recipeId);
                    }]
            }
        });
    }]);

app.controller('AlertCtrl', [
    '$scope',
    'alertService',
    'alerts',
    'recipe',
    'authService',
    function ($scope, alertService, alerts, recipe, authService) {

        $scope.alert = {};
        $scope.alerts = alerts;
        $scope.recipe = recipe;
        $scope.isLoggedIn = authService.isLoggedIn;
        $scope.successMsg = null;
        $scope.errorMsg = null;

        $scope.saveAlert = function () {
            $scope.alert.recipe = $scope.recipe._id;
            alertService.create($scope.alert).success(function (alert) {
                $scope.successMsg = 'Merci d\'avoir signalé ce comportement';
                $scope.comment = '';
            });
        };
        
        $scope.changeStatus = function (alert, newStatus) {
            alertService.changeStatus(alert, newStatus).success(function (alertResult) {
                $scope.successMsg = 'Statut modifié';
                alert.status = newStatus;
            });
        };
    }]);