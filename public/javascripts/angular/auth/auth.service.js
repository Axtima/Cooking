var app = angular.module('cooking.auth');

app.factory('auth', ['$http', '$window', 'constants', function ($http, $window, constants) {
        var auth = {};
        auth.saveToken = function (token) {
            $window.localStorage[constants.authTokenName] = token;
        };

        auth.getToken = function () {
            return $window.localStorage[constants.authTokenName];
        };
        auth.currentUser = function () {
            if (auth.isLoggedIn()) {
                var token = auth.getToken();
                var payload = JSON.parse($window.atob(token.split('.')[1]));

                return payload.username;
            }
        };
        auth.register = function (user) {
            return $http.post('/rest/user/register', user).success(function (data) {
                auth.saveToken(data.token);
            });
        };
        auth.logIn = function (user) {
            return $http.post('/rest/user/login', user).success(function (data) {
                auth.saveToken(data.token);
            });
        };
        auth.logOut = function () {
            $window.localStorage.removeItem(constants.authTokenName);
        };
        auth.isLoggedIn = function () {
            var token = auth.getToken();

            if (token) {
                var payload = JSON.parse($window.atob(token.split('.')[1]));

                return payload.exp > Date.now() / 1000;
            } else {
                return false;
            }
        };
        return auth;
    }]);