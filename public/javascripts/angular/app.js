var app = angular.module('cooking', [
    'ngRoute',
    'cooking.constant',
    'cooking.auth',
    'cooking.recipe',
    'cooking.user',
    'cooking.glossary'
]);
app.config(['$routeProvider', 'constants', function ($routeProvider, constants) {
        
        /************* FRONT ************/
        
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
        
        /************* ADMINISTRATION ************/
        
        // Admin
        $routeProvider.when('/admin', {
            templateUrl: constants.angularDirectory + '/templates/admin.html',
            controller: 'MainCtrl'
        });
        // Recipe
        $routeProvider.when('/recipe', {
            templateUrl: constants.angularDirectory + 'recipe/templates/list.html',
            controller: 'RecipeCtrl',
            resolve: {
                recipe: ['$route', 'recipeService', function ($route, recipeService) {
                    return recipeService.getAll();
                }]
            }
        });
        $routeProvider.when('/recipe/form', {
            templateUrl: constants.angularDirectory + 'recipe/templates/form.html',
            controller: 'RecipeCtrl',
            resolve: {
                recipe: function() {return {};},
                glossaries: function() {return [{}];}
            }
        });
        $routeProvider.when('/recipe/form/:id', {
            templateUrl: constants.angularDirectory + 'recipe/templates/form.html',
            controller: 'RecipeCtrl',
            resolve: {
                recipe: ['$route', 'recipeService', function ($route, recipeService) {
                    return recipeService.get($route.current.params.id);
                }],
                glossaries: function() {return [{}];}
            }
        });
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
        // User
        $routeProvider.when('/user', {
            templateUrl: constants.angularDirectory + 'user/templates/list.html',
            controller: 'UserCtrl',
            resolve: {
                users: ['$route', 'userService', function ($route, userService) {
                    return userService.getAll();
                }],
                user: function() {return {};}
            }
        });
        $routeProvider.when('/user/form', {
            templateUrl: constants.angularDirectory + 'user/templates/form.html',
            controller: 'UserCtrl',
            resolve: {
                users: function() {return [{}];},
                user: function() {return {};}
            }
        });
        $routeProvider.when('/user/form/:id', {
            templateUrl: constants.angularDirectory + 'user/templates/form.html',
            controller: 'UserCtrl',
            resolve: {
                users: function() {return [{}];},
                user: ['$route', 'userService', function ($route, userService) {
                    return userService.get($route.current.params.id);
                }]
            }
        });
        $routeProvider.when('/user/formPassword/:id', {
            templateUrl: constants.angularDirectory + 'user/templates/formPassword.html',
            controller: 'UserCtrl',
            resolve: {
                users: function() {return [{}];},
                user: ['$route', 'userService', function ($route, userService) {
                    return userService.get($route.current.params.id);
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
    '$location',
    'authService',
    'recipes',
    function ($scope, $location, authService, recipes) {
        $scope.isLoggedIn = authService.isLoggedIn;
        $scope.recipes = recipes;
        $scope.addRecipe = function() {
            $location.path('/recipe/form');
        }
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



