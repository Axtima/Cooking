var app = angular.module('cooking.alert');

app.factory('alertService', ['$http', 'authService', function ($http, authService) {

        var o = {
            glossaries: []
        };
        o.get = function (id) {
            return $http.get('/rest/alert/' + id).then(function (res) {
                return res.data;
            });
        };

        o.getAll = function () {
            return $http.get('/rest/alert').then(function (res) {
                return res.data;
            });
        };

        o.create = function (alert) {
            return $http.post('/rest/alert', alert, {
                headers: {Authorization: 'Bearer ' + authService.getToken()}
            }).success(function (data) {
                o.glossaries.push(data);
            });
        };
        
        o.update = function (alert) {
            return $http.post('/rest/alert/' + alert._id, alert, {
                headers: {Authorization: 'Bearer ' + authService.getToken()}
            }).success(function (data) {
            });
        };
        
        o.delete = function (alertId) {
            return $http.delete('/rest/alert/' + alertId, alertId, {
                headers: {Authorization: 'Bearer ' + authService.getToken()}
            }).success(function (data) {
            });
        };

        return o;
    }]
        );