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
                recipePromise: ['recipes', function (recipes) {
                        return recipes.getAll();
                    }]
            }*/
        }).otherwise({
            redirectTo: '/home'
        });
    }]);

app.controller('MainCtrl', [
    '$scope',
    'auth',
    function ($scope, auth) {
        $scope.isLoggedIn = auth.isLoggedIn;
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
    'auth',
    function ($scope, auth) {
        $scope.isLoggedIn = auth.isLoggedIn;
        $scope.currentUser = auth.currentUser;
        $scope.logOut = auth.logOut;
    }]);



