var app = angular.module('cooking.recipe', [
    'cooking.auth',
    'ngRoute',
    'cooking.constant'
]);

app.controller('RecipeCtrl', [
    '$scope',
    'recipes',
    'recipe',
    'auth',
    function ($scope, recipes, recipe, auth) {
        $scope.recipe = recipe;
        $scope.isLoggedIn = auth.isLoggedIn;
        $scope.addComment = function () {
            if ($scope.body === '') {
                return;
            }
            recipes.addComment(recipe._id, {
                body: $scope.body,
                author: 'user',
            }).success(function (comment) {
                $scope.recipe.comments.push(comment);
            });
            $scope.body = '';
        };
    }]);