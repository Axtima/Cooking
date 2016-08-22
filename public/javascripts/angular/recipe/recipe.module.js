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
        $scope.successMsg = null;
        $scope.errorMsg = null;
        $scope.recipe = recipe;
        $scope.isLoggedIn = authService.isLoggedIn;
        $scope.addRecipe = function() {
            recipeService.create({
                title: $scope.recipe.title,
                steps: $scope.recipe.steps
            }).success(function (recipe) {
                $scope.successMsg = 'Recette créée avec succès';
                $scope.title = '';
                $scope.steps = [];
            });
        };
        $scope.addStep = function() {
            if (!$scope.recipe.steps) {
                $scope.recipe.steps = [];
            }
            $scope.recipe.steps.push({
                order: $scope.recipe.steps.length + 1,
                description: ''
            });
        };
        /*$scope.addComment = function () {
            if ($scope.body === '') {
                return;
            }
            recipeService.addComment(recipe._id, {
                body: $scope.body,
                author: 'user',
            }).success
            if (!$scope.recipe.steps) {
                $scope.recipe.steps = [];
            }
            $scope.recipe.steps.push({
                order: $scope.recipe.steps.length + 1,
                description: ''
            });
        }
        /*$scope.addComment = function () {
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
        };*/
    }]);