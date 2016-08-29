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
        // Transform terms to string
        if(glossary && glossary.terms) {
            glossary.terms = glossary.terms.toString();
        }
        $scope.successMsg = null;
        $scope.errorMsg = null;
        $scope.glossary = glossary;
        $scope.glossaries = glossaries;
        $scope.isLoggedIn = authService.isLoggedIn;
        $scope.saveGlossary = function () {
            if(!$scope.glossary._id) {
                glossaryService.create({
                    title: $scope.glossary.title,
                    terms: $scope.glossary.terms.split(','),
                    definition: $scope.glossary.definition
                }).success(function (glossary) {
                    $scope.successMsg = 'Définition ajoutée avec succès';
                    $scope.title = '';
                    $scope.term = '';
                    $scope.definition = [];
                });
            } else {
                glossaryService.update({
                    _id: $scope.glossary._id,
                    title: $scope.glossary.title,
                    terms: $scope.glossary.terms.split(','),
                    definition: $scope.glossary.definition
                }).success(function (glossary) {
                    $scope.successMsg = 'Définition modifiée avec succès';
                });
            }
        };
        $scope.remove = function (glossary) {
            glossaryService.delete(glossary._id).success(
                function (res) {
                    $scope.glossaries = $scope.glossaries.filter(function(el) {
                        return el._id !== glossary._id;
                    });
                    $scope.successMsg = 'Définition supprimée avec succès';
                }
            );
        };
    }]);