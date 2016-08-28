var app = angular.module('cooking.glossary', [
    'cooking.auth',
    'ngRoute',
    'cooking.constant'
]);

app.controller('GlossaryCtrl', [
    '$scope',
    'glossaryService',
    'glossary',
    'glossaries',
    'authService',
    function ($scope, glossaryService, glossary, glossaries, authService) {
        $scope.successMsg = null;
        $scope.errorMsg = null;
        $scope.glossary = glossary;
        $scope.glossaries = glossaries;
        $scope.isLoggedIn = authService.isLoggedIn;
        $scope.addGlossary = function () {
            glossaryService.create({
                terms: [$scope.glossary.term],
                definition: $scope.glossary.definition
            }).success(function (glossary) {
                $scope.successMsg = 'Définition ajoutée avec succès';
                $scope.term = '';
                $scope.definition = [];
            });
        };
        $scope.remove = function (step) {
            $scope.recipe.steps.splice(step.order - 1, 1);
            var i = 0;
            $scope.recipe.steps.forEach(function (step) {
                i++;
                step.order = i;
            });
        };
    }]);