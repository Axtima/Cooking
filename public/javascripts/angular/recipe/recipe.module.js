var app = angular.module('cooking.recipe', [
    'cooking.auth',
    'ngRoute',
    'cooking.constant',
    'ngFileUpload',
    'ngAnimate'
]);

app.controller('RecipeCtrl', [
    '$scope',
    'recipeService',
    'recipe',
    'authService',
    'Upload',
    function ($scope, recipeService, recipe, authService, Upload) {
        $scope.successMsg = null;
        $scope.errorMsg = null;
        $scope.recipe = recipe;
        $scope.isLoggedIn = authService.isLoggedIn;
        $scope.addRecipe = function () {
            debugger;
            recipeService.create({
                title: $scope.recipe.title,
                steps: $scope.recipe.steps
            }).success(function (recipe) {
                $scope.successMsg = 'Recette créée avec succès';
                $scope.title = '';
                $scope.steps = [];
            });
        };
        $scope.addStep = function () {
            if (!$scope.recipe.steps) {
                $scope.recipe.steps = [];
            }
            $scope.recipe.steps.push({
                order: $scope.recipe.steps.length + 1,
                description: ''
            });
        };
        $scope.stepDown = function (step) {
            if (step.order < $scope.recipe.steps.length) {
                var stepReplaced = $scope.recipe.steps[step.order];
                stepReplaced.order = step.order;
                step.order = step.order + 1;

                // Echange des places dans la liste
                $scope.recipe.steps[step.order - 1] = step;
                $scope.recipe.steps[stepReplaced.order - 1] = stepReplaced;
            }
        };
        $scope.stepUp = function (step) {
            if ((step.order - 2) >= 0) {
                var stepReplaced = $scope.recipe.steps[step.order - 2];
                stepReplaced.order = step.order;
                step.order = step.order - 1;

                // Echange des places dans la liste
                $scope.recipe.steps[step.order - 1] = step;
                $scope.recipe.steps[stepReplaced.order - 1] = stepReplaced;
            }
        };
        $scope.remove = function (step) {
            $scope.recipe.steps.splice(step.order - 1, 1);
            var i = 0;
            $scope.recipe.steps.forEach(function (step) {
                i++;
                step.order = i;
            });
        };
        $scope.upload = function (file) {
            if ($scope.form.file.$valid && $scope.file) {
                var file = $scope.file;
                Upload.upload({
                    url: 'upload/url',
                    data: {file: file, 'username': $scope.username}
                }).then(function (resp) {
                    console.log('Success ' + resp.config.data.file.name + 'uploaded. Response: ' + resp.data);
                }, function (resp) {
                    console.log('Error status: ' + resp.status);
                }, function (evt) {
                    var progressPercentage = parseInt(100.0 * evt.loaded / evt.total);
                    console.log('progress: ' + progressPercentage + '% ' + evt.config.data.file.name);
                });
            }
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