var app = angular.module('cooking.glossary');

app.factory('glossaryService', ['$http', 'authService', function ($http, authService) {

        var o = {
            glossaries: []
        };
        o.get = function (id) {
            return $http.get('/rest/glossary/' + id).then(function (res) {
                return res.data;
            });
        };

        o.getAll = function () {
            return $http.get('/rest/glossary').then(function (res) {
                return res.data;
            });
        };

        o.create = function (glossary) {
            return $http.post('/rest/glossary', glossary, {
                headers: {Authorization: 'Bearer ' + authService.getToken()}
            }).success(function (data) {
                o.glossaries.push(data);
            });
        };
        
        o.update = function (glossary) {
            return $http.post('/rest/glossary/' + glossary._id, glossary, {
                headers: {Authorization: 'Bearer ' + authService.getToken()}
            }).success(function (data) {
            });
        };
        
        o.delete = function (glossaryId) {
            return $http.delete('/rest/glossary/' + glossaryId, glossaryId, {
                headers: {Authorization: 'Bearer ' + authService.getToken()}
            }).success(function (data) {
            });
        };

/*
        o.addComment = function (id, comment) {
            return $http.post('/rest/glossary/' + id + '/comments', comment, {
                headers: {Authorization: 'Bearer ' + authService.getToken()}
            });
        };
        */

        return o;
    }]
        );