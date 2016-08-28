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

        o.upvote = function (glossary) {
            return $http.put('/rest/glossary/' + glossary._id + '/upvote', null, {
                headers: {Authorization: 'Bearer ' + authService.getToken()}
            }).success(function (data) {
                glossary.upvotes += 1;
            });
        };

        o.addComment = function (id, comment) {
            return $http.post('/rest/glossary/' + id + '/comments', comment, {
                headers: {Authorization: 'Bearer ' + authService.getToken()}
            });
        };

        return o;
    }]
        );