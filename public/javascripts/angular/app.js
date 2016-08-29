var app = angular.module('cooking', [
    'ngRoute',
    'cooking.constant',
    'cooking.auth',
    'cooking.recipe',
    'cooking.glossary'
]);
app.config(['$routeProvider', 'constants', function ($routeProvider, constants) {
        // Home
        $routeProvider.when('/home', {
            templateUrl: constants.angularDirectory + 'templates/home.html',
            controller: 'MainCtrl',
            resolve: {
                recipes: ['recipeService', function (recipeService) {
                    return recipeService.getAll();
                }]
            }
        });
        // Recipe
        $routeProvider.when('/recipe/:id', {
            templateUrl: constants.angularDirectory + 'recipe/templates/entry.html',
            controller: 'RecipeCtrl',
            resolve: {
                recipe: ['$route', 'recipeService', function ($route, recipeService) {
                    return recipeService.get($route.current.params.id);
                }],
                glossaries: ['$route', 'glossaryService', function ($route, glossaryService) {
                    return glossaryService.getAll();
                }]
            }
        });
        $routeProvider.when('/recipef', {
            templateUrl: constants.angularDirectory + 'recipe/templates/form.html',
            controller: 'RecipeCtrl',
            resolve: {
                recipe: function() {return {};},
                glossaries: function() {return [{}];}
            }
        });
        $routeProvider.when('/recipef/:id', {
            templateUrl: constants.angularDirectory + 'recipe/templates/form.html',
            controller: 'RecipeCtrl',
            resolve: {
                recipe: ['$route', 'recipeService', function ($route, recipeService) {
                    return recipeService.get($route.current.params.id);
                }],
                glossaries: function() {return [{}];}
            }
        });
        // Glossary
        $routeProvider.when('/glossary', {
            templateUrl: constants.angularDirectory + 'glossary/templates/list.html',
            controller: 'GlossaryCtrl',
            resolve: {
                glossaries: ['$route', 'glossaryService', function ($route, glossaryService) {
                    return glossaryService.getAll();
                }],
                glossary: function() {return {};}
            }
        });
        $routeProvider.when('/glossary/form', {
            templateUrl: constants.angularDirectory + 'glossary/templates/form.html',
            controller: 'GlossaryCtrl',
            resolve: {
                glossaries: function() {return [{}];},
                glossary: function() {return {};}
            }
        });
        $routeProvider.when('/glossary/form/:id', {
            templateUrl: constants.angularDirectory + 'glossary/templates/form.html',
            controller: 'GlossaryCtrl',
            resolve: {
                glossaries: function() {return [{}];},
                glossary: ['$route', 'glossaryService', function ($route, glossaryService) {
                    return glossaryService.get($route.current.params.id);
                }]
            }
        });
        // Default
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



