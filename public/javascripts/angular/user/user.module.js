var app = angular.module('cooking.user', [
    'cooking.auth',
    'ngRoute',
    'cooking.constant'
]);

app.controller('UserCtrl', [
    '$scope',
    'userService',
    'user',
    'users',
    'authService',
    '$location',
    function ($scope, userService, user, users, authService, $location) {
        $scope.user = user;
        $scope.users = users;
        $scope.isLoggedIn = authService.isLoggedIn;
        $scope.successMsg = null;
        $scope.errorMsg = null;

        $scope.saveUser = function () {
            if(!$scope.user._id) {
                userService.create({
                    email: $scope.user.email,
                    username: $scope.user.username,
                    password: $scope.user.password,
                    active: $scope.user.active
                }).success(function (user) {
                    $scope.successMsg = 'Utilisateur ajouté avec succès';
                    $scope.user.email = '';
                    $scope.user.username = '';
                    $scope.user.password = '';
                });
            } else {
                userService.update({
                    _id: $scope.user._id,
                    email: $scope.user.email,
                    username: $scope.user.username,
                    active: $scope.user.active
                }).success(function (glossary) {
                    $scope.successMsg = 'Utilisateur modifié avec succès';
                });
            }
        };
        $scope.saveUserPassword = function () {
            userService.updatePassword({
                _id: $scope.user._id,
                email: $scope.user.email,
                password: $scope.user.password
            }).success(function (glossary) {
                $scope.successMsg = 'Mot de passe modifié avec succès';
            });
        };
        
        $scope.remove = function (glossary) {
            userService.delete(glossary._id).success(
                function (res) {
                    $scope.users = $scope.users.filter(function(el) {
                        return el._id !== user._id;
                    });
                    $scope.successMsg = 'Utilisateur supprimé avec succès';
                }
            );
        };
        
        // Boutons de redirection
        $scope.gotoChangePasswordForm = function (user) {
            $location.path('/user/formPassword/' + user._id);
        };
    }]);