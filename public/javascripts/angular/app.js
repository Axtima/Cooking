var app = angular.module('cooking', [
    'ngRoute',
    'cooking.constant',
    'cooking.auth',
    'cooking.recipe'
]);
app.config(['$routeProvider', 'constants', function ($routeProvider, constants) {
        $routeProvider.when('/home', {
            templateUrl: constants.angularDirectory + '/templates/home.html',
            controller: 'MainCtrl'/*,
            resolve: {
                recipePromise: ['recipeService', function (recipeService) {
                        return recipeService.getAll();
                    }]
            }*/
        }).otherwise({
            redirectTo: '/home'
        });
    }]);

app.controller('MainCtrl', [
    '$scope',
    'authService',
    function ($scope, authService) {
        $scope.isLoggedIn = authService.isLoggedIn;
        /*$scope.addPost = function () {
            if (!$scope.title || $scope.title === '') {
                return;
            }
            posts.create({
                title: $scope.title,
                link: $scope.link,
            });
            $scope.title = '';
            $scope.link = '';
        };*/
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



