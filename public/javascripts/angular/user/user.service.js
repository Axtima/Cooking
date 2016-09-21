var app = angular.module('cooking.user');

app.factory('userService', ['$http', 'authService', function ($http, authService) {

        var o = {
            glossaries: []
        };
        o.get = function (id) {
            return $http.get('/rest/user/' + id).then(function (res) {
                return res.data;
            });
        };

        o.getAll = function () {
            return $http.get('/rest/user').then(function (res) {
                return res.data;
            });
        };

        o.create = function (user) {
            return $http.post('/rest/user', user, {
                headers: {Authorization: 'Bearer ' + authService.getToken()}
            }).success(function (data) {
                o.glossaries.push(data);
            });
        };
        
        o.update = function (user) {
            return $http.post('/rest/user/' + user._id, user, {
                headers: {Authorization: 'Bearer ' + authService.getToken()}
            }).success(function (data) {
            });
        };
        
        o.updatePassword = function (user) {
            return $http.post('/rest/user/password/' + user._id, user, {
                headers: {Authorization: 'Bearer ' + authService.getToken()}
            }).success(function (data) {
            });
        };
        
        o.delete = function (userId) {
            return $http.delete('/rest/user/' + userId, userId, {
                headers: {Authorization: 'Bearer ' + authService.getToken()}
            }).success(function (data) {
            });
        };

        return o;
    }]
        );