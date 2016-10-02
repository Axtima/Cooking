var app = angular.module('cooking.auth');

app.factory('authService', ['$http', '$window', 'constants', function ($http, $window, constants) {
        var authService = {};
        authService.saveToken = function (token) {
            $window.localStorage[constants.authTokenName] = token;
        };

        authService.getToken = function () {
            return $window.localStorage[constants.authTokenName];
        };
        authService.currentUser = function () {
            if (authService.isLoggedIn()) {
                var token = authService.getToken();
                var loggedInUser = JSON.parse($window.atob(token.split('.')[1]));

                return loggedInUser.email;
            }
        };
        authService.register = function (user) {
            return $http.post('/rest/user/register', user).success(function (data) {
                authService.saveToken(data.token);
            });
        };
        authService.logIn = function (user) {
            return $http.post('/rest/user/login', user).success(function (data) {
                authService.saveToken(data.token);
            });
        };
        authService.forgotPassword = function (user) {
            return $http.post('/rest/user/forgot', user).success(function (res) {
                return res.data;
            });
        };
        authService.loadResetToken = function (token) {
            return $http.get('/rest/user/reset/' + token).success(function (res) {
                return res.data;
            });
        };
        authService.resetPassword = function (user, token) {
            return $http.post('/rest/user/reset/' + token, user).success(function (res) {
                return res.data;
            });
        };
        authService.logOut = function () {
            $window.localStorage.removeItem(constants.authTokenName);
        };
        authService.isLoggedIn = function () {
            var token = authService.getToken();

            if (token) {
                var payload = JSON.parse($window.atob(token.split('.')[1]));

                return payload.exp > Date.now() / 1000;
            } else {
                return false;
            }
        };
        return authService;
    }]);