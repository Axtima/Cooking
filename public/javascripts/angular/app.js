var app = angular.module('cooking', [
    'ngRoute',
    'cooking.constant',
    'cooking.auth',
    'cooking.recipe'
]);
app.config(['$routeProvider', 'constants', function ($routeProvider, constants) {
        $routeProvider.when('/home', {
            templateUrl: constants.angularDirectory + '/templates/home.html',
            controller: 'MainCtrl',
            resolve: {
                recipes: ['recipeService', function (recipeService) {
                    return recipeService.getAll();
                }]
            }
        });
        $routeProvider.when('/recipe/form', {
            templateUrl: constants.angularDirectory + '/recipe/templates/form.html',
            controller: 'RecipeCtrl',
            resolve: {
                recipe: function() {return {};}
            }
        });
        $routeProvider.when('/recipe/form/{id}', {
            templateUrl: constants.angularDirectory + '/recipe/templates/form.html',
            controller: 'RecipeCtrl',
            resolve: {
                recipe: ['$routeParams', 'recipeService', function ($routeParams, recipeService) {
                    return recipeService.get($routeParams.id);
                }]
            }
        });
        $routeProvider.otherwise({
            redirectTo: '/home'
        });
    }]);

app.controller('MainCtrl', [
    '$scope',
    'authService',
    'recipes',
    function ($scope, authService, recipes) {
        $scope.isLoggedIn = authService.isLoggedIn;
        $scope.recipes = recipes;
    }

]);

app.controller('NavCtrl', [
    '$scope',
    'authService',
    function ($scope, authService) {
        $scope.isLoggedIn = authService.isLoggedIn;
        $scope.currentUser = authService.currentUser;
        $scope.logOut = authService.logOut;
    }]);



