var app = angular.module('cooking.recipe', [
    'cooking.auth',
    'cooking.glossary',
    'ngRoute',
    'cooking.constant',
    'ngFileUpload',
    'ngAnimate',
    'cooking.modal'
]);

app.controller('RecipeCtrl', [
    '$scope',
    'recipeService',
    'recipe',
    'glossaries',
    'authService',
    'Upload',
    '$timeout',
    '$sce',
    function ($scope, recipeService, recipe, glossaries, authService, Upload, $timeout, $sce) {
        $scope.successMsg = null;
        $scope.errorMsg = null;
        $scope.recipe = recipe;
        $scope.isLoggedIn = authService.isLoggedIn;
        /**
         * Upload d'un fichier
         */
        $scope.uploadFile = function (recipeId, stepOrder, file) {
            var url = '/rest/recipe/upload/' + recipeId;
            if (stepOrder) {
                url = url + '/step/' + stepOrder;
            }
            Upload.upload({
                url: url,
                data: {
                    file: file
                }
            }).then(function (resp) {
                if (resp.data.error_code === 0) {
                    $scope.successMsg = file.name + ' transféré avec succès';
                } else {
                    $scope.errorMsg = "Erreur lors de l'envoi du fichier " + file.filename;
                }
            }, function (resp) {
                $scope.errorMsg = "Erreur lors de l'envoi du fichier " + file.filename;
            }, function (evt) {
                var progressPercentage = parseInt(100.0 * evt.loaded / evt.total);
                file.progress = progressPercentage;
            });
        },
        /**
         * Get html of step description with glossary tooltips
         */
        $scope.displayDescription = function (step) {
            var description = step.description;
            glossaries.forEach(function (glossary) {
                glossary.terms.forEach(function (term) {
                    var index = description.search(term);
                    if (index >= 0) {
                        var text = description.slice(0, index) +
                                '<div class="tooltip">' +
                                description.slice(index, index + term.length) +
                                '<span class="tooltiptext">' +
                                glossary.definition +
                                '</span>' +
                                '</div>' +
                                description.slice(index + term.length);
                        description = text;
                    }
                });
            });
            var res = $sce.trustAsHtml(description);
            return res;
        },
        /**
         * Add a recipe
         */
        $scope.addRecipe = function () {
            recipeService.create({
                title: $scope.recipe.title,
                steps: $scope.recipe.steps,
                ingredients: $scope.recipe.ingredients
            }).success(function (recipe) {
                var nbFiles = 0;
                if ($scope.recipe.file) {
                    nbFiles++;
                    $scope.uploadFile(recipe._id, null, $scope.recipe.file);
                }
                if ($scope.recipe.steps) {
                    $scope.recipe.steps.forEach(function (step) {
                        if (step.file) {
                            nbFiles++;
                            $scope.uploadFile(recipe._id, step.order, step.file);
                        }
                    });
                }
                if (nbFiles === 0) {
                    $scope.successMsg = 'Recette créée avec succès';
                } else {
                    $scope.successMsg = 'Envoi des images ...';
                }
                $scope.title = '';
                $scope.steps = [];
            });
        };
        /**
         * Add a ingredient
         */
        $scope.addIngredient = function () {
            if (!$scope.recipe.ingredients) {
                $scope.recipe.ingredients = [];
            }
            $scope.recipe.ingredients.push({
                order: $scope.recipe.ingredients.length + 1,
                name: ''
            });
        };
        /**
         * Move down a ingredient
         */
        $scope.ingredientDown = function (ingredient) {
            if (ingredient.order < $scope.recipe.ingredients.length) {
                var ingredientReplaced = $scope.recipe.ingredients[ingredient.order];
                ingredientReplaced.movingUp = true;
                ingredient.movingDown = true;

                $timeout(function () {
                    ingredientReplaced.movingUp = false;
                    ingredient.movingDown = false;

                    ingredientReplaced.order = ingredient.order;
                    ingredient.order = ingredient.order + 1;

                    // Echange des places dans la liste
                    $scope.recipe.ingredients[ingredient.order - 1] = ingredient;
                    $scope.recipe.ingredients[ingredientReplaced.order - 1] = ingredientReplaced;
                }, 2000);
            }
        };
        /**
         * Move up a ingredient
         */
        $scope.ingredientUp = function (ingredient) {
            if ((ingredient.order - 2) >= 0) {
                var ingredientReplaced = $scope.recipe.ingredients[ingredient.order - 2];
                ingredient.movingUp = true;
                ingredientReplaced.movingDown = true;
                $timeout(function () {
                    ingredient.movingUp = false;
                    ingredientReplaced.movingDown = false;

                    ingredientReplaced.order = ingredient.order;
                    ingredient.order = ingredient.order - 1;

                    // Echange des places dans la liste
                    $scope.recipe.ingredients[ingredient.order - 1] = ingredient;
                    $scope.recipe.ingredients[ingredientReplaced.order - 1] = ingredientReplaced;
                }, 2000);
            }
        };
        /**
         * Remove a ingredient
         */
        $scope.removeIngredient = function (ingredient) {
            $scope.recipe.ingredients.splice(ingredient.order - 1, 1);
            var i = 0;
            $scope.recipe.ingredients.forEach(function (ingredient) {
                i++;
                ingredient.order = i;
            });
        };
        /**
         * Add a step
         */
        $scope.addStep = function () {
            if (!$scope.recipe.steps) {
                $scope.recipe.steps = [];
            }
            $scope.recipe.steps.push({
                order: $scope.recipe.steps.length + 1,
                description: ''
            });
        };
        /**
         * Move down a step
         */
        $scope.stepDown = function (step) {
            if (step.order < $scope.recipe.steps.length) {
                var stepReplaced = $scope.recipe.steps[step.order];
                stepReplaced.movingUp = true;
                step.movingDown = true;

                $timeout(function () {
                    stepReplaced.movingUp = false;
                    step.movingDown = false;

                    stepReplaced.order = step.order;
                    step.order = step.order + 1;

                    // Echange des places dans la liste
                    $scope.recipe.steps[step.order - 1] = step;
                    $scope.recipe.steps[stepReplaced.order - 1] = stepReplaced;
                }, 2000);
            }
        };
        /**
         * Move up a step
         */
        $scope.stepUp = function (step) {
            if ((step.order - 2) >= 0) {
                var stepReplaced = $scope.recipe.steps[step.order - 2];
                step.movingUp = true;
                stepReplaced.movingDown = true;
                $timeout(function () {
                    step.movingUp = false;
                    stepReplaced.movingDown = false;

                    stepReplaced.order = step.order;
                    step.order = step.order - 1;

                    // Echange des places dans la liste
                    $scope.recipe.steps[step.order - 1] = step;
                    $scope.recipe.steps[stepReplaced.order - 1] = stepReplaced;
                }, 2000);
            }
        };
        /**
         * Remove a step
         */
        $scope.removeStep = function (step) {
            $scope.recipe.steps.splice(step.order - 1, 1);
            var i = 0;
            $scope.recipe.steps.forEach(function (step) {
                i++;
                step.order = i;
            });
        };
        /**
         * Upload a picture
         */
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
    }]);