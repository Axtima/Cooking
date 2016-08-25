var app = angular.module('cooking.recipe', [
    'cooking.auth',
    'ngRoute',
    'cooking.constant',
    'angularFileUpload'
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
        $scope.addRecipe = function () {
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
            $scope.recipe.steps.forEach(function(step) {
                i++;
                step.order = i;
            });
        };
        $scope.onFileSelect = function (step, file) {
            $scope.uploadInProgress = true;
            $scope.uploadProgress = 0;

            if (angular.isArray(image)) {
                image = image[0];
            }

            $scope.upload = $upload.upload({
                url: '/rest/file',
                method: 'POST',
                data: {
                    step: step
                },
                file: image
            }).progress(function (event) {
                $scope.uploadProgress = Math.floor(event.loaded / event.total);
                $scope.$apply();
            }).success(function (data, status, headers, config) {
                AlertService.success('Photo uploaded!');
            }).error(function (err) {
                $scope.uploadInProgress = false;
                AlertService.error('Error uploading file: ' + err.message || err);
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