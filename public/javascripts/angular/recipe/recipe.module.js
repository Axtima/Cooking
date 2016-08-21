var app = angular.module('cooking.recipe', [
    'cooking.auth',
    'ngRoute',
    'cooking.constant'
]);

app.controller('RecipeCtrl', [
    '$scope',
    'recipeService',
    'recipe',
    'authService',
    function ($scope, recipeService, recipe, authService) {
        $scope.recipe = recipe;
        $scope.isLoggedIn = authService.isLoggedIn;
        $scope.addComment = function () {
            if ($scope.body === '') {
                return;
            }
            recipeService.addComment(recipe._id, {
                body: $scope.body,
                author: 'user',
            }).success(function (comment) {
                $scope.recipe.comments.push(comment);
            });
            $scope.body = '';
        };
    }]);